"""
WebSocket Bridge for Real-Time Events
Connects microservices via WebSocket for instant updates
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Set, List
import asyncio
import json
import pika
import os
from datetime import datetime
from threading import Thread

app = FastAPI(title="Art-OS WebSocket Bridge", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = {
            "all": set(),
            "transactions": set(),
            "analytics": set(),
            "media": set(),
            "auctions": set(),
        }
    
    async def connect(self, websocket: WebSocket, channel: str = "all"):
        await websocket.accept()
        self.active_connections[channel].add(websocket)
        self.active_connections["all"].add(websocket)
        print(f"✅ Client connected to channel: {channel}")
    
    def disconnect(self, websocket: WebSocket, channel: str = "all"):
        if websocket in self.active_connections[channel]:
            self.active_connections[channel].remove(websocket)
        if websocket in self.active_connections["all"]:
            self.active_connections["all"].remove(websocket)
        print(f"❌ Client disconnected from channel: {channel}")
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        try:
            await websocket.send_text(message)
        except Exception as e:
            print(f"Error sending message: {e}")
    
    async def broadcast(self, message: str, channel: str = "all"):
        """Broadcast message to all clients in a channel"""
        disconnected = set()
        for connection in self.active_connections[channel]:
            try:
                await connection.send_text(message)
            except Exception as e:
                print(f"Error broadcasting to client: {e}")
                disconnected.add(connection)
        
        # Remove disconnected clients
        for conn in disconnected:
            self.disconnect(conn, channel)
    
    async def broadcast_json(self, data: dict, channel: str = "all"):
        """Broadcast JSON data to channel"""
        message = json.dumps(data)
        await self.broadcast(message, channel)

manager = ConnectionManager()

# RabbitMQ Consumer Thread
class RabbitMQConsumer:
    def __init__(self, manager: ConnectionManager):
        self.manager = manager
        self.rabbitmq_url = os.getenv("RABBITMQ_URL", "amqp://guest:guest@localhost:5672/")
        self.running = False
    
    def start(self):
        """Start consuming from RabbitMQ"""
        self.running = True
        thread = Thread(target=self._consume, daemon=True)
        thread.start()
        print("🐰 RabbitMQ consumer started")
    
    def _consume(self):
        """Consume messages from RabbitMQ exchanges"""
        try:
            connection = pika.BlockingConnection(pika.URLParameters(self.rabbitmq_url))
            channel = connection.channel()
            
            # Declare exchanges
            exchanges = ["analytics", "transactions", "media"]
            for exchange in exchanges:
                channel.exchange_declare(exchange=exchange, exchange_type="topic", durable=True)
            
            # Create queue
            result = channel.queue_declare(queue='', exclusive=True)
            queue_name = result.method.queue
            
            # Bind to all exchanges
            channel.queue_bind(exchange="analytics", queue=queue_name, routing_key="#")
            channel.queue_bind(exchange="transactions", queue=queue_name, routing_key="#")
            channel.queue_bind(exchange="media", queue=queue_name, routing_key="#")
            
            def callback(ch, method, properties, body):
                try:
                    data = json.loads(body)
                    event_type = data.get("type", "unknown")
                    
                    # Determine channel
                    if "transaction" in event_type:
                        channel_name = "transactions"
                    elif "price" in event_type or "analytics" in event_type:
                        channel_name = "analytics"
                    elif "media" in event_type:
                        channel_name = "media"
                    elif "auction" in event_type or "bid" in event_type:
                        channel_name = "auctions"
                    else:
                        channel_name = "all"
                    
                    # Broadcast to WebSocket clients
                    asyncio.run(self.manager.broadcast_json({
                        "event": event_type,
                        "data": data,
                        "timestamp": datetime.now().isoformat(),
                        "channel": channel_name,
                    }, channel_name))
                    
                    print(f"📡 Broadcasted event: {event_type} to channel: {channel_name}")
                
                except Exception as e:
                    print(f"Error processing message: {e}")
            
            channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=True)
            
            print("🎧 Listening for RabbitMQ messages...")
            channel.start_consuming()
        
        except Exception as e:
            print(f"❌ RabbitMQ consumer error: {e}")
            if self.running:
                # Retry connection
                asyncio.run(asyncio.sleep(5))
                self._consume()

# Initialize consumer
rabbitmq_consumer = RabbitMQConsumer(manager)

@app.on_event("startup")
async def startup_event():
    """Start RabbitMQ consumer on startup"""
    rabbitmq_consumer.start()
    print("🚀 WebSocket Bridge started")

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "websocket-bridge",
        "active_connections": {
            channel: len(connections)
            for channel, connections in manager.active_connections.items()
        }
    }

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    General WebSocket endpoint for all events
    """
    await manager.connect(websocket, "all")
    
    try:
        # Send welcome message
        await manager.send_personal_message(
            json.dumps({
                "type": "connected",
                "message": "Connected to Art-OS WebSocket Bridge",
                "channels": list(manager.active_connections.keys())
            }),
            websocket
        )
        
        # Keep connection alive
        while True:
            data = await websocket.receive_text()
            
            # Handle ping/pong
            if data == "ping":
                await manager.send_personal_message("pong", websocket)
            else:
                # Echo back for testing
                await manager.send_personal_message(
                    json.dumps({"echo": data}),
                    websocket
                )
    
    except WebSocketDisconnect:
        manager.disconnect(websocket, "all")
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket, "all")

@app.websocket("/ws/{channel}")
async def websocket_channel(websocket: WebSocket, channel: str):
    """
    Channel-specific WebSocket endpoint
    Channels: transactions, analytics, media, auctions
    """
    if channel not in manager.active_connections:
        await websocket.close(code=1008, reason="Invalid channel")
        return
    
    await manager.connect(websocket, channel)
    
    try:
        # Send welcome message
        await manager.send_personal_message(
            json.dumps({
                "type": "connected",
                "message": f"Connected to channel: {channel}",
                "channel": channel
            }),
            websocket
        )
        
        # Keep connection alive
        while True:
            data = await websocket.receive_text()
            
            if data == "ping":
                await manager.send_personal_message("pong", websocket)
    
    except WebSocketDisconnect:
        manager.disconnect(websocket, channel)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket, channel)

@app.post("/api/v1/broadcast")
async def broadcast_message(channel: str = "all", message: dict = None):
    """
    Manually broadcast a message to WebSocket clients
    For testing and internal use
    """
    if channel not in manager.active_connections:
        return {"error": "Invalid channel"}
    
    await manager.broadcast_json({
        "type": "manual_broadcast",
        "data": message,
        "timestamp": datetime.now().isoformat()
    }, channel)
    
    return {
        "status": "broadcasted",
        "channel": channel,
        "recipients": len(manager.active_connections[channel])
    }

@app.get("/api/v1/channels")
async def list_channels():
    """
    List all available channels and their connection counts
    """
    return {
        "channels": {
            channel: {
                "active_connections": len(connections),
                "description": get_channel_description(channel)
            }
            for channel, connections in manager.active_connections.items()
        }
    }

def get_channel_description(channel: str) -> str:
    descriptions = {
        "all": "All events from all services",
        "transactions": "Transaction lifecycle events",
        "analytics": "Price updates, KDE calculations, cascade pricing",
        "media": "News articles, sentiment analysis results",
        "auctions": "Auction bids, auction end notifications",
    }
    return descriptions.get(channel, "Unknown channel")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8004))
    uvicorn.run(app, host="0.0.0.0", port=port)
