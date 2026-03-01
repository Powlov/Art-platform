import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { parse } from 'url';
import { getDb } from './db';
import { eq } from 'drizzle-orm';
import { auctions, messages, users } from '../drizzle/schema';

interface WebSocketClient {
  ws: WebSocket;
  userId?: number;
  userName?: string;
  userAvatar?: string;
  auctionId?: number;
  messageThreadId?: number;
  lastPing?: Date;
}

const clients: Map<string, WebSocketClient> = new Map();
let clientIdCounter = 0;

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws: WebSocket, req: any) => {
    const clientId = `client-${++clientIdCounter}`;
    const client: WebSocketClient = { ws };
    clients.set(clientId, client);

    console.log(`[WebSocket] Client connected: ${clientId}`);

    ws.on('message', async (data: string) => {
      try {
        const message = JSON.parse(data);
        await handleWebSocketMessage(client, message, clientId);
      } catch (error) {
        console.error('[WebSocket] Error handling message:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      }
    });

    ws.on('close', () => {
      clients.delete(clientId);
      console.log(`[WebSocket] Client disconnected: ${clientId}`);
    });

    ws.on('error', (error: any) => {
      console.error(`[WebSocket] Error for ${clientId}:`, error);
    });
  });

  return wss;
}

async function handleWebSocketMessage(
  client: WebSocketClient,
  message: any,
  clientId: string
) {
  const { type, payload } = message;

  switch (type) {
    case 'auth':
      client.userId = payload.userId;
      client.userName = payload.userName || 'Anonymous';
      client.userAvatar = payload.userAvatar || '';
      client.lastPing = new Date();
      client.ws.send(JSON.stringify({ type: 'auth_success', userId: payload.userId }));
      broadcastUserStatus(payload.userId, 'online');
      break;

    case 'subscribe_auction':
      client.auctionId = payload.auctionId;
      client.ws.send(JSON.stringify({ 
        type: 'auction_subscribed', 
        auctionId: payload.auctionId,
        watchersCount: getAuctionWatchers(payload.auctionId)
      }));
      // Notify other watchers that someone joined
      broadcastToAuction(payload.auctionId, {
        type: 'watcher_joined',
        auctionId: payload.auctionId,
        watchersCount: getAuctionWatchers(payload.auctionId),
        userId: client.userId,
        userName: client.userName,
      }, client.ws);
      break;

    case 'unsubscribe_auction':
      const prevAuctionId = client.auctionId;
      client.auctionId = undefined;
      if (prevAuctionId) {
        broadcastToAuction(prevAuctionId, {
          type: 'watcher_left',
          auctionId: prevAuctionId,
          watchersCount: getAuctionWatchers(prevAuctionId),
          userId: client.userId,
          userName: client.userName,
        });
      }
      break;

    case 'auction_chat_message':
      if (client.userId && client.auctionId) {
        const chatMessage = {
          type: 'auction_chat_message',
          auctionId: client.auctionId,
          message: {
            id: `msg-${Date.now()}-${client.userId}`,
            userId: client.userId,
            userName: client.userName || 'Anonymous',
            userAvatar: client.userAvatar || '',
            text: payload.message,
            timestamp: new Date(),
          },
        };
        broadcastToAuction(client.auctionId, chatMessage);
      }
      break;

    case 'subscribe_messages':
      client.messageThreadId = payload.threadId;
      client.ws.send(JSON.stringify({ 
        type: 'messages_subscribed', 
        threadId: payload.threadId 
      }));
      break;

    case 'place_bid':
      if (client.userId && client.auctionId) {
        await handleBid(client, payload);
      }
      break;

    case 'send_message':
      if (client.userId) {
        await handleMessage(client, payload);
      }
      break;

    case 'price_update':
      if (client.userId && client.auctionId) {
        broadcastToAuction(client.auctionId, {
          type: 'price_update',
          auctionId: client.auctionId,
          currentPrice: payload.currentPrice,
          bidderId: client.userId,
          timestamp: new Date(),
        });
      }
      break;

    case 'ping':
      client.lastPing = new Date();
      client.ws.send(JSON.stringify({ type: 'pong', timestamp: new Date() }));
      break;

    case 'subscribe_fraud_alerts':
      client.ws.send(JSON.stringify({ 
        type: 'fraud_alerts_subscribed',
        timestamp: new Date()
      }));
      console.log(`[WebSocket] Client ${clientId} subscribed to fraud alerts`);
      break;

    case 'subscribe_graph_updates':
      client.ws.send(JSON.stringify({ 
        type: 'graph_updates_subscribed',
        timestamp: new Date()
      }));
      console.log(`[WebSocket] Client ${clientId} subscribed to graph updates`);
      break;

    case 'subscribe_banking_updates':
      client.ws.send(JSON.stringify({ 
        type: 'banking_updates_subscribed',
        timestamp: new Date()
      }));
      console.log(`[WebSocket] Client ${clientId} subscribed to banking updates`);
      break;

    default:
      console.warn(`[WebSocket] Unknown message type: ${type}`);
  }
}

