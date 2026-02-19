import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, X, Info, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'wouter';

interface Notification {
  id: string;
  type: 'artwork_approved' | 'artwork_rejected' | 'new_bid' | 'auction_won' | 'auction_lost' | 'new_message' | 'payment_received' | 'info';
  title: string;
  message: string;
  link?: string;
  artworkId?: number;
  auctionId?: number;
  timestamp: Date;
  read: boolean;
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Connect to WebSocket
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log('[Notifications] WebSocket connected');
      // Authenticate if user is logged in
      const userId = localStorage.getItem('userId');
      if (userId) {
        websocket.send(JSON.stringify({
          type: 'auth',
          payload: { userId: parseInt(userId) }
        }));
      }
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'notification') {
          const newNotification = {
            ...data.notification,
            timestamp: new Date(data.notification.timestamp)
          };
          setNotifications(prev => [newNotification, ...prev].slice(0, 10)); // Keep last 10
          
          // Play sound
          playNotificationSound();
          
          // Show browser notification if permitted
          if (Notification.permission === 'granted') {
            new Notification(newNotification.title, {
              body: newNotification.message,
              icon: '/logo.png',
            });
          }
        }
      } catch (error) {
        console.error('[Notifications] Error parsing message:', error);
      }
    };

    websocket.onerror = (error) => {
      console.error('[Notifications] WebSocket error:', error);
    };

    websocket.onclose = () => {
      console.log('[Notifications] WebSocket disconnected');
      // Reconnect after 3 seconds
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    };

    setWs(websocket);

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      websocket.close();
    };
  }, []);

  const playNotificationSound = () => {
    // Play a subtle notification sound
    const audio = new Audio('data:audio/wav;base64,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');
    audio.volume = 0.3;
    audio.play().catch(() => {}); // Ignore errors if audio is blocked
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'artwork_approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'artwork_rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'new_bid':
      case 'auction_won':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'auction_lost':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'new_message':
        return <Info className="w-5 h-5 text-purple-500" />;
      case 'payment_received':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
          >
            {unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[80vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-500 to-indigo-600">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-white" />
                  <h3 className="font-bold text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-white/20 text-white text-xs rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-sm text-white/80 hover:text-white transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.map((notif) => (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                          !notif.read ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => {
                          markAsRead(notif.id);
                          if (notif.link) {
                            setIsOpen(false);
                          }
                        }}
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {getIcon(notif.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-semibold text-gray-900 text-sm">
                                {notif.title}
                              </p>
                              {!notif.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                              {notif.message}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-400">
                                {getTimeAgo(notif.timestamp)}
                              </span>
                              {notif.link && (
                                <Link href={notif.link}>
                                  <span className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                                    View →
                                  </span>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
