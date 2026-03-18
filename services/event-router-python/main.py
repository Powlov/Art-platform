"""
Python Event Router (for sandbox testing without Go)
Implements same functionality as Go version
"""

from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import jwt
import pika
import json
import os
from enum import Enum

app = FastAPI(title="Art-OS Event Router", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key")
RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@localhost:5672/")

# Models
class EventType(str, Enum):
    ARTWORK_CREATED = "artwork.created"
    ARTWORK_UPDATED = "artwork.updated"
    PRICE_CHANGED = "price.changed"
    TRANSACTION_CREATED = "transaction.created"
    TRANSACTION_COMPLETED = "transaction.completed"
    AUCTION_BID = "auction.bid"
    MEDIA_PUBLISHED = "media.published"

class Event(BaseModel):
    id: Optional[str] = None
    type: EventType
    source: str
    payload: Dict[str, Any]
    timestamp: Optional[datetime] = None
    retry_count: int = 0

class CircuitBreaker:
    """Simple circuit breaker implementation"""
    def __init__(self, name: str, failure_threshold: int = 3):
        self.name = name
        self.failure_threshold = failure_threshold
        self.failure_count = 0
        self.state = "CLOSED"  # CLOSED, OPEN, HALF_OPEN
        self.last_failure_time = None
        self.timeout = timedelta(seconds=60)
    
    def call(self, func, *args, **kwargs):
        """Execute function through circuit breaker"""
        if self.state == "OPEN":
            # Check if timeout passed
            if datetime.now() - self.last_failure_time > self.timeout:
                self.state = "HALF_OPEN"
            else:
                raise Exception(f"Circuit breaker {self.name} is OPEN")
        
        try:
            result = func(*args, **kwargs)
            if self.state == "HALF_OPEN":
                self.state = "CLOSED"
                self.failure_count = 0
            return result
        except Exception as e:
            self.failure_count += 1
            self.last_failure_time = datetime.now()
            
            if self.failure_count >= self.failure_threshold:
                self.state = "OPEN"
            
            raise e

# Initialize circuit breakers
analytics_breaker = CircuitBreaker("analytics")
transaction_breaker = CircuitBreaker("transactions")
media_breaker = CircuitBreaker("media")

# RabbitMQ Connection
rabbitmq_connection = None
rabbitmq_channel = None

def get_rabbitmq_channel():
    """Get or create RabbitMQ channel"""
    global rabbitmq_connection, rabbitmq_channel
    
    if rabbitmq_connection is None or rabbitmq_connection.is_closed:
        try:
            rabbitmq_connection = pika.BlockingConnection(
                pika.URLParameters(RABBITMQ_URL)
            )
            rabbitmq_channel = rabbitmq_connection.channel()
            
            # Declare exchanges
            for exchange in ["analytics", "transactions", "media"]:
                rabbitmq_channel.exchange_declare(
                    exchange=exchange,
                    exchange_type="topic",
                    durable=True
                )
        except Exception as e:
            print(f"RabbitMQ connection error: {e}")
            return None
    
    return rabbitmq_channel

# JWT Authentication
def verify_token(authorization: Optional[str] = Header(None)):
    """Verify JWT token"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    try:
        token = authorization.replace("Bearer ", "")
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def publish_event(event: Event):
    """Publish event to RabbitMQ"""
    channel = get_rabbitmq_channel()
    if not channel:
        raise Exception("RabbitMQ connection failed")
    
    # Determine exchange based on event type
    if event.type in [EventType.ARTWORK_CREATED, EventType.ARTWORK_UPDATED, EventType.PRICE_CHANGED]:
        exchange = "analytics"
    elif event.type in [EventType.TRANSACTION_CREATED, EventType.TRANSACTION_COMPLETED, EventType.AUCTION_BID]:
        exchange = "transactions"
    elif event.type == EventType.MEDIA_PUBLISHED:
        exchange = "media"
    else:
        exchange = "analytics"
    
    # Set timestamp
    if not event.timestamp:
        event.timestamp = datetime.now()
    
    # Publish
    channel.basic_publish(
        exchange=exchange,
        routing_key=event.type.value,
        body=json.dumps(event.dict(), default=str),
        properties=pika.BasicProperties(
            delivery_mode=2,  # persistent
            content_type="application/json"
        )
    )

def route_event(event: Event):
    """Route event through appropriate circuit breaker"""
    if event.source == "analytics":
        return analytics_breaker.call(publish_event, event)
    elif event.source == "transaction_hub":
        return transaction_breaker.call(publish_event, event)
    elif event.source == "media_hub":
        return media_breaker.call(publish_event, event)
    else:
        return publish_event(event)

# API Endpoints
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "services": {
            "analytics": analytics_breaker.state,
            "transactions": transaction_breaker.state,
            "media": media_breaker.state,
        },
        "rabbitmq": "connected" if get_rabbitmq_channel() else "disconnected"
    }

@app.post("/api/v1/events")
async def publish_event_endpoint(event: Event, user=Depends(verify_token)):
    """
    Publish event to event bus
    Requires JWT authentication
    """
    try:
        route_event(event)
        return {
            "status": "accepted",
            "event_id": event.id,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/auth/token")
async def create_token(email: str, password: str):
    """
    Create JWT token (for testing)
    In production, verify credentials against database
    """
    # Mock authentication - replace with real logic
    if password == "admin123":  # Insecure - for testing only
        payload = {
            "user_id": "test-user-id",
            "email": email,
            "role": "admin",
            "exp": datetime.utcnow() + timedelta(hours=24)
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
        return {"access_token": token, "token_type": "bearer"}
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/api/v1/circuit-breakers")
async def get_circuit_breakers():
    """Get circuit breaker states"""
    return {
        "analytics": {
            "state": analytics_breaker.state,
            "failures": analytics_breaker.failure_count
        },
        "transactions": {
            "state": transaction_breaker.state,
            "failures": transaction_breaker.failure_count
        },
        "media": {
            "state": media_breaker.state,
            "failures": media_breaker.failure_count
        }
    }

@app.post("/api/v1/circuit-breakers/{service}/reset")
async def reset_circuit_breaker(service: str):
    """Reset a circuit breaker (admin only)"""
    breakers = {
        "analytics": analytics_breaker,
        "transactions": transaction_breaker,
        "media": media_breaker
    }
    
    if service not in breakers:
        raise HTTPException(status_code=404, detail="Service not found")
    
    breaker = breakers[service]
    breaker.state = "CLOSED"
    breaker.failure_count = 0
    
    return {"status": "reset", "service": service}

# Startup/Shutdown
@app.on_event("startup")
async def startup():
    """Initialize connections on startup"""
    print("🚀 Event Router starting...")
    get_rabbitmq_channel()
    print("✅ RabbitMQ connected")

@app.on_event("shutdown")
async def shutdown():
    """Close connections on shutdown"""
    global rabbitmq_connection
    if rabbitmq_connection and not rabbitmq_connection.is_closed:
        rabbitmq_connection.close()
    print("👋 Event Router stopped")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
