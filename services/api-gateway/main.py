"""
API Gateway for Art-OS Microservices
Centralized entry point with routing, rate limiting, and monitoring
"""

from fastapi import FastAPI, Request, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import httpx
import time
import os
from typing import Optional
from collections import defaultdict
from datetime import datetime, timedelta

app = FastAPI(
    title="Art-OS API Gateway",
    version="1.0.0",
    description="Centralized gateway for all Art-OS microservices"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Service registry
SERVICES = {
    "analytics": os.getenv("ANALYTICS_URL", "http://localhost:8001"),
    "transactions": os.getenv("TRANSACTION_HUB_URL", "http://localhost:8002"),
    "media": os.getenv("MEDIA_HUB_URL", "http://localhost:8003"),
    "websocket": os.getenv("WEBSOCKET_BRIDGE_URL", "http://localhost:8004"),
}

# Rate limiting
class RateLimiter:
    def __init__(self):
        self.requests = defaultdict(list)
        self.limits = {
            "default": 100,  # requests per minute
            "analytics": 60,
            "transactions": 30,
        }
    
    def check_rate_limit(self, client_id: str, service: str = "default") -> bool:
        """Check if request is within rate limit"""
        now = datetime.now()
        minute_ago = now - timedelta(minutes=1)
        
        # Clean old requests
        self.requests[client_id] = [
            req_time for req_time in self.requests[client_id]
            if req_time > minute_ago
        ]
        
        # Check limit
        limit = self.limits.get(service, self.limits["default"])
        if len(self.requests[client_id]) >= limit:
            return False
        
        # Add current request
        self.requests[client_id].append(now)
        return True

rate_limiter = RateLimiter()

# Request metrics
request_metrics = {
    "total_requests": 0,
    "requests_by_service": defaultdict(int),
    "errors": 0,
    "avg_response_time": 0,
}

@app.middleware("http")
async def add_metrics_middleware(request: Request, call_next):
    """Track request metrics"""
    start_time = time.time()
    
    # Get client identifier
    client_id = request.client.host if request.client else "unknown"
    
    response = await call_next(request)
    
    # Update metrics
    request_metrics["total_requests"] += 1
    process_time = (time.time() - start_time) * 1000
    
    # Update average response time
    total = request_metrics["total_requests"]
    current_avg = request_metrics["avg_response_time"]
    request_metrics["avg_response_time"] = (
        (current_avg * (total - 1) + process_time) / total
    )
    
    # Add headers
    response.headers["X-Process-Time"] = f"{process_time:.2f}ms"
    response.headers["X-Gateway-Version"] = "1.0.0"
    
    return response

@app.get("/health")
async def health_check():
    """Gateway health check"""
    # Check all services
    service_health = {}
    
    async with httpx.AsyncClient(timeout=2.0) as client:
        for service_name, service_url in SERVICES.items():
            try:
                response = await client.get(f"{service_url}/health")
                service_health[service_name] = {
                    "status": "healthy" if response.status_code == 200 else "unhealthy",
                    "url": service_url
                }
            except Exception:
                service_health[service_name] = {
                    "status": "unreachable",
                    "url": service_url
                }
    
    all_healthy = all(s["status"] == "healthy" for s in service_health.values())
    
    return {
        "gateway": "healthy",
        "services": service_health,
        "overall_status": "healthy" if all_healthy else "degraded",
        "metrics": request_metrics
    }

@app.api_route("/analytics/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def analytics_proxy(request: Request, path: str):
    """Proxy requests to Analytics Service"""
    return await proxy_request(request, "analytics", path)

@app.api_route("/transactions/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def transactions_proxy(request: Request, path: str):
    """Proxy requests to Transaction Hub"""
    return await proxy_request(request, "transactions", path)

@app.api_route("/media/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def media_proxy(request: Request, path: str):
    """Proxy requests to Media Hub"""
    return await proxy_request(request, "media", path)

async def proxy_request(request: Request, service: str, path: str):
    """Generic proxy function"""
    # Rate limiting
    client_id = request.client.host if request.client else "unknown"
    if not rate_limiter.check_rate_limit(client_id, service):
        return JSONResponse(
            status_code=429,
            content={
                "error": "Rate limit exceeded",
                "service": service,
                "retry_after": 60
            }
        )
    
    # Get service URL
    service_url = SERVICES.get(service)
    if not service_url:
        raise HTTPException(status_code=404, detail=f"Service '{service}' not found")
    
    # Build target URL
    target_url = f"{service_url}/{path}"
    if request.url.query:
        target_url += f"?{request.url.query}"
    
    # Forward request
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            # Get request body
            body = await request.body()
            
            # Forward request
            response = await client.request(
                method=request.method,
                url=target_url,
                headers=dict(request.headers),
                content=body
            )
            
            # Update metrics
            request_metrics["requests_by_service"][service] += 1
            
            # Return response
            return JSONResponse(
                status_code=response.status_code,
                content=response.json() if response.headers.get("content-type", "").startswith("application/json") else {"data": response.text},
                headers=dict(response.headers)
            )
    
    except httpx.TimeoutException:
        request_metrics["errors"] += 1
        raise HTTPException(status_code=504, detail=f"Service '{service}' timeout")
    except Exception as e:
        request_metrics["errors"] += 1
        raise HTTPException(status_code=502, detail=f"Service '{service}' error: {str(e)}")

@app.get("/api/v1/services")
async def list_services():
    """List all available services"""
    return {
        "services": [
            {
                "name": name,
                "url": url,
                "endpoints": get_service_endpoints(name)
            }
            for name, url in SERVICES.items()
        ]
    }

def get_service_endpoints(service: str) -> list:
    """Get common endpoints for each service"""
    endpoints = {
        "analytics": [
            "GET /analytics/api/v1/analytics/fair-price",
            "GET /analytics/api/v1/analytics/market-gravity/{category}",
            "POST /analytics/api/v1/analytics/cascade-pricing",
            "POST /analytics/api/v1/analytics/fraud-detection/scan",
            "GET /analytics/api/v1/analytics/fraud-detection/alerts",
        ],
        "transactions": [
            "POST /transactions/api/v1/transactions",
            "GET /transactions/api/v1/transactions/{id}",
            "GET /transactions/api/v1/transactions/{id}/saga-steps",
        ],
        "media": [
            "POST /media/api/v1/media/analyze-article",
            "POST /media/api/v1/media/analyze-impact",
            "GET /media/api/v1/media/articles",
        ],
        "websocket": [
            "WS /websocket/ws",
            "WS /websocket/ws/{channel}",
            "POST /websocket/api/v1/broadcast",
        ]
    }
    return endpoints.get(service, [])

@app.get("/api/v1/metrics")
async def get_metrics():
    """Get gateway metrics"""
    return {
        "gateway_metrics": request_metrics,
        "rate_limits": rate_limiter.limits,
        "uptime_seconds": time.time() - app.state.start_time if hasattr(app.state, "start_time") else 0
    }

@app.on_event("startup")
async def startup_event():
    """Initialize gateway"""
    app.state.start_time = time.time()
    print("🚀 API Gateway started")
    print(f"📡 Services configured: {', '.join(SERVICES.keys())}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
