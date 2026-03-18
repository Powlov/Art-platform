#!/usr/bin/env python3
"""
Art-Platform Price Corridor Service
Calculates platform median, price boundaries, and market pressure indicators
Based on verified gallery data aggregation
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
import numpy as np
from scipy import stats
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Price Corridor Service",
    description="Platform median calculation and price corridor analysis",
    version="1.0.0"
)

# ==================== Data Models ====================

class ArtworkPrice(BaseModel):
    artwork_id: str
    gallery_id: str
    ask_price: float
    currency: str = "USD"
    timestamp: str

class PriceCorridorRequest(BaseModel):
    category: Optional[str] = None  # e.g., "Sculpture, Bronze"
    artist_id: Optional[str] = None
    style: Optional[str] = None
    period: Optional[str] = None
    min_samples: int = 5  # Minimum number of data points

class PriceCorridorResponse(BaseModel):
    median_price: float
    mean_price: float
    lower_bound: float  # median - 1 * std
    upper_bound: float  # median + 1 * std
    confidence_interval_95: Dict[str, float]  # 2.5th and 97.5th percentiles
    sample_size: int
    std_deviation: float
    coefficient_variation: float  # std / mean
    price_range: Dict[str, float]

class MarketPositionRequest(BaseModel):
    artwork_id: str
    current_price: float
    corridor_data: PriceCorridorResponse

class MarketPositionResponse(BaseModel):
    artwork_id: str
    current_price: float
    position_in_corridor: str  # "lower_third", "middle", "upper_third"
    distance_from_median_pct: float
    growth_potential_pct: float  # Distance to upper bound
    risk_level: str  # "low", "medium", "high"
    recommendation: str

class MarketPressureRequest(BaseModel):
    artwork_id: str
    current_price: float
    median_price: float
    provenance_score: float  # 0-1, institutional backing
    hype_score: float  # 0-1, media mentions/searches
    liquidity_score: float  # 0-1, time-to-sale metric

class MarketPressureResponse(BaseModel):
    artwork_id: str
    pressure_value: float  # Negative = undervalued, Positive = overvalued
    pressure_category: str  # "strong_buy", "buy", "hold", "sell", "strong_sell"
    factors: Dict[str, float]  # F1, F2, F3 decomposition
    color_code: str  # Hex color for heatmap
    recommendation: str

# ==================== Mock Data (Replace with DB queries) ====================

# Simulated gallery data
MOCK_GALLERY_PRICES = {
    "sculpture_bronze": [
        {"artwork_id": "scl-001", "gallery_id": "gal-001", "ask_price": 15000, "timestamp": "2026-03-01"},
        {"artwork_id": "scl-002", "gallery_id": "gal-002", "ask_price": 18000, "timestamp": "2026-03-05"},
        {"artwork_id": "scl-003", "gallery_id": "gal-003", "ask_price": 22000, "timestamp": "2026-03-10"},
        {"artwork_id": "scl-004", "gallery_id": "gal-004", "ask_price": 17500, "timestamp": "2026-03-12"},
        {"artwork_id": "scl-005", "gallery_id": "gal-005", "ask_price": 19000, "timestamp": "2026-03-15"},
        {"artwork_id": "scl-006", "gallery_id": "gal-006", "ask_price": 21000, "timestamp": "2026-03-16"},
        {"artwork_id": "scl-007", "gallery_id": "gal-007", "ask_price": 16500, "timestamp": "2026-03-17"},
    ],
    "painting_oil": [
        {"artwork_id": "pnt-001", "gallery_id": "gal-001", "ask_price": 35000, "timestamp": "2026-03-01"},
        {"artwork_id": "pnt-002", "gallery_id": "gal-002", "ask_price": 42000, "timestamp": "2026-03-05"},
        {"artwork_id": "pnt-003", "gallery_id": "gal-003", "ask_price": 38000, "timestamp": "2026-03-08"},
        {"artwork_id": "pnt-004", "gallery_id": "gal-004", "ask_price": 45000, "timestamp": "2026-03-11"},
        {"artwork_id": "pnt-005", "gallery_id": "gal-005", "ask_price": 40000, "timestamp": "2026-03-14"},
    ]
}

# ==================== Core Calculation Functions ====================

def calculate_price_corridor(prices: List[float]) -> Dict:
    """
    Calculate statistical price corridor from verified gallery data
    Returns median, bounds, and confidence intervals
    """
    if len(prices) < 2:
        raise ValueError("Need at least 2 price points")
    
    prices_array = np.array(prices)
    
    # Core statistics
    median = float(np.median(prices_array))
    mean = float(np.mean(prices_array))
    std = float(np.std(prices_array))
    
    # Corridor boundaries (1 std deviation)
    lower_bound = median - std
    upper_bound = median + std
    
    # Confidence interval (95%)
    ci_lower = float(np.percentile(prices_array, 2.5))
    ci_upper = float(np.percentile(prices_array, 97.5))
    
    # Coefficient of variation (volatility indicator)
    cv = (std / mean) if mean > 0 else 0
    
    return {
        "median_price": median,
        "mean_price": mean,
        "lower_bound": max(0, lower_bound),  # Prices can't be negative
        "upper_bound": upper_bound,
        "confidence_interval_95": {
            "lower": ci_lower,
            "upper": ci_upper
        },
        "sample_size": len(prices),
        "std_deviation": std,
        "coefficient_variation": cv,
        "price_range": {
            "min": float(np.min(prices_array)),
            "max": float(np.max(prices_array)),
            "p25": float(np.percentile(prices_array, 25)),
            "p50": float(np.percentile(prices_array, 50)),
            "p75": float(np.percentile(prices_array, 75))
        }
    }

def calculate_market_position(current_price: float, corridor: Dict) -> Dict:
    """
    Determine artwork's position within the price corridor
    Returns position category and growth potential
    """
    median = corridor["median_price"]
    lower = corridor["lower_bound"]
    upper = corridor["upper_bound"]
    
    # Distance from median (percentage)
    distance_from_median = ((current_price - median) / median) * 100
    
    # Position in corridor
    if current_price <= lower + (median - lower) / 3:
        position = "lower_third"
        risk = "low"
    elif current_price >= upper - (upper - median) / 3:
        position = "upper_third"
        risk = "high"
    else:
        position = "middle"
        risk = "medium"
    
    # Growth potential to upper bound
    growth_potential = ((upper - current_price) / current_price) * 100 if current_price > 0 else 0
    
    # Recommendation logic
    if position == "lower_third" and distance_from_median < -15:
        recommendation = "Strong Buy - Undervalued asset with high growth potential"
    elif position == "lower_third":
        recommendation = "Buy - Below median, good entry point"
    elif position == "middle":
        recommendation = "Hold - Fairly priced at market median"
    elif position == "upper_third" and distance_from_median > 20:
        recommendation = "Caution - Overvalued, high risk of correction"
    else:
        recommendation = "Neutral - Premium pricing, verify fundamentals"
    
    return {
        "position_in_corridor": position,
        "distance_from_median_pct": round(distance_from_median, 2),
        "growth_potential_pct": round(max(0, growth_potential), 2),
        "risk_level": risk,
        "recommendation": recommendation
    }

def calculate_market_pressure(
    current_price: float,
    median_price: float,
    provenance_score: float,
    hype_score: float,
    liquidity_score: float
) -> Dict:
    """
    Calculate market pressure using 3 factors (F1, F2, F3)
    F1 = Institutional backing (provenance)
    F2 = Market hype (media buzz)
    F3 = Liquidity (ease of sale)
    
    Returns pressure value and color coding for heatmap
    """
    # Normalize price deviation
    price_deviation = (current_price - median_price) / median_price
    
    # Factor weights
    F1 = provenance_score * 0.4  # Institutional backing (40%)
    F2 = hype_score * 0.3  # Market hype (30%)
    F3 = liquidity_score * 0.3  # Liquidity (30%)
    
    # Pressure calculation
    # Negative pressure = undervalued (buy signal)
    # Positive pressure = overvalued (sell signal)
    
    # If price is below median with strong fundamentals (high F1) → strong buy
    # If price is above median with weak fundamentals (low F1) → sell
    
    fundamental_strength = F1 + F3  # Combined fundamental score
    hype_factor = F2
    
    # Pressure value
    if price_deviation < 0:  # Below median
        # Strong fundamentals + low price = high buy pressure (negative value)
        pressure = price_deviation * (1 - fundamental_strength) * (1 - hype_factor)
    else:  # Above median
        # Weak fundamentals + high price = high sell pressure (positive value)
        pressure = price_deviation * (1 + hype_factor) * (1 - fundamental_strength)
    
    # Categorize pressure
    if pressure < -0.3:
        category = "strong_buy"
        color = "#FF0000"  # Bright red (hot buy opportunity)
        recommendation = "Significantly undervalued - Strong buy signal"
    elif pressure < -0.15:
        category = "buy"
        color = "#FF6600"  # Orange-red
        recommendation = "Undervalued - Buy opportunity"
    elif -0.15 <= pressure <= 0.15:
        category = "hold"
        color = "#FFFF00"  # Yellow (neutral)
        recommendation = "Fairly valued - Hold position"
    elif pressure <= 0.3:
        category = "sell"
        color = "#00CCFF"  # Light blue
        recommendation = "Overvalued - Consider selling"
    else:
        category = "strong_sell"
        color = "#0000FF"  # Blue (cold, overheated)
        recommendation = "Significantly overvalued - Strong sell signal"
    
    return {
        "pressure_value": round(pressure, 4),
        "pressure_category": category,
        "factors": {
            "F1_provenance": round(F1, 3),
            "F2_hype": round(F2, 3),
            "F3_liquidity": round(F3, 3),
            "fundamental_strength": round(fundamental_strength, 3)
        },
        "color_code": color,
        "recommendation": recommendation
    }

# ==================== API Endpoints ====================

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "price-corridor",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/api/v1/corridor/calculate", response_model=PriceCorridorResponse)
async def calculate_corridor(request: PriceCorridorRequest):
    """
    Calculate price corridor for a given category/artist/style
    
    Returns platform median, bounds, and statistical metrics
    """
    try:
        # Mock data fetching (replace with actual DB query)
        category_key = request.category.lower().replace(", ", "_").replace(" ", "_") if request.category else "sculpture_bronze"
        
        if category_key not in MOCK_GALLERY_PRICES:
            category_key = "sculpture_bronze"  # Default fallback
        
        prices_data = MOCK_GALLERY_PRICES[category_key]
        prices = [item["ask_price"] for item in prices_data]
        
        if len(prices) < request.min_samples:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient data: need at least {request.min_samples} samples, got {len(prices)}"
            )
        
        corridor_data = calculate_price_corridor(prices)
        
        logger.info(f"Calculated corridor for category '{category_key}': median=${corridor_data['median_price']:.2f}")
        
        return PriceCorridorResponse(**corridor_data)
    
    except Exception as e:
        logger.error(f"Error calculating corridor: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/corridor/position", response_model=MarketPositionResponse)
async def analyze_market_position(request: MarketPositionRequest):
    """
    Analyze artwork's position within the price corridor
    
    Returns position category, risk level, and recommendation
    """
    try:
        corridor_dict = request.corridor_data.dict()
        position_data = calculate_market_position(request.current_price, corridor_dict)
        
        response = {
            "artwork_id": request.artwork_id,
            "current_price": request.current_price,
            **position_data
        }
        
        logger.info(f"Position analysis for {request.artwork_id}: {position_data['position_in_corridor']}, "
                   f"growth potential: {position_data['growth_potential_pct']:.1f}%")
        
        return MarketPositionResponse(**response)
    
    except Exception as e:
        logger.error(f"Error analyzing position: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/pressure/calculate", response_model=MarketPressureResponse)
async def calculate_pressure(request: MarketPressureRequest):
    """
    Calculate market pressure using 3-factor model (F1, F2, F3)
    
    F1 = Institutional backing (provenance)
    F2 = Market hype (media mentions)
    F3 = Liquidity (time-to-sale)
    
    Returns pressure value and color code for heatmap visualization
    """
    try:
        pressure_data = calculate_market_pressure(
            request.current_price,
            request.median_price,
            request.provenance_score,
            request.hype_score,
            request.liquidity_score
        )
        
        response = {
            "artwork_id": request.artwork_id,
            **pressure_data
        }
        
        logger.info(f"Pressure analysis for {request.artwork_id}: "
                   f"category={pressure_data['pressure_category']}, "
                   f"value={pressure_data['pressure_value']:.3f}")
        
        return MarketPressureResponse(**response)
    
    except Exception as e:
        logger.error(f"Error calculating pressure: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/categories")
async def list_categories():
    """List available categories with sample sizes"""
    categories = {}
    for key, prices in MOCK_GALLERY_PRICES.items():
        categories[key] = {
            "sample_size": len(prices),
            "price_range": {
                "min": min(item["ask_price"] for item in prices),
                "max": max(item["ask_price"] for item in prices)
            }
        }
    return categories

# ==================== Startup ====================

if __name__ == "__main__":
    import uvicorn
    
    port = 8006
    logger.info(f"Starting Price Corridor Service on port {port}")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info"
    )
