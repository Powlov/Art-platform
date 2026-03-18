#!/bin/bash

# ============================================================================
# Art-OS Microservices Startup Script (Sandbox Mode)
# ============================================================================

set -e

echo "============================================================"
echo "🚀 Starting Art-OS Microservices (Sandbox Mode)"
echo "============================================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base directory
BASE_DIR="/home/user/webapp/Art-platform"

# Export environment variables
export JWT_SECRET="sandbox-test-secret-key"
export PORT_ANALYTICS=8001
export PORT_EVENT_ROUTER=8080

# Function to start service in background
start_service() {
    local name=$1
    local port=$2
    local dir=$3
    local command=$4
    
    echo -e "${BLUE}📦 Starting ${name} on port ${port}...${NC}"
    cd "${BASE_DIR}/${dir}"
    nohup $command > "/tmp/${name}.log" 2>&1 &
    echo $! > "/tmp/${name}.pid"
    echo -e "${GREEN}✅ ${name} started (PID: $(cat /tmp/${name}.pid))${NC}"
    echo ""
}

# Function to check service health
check_health() {
    local name=$1
    local url=$2
    
    echo -e "${BLUE}🔍 Checking ${name} health...${NC}"
    for i in {1..10}; do
        if curl -s "${url}" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ ${name} is healthy${NC}"
            return 0
        fi
        echo "   Waiting... ($i/10)"
        sleep 2
    done
    echo -e "${YELLOW}⚠️  ${name} health check timeout${NC}"
    return 1
}

# Stop existing services
echo -e "${YELLOW}🛑 Stopping existing services...${NC}"
for pid_file in /tmp/*.pid; do
    if [ -f "$pid_file" ]; then
        pid=$(cat "$pid_file")
        if ps -p "$pid" > /dev/null 2>&1; then
            kill "$pid" 2>/dev/null || true
        fi
        rm "$pid_file"
    fi
done
echo ""

# Start Analytics Service
start_service \
    "Analytics-Service" \
    "$PORT_ANALYTICS" \
    "services/analytics-service" \
    "python3 main.py"

# Wait for Analytics to start
sleep 3
check_health "Analytics-Service" "http://localhost:${PORT_ANALYTICS}/health"
echo ""

# Start Event Router (Python version)
start_service \
    "Event-Router" \
    "$PORT_EVENT_ROUTER" \
    "services/event-router-python" \
    "python3 main.py"

# Wait for Event Router to start
sleep 3
check_health "Event-Router" "http://localhost:${PORT_EVENT_ROUTER}/health"
echo ""

# Display service URLs
echo "============================================================"
echo -e "${GREEN}✅ All services started successfully!${NC}"
echo "============================================================"
echo ""
echo "📡 Service URLs:"
echo "  ├─ Event Router:       http://localhost:${PORT_EVENT_ROUTER}"
echo "  ├─ Analytics Service:  http://localhost:${PORT_ANALYTICS}"
echo "  └─ Frontend (existing): http://localhost:3000"
echo ""
echo "📝 API Documentation:"
echo "  ├─ Event Router API:   http://localhost:${PORT_EVENT_ROUTER}/docs"
echo "  └─ Analytics API:      http://localhost:${PORT_ANALYTICS}/docs"
echo ""
echo "📊 Health Checks:"
echo "  ├─ Event Router:       curl http://localhost:${PORT_EVENT_ROUTER}/health"
echo "  └─ Analytics:          curl http://localhost:${PORT_ANALYTICS}/health"
echo ""
echo "📋 Logs:"
echo "  ├─ Event Router:       tail -f /tmp/Event-Router.log"
echo "  └─ Analytics:          tail -f /tmp/Analytics-Service.log"
echo ""
echo "🛑 Stop all services:"
echo "  bash ${BASE_DIR}/scripts/stop-services.sh"
echo ""
echo "============================================================"
