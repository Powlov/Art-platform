import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Users,
  TrendingUp,
  DollarSign,
  Target,
  Award,
  Clock,
  Eye,
  MessageSquare,
  FileText,
  BarChart3,
  ArrowRight,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  Package,
  ShieldCheck,
  Sparkles,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useLocation } from 'wouter';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import { LoadingState } from '@/components/LoadingState';

interface ConsultantStats {
  totalClients: number;
  activeClients: number;
  totalPortfolioValue: number;
  monthlyCommission: number;
  completedDeals: number;
  pendingRecommendations: number;
  averageROI: number;
  clientSatisfaction: number;
}

interface Client {
  id: number;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  portfolioValue: number;
  artworksOwned: number;
  joinDate: string;
  lastContact: string;
  accessLevel: 'full' | 'limited' | 'view-only';
  status: 'active' | 'pending' | 'inactive';
  roi: number;
}

interface Portfolio {
  clientId: number;
  clientName: string;
  totalValue: number;
  totalInvestment: number;
  artworks: PortfolioArtwork[];
  performance: number;
  lastUpdate: string;
}

interface PortfolioArtwork {
  id: number;
  title: string;
  artist: string;
  image: string;
  purchasePrice: number;
  currentValue: number;
  purchaseDate: string;
  appreciation: number;
}

interface Recommendation {
  id: number;
  clientId: number;
  clientName: string;
  artwork: string;
  artist: string;
  price: number;
  reason: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  createdAt: string;
  commission: number;
}

interface Deal {
  id: number;
  clientName: string;
  artwork: string;
  amount: number;
  commission: number;
  status: 'completed' | 'in-progress' | 'pending';
  date: string;
}

