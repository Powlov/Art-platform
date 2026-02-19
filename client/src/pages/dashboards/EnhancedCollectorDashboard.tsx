import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Gavel,
  ShoppingCart,
  Eye,
  Award,
  Sparkles,
  Target,
  Bell,
  BarChart3,
  PieChart,
  Package,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Calendar,
  ArrowRight,
  Filter,
  Download,
  Truck,
  BadgeCheck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation } from 'wouter';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import { LoadingState } from '@/components/LoadingState';

interface CollectorStats {
  collectionSize: number;
  portfolioValue: number;
  totalInvestment: number;
  valueGrowth: number;
  roi: number;
  activeAuctions: number;
  wishlistItems: number;
  recentViews: number;
}

interface Artwork {
  id: number;
  title: string;
  artist: string;
  image: string;
  purchasePrice: number;
  currentValue: number;
  purchaseDate: string;
  appreciation: number;
  category: string;
  status: 'owned' | 'auction' | 'wishlist';
}

interface Recommendation {
  id: number;
  title: string;
  artist: string;
  image: string;
  price: number;
  reason: string;
  matchScore: number;
  trend: 'rising' | 'stable' | 'emerging';
}

interface Alert {
  id: number;
  type: 'price_target' | 'auction_ending' | 'new_match' | 'market_trend';
  title: string;
  description: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
}

