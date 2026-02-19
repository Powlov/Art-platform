import { useEffect, useRef, useCallback, useState } from 'react';

export interface WebSocketMessage {
  type: 'message' | 'typing' | 'status' | 'read' | 'error';
  data: any;
}

export function useWebSocket(userId: string | undefined) {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (!userId || typeof window === 'undefined') return;
    if (ws.current?.readyState === WebSocket.OPEN) return;

    try {
      const protocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = typeof window !== 'undefined' ? `${protocol}//${window.location.host}/ws?userId=${userId}` : '';
      
      if (!wsUrl) return;

      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        reconnectAttempts.current = 0;
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WebSocketMessage;
          setMessages((prev) => [...prev, message]);

          // Handle different message types
          if (message.type === 'status') {
            if (message.data.status === 'online') {
              setOnlineUsers((prev) => {
                const newSet = new Set(prev);
                newSet.add(message.data.userId);
                return newSet;
              });
            } else if (message.data.status === 'offline') {
              setOnlineUsers((prev) => {
                const newSet = new Set(prev);
                newSet.delete(message.data.userId);
                return newSet;
              });
            }
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      ws.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);

        // Attempt to reconnect
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          setTimeout(connect, delay);
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setIsConnected(false);
    }
  }, [userId]);

  const send = useCallback((message: WebSocketMessage) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  const sendMessage = useCallback(
    (recipientId: string, text: string) => {
      send({
        type: 'message',
        data: {
          recipientId,
          text,
          timestamp: new Date().toISOString(),
        },
      });
    },
    [send]
  );

  const sendTyping = useCallback(
    (recipientId: string) => {
      send({
        type: 'typing',
        data: {
          recipientId,
          timestamp: new Date().toISOString(),
        },
      });
    },
    [send]
  );

  const sendReadReceipt = useCallback(
    (messageId: string) => {
      send({
        type: 'read',
        data: {
          messageId,
          timestamp: new Date().toISOString(),
        },
      });
    },
    [send]
  );

  useEffect(() => {
    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);

  return {
    isConnected,
    messages,
    onlineUsers,
    send,
    sendMessage,
    sendTyping,
    sendReadReceipt,
  };
}