const EnhancedConsultantDashboard: React.FC = () => {
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<number | null>(null);

  const [stats, setStats] = useState<ConsultantStats>({
    totalClients: 0,
    activeClients: 0,
    totalPortfolioValue: 0,
    monthlyCommission: 0,
    completedDeals: 0,
    pendingRecommendations: 0,
    averageROI: 0,
    clientSatisfaction: 0,
  });

  const [clients, setClients] = useState<Client[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStats({
        totalClients: 18,
        activeClients: 14,
        totalPortfolioValue: 64500000,
        monthlyCommission: 1280000,
        completedDeals: 47,
        pendingRecommendations: 8,
        averageROI: 24.5,
        clientSatisfaction: 4.7,
      });

      setClients([
        {
          id: 1,
          name: 'Михаил Иванов',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
          email: 'mikhail@example.com',
          phone: '+7 (495) 123-45-67',
          portfolioValue: 8500000,
          artworksOwned: 12,
          joinDate: '2023-01-15',
          lastContact: '2024-12-20',
          accessLevel: 'full',
          status: 'active',
          roi: 28.5,
        },
        {
          id: 2,
          name: 'Елена Соколова',
          avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200',
          email: 'elena@example.com',
          phone: '+7 (495) 234-56-78',
          portfolioValue: 6200000,
          artworksOwned: 8,
          joinDate: '2023-06-20',
          lastContact: '2024-12-18',
          accessLevel: 'full',
          status: 'active',
          roi: 22.3,
        },
        {
          id: 3,
          name: 'Александр Петров',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
          email: 'alex@example.com',
          phone: '+7 (495) 345-67-89',
          portfolioValue: 4800000,
          artworksOwned: 6,
          joinDate: '2024-02-10',
          lastContact: '2024-12-15',
          accessLevel: 'limited',
          status: 'active',
          roi: 18.7,
        },
      ]);

      setPortfolios([
        {
          clientId: 1,
          clientName: 'Михаил Иванов',
          totalValue: 8500000,
          totalInvestment: 6600000,
          performance: 28.8,
          lastUpdate: '2024-12-20',
          artworks: [
            {
              id: 1,
              title: 'Безмолвие Времени',
              artist: 'Анна Петрова',
              image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400',
              purchasePrice: 500000,
              currentValue: 850000,
              purchaseDate: '2023-01-15',
              appreciation: 70,
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
            },
          ],
        },
      ]);

      setRecommendations([
        {
          id: 1,
          clientId: 1,
          clientName: 'Михаил Иванов',
          artwork: 'Цифровые Грезы',
          artist: 'Дмитрий Волков',
          price: 680000,
          reason: 'Соответствует предпочтениям клиента и показывает рост',
          status: 'pending',
          createdAt: '2024-12-20',
          commission: 68000,
        },
        {
          id: 2,
          clientId: 2,
          clientName: 'Елена Соколова',
          artwork: 'Портрет Эпохи',
          artist: 'Елена Сергеева',
          price: 850000,
          reason: 'Инвестиционный потенциал и дополнение коллекции',
          status: 'accepted',
          createdAt: '2024-12-18',
          commission: 85000,
        },
        {
          id: 3,
          clientId: 1,
          clientName: 'Михаил Иванов',
          artwork: 'Абстракция #12',
          artist: 'Мария Козлова',
          price: 520000,
          reason: 'Диверсификация портфеля',
          status: 'completed',
          createdAt: '2024-12-15',
          commission: 52000,
        },
      ]);

      setDeals([
        {
          id: 1,
          clientName: 'Михаил Иванов',
          artwork: 'Безмолвие Времени',
          amount: 850000,
          commission: 85000,
          status: 'completed',
          date: '2024-12-15',
        },
        {
          id: 2,
          clientName: 'Елена Соколова',
          artwork: 'Городские Ритмы',
          amount: 780000,
          commission: 78000,
          status: 'completed',
          date: '2024-12-10',
        },
        {
          id: 3,
          clientName: 'Александр Петров',
          artwork: 'Абстракция #7',
          amount: 520000,
          commission: 52000,
          status: 'in-progress',
          date: '2024-12-20',
        },
      ]);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAccessLevelBadge = (level: string) => {
    const config = {
      full: { label: 'Полный', className: 'bg-green-500' },
      limited: { label: 'Ограниченный', className: 'bg-yellow-500' },
      'view-only': { label: 'Просмотр', className: 'bg-blue-500' },
    };
    const item = config[level as keyof typeof config];
    return <Badge className={`${item.className} text-white text-xs`}>{item.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const config = {
      active: { label: 'Активен', className: 'bg-green-500' },
      pending: { label: 'Ожидает', className: 'bg-yellow-500' },
      inactive: { label: 'Неактивен', className: 'bg-gray-500' },
      accepted: { label: 'Принято', className: 'bg-blue-500' },
      declined: { label: 'Отклонено', className: 'bg-red-500' },
      completed: { label: 'Завершено', className: 'bg-green-500' },
      'in-progress': { label: 'В работе', className: 'bg-yellow-500' },
    };
    const item = config[status as keyof typeof config];
    return item ? <Badge className={`${item.className} text-white`}>{item.label}</Badge> : null;
  };

  if (loading) {
    return <LoadingState message="Загрузка панели консультанта..." />;
  }

  const clientPortfolio = selectedClient
    ? portfolios.find((p) => p.clientId === selectedClient)
    : null;

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
                <Briefcase className="w-8 h-8 text-indigo-600" />
                Панель Консультанта
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Управление клиентами и их портфелями
              </p>
            </div>
            <div className="flex gap-3 w-full lg:w-auto">
              <Button
                variant="outline"
                onClick={() => navigate('/access-management')}
                className="flex-1 lg:flex-none"
              >
                <ShieldCheck className="w-4 h-4 mr-2" />
                Доступы
              </Button>
              <Button className="flex-1 lg:flex-none">
                <Plus className="w-4 h-4 mr-2" />
                Новая рекомендация
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
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
                <Badge variant="secondary">{stats.activeClients} активных</Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.totalClients}
              </h3>
              <p className="text-sm text-gray-500">Всего клиентов</p>
              <Button
                variant="link"
                className="mt-2 p-0 h-auto text-sm"
                onClick={() => setActiveTab('clients')}
              >
                Смотреть всех <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <Badge className="bg-green-500">
                  ₽{(stats.monthlyCommission / 1000000).toFixed(1)}M
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                ₽{(stats.totalPortfolioValue / 1000000).toFixed(1)}M
              </h3>
              <p className="text-sm text-gray-500">Управляемые активы</p>
              <div className="mt-3">
                <Progress value={stats.averageROI} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <Badge variant="outline">{stats.completedDeals} сделок</Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                +{stats.averageROI}%
              </h3>
              <p className="text-sm text-gray-500">Средний ROI</p>
              <Button
                variant="link"
                className="mt-2 p-0 h-auto text-sm"
                onClick={() => setActiveTab('performance')}
              >
                Аналитика <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-orange-600" />
                </div>
                <Badge variant="outline">{stats.pendingRecommendations} новых</Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.clientSatisfaction}
              </h3>
              <p className="text-sm text-gray-500">Рейтинг клиентов</p>
              <div className="mt-3 flex">
                {[...Array(5)].map((_, i) => (
                  <Award
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(stats.clientSatisfaction)
                        ? 'text-yellow-500 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="clients">Клиенты</TabsTrigger>
            <TabsTrigger value="recommendations">Рекомендации</TabsTrigger>
            <TabsTrigger value="performance">Результаты</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Активные рекомендации
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendations.slice(0, 5).map((rec) => (
                      <div
                        key={rec.id}
                        className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-semibold">{rec.artwork}</p>
                            {getStatusBadge(rec.status)}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Для: {rec.clientName} • Художник: {rec.artist}
                          </p>
                          <p className="text-sm text-gray-500 mb-3">{rec.reason}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="font-semibold">₽{rec.price.toLocaleString()}</span>
                            <span className="text-green-600">
                              Комиссия: ₽{rec.commission.toLocaleString()}
                            </span>
                            <span className="text-gray-500">
                              {new Date(rec.createdAt).toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Последние сделки</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {deals.slice(0, 5).map((deal) => (
                        <div
                          key={deal.id}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{deal.artwork}</p>
                            <p className="text-xs text-gray-500">{deal.clientName}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-green-600">
                              +₽{(deal.commission / 1000).toFixed(0)}K
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(deal.date).toLocaleDateString('ru-RU')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Быстрые действия</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full justify-start" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Новая рекомендация
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Связаться с клиентом
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Сформировать отчёт
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">
                  Мои клиенты ({clients.length})
                </h3>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Поиск клиента..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Фильтр
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {clients.map((client, index) => (
                  <motion.div
                    key={client.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <img
                            src={client.avatar}
                            alt={client.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-lg">{client.name}</h4>
                              {getStatusBadge(client.status)}
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              {getAccessLevelBadge(client.accessLevel)}
                              <Badge variant="outline" className="text-xs">
                                <Package className="w-3 h-3 mr-1" />
                                {client.artworksOwned} работ
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Портфель:</span>
                            <span className="font-semibold">
                              ₽{(client.portfolioValue / 1000000).toFixed(1)}M
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">ROI:</span>
                            <span className="font-semibold text-green-600">
                              +{client.roi}%
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Последний контакт:</span>
                            <span>
                              {new Date(client.lastContact).toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => setSelectedClient(client.id)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Портфель
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Связаться
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Portfolio Details Dialog */}
              {clientPortfolio && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Портфель: {clientPortfolio.clientName}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedClient(null)}
                      >
                        Закрыть
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Текущая стоимость</p>
                        <p className="text-2xl font-bold">
                          ₽{(clientPortfolio.totalValue / 1000000).toFixed(1)}M
                        </p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Инвестировано</p>
                        <p className="text-2xl font-bold">
                          ₽{(clientPortfolio.totalInvestment / 1000000).toFixed(1)}M
                        </p>
                      </div>
                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Прирост</p>
                        <p className="text-2xl font-bold text-green-600">
                          +{clientPortfolio.performance}%
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {clientPortfolio.artworks.map((artwork) => (
                        <Card key={artwork.id}>
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <img
                                src={artwork.image}
                                alt={artwork.title}
                                className="w-24 h-24 rounded object-cover"
                              />
                              <div className="flex-1">
                                <h5 className="font-semibold mb-1">{artwork.title}</h5>
                                <p className="text-sm text-gray-500 mb-2">{artwork.artist}</p>
                                <div className="space-y-1 text-xs">
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Покупка:</span>
                                    <span>₽{artwork.purchasePrice.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Сейчас:</span>
                                    <span className="font-semibold text-green-600">
                                      ₽{artwork.currentValue.toLocaleString()}
                                    </span>
                                  </div>
                                  <Badge className="bg-green-500 text-white text-xs">
                                    +{artwork.appreciation}%
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">
                  Рекомендации ({recommendations.length})
                </h3>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Создать рекомендацию
                </Button>
              </div>

              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-lg">{rec.artwork}</h4>
                              {getStatusBadge(rec.status)}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              Для: <span className="font-medium">{rec.clientName}</span> •
                              Художник: {rec.artist}
                            </p>
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-3">
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {rec.reason}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold mb-1">
                              ₽{rec.price.toLocaleString()}
                            </p>
                            <p className="text-sm text-green-600 font-semibold">
                              +₽{rec.commission.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <span className="text-sm text-gray-500">
                            {new Date(rec.createdAt).toLocaleDateString('ru-RU')}
                          </span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-3 h-3 mr-1" />
                              Детали
                            </Button>
                            {rec.status === 'pending' && (
                              <>
                                <Button size="sm" variant="outline">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Принять
                                </Button>
                                <Button size="sm" variant="outline">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Отклонить
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Доход по месяцам</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { month: 'Ноябрь', amount: 950000 },
                      { month: 'Октябрь', amount: 1120000 },
                      { month: 'Сентябрь', amount: 880000 },
                      { month: 'Август', amount: 1050000 },
                    ].map((data, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{data.month}</span>
                          <span className="text-green-600 font-semibold">
                            ₽{(data.amount / 1000).toFixed(0)}K
                          </span>
                        </div>
                        <Progress value={(data.amount / 1200000) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>TOP клиенты по ROI</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {clients
                      .sort((a, b) => b.roi - a.roi)
                      .slice(0, 5)
                      .map((client, index) => (
                        <div
                          key={client.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                        >
                          <Badge variant="outline" className="w-6 h-6 flex items-center justify-center p-0">
                            {index + 1}
                          </Badge>
                          <img
                            src={client.avatar}
                            alt={client.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{client.name}</p>
                            <p className="text-xs text-gray-500">
                              ₽{(client.portfolioValue / 1000000).toFixed(1)}M
                            </p>
                          </div>
                          <Badge className="bg-green-500">+{client.roi}%</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedConsultantDashboard;