const EnhancedCollectorDashboard: React.FC = () => {
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [stats, setStats] = useState<CollectorStats>({
    collectionSize: 0,
    portfolioValue: 0,
    totalInvestment: 0,
    valueGrowth: 0,
    roi: 0,
    activeAuctions: 0,
    wishlistItems: 0,
    recentViews: 0,
  });

  const [collection, setCollection] = useState<Artwork[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data
      setStats({
        collectionSize: 28,
        portfolioValue: 4850000,
        totalInvestment: 3850000,
        valueGrowth: 25.9,
        roi: 26.0,
        activeAuctions: 5,
        wishlistItems: 12,
        recentViews: 347,
      });

      setCollection([
        {
          id: 1,
          title: 'Безмолвие Времени',
          artist: 'Анна Петрова',
          image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400',
          purchasePrice: 500000,
          currentValue: 850000,
          purchaseDate: '2023-01-15',
          appreciation: 70,
          category: 'Живопись',
          status: 'owned',
        },
        {
          id: 2,
          title: 'Городские Ритмы',
          artist: 'Иван Смирнов',
          image: 'https://images.unsplash.com/photo-1578926078151-9c8f7ed23024?w=400',
          purchasePrice: 650000,
          currentValue: 780000,
          purchaseDate: '2023-06-20',
          appreciation: 20,
          category: 'Современное искусство',
          status: 'owned',
        },
        {
          id: 3,
          title: 'Абстракция #7',
          artist: 'Мария Козлова',
          image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400',
          purchasePrice: 420000,
          currentValue: 520000,
          purchaseDate: '2024-02-10',
          appreciation: 23.8,
          category: 'Абстракция',
          status: 'owned',
        },
      ]);

      setRecommendations([
        {
          id: 1,
          title: 'Цифровые Грезы',
          artist: 'Дмитрий Волков',
          image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=400',
          price: 680000,
          reason: 'Похожий стиль на ваши любимые работы',
          matchScore: 95,
          trend: 'rising',
        },
        {
          id: 2,
          title: 'Портрет Эпохи',
          artist: 'Елена Сергеева',
          image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=400',
          price: 850000,
          reason: 'Художник показывает стабильный рост цен (+40% за год)',
          matchScore: 88,
          trend: 'emerging',
        },
        {
          id: 3,
          title: 'Минимализм #12',
          artist: 'Алексей Новиков',
          image: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=400',
          price: 520000,
          reason: 'Дополняет вашу коллекцию современного искусства',
          matchScore: 82,
          trend: 'stable',
        },
      ]);

      setAlerts([
        {
          id: 1,
          type: 'auction_ending',
          title: 'Аукцион завершается через 2 часа',
          description: 'Работа "Летний Вечер" - текущая ставка 720,000₽',
          time: '2 часа',
          priority: 'high',
        },
        {
          id: 2,
          type: 'price_target',
          title: 'Целевая цена достигнута',
          description: 'Произведение "Безмолвие Времени" достигло целевой стоимости 850,000₽',
          time: '5 часов',
          priority: 'medium',
        },
        {
          id: 3,
          type: 'new_match',
          title: 'Новая рекомендация AI',
          description: '3 новых произведения соответствуют вашим предпочтениям',
          time: '1 день',
          priority: 'low',
        },
      ]);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'rising') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'emerging') return <Sparkles className="w-4 h-4 text-purple-500" />;
    return <TrendingDown className="w-4 h-4 text-gray-500" />;
  };

  const getAlertIcon = (type: string) => {
    const icons = {
      price_target: <Target className="w-5 h-5 text-green-500" />,
      auction_ending: <Gavel className="w-5 h-5 text-orange-500" />,
      new_match: <Sparkles className="w-5 h-5 text-purple-500" />,
      market_trend: <TrendingUp className="w-5 h-5 text-blue-500" />,
    };
    return icons[type as keyof typeof icons] || <Bell className="w-5 h-5" />;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'border-red-200 bg-red-50 dark:bg-red-900/20',
      medium: 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20',
      low: 'border-blue-200 bg-blue-50 dark:bg-blue-900/20',
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  if (loading) {
    return <LoadingState message="Загрузка панели коллекционера..." />;
  }

  const valueGain = stats.portfolioValue - stats.totalInvestment;
  const avgAppreciation = (stats.valueGrowth / stats.collectionSize).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Heart className="w-8 h-8 text-blue-600" />
                Панель Коллекционера
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Управляйте своей коллекцией и инвестициями
              </p>
            </div>
            <div className="flex gap-3 w-full lg:w-auto">
              <Button
                variant="outline"
                onClick={() => navigate('/access-management')}
                className="flex-1 lg:flex-none"
              >
                <Users className="w-4 h-4 mr-2" />
                Консультанты
              </Button>
              <Button
                onClick={() => navigate('/marketplace')}
                className="flex-1 lg:flex-none"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Каталог
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Key Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <Badge variant="secondary">{stats.collectionSize} работ</Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                ₽{stats.portfolioValue.toLocaleString()}
              </h3>
              <p className="text-sm text-gray-500">Стоимость портфеля</p>
              <div className="mt-3 flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-green-600 font-semibold">
                  +₽{valueGain.toLocaleString()}
                </span>
                <span className="text-gray-500">({stats.valueGrowth}%)</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <Badge className="bg-green-500">ROI: {stats.roi}%</Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                +{stats.valueGrowth}%
              </h3>
              <p className="text-sm text-gray-500">Прирост стоимости</p>
              <div className="mt-3">
                <Progress value={stats.valueGrowth} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <Gavel className="w-6 h-6 text-purple-600" />
                </div>
                <Badge variant="outline">{stats.activeAuctions} активных</Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.activeAuctions}
              </h3>
              <p className="text-sm text-gray-500">Участие в аукционах</p>
              <Button variant="link" className="mt-2 p-0 h-auto text-sm" onClick={() => navigate('/auctions')}>
                Смотреть все <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-orange-600" />
                </div>
                <Badge variant="outline">{stats.wishlistItems} в списке</Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.wishlistItems}
              </h3>
              <p className="text-sm text-gray-500">Wishlist</p>
              <Button variant="link" className="mt-2 p-0 h-auto text-sm">
                Посмотреть <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Access - Financial Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Финансовые сервисы
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-500"
              onClick={() => navigate('/wallet')}
            >
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-1">Кошелёк</h3>
                <p className="text-xs text-gray-500">Баланс и транзакции</p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-purple-500"
              onClick={() => navigate('/art-credit')}
            >
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-1">Арт-Кредит</h3>
                <p className="text-xs text-gray-500">От 7% годовых</p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-green-500"
              onClick={() => navigate('/crowdfunding')}
            >
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-1">Краудфандинг</h3>
                <p className="text-xs text-gray-500">Совместные покупки</p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-orange-500"
              onClick={() => navigate('/art-insurance')}
            >
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-1">Страхование</h3>
                <p className="text-xs text-gray-500">Защита коллекции</p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-indigo-500"
              onClick={() => navigate('/rfq')}
            >
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-1">Запросы RFQ</h3>
                <p className="text-xs text-gray-500">Найти произведение</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Quick Access - Service Solutions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Сервисные решения
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-amber-500"
              onClick={() => navigate('/logistics')}
            >
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-1">Логистика</h3>
                <p className="text-xs text-gray-500">Транспорт и хранение</p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-slate-500"
              onClick={() => navigate('/marketplace')}
            >
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-1">Маркетплейс</h3>
                <p className="text-xs text-gray-500">Каталог работ</p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-rose-500"
              onClick={() => navigate('/auctions')}
            >
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Gavel className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-1">Аукционы</h3>
                <p className="text-xs text-gray-500">Торги в реальном времени</p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-emerald-500"
              onClick={() => navigate('/investments')}
            >
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-1">Инвестиции</h3>
                <p className="text-xs text-gray-500">Управление портфелем</p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-500"
              onClick={() => navigate('/events')}
            >
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-1">Мероприятия</h3>
                <p className="text-xs text-gray-500">Выставки и билеты</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="collection">Коллекция</TabsTrigger>
            <TabsTrigger value="recommendations">AI Рекомендации</TabsTrigger>
            <TabsTrigger value="alerts">Алерты</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Portfolio Performance */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Производительность портфеля
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Средний прирост</p>
                        <p className="text-2xl font-bold text-green-600">+{avgAppreciation}%</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Лучшая работа</p>
                        <p className="text-2xl font-bold text-blue-600">+70%</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Просмотры</p>
                        <p className="text-2xl font-bold text-purple-600">{stats.recentViews}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Распределение по категориям</h4>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Живопись</span>
                            <span>45%</span>
                          </div>
                          <Progress value={45} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Современное искусство</span>
                            <span>30%</span>
                          </div>
                          <Progress value={30} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Абстракция</span>
                            <span>25%</span>
                          </div>
                          <Progress value={25} className="h-2" />
                        </div>
                      </div>
                    </div>

                    <Button className="w-full" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Экспортировать отчёт
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Недавняя активность
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: 'Добавлено в коллекцию', item: 'Абстракция #7', time: '2 дня назад' },
                      { action: 'Ставка на аукционе', item: 'Летний Вечер', time: '5 часов назад' },
                      { action: 'Добавлено в wishlist', item: 'Цифровые Грезы', time: '1 день назад' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                          <p className="text-sm text-gray-500 truncate">{activity.item}</p>
                          <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Collection Tab */}
          <TabsContent value="collection">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Моя коллекция ({collection.length} работ)</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Фильтр
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Экспорт
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collection.map((artwork, index) => (
                  <motion.div
                    key={artwork.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                          onClick={() => navigate(`/artwork-passport/${artwork.id}`)}>
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={artwork.image}
                          alt={artwork.title}
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                        <Badge className="absolute top-3 right-3 bg-green-500">
                          +{artwork.appreciation}%
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-lg mb-1">{artwork.title}</h4>
                        <p className="text-sm text-gray-500 mb-3">{artwork.artist}</p>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Покупка:</span>
                            <span className="font-medium">₽{artwork.purchasePrice.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Текущая:</span>
                            <span className="font-semibold text-green-600">₽{artwork.currentValue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Дата:</span>
                            <span>{new Date(artwork.purchaseDate).toLocaleDateString('ru-RU')}</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <Badge variant="outline" className="text-xs">{artwork.category}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* AI Recommendations Tab */}
          <TabsContent value="recommendations">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    AI Рекомендации
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Подобрано на основе ваших предпочтений и истории покупок
                  </p>
                </div>
                <Button variant="outline">
                  Обновить рекомендации
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="flex flex-col sm:flex-row gap-4 p-4">
                        <div className="relative w-full sm:w-48 h-48 flex-shrink-0 overflow-hidden rounded-lg">
                          <img
                            src={rec.image}
                            alt={rec.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            {getTrendIcon(rec.trend)}
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-lg">{rec.title}</h4>
                                <p className="text-sm text-gray-500">{rec.artist}</p>
                              </div>
                              <Badge className="bg-purple-500">
                                {rec.matchScore}%
                              </Badge>
                            </div>

                            <p className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                              ₽{rec.price.toLocaleString()}
                            </p>

                            <div className="flex items-start gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg mb-4">
                              <Sparkles className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-gray-700 dark:text-gray-300">{rec.reason}</p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              className="flex-1"
                              onClick={() => navigate(`/artwork-passport/${rec.id}`)}
                            >
                              Подробнее
                            </Button>
                            <Button variant="outline" size="icon">
                              <Heart className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Уведомления и алерты</h3>
                <Button variant="outline" size="sm">
                  <Bell className="w-4 h-4 mr-2" />
                  Настроить
                </Button>
              </div>

              <div className="space-y-4">
                {alerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`border-l-4 ${getPriorityColor(alert.priority)}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                            {getAlertIcon(alert.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <h4 className="font-semibold">{alert.title}</h4>
                              <span className="text-xs text-gray-500 whitespace-nowrap">{alert.time}</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {alert.description}
                            </p>
                            <div className="flex gap-2">
                              {alert.type === 'auction_ending' && (
                                <Button size="sm" onClick={() => navigate('/auctions')}>
                                  Перейти к аукциону
                                </Button>
                              )}
                              {alert.type === 'new_match' && (
                                <Button size="sm" variant="outline" onClick={() => setActiveTab('recommendations')}>
                                  Смотреть рекомендации
                                </Button>
                              )}
                              <Button size="sm" variant="ghost">
                                Отметить прочитанным
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedCollectorDashboard;
