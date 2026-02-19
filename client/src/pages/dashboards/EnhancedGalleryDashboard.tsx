import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Users,
  Palette,
  Calendar,
  DollarSign,
  TrendingUp,
  Phone,
  Mail,
  MapPin,
  Star,
  Eye,
  Plus,
  Search,
  Filter,
  BarChart3,
  UserPlus,
  CalendarPlus,
  Package,
  Award,
  Clock,
  ArrowRight,
  Edit,
  MessageSquare,
  Download,
  FileText,
  Target,
  Briefcase,
  Lock,
  Truck,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface GalleryStats {
  totalArtists: number;
  totalArtworks: number;
  totalClients: number;
  monthlyRevenue: number;
  activeExhibitions: number;
  pendingDeals: number;
  visitorCount: number;
  conversionRate: number;
}

interface Artist {
  id: number;
  name: string;
  avatar: string;
  specialty: string;
  artworks: number;
  totalSales: number;
  status: 'active' | 'pending' | 'inactive';
  joinDate: string;
  rating: number;
}

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  type: 'collector' | 'corporate' | 'institution';
  totalPurchases: number;
  lastContact: string;
  tags: string[];
  status: 'active' | 'potential' | 'cold';
}

interface Exhibition {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  venue: string;
  status: 'planning' | 'active' | 'completed';
  artists: number;
  artworks: number;
  visitors: number;
  sales: number;
}

interface Deal {
  id: number;
  artwork: string;
  client: string;
  artist: string;
  amount: number;
  status: 'negotiating' | 'pending' | 'closed' | 'cancelled';
  probability: number;
  deadline: string;
}

