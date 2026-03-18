"""
Art-OS Analytics Service
Implements KDE (Kernel Density Estimation) algorithm for fair price calculation
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
from scipy.stats import gaussian_kde
from scipy.signal import find_peaks
import httpx
import os

# Import cascade pricing module
from cascade_pricing import router as cascade_router
from fraud_detection import router as fraud_router

app = FastAPI(title="Art-OS Analytics Service", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class ArtworkAnalysisRequest(BaseModel):
    artwork_id: str
    category: str
    artist_id: str
    current_price: Optional[float] = None

class FairPriceResponse(BaseModel):
    artwork_id: str
    fair_price: float
    confidence: float
    sample_size: int
    price_range: dict
    algorithm: str = "KDE"

class MarketGravityPoint(BaseModel):
    venue_name: str
    location: str
    artwork_count: int
    avg_price: float
    gravity_score: float

# KDE Algorithm Implementation
class KDEPricingEngine:
    """
    Kernel Density Estimation for fair price calculation
    Based on similar artworks' transaction history
    """
    
    def __init__(self, bandwidth: float = 0.2):
        self.bandwidth = bandwidth
    
    def calculate_fair_price(
        self, 
        prices: List[float], 
        trust_weights: Optional[List[float]] = None
    ) -> dict:
        """
        Calculate fair price using KDE
        
        Args:
            prices: List of historical transaction prices
            trust_weights: Optional trust scores for each transaction
        
        Returns:
            dict with fair_price, confidence, and distribution stats
        """
        if len(prices) < 3:
            return {
                "fair_price": np.mean(prices) if prices else 0,
                "confidence": 0.3,
                "sample_size": len(prices),
                "method": "mean_fallback"
            }
        
        # Convert to numpy array
        prices_array = np.array(prices)
        
        # Apply trust weights if provided
        if trust_weights:
            weights = np.array(trust_weights)
        else:
            weights = np.ones(len(prices))
        
        # Normalize weights
        weights = weights / weights.sum()
        
        # Create KDE
        try:
            kde = gaussian_kde(
                prices_array, 
                bw_method=self.bandwidth,
                weights=weights
            )
        except Exception as e:
            # Fallback to weighted mean
            return {
                "fair_price": np.average(prices_array, weights=weights),
                "confidence": 0.5,
                "sample_size": len(prices),
                "method": "weighted_mean_fallback"
            }
        
        # Evaluate KDE on a grid
        price_min, price_max = prices_array.min(), prices_array.max()
        price_range = price_max - price_min
        x_grid = np.linspace(
            price_min - 0.2 * price_range,
            price_max + 0.2 * price_range,
            1000
        )
        density = kde(x_grid)
        
        # Find peaks (modes) in distribution
        peaks, properties = find_peaks(density, height=0)
        
        if len(peaks) > 0:
            # Use highest peak as fair price
            main_peak_idx = peaks[np.argmax(properties['peak_heights'])]
            fair_price = float(x_grid[main_peak_idx])
        else:
            # Fallback to mean
            fair_price = float(np.average(prices_array, weights=weights))
        
        # Calculate confidence based on sample size and distribution spread
        confidence = min(
            1.0,
            (len(prices) / 20) * (1 - (price_range / fair_price) * 0.5)
        )
        
        return {
            "fair_price": round(fair_price, 2),
            "confidence": round(confidence, 3),
            "sample_size": len(prices),
            "price_range": {
                "min": float(price_min),
                "max": float(price_max),
                "p25": float(np.percentile(prices_array, 25)),
                "p50": float(np.percentile(prices_array, 50)),
                "p75": float(np.percentile(prices_array, 75)),
            },
            "method": "kde_peak"
        }

# Initialize pricing engine
pricing_engine = KDEPricingEngine(bandwidth=0.2)

# Neo4j Connection (mock)
NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "password")

async def get_similar_artwork_prices(artwork_id: str, category: str) -> List[dict]:
    """
    Query Neo4j for similar artwork transaction prices
    Mock implementation - returns sample data
    """
    # In production, query Neo4j:
    # MATCH (target:Asset {id: $artwork_id})-[:SIMILAR_TO]->(similar:Asset)
    # MATCH (similar)-[:TRANSACTED_IN]->(tx:Transaction {status: 'completed'})
    # RETURN tx.amount, tx.date, similar.id
    
    # Mock data for demonstration
    mock_prices = [
        {"price": 12000, "date": "2024-01-15", "trust": 0.9},
        {"price": 15000, "date": "2024-02-20", "trust": 0.8},
        {"price": 13500, "date": "2024-03-10", "trust": 0.95},
        {"price": 14200, "date": "2024-04-05", "trust": 0.85},
        {"price": 16000, "date": "2024-05-15", "trust": 0.9},
        {"price": 13800, "date": "2024-06-20", "trust": 0.8},
        {"price": 15500, "date": "2024-07-10", "trust": 0.9},
    ]
    return mock_prices

async def calculate_market_gravity(category: str) -> List[MarketGravityPoint]:
    """
    Calculate market gravity points (clusters of high-value artworks)
    """
    # Mock implementation
    return [
        MarketGravityPoint(
            venue_name="Chelsea Gallery District",
            location="New York, NY",
            artwork_count=45,
            avg_price=25000,
            gravity_score=0.85
        ),
        MarketGravityPoint(
            venue_name="Gagosian Gallery",
            location="London, UK",
            artwork_count=32,
            avg_price=35000,
            gravity_score=0.92
        ),
    ]

# API Endpoints
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "analytics"}

@app.post("/api/v1/analytics/fair-price", response_model=FairPriceResponse)
async def calculate_fair_price(request: ArtworkAnalysisRequest):
    """
    Calculate fair price for an artwork using KDE algorithm
    """
    try:
        # Get similar artwork prices from Neo4j
        price_data = await get_similar_artwork_prices(
            request.artwork_id, 
            request.category
        )
        
        if not price_data:
            raise HTTPException(
                status_code=404,
                detail="No comparable artworks found"
            )
        
        # Extract prices and trust scores
        prices = [p["price"] for p in price_data]
        trust_weights = [p["trust"] for p in price_data]
        
        # Calculate fair price using KDE
        result = pricing_engine.calculate_fair_price(prices, trust_weights)
        
        return FairPriceResponse(
            artwork_id=request.artwork_id,
            fair_price=result["fair_price"],
            confidence=result["confidence"],
            sample_size=result["sample_size"],
            price_range=result["price_range"],
            algorithm="KDE"
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/analytics/market-gravity/{category}")
async def get_market_gravity(category: str):
    """
    Get market gravity points for a category
    """
    try:
        gravity_points = await calculate_market_gravity(category)
        return {
            "category": category,
            "gravity_points": gravity_points
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/analytics/anomaly-detection")
async def detect_price_anomalies(artwork_id: str, current_price: float):
    """
    Detect pricing anomalies using statistical methods
    """
    # Get historical prices
    price_data = await get_similar_artwork_prices(artwork_id, "painting")
    prices = [p["price"] for p in price_data]
    
    # Calculate z-score
    mean_price = np.mean(prices)
    std_price = np.std(prices)
    z_score = (current_price - mean_price) / std_price if std_price > 0 else 0
    
    is_anomaly = abs(z_score) > 2.5
    
    return {
        "artwork_id": artwork_id,
        "current_price": current_price,
        "mean_price": round(mean_price, 2),
        "std_deviation": round(std_price, 2),
        "z_score": round(z_score, 3),
        "is_anomaly": is_anomaly,
        "severity": "high" if abs(z_score) > 3 else "medium" if abs(z_score) > 2 else "low"
    }

# Include cascade pricing routes
app.include_router(cascade_router, prefix="/api/v1/analytics", tags=["cascade-pricing"])

# Include fraud detection routes
app.include_router(fraud_router, prefix="/api/v1/analytics", tags=["fraud-detection"])

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)
