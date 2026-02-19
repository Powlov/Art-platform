import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export interface WebSocketContextType {
  isConnected: boolean;
  subscribe: (eventType: string, callback: (data: any) => void) => void;
  unsubscribe: (eventType: string) => void;
  send: (message: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [listeners, setListeners] = useState<Map<string, (data: any) => void>>(new Map());
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  useEffect(() => {
    // Only attempt to connect to WebSocket if server is available
    // For development, WebSocket is optional
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws';
    let websocket: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;

    const connectWebSocket = () => {
      try {
        websocket = new WebSocket(wsUrl);

        websocket.onopen = () => {
          console.log('WebSocket connected');
          setIsConnected(true);
          setConnectionAttempts(0);
        };

        websocket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            const callback = listeners.get(data.type);
            if (callback) {
              callback(data.payload);
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        websocket.onerror = (error) => {
          console.warn('WebSocket error - continuing without real-time updates:', error);
          setIsConnected(false);
        };

        websocket.onclose = () => {
          console.log('WebSocket disconnected');
          setIsConnected(false);
          
          // Attempt to reconnect after delay (max 5 attempts)
          if (connectionAttempts < 5) {
            reconnectTimeout = setTimeout(() => {
              setConnectionAttempts(prev => prev + 1);
              connectWebSocket();
            }, 3000 + connectionAttempts * 1000);
          }
        };

        setWs(websocket);
      } catch (error) {
        console.warn('Failed to create WebSocket:', error);
        setIsConnected(false);
      }
    };

    connectWebSocket();

    return () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (websocket) {
        websocket.close();
      }
    };
  }, []);

  const subscribe = useCallback((eventType: string, callback: (data: any) => void) => {
    setListeners((prev) => new Map(prev).set(eventType, callback));
  }, []);

  const unsubscribe = useCallback((eventType: string) => {
    setListeners((prev) => {
      const newListeners = new Map(prev);
      newListeners.delete(eventType);
      return newListeners;
    });
  }, []);

  const send = useCallback((message: any) => {
    if (ws && isConnected) {
      ws.send(JSON.stringify(message));
    }
  }, [ws, isConnected]);

  return (
    <WebSocketContext.Provider value={{ isConnected, subscribe, unsubscribe, send }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
};
