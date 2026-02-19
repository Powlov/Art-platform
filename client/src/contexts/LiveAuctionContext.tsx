import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';

interface Bid {
  id: string;
  userId: number;
  userName: string;
  userAvatar: string;
  amount: number;
  timestamp: Date;
  isAutomatic?: boolean;
}

interface ChatMessage {
  id: string;
  userId: number;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: Date;
}

interface AuctionData {
  id: number;
  currentBid: number;
  bidsCount: number;
  highestBidder?: {
    id: number;
    name: string;
    avatar: string;
  };
  watchersCount: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
}

interface LiveAuctionContextType {
  // Connection state
  isConnected: boolean;
  isSubscribed: boolean;
  
  // Auction data
  auctionData: AuctionData | null;
  bids: Bid[];
  chatMessages: ChatMessage[];
  
  // Actions
  subscribeToAuction: (auctionId: number) => void;
  unsubscribeFromAuction: () => void;
  placeBid: (amount: number, isAutomatic?: boolean) => Promise<void>;
  sendChatMessage: (message: string) => void;
  
  // State
  isPlacingBid: boolean;
  bidError: string | null;
}

const LiveAuctionContext = createContext<LiveAuctionContextType | undefined>(undefined);

export function LiveAuctionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [auctionData, setAuctionData] = useState<AuctionData | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [bidError, setBidError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const currentAuctionIdRef = useRef<number | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout>();

  // WebSocket connection
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[LiveAuction] WebSocket connected');
        setIsConnected(true);

        // Authenticate if user is logged in
        if (user) {
          ws.send(JSON.stringify({
            type: 'auth',
            payload: {
              userId: user.id,
              userName: user.name,
              userAvatar: user.avatar,
            },
          }));
        }

        // Start ping interval
        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, 30000); // Ping every 30 seconds
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data);
        } catch (error) {
          console.error('[LiveAuction] Error parsing message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('[LiveAuction] WebSocket error:', error);
        setIsConnected(false);
      };

      ws.onclose = () => {
        console.log('[LiveAuction] WebSocket disconnected');
        setIsConnected(false);
        setIsSubscribed(false);
        
        // Clear ping interval
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
        }

        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('[LiveAuction] Attempting to reconnect...');
          connect();
        }, 3000);
      };
    } catch (error) {
      console.error('[LiveAuction] Error creating WebSocket:', error);
    }
  }, [user]);

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback((data: any) => {
    switch (data.type) {
      case 'auth_success':
        console.log('[LiveAuction] Authenticated');
        break;

      case 'auction_subscribed':
        console.log('[LiveAuction] Subscribed to auction', data.auctionId);
        setIsSubscribed(true);
        setAuctionData((prev) => ({
          ...prev!,
          watchersCount: data.watchersCount || 0,
        }));
        break;

      case 'new_bid':
        console.log('[LiveAuction] New bid received', data.bid);
        // Add bid to the beginning of the list
        setBids((prev) => [data.bid, ...prev].slice(0, 50)); // Keep last 50 bids
        
        // Update auction data
        setAuctionData((prev) => ({
          ...prev!,
          currentBid: data.currentBid,
          bidsCount: data.bidsCount,
          highestBidder: {
            id: data.bid.userId,
            name: data.bid.userName,
            avatar: data.bid.userAvatar,
          },
        }));
        break;

      case 'bid_accepted':
        console.log('[LiveAuction] Bid accepted');
        setIsPlacingBid(false);
        setBidError(null);
        break;

      case 'bid_rejected':
        console.log('[LiveAuction] Bid rejected:', data.message);
        setIsPlacingBid(false);
        setBidError(data.message);
        break;

      case 'auction_chat_message':
        console.log('[LiveAuction] Chat message received');
        setChatMessages((prev) => [...prev, data.message].slice(-100)); // Keep last 100 messages
        break;

      case 'watcher_joined':
        console.log('[LiveAuction] Watcher joined');
        setAuctionData((prev) => ({
          ...prev!,
          watchersCount: data.watchersCount,
        }));
        break;

      case 'watcher_left':
        console.log('[LiveAuction] Watcher left');
        setAuctionData((prev) => ({
          ...prev!,
          watchersCount: data.watchersCount,
        }));
        break;

      case 'error':
        console.error('[LiveAuction] Error:', data.message);
        setBidError(data.message);
        break;

      case 'pong':
        // Heartbeat response
        break;

      default:
        console.warn('[LiveAuction] Unknown message type:', data.type);
    }
  }, []);

  // Subscribe to auction
  const subscribeToAuction = useCallback((auctionId: number) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('[LiveAuction] WebSocket not connected');
      return;
    }

    // Unsubscribe from previous auction if any
    if (currentAuctionIdRef.current && currentAuctionIdRef.current !== auctionId) {
      unsubscribeFromAuction();
    }

    currentAuctionIdRef.current = auctionId;
    
    // Initialize auction data
    setAuctionData({
      id: auctionId,
      currentBid: 0,
      bidsCount: 0,
      watchersCount: 0,
      status: 'active',
    });
    
    // Clear previous data
    setBids([]);
    setChatMessages([]);

    wsRef.current.send(JSON.stringify({
      type: 'subscribe_auction',
      payload: { auctionId },
    }));
  }, []);

  // Unsubscribe from auction
  const unsubscribeFromAuction = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    if (currentAuctionIdRef.current) {
      wsRef.current.send(JSON.stringify({
        type: 'unsubscribe_auction',
        payload: { auctionId: currentAuctionIdRef.current },
      }));
    }

    currentAuctionIdRef.current = null;
    setIsSubscribed(false);
    setAuctionData(null);
    setBids([]);
    setChatMessages([]);
  }, []);

  // Place bid
  const placeBid = useCallback(async (amount: number, isAutomatic = false) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket not connected');
    }

    if (!user) {
      throw new Error('User not authenticated');
    }

    if (!currentAuctionIdRef.current) {
      throw new Error('No auction subscribed');
    }

    setIsPlacingBid(true);
    setBidError(null);

    wsRef.current.send(JSON.stringify({
      type: 'place_bid',
      payload: {
        auctionId: currentAuctionIdRef.current,
        amount,
        isAutomatic,
      },
    }));

    // Wait for response (timeout after 5 seconds)
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        setIsPlacingBid(false);
        reject(new Error('Bid timeout'));
      }, 5000);

      const checkBidStatus = setInterval(() => {
        if (!isPlacingBid) {
          clearTimeout(timeout);
          clearInterval(checkBidStatus);
          if (bidError) {
            reject(new Error(bidError));
          } else {
            resolve();
          }
        }
      }, 100);
    });
  }, [user, isPlacingBid, bidError]);

  // Send chat message
  const sendChatMessage = useCallback((message: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('[LiveAuction] WebSocket not connected');
      return;
    }

    if (!user) {
      console.error('[LiveAuction] User not authenticated');
      return;
    }

    if (!currentAuctionIdRef.current) {
      console.error('[LiveAuction] No auction subscribed');
      return;
    }

    wsRef.current.send(JSON.stringify({
      type: 'auction_chat_message',
      payload: {
        message: message.trim(),
      },
    }));
  }, [user]);

  // Connect on mount
  useEffect(() => {
    connect();

    return () => {
      // Cleanup on unmount
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  // Reconnect when user logs in
  useEffect(() => {
    if (user && !isConnected) {
      connect();
    }
  }, [user, isConnected, connect]);

  const value: LiveAuctionContextType = {
    isConnected,
    isSubscribed,
    auctionData,
    bids,
    chatMessages,
    subscribeToAuction,
    unsubscribeFromAuction,
    placeBid,
    sendChatMessage,
    isPlacingBid,
    bidError,
  };

  return (
    <LiveAuctionContext.Provider value={value}>
      {children}
    </LiveAuctionContext.Provider>
  );
}

export function useLiveAuction() {
  const context = useContext(LiveAuctionContext);
  if (context === undefined) {
    throw new Error('useLiveAuction must be used within a LiveAuctionProvider');
  }
  return context;
}
