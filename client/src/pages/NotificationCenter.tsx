import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Check,
  X,
  Filter,
  Search,
  Settings,
  BellRing,
  BellOff,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Info,
  DollarSign,
  Calendar,
  User,
  Heart,
  MessageSquare,
  TrendingUp,
  Package,
  Award,
  Zap,
  Clock,
  Star,
  Tag,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useLocation } from 'wouter';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import { LoadingState } from '@/components/LoadingState';

type NotificationType = 
  | 'deal' 
  | 'auction' 
  | 'price_alert'
  | 'message'
  | 'event'
  | 'system'
  | 'recommendation'
  | 'favorite'
  | 'achievement';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  actionLabel?: string;
  metadata?: {
    artworkId?: string;
    userId?: string;
    price?: number;
    change?: number;
  };
}

interface NotificationSettings {
  deals: boolean;
  auctions: boolean;
  priceAlerts: boolean;
  messages: boolean;
  events: boolean;
  recommendations: boolean;
  favorites: boolean;
  achievements: boolean;
  email: boolean;
  push: boolean;
  sms: boolean;
}

const NotificationCenter: React.FC = () => {
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    deals: true,
    auctions: true,
    priceAlerts: true,
    messages: true,
    events: true,
    recommendations: true,
    favorites: true,
    achievements: true,
    email: true,
    push: true,
    sms: false,
  });

  useEffect(() => {
    setTimeout(() => {
      setNotifications(generateMockNotifications(25));
      setLoading(false);
    }, 800);

    // Simulate real-time notifications
    const interval = setInterval(() => {
      setNotifications(prev => {
        const newNotif = generateMockNotifications(1)[0];
        return [newNotif, ...prev].slice(0, 100);
      });
    }, 15000); // New notification every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const generateMockNotifications = useCallback((count: number): Notification[] => {
    const types: NotificationType[] = [
      'deal', 'auction', 'price_alert', 'message', 'event',
      'system', 'recommendation', 'favorite', 'achievement'
    ];
    const priorities: Notification['priority'][] = ['low', 'medium', 'high', 'urgent'];
    
    const templates = {
      deal: [
        'Новая продажа: "Красная композиция" продана за ₽850K',
        'Сделка завершена: "Городской пейзаж" приобретён коллекционером',
        'Быстрая продажа: "Абстракция №7" продана за 24 часа',
      ],
      auction: [
        'Аукцион начинается: "Портрет" через 2 часа',
        'Новая ставка: ₽720K на "Ночной город"',
        'Аукцион завершён: вы выиграли "Пейзаж"!',
      ],
      price_alert: [
        'Цена снижена: "Скульптура №5" теперь ₽450K (-15%)',
        'Целевая цена достигнута: "Композиция" доступна за ₽280K',
        'Рост цены: "Абстракция" +25% за неделю',
      ],
      message: [
        'Новое сообщение от галереи "Манеж"',
        'Консультант ответил на ваш вопрос',
        'У вас 3 непрочитанных сообщения',
      ],
      event: [
        'Напоминание: выставка "Современное искусство" завтра',
        'Новое мероприятие: "Встреча с художником" 15 июня',
        'WIN-WIN: ваши билеты подтверждены',
      ],
      system: [
        'Обновление системы завершено',
        'Ваш профиль просмотрели 47 раз на этой неделе',
        'Резервное копирование данных выполнено',
      ],
      recommendation: [
        'AI рекомендация: 5 новых работ для вашей коллекции',
        'Инвестиционная возможность: "Фотография №12" с ROI 38%',
        'Похожие работы: найдено 8 совпадений с вашими предпочтениями',
      ],
      favorite: [
        'Новая работа от избранного художника: Анна Петрова',
        'Произведение из вашего wishlist теперь доступно',
        'Художник из избранного участвует в новой выставке',
      ],
      achievement: [
        'Достижение разблокировано: "Коллекционер" (10 покупок)',
        'Новый уровень: "Опытный инвестор"',
        'Награда: +500 баллов за активность',
      ],
    };

    return Array.from({ length: count }, (_, i) => {
      const type = types[Math.floor(Math.random() * types.length)];
      const messages = templates[type];
      const message = messages[Math.floor(Math.random() * messages.length)];
      
      return {
        id: `notif-${Date.now()}-${i}`,
        type,
        title: type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' '),
        message,
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 7), // Last 7 days
        read: Math.random() > 0.6,
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        actionUrl: `/marketplace`,
        actionLabel: 'Посмотреть',
        metadata: {
          price: Math.floor(Math.random() * 1000000) + 100000,
          change: Math.random() * 40 - 20,
        },
      };
    });
  }, []);

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'deal': return <DollarSign className="w-4 h-4" />;
      case 'auction': return <TrendingUp className="w-4 h-4" />;
      case 'price_alert': return <Tag className="w-4 h-4" />;
      case 'message': return <MessageSquare className="w-4 h-4" />;
      case 'event': return <Calendar className="w-4 h-4" />;
      case 'system': return <Settings className="w-4 h-4" />;
      case 'recommendation': return <Zap className="w-4 h-4" />;
      case 'favorite': return <Heart className="w-4 h-4" />;
      case 'achievement': return <Award className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'low': return 'text-muted-foreground';
      case 'medium': return 'text-blue-600';
      case 'high': return 'text-orange-600';
      case 'urgent': return 'text-red-600';
    }
  };

  const getPriorityBadge = (priority: Notification['priority']) => {
    switch (priority) {
      case 'low': return null;
      case 'medium': return <Badge variant="outline">Средний</Badge>;
      case 'high': return <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20">Важно</Badge>;
      case 'urgent': return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Срочно</Badge>;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds} сек назад`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} мин назад`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} ч назад`;
    return `${Math.floor(seconds / 86400)} дн назад`;
  };

  const filteredNotifications = notifications.filter(notif => {
    if (activeTab !== 'all' && notif.type !== activeTab) return false;
    if (searchQuery && !notif.message.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  if (loading) {
    return <LoadingState fullScreen message="Загрузка уведомлений..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <Bell className="w-8 h-8 text-primary" />
                Центр уведомлений
                {unreadCount > 0 && (
                  <Badge className="bg-red-500 text-white">
                    {unreadCount}
                  </Badge>
                )}
              </h1>
              <p className="text-muted-foreground">
                Управление всеми уведомлениями и настройками
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0} className="gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Прочитать все
              </Button>
              <Button variant="outline" onClick={() => setShowSettings(!showSettings)} className="gap-2">
                <Settings className="w-4 h-4" />
                Настройки
              </Button>
              <Button variant="outline" onClick={clearAll} className="gap-2">
                <Trash2 className="w-4 h-4" />
                Очистить
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Всего</p>
                    <p className="text-2xl font-bold">{notifications.length}</p>
                  </div>
                  <Bell className="w-10 h-10 text-primary opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Непрочитанных</p>
                    <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
                  </div>
                  <BellRing className="w-10 h-10 text-red-600 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Срочных</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {notifications.filter(n => n.priority === 'urgent' || n.priority === 'high').length}
                    </p>
                  </div>
                  <AlertCircle className="w-10 h-10 text-orange-600 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">За сегодня</p>
                    <p className="text-2xl font-bold">
                      {notifications.filter(n => 
                        new Date(n.timestamp).toDateString() === new Date().toDateString()
                      ).length}
                    </p>
                  </div>
                  <Clock className="w-10 h-10 text-primary opacity-20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="mb-6">
            <Input
              placeholder="Поиск уведомлений..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Настройки уведомлений</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-3">Типы уведомлений</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(settings).slice(0, 8).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                              <label className="flex items-center gap-2 cursor-pointer">
                                {getTypeIcon(key as NotificationType)}
                                <span className="font-medium">
                                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                </span>
                              </label>
                              <Switch
                                checked={value}
                                onCheckedChange={() => setSettings(prev => ({
                                  ...prev,
                                  [key]: !value
                                }))}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3">Каналы доставки</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <span className="font-medium">Email уведомления</span>
                            <Switch
                              checked={settings.email}
                              onCheckedChange={() => setSettings(prev => ({
                                ...prev,
                                email: !prev.email
                              }))}
                            />
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <span className="font-medium">Push уведомления</span>
                            <Switch
                              checked={settings.push}
                              onCheckedChange={() => setSettings(prev => ({
                                ...prev,
                                push: !prev.push
                              }))}
                            />
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <span className="font-medium">SMS уведомления</span>
                            <Switch
                              checked={settings.sms}
                              onCheckedChange={() => setSettings(prev => ({
                                ...prev,
                                sms: !prev.sms
                              }))}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
            <TabsTrigger value="all">Все ({notifications.length})</TabsTrigger>
            <TabsTrigger value="deal">Сделки</TabsTrigger>
            <TabsTrigger value="auction">Аукционы</TabsTrigger>
            <TabsTrigger value="price_alert">Цены</TabsTrigger>
            <TabsTrigger value="message">Сообщения</TabsTrigger>
            <TabsTrigger value="event">События</TabsTrigger>
            <TabsTrigger value="recommendation">AI</TabsTrigger>
            <TabsTrigger value="favorite">Избранное</TabsTrigger>
            <TabsTrigger value="achievement">Награды</TabsTrigger>
            <TabsTrigger value="system">Система</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Notifications List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.map((notif, index) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.02 }}
              >
                <Card className={`hover:border-primary transition-colors cursor-pointer ${!notif.read ? 'border-primary/50' : ''}`}>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        !notif.read ? 'bg-primary/10' : 'bg-muted'
                      } ${getPriorityColor(notif.priority)}`}>
                        {getTypeIcon(notif.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className={`font-semibold ${!notif.read ? 'text-primary' : ''}`}>
                              {notif.title}
                            </h3>
                            {getPriorityBadge(notif.priority)}
                            {!notif.read && (
                              <Badge className="bg-primary text-white">Новое</Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                            {formatTimeAgo(notif.timestamp)}
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">
                          {notif.message}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {notif.actionUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                markAsRead(notif.id);
                                navigate(notif.actionUrl!);
                              }}
                            >
                              {notif.actionLabel || 'Открыть'}
                            </Button>
                          )}
                          {!notif.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notif.id)}
                              className="gap-1"
                            >
                              <Check className="w-4 h-4" />
                              Прочитано
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notif.id)}
                            className="gap-1 text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                            Удалить
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredNotifications.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <BellOff className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Нет уведомлений</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default NotificationCenter;
