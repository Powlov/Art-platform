import React, { useState, useEffect } from 'react';
import { Bell, Check, X, Clock, DollarSign, MessageSquare, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';

interface Notification {
  id: string;
  type: 'deal' | 'message' | 'event' | 'system';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
}

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  badgeCount: number;
}

const notificationIcons = {
  deal: DollarSign,
  message: MessageSquare,
  event: Calendar,
  system: Bell,
};

const notificationColors = {
  deal: 'text-green-600 bg-green-100',
  message: 'text-blue-600 bg-blue-100',
  event: 'text-purple-600 bg-purple-100',
  system: 'text-gray-600 bg-gray-100',
};

export default function NotificationsDropdown({ isOpen, onClose, badgeCount }: NotificationsDropdownProps) {
  const [, setLocation] = useLocation();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'deal',
      title: 'Сделка завершена',
      description: 'Произведение "Абстракция #5" успешно продано за ₽45,000',
      timestamp: '5 мин назад',
      isRead: false,
    },
    {
      id: '2',
      type: 'message',
      title: 'Новое сообщение',
      description: 'Галерея "Современное искусство" ответила на ваш запрос',
      timestamp: '1 час назад',
      isRead: false,
      link: '/messenger',
    },
    {
      id: '3',
      type: 'event',
      title: 'Скоро событие',
      description: 'Ярмарка WIN-WIN начинается через 2 дня',
      timestamp: '3 часа назад',
      isRead: false,
      link: '/events/win-win-2025',
    },
    {
      id: '4',
      type: 'system',
      title: 'Подтверждение оплаты',
      description: 'Платеж ₽12,500 успешно обработан',
      timestamp: '1 день назад',
      isRead: true,
    },
  ]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (notification: Notification) => {
    handleMarkAsRead(notification.id);
    if (notification.link) {
      setLocation(notification.link);
      onClose();
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dropdown */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-lg shadow-2xl z-50"
          role="dialog"
          aria-label="Уведомления"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={20} className="text-gray-700" />
              <h3 className="font-bold text-lg">Уведомления</h3>
              {unreadCount > 0 && (
                <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-xs"
                >
                  <Check size={14} className="mr-1" />
                  Прочитать все
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label="Закрыть"
              >
                <X size={18} />
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell size={48} className="mx-auto mb-3 opacity-30" />
                <p>Нет уведомлений</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => {
                  const Icon = notificationIcons[notification.type];
                  const colorClass = notificationColors[notification.type];

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className={`p-2 rounded-lg ${colorClass} flex-shrink-0`}>
                          <Icon size={18} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-sm text-gray-900 line-clamp-1">
                              {notification.title}
                            </p>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.description}
                          </p>
                          <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                            <Clock size={12} />
                            <span>{notification.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 text-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700 text-sm"
              onClick={() => {
                setLocation('/notifications');
                onClose();
              }}
            >
              Посмотреть все уведомления →
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
