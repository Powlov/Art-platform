"""
Cascade Pricing Mechanism
Automatically adjusts prices of similar artworks based on market events
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
import math

router = APIRouter()

class CascadePricingRequest(BaseModel):
    artwork_id: str
    new_price: float
    transaction_id: Optional[str] = None
    reason: str = "market_update"

class PriceAdjustment(BaseModel):
    artwork_id: str
    old_price: float
    new_price: float
    adjustment_percent: float
    reason: str
    confidence: float

class CascadePricingResponse(BaseModel):
    trigger_artwork_id: str
    trigger_price: float
    affected_artworks: List[PriceAdjustment]
    total_affected: int
    cascade_depth: int

class CascadePricingEngine:
    """
    Implements cascade pricing algorithm
    Adjusts prices of similar/related artworks based on market events
    """
    
    def __init__(self):
        self.similarity_threshold = 0.7
        self.max_cascade_depth = 3
        self.influence_factors = {
            'same_artist': 0.8,      # Strong influence
            'same_category': 0.5,    # Medium influence
            'same_style': 0.4,       # Medium-low influence
            'exhibited_together': 0.3, # Low influence
            'similar_price_range': 0.6, # Medium-high influence
        }
    
    def calculate_similarity(self, artwork1: dict, artwork2: dict) -> float:
        """Calculate similarity score between two artworks"""
        score = 0.0
        
        # Same artist = strong correlation
        if artwork1.get('artist_id') == artwork2.get('artist_id'):
            score += self.influence_factors['same_artist']
        
        # Same category
        if artwork1.get('category') == artwork2.get('category'):
            score += self.influence_factors['same_category']
        
        # Similar price range (within 50%)
        price1 = artwork1.get('current_price', 0)
        price2 = artwork2.get('current_price', 0)
        if price1 > 0 and price2 > 0:
            price_ratio = min(price1, price2) / max(price1, price2)
            if price_ratio > 0.5:
                score += self.influence_factors['similar_price_range'] * price_ratio
        
        return min(1.0, score)
    
    def calculate_price_adjustment(
        self,
        trigger_price: float,
        old_price: float,
        similarity: float,
        market_direction: str = 'up'
    ) -> float:
        """
        Calculate new price based on trigger event
        
        Formula: new_price = old_price * (1 + adjustment_factor)
        where adjustment_factor = similarity * price_change_percent * dampening
        """
        # Calculate price change percent
        if old_price == 0:
            return old_price
        
        price_change_percent = (trigger_price - old_price) / old_price
        
        # Apply dampening (cascade effect weakens over iterations)
        dampening = 0.7  # Each cascade level is 70% of previous
        
        # Calculate adjustment
        adjustment_factor = similarity * price_change_percent * dampening
        
        # Cap adjustment at +/- 20%
        adjustment_factor = max(-0.2, min(0.2, adjustment_factor))
        
        new_price = old_price * (1 + adjustment_factor)
        
        return round(new_price, 2)
    
    def execute_cascade(
        self,
        trigger_artwork: dict,
        all_artworks: List[dict],
        depth: int = 0
    ) -> List[PriceAdjustment]:
        """
        Execute cascade pricing algorithm
        """
        if depth >= self.max_cascade_depth:
            return []
        
        adjustments = []
        
        for artwork in all_artworks:
            # Skip trigger artwork
            if artwork['id'] == trigger_artwork['id']:
                continue
            
            # Calculate similarity
            similarity = self.calculate_similarity(trigger_artwork, artwork)
            
            # Skip if similarity too low
            if similarity < self.similarity_threshold:
                continue
            
            # Calculate new price
            old_price = artwork['current_price']
            new_price = self.calculate_price_adjustment(
                trigger_artwork['current_price'],
                old_price,
                similarity
            )
            
            # Create adjustment record
            adjustment_percent = ((new_price - old_price) / old_price) * 100 if old_price > 0 else 0
            
            adjustment = PriceAdjustment(
                artwork_id=artwork['id'],
                old_price=old_price,
                new_price=new_price,
                adjustment_percent=round(adjustment_percent, 2),
                reason=f"cascade_from_{trigger_artwork['id']}_depth_{depth}",
                confidence=round(similarity, 3)
            )
            
            adjustments.append(adjustment)
            
            # Recursive cascade (with updated price)
            if abs(adjustment_percent) > 5:  # Only cascade significant changes
                artwork_copy = artwork.copy()
                artwork_copy['current_price'] = new_price
                
                sub_adjustments = self.execute_cascade(
                    artwork_copy,
                    all_artworks,
                    depth + 1
                )
                adjustments.extend(sub_adjustments)
        
        return adjustments

# Initialize engine
pricing_engine = CascadePricingEngine()

# Mock artwork database
mock_artworks = [
    {
        "id": "artwork-001",
        "title": "Sunset Dreams",
        "artist_id": "artist-001",
        "category": "painting",
        "current_price": 15000,
    },
    {
        "id": "artwork-002",
        "title": "Urban Nights",
        "artist_id": "artist-001",
        "category": "painting",
        "current_price": 18000,
    },
    {
        "id": "artwork-003",
        "title": "MountainScape",
        "artist_id": "artist-002",
        "category": "painting",
        "current_price": 12000,
    },
    {
        "id": "artwork-004",
        "title": "Abstract Expression",
        "artist_id": "artist-001",
        "category": "abstract",
        "current_price": 20000,
    },
    {
        "id": "artwork-005",
        "title": "Modern Sculpture",
        "artist_id": "artist-003",
        "category": "sculpture",
        "current_price": 25000,
    },
]

@router.post("/cascade-pricing", response_model=CascadePricingResponse)
async def trigger_cascade_pricing(request: CascadePricingRequest):
    """
    Trigger cascade pricing based on a market event
    """
    try:
        # Find trigger artwork
        trigger = next((a for a in mock_artworks if a['id'] == request.artwork_id), None)
        
        if not trigger:
            raise HTTPException(status_code=404, detail="Artwork not found")
        
        # Update trigger artwork price
        trigger_copy = trigger.copy()
        trigger_copy['current_price'] = request.new_price
        
        # Execute cascade
        adjustments = pricing_engine.execute_cascade(
            trigger_copy,
            mock_artworks,
            depth=0
        )
        
        # Calculate max depth
        max_depth = 0
        for adj in adjustments:
            depth = int(adj.reason.split('depth_')[-1]) if 'depth_' in adj.reason else 0
            max_depth = max(max_depth, depth)
        
        return CascadePricingResponse(
            trigger_artwork_id=request.artwork_id,
            trigger_price=request.new_price,
            affected_artworks=adjustments,
            total_affected=len(adjustments),
            cascade_depth=max_depth + 1
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/cascade-pricing/preview")
async def preview_cascade_impact(artwork_id: str, new_price: float):
    """
    Preview cascade pricing impact without applying changes
    """
    try:
        request = CascadePricingRequest(
            artwork_id=artwork_id,
            new_price=new_price,
            reason="preview"
        )
        return await trigger_cascade_pricing(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
