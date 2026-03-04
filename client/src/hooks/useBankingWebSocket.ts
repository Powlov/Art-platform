import { useEffect, useState, useRef } from 'react';

interface BankingUpdate {
  loanId: string;
  bankName: string;
  artworkTitle: string;
  updateType: 'ltv_change' | 'margin_call' | 'valuation' | 'status_change';
  currentLTV?: number;
  previousLTV?: number;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
}

interface UseBankingWebSocketProps {
  onUpdate?: (update: BankingUpdate) => void;
  autoConnect?: boolean;
}

/**
 * Custom hook for banking real-time updates via WebSocket
 */
export function useBankingWebSocket({ onUpdate, autoConnect = true }: UseBankingWebSocketProps = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [updates, setUpdates] = useState<BankingUpdate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000;

  const connect = () => {
    try {
      // Determine WebSocket URL
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/ws`;

      console.log('[BankingWebSocket] Connecting to:', wsUrl);
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[BankingWebSocket] Connected');
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;

        // Subscribe to banking updates
        ws.send(JSON.stringify({
          type: 'subscribe',
          channel: 'banking_updates'
        }));

        // Send ping every 30 seconds to keep connection alive
        const pingInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, 30000);

        // Store interval ID for cleanup
        (ws as any).pingInterval = pingInterval;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'banking_update') {
            const update: BankingUpdate = data.update;
            console.log('[BankingWebSocket] Banking update received:', update);
            
            setUpdates((prev) => [update, ...prev].slice(0, 50)); // Keep last 50 updates
            
            if (onUpdate) {
              onUpdate(update);
            }
          } else if (data.type === 'pong') {
            console.log('[BankingWebSocket] Pong received');
          }
        } catch (err) {
          console.error('[BankingWebSocket] Error parsing message:', err);
        }
      };

      ws.onerror = (event) => {
        console.error('[BankingWebSocket] Error:', event);
        setError('WebSocket connection error');
      };

      ws.onclose = () => {
        console.log('[BankingWebSocket] Disconnected');
        setIsConnected(false);

        // Clear ping interval
        if ((ws as any).pingInterval) {
          clearInterval((ws as any).pingInterval);
        }

        // Attempt to reconnect
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          console.log(
            `[BankingWebSocket] Reconnecting... (attempt ${reconnectAttempts.current}/${maxReconnectAttempts})`
          );
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectDelay);
        } else {
          setError('Failed to connect after multiple attempts');
        }
      };
    } catch (err) {
      console.error('[BankingWebSocket] Connection error:', err);
      setError('Failed to establish WebSocket connection');
    }
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  };

  const clearUpdates = () => {
    setUpdates([]);
  };

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect]);

  return {
    isConnected,
    updates,
    error,
    connect,
    disconnect,
    clearUpdates,
  };
}
