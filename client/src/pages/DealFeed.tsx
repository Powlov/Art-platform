import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  Filter,
  Search,
  Bell,
  Eye,
  Heart,
  Share2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Tag,
  Building2,
  User,
  Palette,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation } from 'wouter';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import { LoadingState } from '@/components/LoadingState';

interface Deal {
  id: string;
  type: 'sale' | 'auction' | 'offer' | 'bid';
  status: 'active' | 'completed' | 'pending' | 'cancelled';
  artwork: {
    id: string;
    title: string;
    artist: string;
    imageUrl: string;
    category: string;
  };
  price: number;
  previousPrice?: number;
  buyer?: {
    name: string;
    type: 'collector' | 'gallery' | 'institution';
    avatar: string;
  };
  seller?: {
    name: string;
    type: 'artist' | 'gallery' | 'collector';
    avatar: string;
  };
  timestamp: Date;
  location?: string;
  views: number;
  favorites: number;
  trend: 'up' | 'down' | 'stable';
}

interface FilterOptions {
  type: string[];
  status: string[];
  priceRange: [number, number];
  category: string[];
}

const DealFeed: React.FC = () => {
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    type: [],
    status: [],
    priceRange: [0, 10000000],
    category: [],
  });

  // Simulate WebSocket connection
  useEffect(() => {
    // Initial load
    setTimeout(() => {
      setDeals(generateMockDeals(20));
      setLoading(false);
    }, 800);

    // Simulate real-time updates
    if (autoRefresh) {
      const interval = setInterval(() => {
        setDeals(prev => {
          const newDeal = generateMockDeals(1)[0];
          return [newDeal, ...prev].slice(0, 50); // Keep last 50 deals
        });
      }, 5000); // New deal every 5 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const generateMockDeals = useCallback((count: number): Deal[] => {
    const types: Deal['type'][] = ['sale', 'auction', 'offer', 'bid'];
    const statuses: Deal['status'][] = ['active', 'completed', 'pending'];
    const trends: Deal['trend'][] = ['up', 'down', 'stable'];
    const categories = ['Живопись', 'Скульптура', 'Фотография', 'Графика', 'NFT'];
    const artists = ['Анна Петрова', 'Михаил Иванов', 'Елена Смирнова', 'Дмитрий Козлов'];
    const artworks = [
      'Красная композиция',
      'Городской пейзаж',
      'Абстракция №7',
      'Портрет',
      'Ночной город',
    ];

    return Array.from({ length: count }, (_, i) => ({
      id: `deal-${Date.now()}-${i}`,
      type: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      artwork: {
        id: `artwork-${i}`,
        title: artworks[Math.floor(Math.random() * artworks.length)],
        artist: artists[Math.floor(Math.random() * artists.length)],
        imageUrl: `/artworks/placeholder-${i % 5}.jpg`,
        category: categories[Math.floor(Math.random() * categories.length)],
      },
      price: Math.floor(Math.random() * 5000000) + 100000,
      previousPrice: Math.random() > 0.5 ? Math.floor(Math.random() * 4500000) + 100000 : undefined,
      buyer: Math.random() > 0.3 ? {
        name: 'Иван Коллекционер',
        type: 'collector' as const,
        avatar: '/avatars/buyer.jpg',
      } : undefined,
      seller: {
        name: artists[Math.floor(Math.random() * artists.length)],
        type: 'artist' as const,
        avatar: '/avatars/seller.jpg',
      },
      timestamp: new Date(Date.now() - Math.random() * 3600000),
      location: Math.random() > 0.5 ? 'Москва' : 'Санкт-Петербург',
      views: Math.floor(Math.random() * 1000) + 50,
      favorites: Math.floor(Math.random() * 200) + 10,
      trend: trends[Math.floor(Math.random() * trends.length)],
    }));
  }, []);

  const filteredDeals = deals.filter(deal => {
    if (activeTab !== 'all' && deal.type !== activeTab) return false;
    if (searchQuery && !deal.artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !deal.artwork.artist.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getTypeIcon = (type: Deal['type']) => {
    switch (type) {
      case 'sale': return <DollarSign className="w-4 h-4" />;
      case 'auction': return <TrendingUp className="w-4 h-4" />;
      case 'offer': return <Tag className="w-4 h-4" />;
      case 'bid': return <Zap className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: Deal['type']) => {
    switch (type) {
      case 'sale': return 'Продажа';
      case 'auction': return 'Аукцион';
      case 'offer': return 'Предложение';
      case 'bid': return 'Ставка';
    }
  };

  const getStatusColor = (status: Deal['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'completed': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-600 border-red-500/20';
    }
  };

  const getStatusLabel = (status: Deal['status']) => {
    switch (status) {
      case 'active': return 'Активна';
      case 'completed': return 'Завершена';
      case 'pending': return 'В ожидании';
      case 'cancelled': return 'Отменена';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds} сек назад`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} мин назад`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} ч назад`;
    return `${Math.floor(seconds / 86400)} дн назад`;
  };

  const calculatePriceChange = (current: number, previous?: number) => {
    if (!previous) return null;
    const change = ((current - previous) / previous) * 100;
    return change;
  };

  if (loading) {
    return <LoadingState fullScreen message="Загрузка ленты сделок..." />;
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
                <Activity className="w-8 h-8 text-primary" />
                Лента сделок
                <Badge variant="outline" className="ml-2">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              </h1>
              <p className="text-muted-foreground">
                Отслеживайте сделки в реальном времени
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant={autoRefresh ? 'default' : 'outline'}
                onClick={() => setAutoRefresh(!autoRefresh)}
                className="gap-2"
              >
                <Bell className="w-4 h-4" />
                {autoRefresh ? 'Авто-обновление' : 'Пауза'}
              </Button>
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2">
                <Filter className="w-4 h-4" />
                Фильтры
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Всего сделок</p>
                    <p className="text-2xl font-bold">{deals.length}</p>
                  </div>
                  <Activity className="w-10 h-10 text-primary opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Активных</p>
                    <p className="text-2xl font-bold text-green-600">
                      {deals.filter(d => d.status === 'active').length}
                    </p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-green-600 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Общий объём</p>
                    <p className="text-2xl font-bold">
                      ₽{(deals.reduce((sum, d) => sum + d.price, 0) / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <DollarSign className="w-10 h-10 text-primary opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Средний чек</p>
                    <p className="text-2xl font-bold">
                      ₽{(deals.reduce((sum, d) => sum + d.price, 0) / deals.length / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <Users className="w-10 h-10 text-primary opacity-20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Поиск по названию или художнику..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                icon={<Search className="w-4 h-4" />}
              />
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Тип сделки</label>
                        <div className="space-y-2">
                          {['sale', 'auction', 'offer', 'bid'].map(type => (
                            <label key={type} className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" className="rounded" />
                              <span className="text-sm">{getTypeLabel(type as Deal['type'])}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Статус</label>
                        <div className="space-y-2">
                          {['active', 'completed', 'pending'].map(status => (
                            <label key={status} className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" className="rounded" />
                              <span className="text-sm">{getStatusLabel(status as Deal['status'])}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Категория</label>
                        <div className="space-y-2">
                          {['Живопись', 'Скульптура', 'Фотография', 'NFT'].map(cat => (
                            <label key={cat} className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" className="rounded" />
                              <span className="text-sm">{cat}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Ценовой диапазон</label>
                        <div className="space-y-2">
                          <Input type="number" placeholder="От" />
                          <Input type="number" placeholder="До" />
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">Все ({deals.length})</TabsTrigger>
            <TabsTrigger value="sale">Продажи ({deals.filter(d => d.type === 'sale').length})</TabsTrigger>
            <TabsTrigger value="auction">Аукционы ({deals.filter(d => d.type === 'auction').length})</TabsTrigger>
            <TabsTrigger value="offer">Предложения ({deals.filter(d => d.type === 'offer').length})</TabsTrigger>
            <TabsTrigger value="bid">Ставки ({deals.filter(d => d.type === 'bid').length})</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Deal Feed */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredDeals.map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:border-primary transition-colors cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      {/* Artwork Image */}
                      <div className="w-24 h-24 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center">
                          <Palette className="w-12 h-12 text-muted-foreground opacity-20" />
                        </div>
                      </div>

                      {/* Deal Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="gap-1">
                                {getTypeIcon(deal.type)}
                                {getTypeLabel(deal.type)}
                              </Badge>
                              <Badge className={getStatusColor(deal.status)}>
                                {getStatusLabel(deal.status)}
                              </Badge>
                              {deal.trend !== 'stable' && (
                                <Badge variant="outline" className="gap-1">
                                  {deal.trend === 'up' ? (
                                    <ArrowUpRight className="w-3 h-3 text-green-600" />
                                  ) : (
                                    <ArrowDownRight className="w-3 h-3 text-red-600" />
                                  )}
                                  Тренд
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-semibold text-lg truncate">{deal.artwork.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{deal.artwork.artist}</p>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-2xl font-bold">₽{(deal.price / 1000).toFixed(0)}K</p>
                            {deal.previousPrice && (
                              <p className={`text-sm ${calculatePriceChange(deal.price, deal.previousPrice)! > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {calculatePriceChange(deal.price, deal.previousPrice)! > 0 ? '+' : ''}
                                {calculatePriceChange(deal.price, deal.previousPrice)!.toFixed(1)}%
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Participants */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          {deal.seller && (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>Продавец: {deal.seller.name}</span>
                            </div>
                          )}
                          {deal.buyer && (
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4" />
                              <span>Покупатель: {deal.buyer.name}</span>
                            </div>
                          )}
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatTimeAgo(deal.timestamp)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {deal.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              {deal.favorites}
                            </span>
                            {deal.location && (
                              <span className="flex items-center gap-1">
                                <Info className="w-4 h-4" />
                                {deal.location}
                              </span>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/artwork-passport/${deal.artwork.id}`)}
                            >
                              Детали
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredDeals.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Нет сделок, соответствующих фильтрам</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default DealFeed;