async function handleBid(client: WebSocketClient, payload: any) {
  const db = await getDb();
  if (!db || !client.userId || !client.auctionId) return;

  try {
    const auction = await db.select().from(auctions)
      .where(eq(auctions.id, client.auctionId))
      .limit(1);

    if (!auction.length) {
      client.ws.send(JSON.stringify({ 
        type: 'error', 
        message: 'Auction not found' 
      }));
      return;
    }

    const auctionData = auction[0];
    const newBid = parseFloat(payload.amount);
    const currentBid = auctionData.currentBid ? parseFloat(auctionData.currentBid.toString()) : parseFloat(auctionData.startPrice.toString());

    if (newBid <= currentBid) {
      client.ws.send(JSON.stringify({ 
        type: 'bid_rejected', 
        message: 'Bid must be higher than current bid',
        currentBid 
      }));
      return;
    }

    // Broadcast bid to all clients watching this auction
    const user = await db.select().from(users)
      .where(eq(users.id, client.userId))
      .limit(1);
    
    const userName = user.length > 0 ? user[0].name : 'Anonymous';
    const userAvatar = user.length > 0 ? user[0].avatar : '';

    broadcastToAuction(client.auctionId, {
      type: 'new_bid',
      auctionId: client.auctionId,
      bid: {
        id: `bid-${Date.now()}`,
        userId: client.userId,
        userName: userName,
        userAvatar: userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${client.userId}`,
        amount: newBid,
        timestamp: new Date(),
        isAutomatic: payload.isAutomatic || false,
      },
      currentBid: newBid,
      bidsCount: (auctionData.bidsCount || 0) + 1,
    });

    client.ws.send(JSON.stringify({ 
      type: 'bid_accepted', 
      amount: newBid,
      message: 'Your bid has been placed successfully' 
    }));
  } catch (error) {
    console.error('[WebSocket] Error handling bid:', error);
    client.ws.send(JSON.stringify({ 
      type: 'error', 
      message: 'Failed to place bid' 
    }));
  }
}

async function handleMessage(client: WebSocketClient, payload: any) {
  const db = await getDb();
  if (!db || !client.userId) return;

  try {
    const newMessage = {
      senderId: client.userId,
      recipientId: payload.recipientId,
      content: payload.content,
      type: payload.type || 'text',
      fileUrl: payload.fileUrl,
      artworkId: payload.artworkId,
      isRead: false,
      createdAt: new Date(),
    };

    // Broadcast to recipient if online
    broadcastToUser(payload.recipientId, {
      type: 'new_message',
      message: newMessage,
    });

    client.ws.send(JSON.stringify({ 
      type: 'message_sent', 
      message: newMessage 
    }));
  } catch (error) {
    console.error('[WebSocket] Error handling message:', error);
    client.ws.send(JSON.stringify({ 
      type: 'error', 
      message: 'Failed to send message' 
    }));
  }
}

function broadcastToAuction(auctionId: number, data: any, excludeWs?: WebSocket) {
  clients.forEach((client) => {
    if (
      client.auctionId === auctionId &&
      client.ws.readyState === WebSocket.OPEN &&
      client.ws !== excludeWs
    ) {
      client.ws.send(JSON.stringify(data));
    }
  });
}

function broadcastToUser(userId: number, data: any) {
  clients.forEach((client) => {
    if (client.userId === userId && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(data));
    }
  });
}

function broadcastUserStatus(userId: number, status: 'online' | 'offline') {
  const statusData = {
    type: 'user_status',
    userId,
    status,
    timestamp: new Date(),
  };

  clients.forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(statusData));
    }
  });
}

export function getConnectedUsers(): number[] {
  const users = new Set<number>();
  clients.forEach((client) => {
    if (client.userId) {
      users.add(client.userId);
    }
  });
  return Array.from(users);
}

export function getAuctionWatchers(auctionId: number): number {
  let count = 0;
  clients.forEach((client) => {
    if (client.auctionId === auctionId) {
      count++;
    }
  });
  return count;
}

// Send notification to a specific user
export function sendNotification(userId: number, notification: {
  type: 'artwork_approved' | 'artwork_rejected' | 'new_bid' | 'auction_won' | 'auction_lost' | 'new_message' | 'payment_received';
  title: string;
  message: string;
  link?: string;
  artworkId?: number;
  auctionId?: number;
}) {
  clients.forEach((client) => {
    if (client.userId === userId && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify({
        type: 'notification',
        notification: {
          id: `notif-${Date.now()}`,
          ...notification,
          timestamp: new Date(),
          read: false,
        }
      }));
    }
  });
}

// Broadcast notification to all connected users
export function broadcastNotification(notification: {
  type: string;
  title: string;
  message: string;
  link?: string;
}) {
  clients.forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify({
        type: 'notification',
        notification: {
          id: `notif-${Date.now()}`,
          ...notification,
          timestamp: new Date(),
          read: false,
        }
      }));
    }
  });
}

// Broadcast fraud alert to all connected users
export function broadcastFraudAlert(alert: {
  id: string;
  type: 'wash_trading' | 'price_manipulation' | 'fake_provenance' | 'circular_ownership' | 'rapid_trades' | 'anomaly';
  severity: 'critical' | 'high' | 'medium' | 'low';
  artworkId: string;
  artworkTitle: string;
  description: string;
  confidence?: number;
  timestamp: Date;
}) {
  const alertMessage = {
    type: 'fraud_alert',
    alert: {
      id: alert.id,
      type: alert.type,
      severity: alert.severity,
      artworkId: alert.artworkId,
      artworkTitle: alert.artworkTitle,
      description: alert.description,
      confidence: alert.confidence || 85,
      timestamp: alert.timestamp,
      status: 'active'
    }
  };

  clients.forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(alertMessage));
      console.log(`[WebSocket] Sent fraud alert ${alert.id} to client`);
    }
  });
}

// Broadcast graph trust update
export function broadcastGraphUpdate(update: {
  nodeId: string;
  nodeName: string;
  nodeType: 'artist' | 'gallery' | 'artwork' | 'collector' | 'transaction';
  action: 'created' | 'updated' | 'verified';
  trustScore?: number;
  timestamp: Date;
}) {
  const updateMessage = {
    type: 'graph_update',
    update: {
      nodeId: update.nodeId,
      nodeName: update.nodeName,
      nodeType: update.nodeType,
      action: update.action,
      trustScore: update.trustScore,
      timestamp: update.timestamp
    }
  };

  clients.forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(updateMessage));
    }
  });
}

// Broadcast banking update (LTV change, margin call, etc.)
export function broadcastBankingUpdate(update: {
  loanId: string;
  bankName: string;
  artworkTitle: string;
  updateType: 'ltv_change' | 'margin_call' | 'loan_created' | 'loan_paid' | 'valuation_update';
  currentLTV?: number;
  previousLTV?: number;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: Date;
}) {
  const updateMessage = {
    type: 'banking_update',
    update: {
      loanId: update.loanId,
      bankName: update.bankName,
      artworkTitle: update.artworkTitle,
      updateType: update.updateType,
      currentLTV: update.currentLTV,
      previousLTV: update.previousLTV,
      message: update.message,
      severity: update.severity,
      timestamp: update.timestamp
    }
  };

  clients.forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(updateMessage));
    }
  });
}

// Get all connected clients count
export function getConnectedClientsCount(): number {
  return clients.size;
}