const EnhancedGalleryDashboard: React.FC = () => {
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddArtistDialog, setShowAddArtistDialog] = useState(false);
  const [showAddClientDialog, setShowAddClientDialog] = useState(false);

  const [stats, setStats] = useState<GalleryStats>({
    totalArtists: 0,
    totalArtworks: 0,
    totalClients: 0,
    monthlyRevenue: 0,
    activeExhibitions: 0,
    pendingDeals: 0,
    visitorCount: 0,
    conversionRate: 0,
  });

  const [artists, setArtists] = useState<Artist[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStats({
        totalArtists: 24,
        totalArtworks: 186,
        totalClients: 142,
        monthlyRevenue: 8450000,
        activeExhibitions: 3,
        pendingDeals: 12,
        visitorCount: 4567,
        conversionRate: 18.5,
      });

      setArtists([
        {
          id: 1,
          name: 'Анна Петрова',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
          specialty: 'Живопись',
          artworks: 23,
          totalSales: 4200000,
          status: 'active',
          joinDate: '2022-03-15',
          rating: 4.8,
        },
        {
          id: 2,
          name: 'Иван Смирнов',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
          specialty: 'Современное искусство',
          artworks: 18,
          totalSales: 3100000,
          status: 'active',
          joinDate: '2021-11-20',
          rating: 4.6,
        },
        {
          id: 3,
          name: 'Мария Козлова',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
          specialty: 'Абстракция',
          artworks: 15,
          totalSales: 2800000,
          status: 'active',
          joinDate: '2023-01-10',
          rating: 4.9,
        },
        {
          id: 4,
          name: 'Дмитрий Волков',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
          specialty: 'Цифровое искусство',
          artworks: 31,
          totalSales: 1900000,
          status: 'pending',
          joinDate: '2024-10-05',
          rating: 4.5,
        },
      ]);

      setClients([
        {
          id: 1,
          name: 'Михаил Иванов',
          email: 'mikhail@example.com',
          phone: '+7 (495) 123-45-67',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
          type: 'collector',
          totalPurchases: 5200000,
          lastContact: '2024-12-20',
          tags: ['VIP', 'Живопись', 'Активный'],
          status: 'active',
        },
        {
          id: 2,
          name: 'ООО "Арт Инвест"',
          email: 'info@artinvest.com',
          phone: '+7 (495) 234-56-78',
          avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200',
          type: 'corporate',
          totalPurchases: 8900000,
          lastContact: '2024-12-18',
          tags: ['Корпоративный', 'Современное искусство'],
          status: 'active',
        },
        {
          id: 3,
          name: 'Елена Соколова',
          email: 'elena@example.com',
          phone: '+7 (495) 345-67-89',
          avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200',
          type: 'collector',
          totalPurchases: 3400000,
          lastContact: '2024-11-25',
          tags: ['Потенциальный', 'Абстракция'],
          status: 'potential',
        },
      ]);

      setExhibitions([
        {
          id: 1,
          name: 'Современное Искусство 2024',
          startDate: '2024-12-01',
          endDate: '2025-01-31',
          venue: 'Главный зал',
          status: 'active',
          artists: 8,
          artworks: 32,
          visitors: 1247,
          sales: 4,
        },
        {
          id: 2,
          name: 'Новые Таланты',
          startDate: '2025-02-15',
          endDate: '2025-03-31',
          venue: 'Зал №2',
          status: 'planning',
          artists: 12,
          artworks: 45,
          visitors: 0,
          sales: 0,
        },
      ]);

      setDeals([
        {
          id: 1,
          artwork: 'Безмолвие Времени',
          client: 'Михаил Иванов',
          artist: 'Анна Петрова',
          amount: 850000,
          status: 'negotiating',
          probability: 75,
          deadline: '2024-12-28',
        },
        {
          id: 2,
          artwork: 'Городские Ритмы',
          client: 'ООО "Арт Инвест"',
          artist: 'Иван Смирнов',
          amount: 780000,
          status: 'pending',
          probability: 90,
          deadline: '2024-12-30',
        },
        {
          id: 3,
          artwork: 'Абстракция #7',
          client: 'Елена Соколова',
          artist: 'Мария Козлова',
          amount: 520000,
          status: 'closed',
          probability: 100,
          deadline: '2024-12-25',
        },
      ]);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Активен', className: 'bg-green-500' },
      pending: { label: 'Ожидает', className: 'bg-yellow-500' },
      inactive: { label: 'Неактивен', className: 'bg-gray-500' },
      potential: { label: 'Потенциальный', className: 'bg-blue-500' },
      cold: { label: 'Холодный', className: 'bg-gray-400' },
      planning: { label: 'Планируется', className: 'bg-blue-500' },
      completed: { label: 'Завершена', className: 'bg-gray-500' },
      negotiating: { label: 'Переговоры', className: 'bg-yellow-500' },
      closed: { label: 'Закрыта', className: 'bg-green-500' },
      cancelled: { label: 'Отменена', className: 'bg-red-500' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return config ? (
      <Badge className={`${config.className} text-white`}>{config.label}</Badge>
    ) : null;
  };

  const getClientTypeIcon = (type: string) => {
    const icons = {
      collector: <Users className="w-4 h-4" />,
      corporate: <Briefcase className="w-4 h-4" />,
      institution: <Building2 className="w-4 h-4" />,
    };
    return icons[type as keyof typeof icons] || <Users className="w-4 h-4" />;
  };

  if (loading) {
    return <LoadingState message="Загрузка панели галереи..." />;
  }

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
                <Building2 className="w-8 h-8 text-blue-600" />
                Панель Галереи
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                CRM и управление галереей
              </p>
            </div>
            <div className="flex gap-3 w-full lg:w-auto">
              <Button
                variant="outline"
                onClick={() => navigate('/analytics')}
                className="flex-1 lg:flex-none"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Аналитика
              </Button>
              <Button
                onClick={() => navigate('/events/1')}
                className="flex-1 lg:flex-none"
              >
                <CalendarPlus className="w-4 h-4 mr-2" />
                Новое событие
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
                  <Palette className="w-6 h-6 text-blue-600" />
                </div>
                <Badge variant="secondary">{stats.totalArtists} художников</Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.totalArtworks}
              </h3>
              <p className="text-sm text-gray-500">Произведений в галерее</p>
              <Button
                variant="link"
                className="mt-2 p-0 h-auto text-sm"
                onClick={() => setActiveTab('artworks')}
              >
                Каталог <ArrowRight className="w-3 h-3 ml-1" />
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
                  +{stats.conversionRate}%
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                ₽{(stats.monthlyRevenue / 1000000).toFixed(1)}M
              </h3>
              <p className="text-sm text-gray-500">Доход за месяц</p>
              <div className="mt-3">
                <Progress value={65} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <Badge variant="outline">{stats.totalClients} клиентов</Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.pendingDeals}
              </h3>
              <p className="text-sm text-gray-500">Активных сделок</p>
              <Button
                variant="link"
                className="mt-2 p-0 h-auto text-sm"
                onClick={() => setActiveTab('deals')}
              >
                Смотреть все <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <Badge variant="outline">{stats.activeExhibitions} активных</Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.visitorCount.toLocaleString()}
              </h3>
              <p className="text-sm text-gray-500">Посетителей</p>
              <Button
                variant="link"
                className="mt-2 p-0 h-auto text-sm"
                onClick={() => setActiveTab('exhibitions')}
              >
                Выставки <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Access - Business Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Инструменты бизнеса
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-purple-500"
              onClick={() => navigate('/gallery-crm')}
            >
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-1">CRM Система</h3>
                <p className="text-xs text-gray-500">Клиенты и художники</p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-500"
              onClick={() => navigate('/rfq')}
            >
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-1">Запросы RFQ</h3>
                <p className="text-xs text-gray-500">Поиск произведений</p>
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
                <p className="text-xs text-gray-500">Защита коллекций</p>
              </CardContent>
            </Card>

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
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-indigo-500"
              onClick={() => navigate('/private-sales')}
            >
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-1">Приватные продажи</h3>
                <p className="text-xs text-gray-500">VIP клиенты</p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-green-500"
              onClick={() => navigate('/events')}
            >
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
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
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="artists">Художники</TabsTrigger>
            <TabsTrigger value="clients">CRM</TabsTrigger>
            <TabsTrigger value="exhibitions">Выставки</TabsTrigger>
            <TabsTrigger value="deals">Сделки</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Активные сделки
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {deals.slice(0, 5).map((deal, index) => (
                      <div
                        key={deal.id}
                        className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-semibold">{deal.artwork}</p>
                            {getStatusBadge(deal.status)}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {deal.client} • {deal.artist}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="font-semibold text-green-600">
                              ₽{deal.amount.toLocaleString()}
                            </span>
                            <span className="text-gray-500">
                              Вероятность: {deal.probability}%
                            </span>
                            <span className="text-gray-500">
                              До: {new Date(deal.deadline).toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                        </div>
                        <Progress value={deal.probability} className="w-20 h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Быстрые действия</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() => setShowAddArtistDialog(true)}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Добавить художника
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() => setShowAddClientDialog(true)}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Новый клиент
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <CalendarPlus className="w-4 h-4 mr-2" />
                      Запланировать выставку
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Экспорт отчёта
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">TOP художники</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {artists
                        .sort((a, b) => b.totalSales - a.totalSales)
                        .slice(0, 3)
                        .map((artist, index) => (
                          <div key={artist.id} className="flex items-center gap-3">
                            <Badge variant="outline" className="w-6 h-6 flex items-center justify-center p-0">
                              {index + 1}
                            </Badge>
                            <img
                              src={artist.avatar}
                              alt={artist.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{artist.name}</p>
                              <p className="text-xs text-gray-500">
                                ₽{(artist.totalSales / 1000000).toFixed(1)}M
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Artists Tab */}
          <TabsContent value="artists">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Художники ({artists.length})</h3>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Поиск..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button onClick={() => setShowAddArtistDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {artists.map((artist, index) => (
                  <motion.div
                    key={artist.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <img
                            src={artist.avatar}
                            alt={artist.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{artist.name}</h4>
                              {getStatusBadge(artist.status)}
                            </div>
                            <p className="text-sm text-gray-500 mb-2">{artist.specialty}</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < Math.floor(artist.rating)
                                      ? 'text-yellow-500 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="text-xs text-gray-500 ml-1">
                                {artist.rating}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Работ:</span>
                            <span className="font-medium">{artist.artworks}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Продажи:</span>
                            <span className="font-semibold text-green-600">
                              ₽{(artist.totalSales / 1000000).toFixed(1)}M
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">С нами:</span>
                            <span>
                              {new Date(artist.joinDate).toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="w-3 h-3 mr-1" />
                            Профиль
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
            </div>
          </TabsContent>

          {/* CRM Tab */}
          <TabsContent value="clients">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Клиентская база ({clients.length})</h3>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Поиск клиента..."
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Фильтр
                  </Button>
                  <Button onClick={() => setShowAddClientDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Новый клиент
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {clients.map((client, index) => (
                  <motion.div
                    key={client.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <img
                            src={client.avatar}
                            alt={client.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-lg">{client.name}</h4>
                              {getStatusBadge(client.status)}
                              <Badge variant="outline" className="flex items-center gap-1">
                                {getClientTypeIcon(client.type)}
                                {client.type}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Mail className="w-4 h-4" />
                                {client.email}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Phone className="w-4 h-4" />
                                {client.phone}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Clock className="w-4 h-4" />
                                {new Date(client.lastContact).toLocaleDateString('ru-RU')}
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex gap-2">
                                {client.tags.map((tag, tagIndex) => (
                                  <Badge key={tagIndex} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>

                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="text-sm text-gray-500">Покупки</p>
                                  <p className="font-semibold text-green-600">
                                    ₽{(client.totalPurchases / 1000000).toFixed(1)}M
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">
                                    <Eye className="w-3 h-3 mr-1" />
                                    Профиль
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <MessageSquare className="w-3 h-3 mr-1" />
                                    Контакт
                                  </Button>
                                </div>
                              </div>
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

          {/* Exhibitions Tab */}
          <TabsContent value="exhibitions">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Выставки</h3>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Создать выставку
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {exhibitions.map((exhibition, index) => (
                  <motion.div
                    key={exhibition.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-lg mb-2">{exhibition.name}</h4>
                            {getStatusBadge(exhibition.status)}
                          </div>
                          <Button variant="ghost" size="icon">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            {new Date(exhibition.startDate).toLocaleDateString('ru-RU')} -{' '}
                            {new Date(exhibition.endDate).toLocaleDateString('ru-RU')}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <MapPin className="w-4 h-4" />
                            {exhibition.venue}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Художники</p>
                            <p className="text-lg font-semibold">{exhibition.artists}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Работы</p>
                            <p className="text-lg font-semibold">{exhibition.artworks}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Посетители</p>
                            <p className="text-lg font-semibold">
                              {exhibition.visitors.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Продажи</p>
                            <p className="text-lg font-semibold text-green-600">
                              {exhibition.sales}
                            </p>
                          </div>
                        </div>

                        <Button variant="outline" className="w-full">
                          Подробнее
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Deals Tab */}
          <TabsContent value="deals">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Активные сделки ({deals.length})</h3>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Новая сделка
                </Button>
              </div>

              <div className="space-y-4">
                {deals.map((deal, index) => (
                  <motion.div
                    key={deal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold text-lg">{deal.artwork}</h4>
                            {getStatusBadge(deal.status)}
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">
                              ₽{deal.amount.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Клиент</p>
                            <p className="font-medium">{deal.client}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Художник</p>
                            <p className="font-medium">{deal.artist}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Дедлайн</p>
                            <p className="font-medium">
                              {new Date(deal.deadline).toLocaleDateString('ru-RU')}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Вероятность закрытия</span>
                            <span className="font-semibold">{deal.probability}%</span>
                          </div>
                          <Progress value={deal.probability} className="h-2" />
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="w-3 h-3 mr-1" />
                            Редактировать
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Связаться
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <FileText className="w-3 h-3 mr-1" />
                            Документы
                          </Button>
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

      {/* Add Artist Dialog */}
      <Dialog open={showAddArtistDialog} onOpenChange={setShowAddArtistDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить художника</DialogTitle>
            <DialogDescription>
              Заполните информацию о новом художнике
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Имя *</Label>
              <Input placeholder="Имя художника" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="artist@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Специализация</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="painting">Живопись</SelectItem>
                  <SelectItem value="sculpture">Скульптура</SelectItem>
                  <SelectItem value="digital">Цифровое искусство</SelectItem>
                  <SelectItem value="abstract">Абстракция</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Биография</Label>
              <Textarea placeholder="Расскажите о художнике" rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddArtistDialog(false)}>
              Отмена
            </Button>
            <Button onClick={() => setShowAddArtistDialog(false)}>Добавить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Client Dialog */}
      <Dialog open={showAddClientDialog} onOpenChange={setShowAddClientDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Новый клиент</DialogTitle>
            <DialogDescription>
              Добавьте нового клиента в CRM систему
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Имя / Компания *</Label>
              <Input placeholder="Имя клиента или название компании" />
            </div>
            <div className="space-y-2">
              <Label>Тип клиента</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="collector">Коллекционер</SelectItem>
                  <SelectItem value="corporate">Корпоративный</SelectItem>
                  <SelectItem value="institution">Институция</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="email@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Телефон</Label>
                <Input placeholder="+7 (___) ___-__-__" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Заметки</Label>
              <Textarea placeholder="Дополнительная информация о клиенте" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddClientDialog(false)}>
              Отмена
            </Button>
            <Button onClick={() => setShowAddClientDialog(false)}>Добавить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedGalleryDashboard;
