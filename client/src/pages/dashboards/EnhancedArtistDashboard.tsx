import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Palette,
  Upload,
  TrendingUp,
  DollarSign,
  Eye,
  Heart,
  Calendar,
  Award,
  Users,
  BarChart3,
  Image as ImageIcon,
  CheckCircle,
  Clock,
  Star,
  ArrowRight,
  Plus,
  Edit,
  Share2,
  Download,
  Filter,
  Truck,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ArtistStats {
  totalArtworks: number;
  totalSales: number;
  totalRevenue: number;
  averagePrice: number;
  profileViews: number;
  followers: number;
  activeExhibitions: number;
  pendingRequests: number;
}

interface Artwork {
  id: number;
  title: string;
  image: string;
  price: number;
  status: 'available' | 'sold' | 'exhibition' | 'reserved';
  views: number;
  likes: number;
  createdAt: string;
  category: string;
}

interface Exhibition {
  id: number;
  name: string;
  venue: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  artworksCount: number;
}

interface SalesData {
  month: string;
  revenue: number;
  sales: number;
}

const EnhancedArtistDashboard: React.FC = () => {
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const [stats, setStats] = useState<ArtistStats>({
    totalArtworks: 0,
    totalSales: 0,
    totalRevenue: 0,
    averagePrice: 0,
    profileViews: 0,
    followers: 0,
    activeExhibitions: 0,
    pendingRequests: 0,
  });

  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    dimensions: '',
    medium: '',
    year: new Date().getFullYear().toString(),
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStats({
        totalArtworks: 47,
        totalSales: 28,
        totalRevenue: 18500000,
        averagePrice: 660714,
        profileViews: 12847,
        followers: 1284,
        activeExhibitions: 3,
        pendingRequests: 5,
      });

      setArtworks([
        {
          id: 1,
          title: 'Безмолвие Времени',
          image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400',
          price: 850000,
          status: 'sold',
          views: 2847,
          likes: 342,
          createdAt: '2023-01-15',
          category: 'Живопись',
        },
        {
          id: 2,
          title: 'Городские Ритмы',
          image: 'https://images.unsplash.com/photo-1578926078151-9c8f7ed23024?w=400',
          price: 780000,
          status: 'available',
          views: 1923,
          likes: 267,
          createdAt: '2023-06-20',
          category: 'Современное искусство',
        },
        {
          id: 3,
          title: 'Абстракция #7',
          image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400',
          price: 520000,
          status: 'exhibition',
          views: 1456,
          likes: 198,
          createdAt: '2024-02-10',
          category: 'Абстракция',
        },
        {
          id: 4,
          title: 'Портрет эпохи',
          image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=400',
          price: 920000,
          status: 'reserved',
          views: 2134,
          likes: 401,
          createdAt: '2024-03-15',
          category: 'Портрет',
        },
      ]);

      setExhibitions([
        {
          id: 1,
          name: 'Современное Искусство России 2024',
          venue: 'Эрмитаж',
          startDate: '2024-12-01',
          endDate: '2025-02-28',
          status: 'active',
          artworksCount: 8,
        },
        {
          id: 2,
          name: 'Персональная выставка',
          venue: 'Третьяковская Галерея',
          startDate: '2025-03-15',
          endDate: '2025-05-15',
          status: 'upcoming',
          artworksCount: 12,
        },
      ]);

      setSalesData([
        { month: 'Янв', revenue: 1200000, sales: 3 },
        { month: 'Фев', revenue: 1800000, sales: 4 },
        { month: 'Мар', revenue: 2100000, sales: 5 },
        { month: 'Апр', revenue: 1500000, sales: 3 },
        { month: 'Май', revenue: 2400000, sales: 6 },
        { month: 'Июн', revenue: 1900000, sales: 4 },
      ]);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSubmit = () => {
    // Validate form
    if (!uploadForm.title || !uploadForm.category || !uploadForm.price) {
      return;
    }

    // TODO: Implement actual upload logic
    console.log('Upload form:', uploadForm);
    setShowUploadDialog(false);
    
    // Reset form
    setUploadForm({
      title: '',
      description: '',
      category: '',
      price: '',
      dimensions: '',
      medium: '',
      year: new Date().getFullYear().toString(),
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: { label: 'Доступно', className: 'bg-green-500' },
      sold: { label: 'Продано', className: 'bg-blue-500' },
      exhibition: { label: 'На выставке', className: 'bg-purple-500' },
      reserved: { label: 'Зарезервировано', className: 'bg-yellow-500' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.available;
    return <Badge className={`${config.className} text-white`}>{config.label}</Badge>;
  };

  const getExhibitionStatusBadge = (status: string) => {
    const statusConfig = {
      upcoming: { label: 'Предстоящая', className: 'bg-blue-500' },
      active: { label: 'Активна', className: 'bg-green-500' },
      completed: { label: 'Завершена', className: 'bg-gray-500' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.upcoming;
    return <Badge className={`${config.className} text-white`}>{config.label}</Badge>;
  };

  if (loading) {
    return <LoadingState message="Загрузка панели художника..." />;
  }

  const conversionRate = ((stats.totalSales / stats.totalArtworks) * 100).toFixed(1);

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
                <Palette className="w-8 h-8 text-purple-600" />
                Панель Художника
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Управляйте своими работами и продажами
              </p>
            </div>
            <div className="flex gap-3 w-full lg:w-auto">
              <Button
                variant="outline"
                onClick={() => navigate('/profile')}
                className="flex-1 lg:flex-none"
              >
                <Eye className="w-4 h-4 mr-2" />
                Мой профиль
              </Button>
              <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                <DialogTrigger asChild>
                  <Button className="flex-1 lg:flex-none">
                    <Plus className="w-4 h-4 mr-2" />
                    Загрузить работу
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Загрузить новую работу</DialogTitle>
                    <DialogDescription>
                      Добавьте информацию о вашем произведении
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Название *</Label>
                      <Input
                        id="title"
                        value={uploadForm.title}
                        onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                        placeholder="Введите название произведения"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Описание</Label>
                      <Textarea
                        id="description"
                        value={uploadForm.description}
                        onChange={(e) =>
                          setUploadForm({ ...uploadForm, description: e.target.value })
                        }
                        placeholder="Опишите ваше произведение"
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Категория *</Label>
                        <Select
                          value={uploadForm.category}
                          onValueChange={(value) =>
                            setUploadForm({ ...uploadForm, category: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите категорию" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="painting">Живопись</SelectItem>
                            <SelectItem value="sculpture">Скульптура</SelectItem>
                            <SelectItem value="photography">Фотография</SelectItem>
                            <SelectItem value="digital">Цифровое искусство</SelectItem>
                            <SelectItem value="abstract">Абстракция</SelectItem>
                            <SelectItem value="portrait">Портрет</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="price">Цена (₽) *</Label>
                        <Input
                          id="price"
                          type="number"
                          value={uploadForm.price}
                          onChange={(e) => setUploadForm({ ...uploadForm, price: e.target.value })}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dimensions">Размеры (см)</Label>
                        <Input
                          id="dimensions"
                          value={uploadForm.dimensions}
                          onChange={(e) =>
                            setUploadForm({ ...uploadForm, dimensions: e.target.value })
                          }
                          placeholder="120 x 90"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="year">Год создания</Label>
                        <Input
                          id="year"
                          type="number"
                          value={uploadForm.year}
                          onChange={(e) => setUploadForm({ ...uploadForm, year: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="medium">Техника</Label>
                      <Input
                        id="medium"
                        value={uploadForm.medium}
                        onChange={(e) => setUploadForm({ ...uploadForm, medium: e.target.value })}
                        placeholder="Масло на холсте"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Изображения</Label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer">
                        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Перетащите изображения или нажмите для выбора
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          PNG, JPG до 10MB. Рекомендуется высокое разрешение.
                        </p>
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                      Отмена
                    </Button>
                    <Button onClick={handleUploadSubmit}>Загрузить</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-purple-600" />
                </div>
                <Badge variant="secondary">{stats.totalArtworks} работ</Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.totalSales}
              </h3>
              <p className="text-sm text-gray-500">Продаж</p>
              <div className="mt-3 flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-green-600 font-semibold">{conversionRate}%</span>
                <span className="text-gray-500">конверсия</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <Badge className="bg-green-500">
                  ₽{stats.averagePrice.toLocaleString()}
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                ₽{(stats.totalRevenue / 1000000).toFixed(1)}M
              </h3>
              <p className="text-sm text-gray-500">Общий доход</p>
              <div className="mt-3">
                <Progress value={60} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <Badge variant="outline">{stats.followers} подписчиков</Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.profileViews.toLocaleString()}
              </h3>
              <p className="text-sm text-gray-500">Просмотров профиля</p>
              <Button variant="link" className="mt-2 p-0 h-auto text-sm">
                Аналитика <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
                <Badge variant="outline">{stats.activeExhibitions} активных</Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.activeExhibitions}
              </h3>
              <p className="text-sm text-gray-500">Выставки</p>
              <Button
                variant="link"
                className="mt-2 p-0 h-auto text-sm"
                onClick={() => setActiveTab('exhibitions')}
              >
                Смотреть все <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Access - Artist Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Инструменты художника
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-500"
              onClick={() => navigate('/artworks/submit')}
            >
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-1">Добавить работу</h3>
                <p className="text-xs text-gray-500">Загрузить произведение</p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-purple-500"
              onClick={() => navigate('/crowdfunding')}
            >
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-1">Краудфандинг</h3>
                <p className="text-xs text-gray-500">Привлечь инвесторов</p>
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
                <p className="text-xs text-gray-500">Защитить работы</p>
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
                <p className="text-xs text-gray-500">Доставка работ</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="artworks">Мои работы</TabsTrigger>
            <TabsTrigger value="exhibitions">Выставки</TabsTrigger>
            <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sales Performance */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Продажи за последние 6 месяцев
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {salesData.map((data, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{data.month}</span>
                          <span className="text-gray-500">
                            ₽{(data.revenue / 1000000).toFixed(1)}M ({data.sales} продаж)
                          </span>
                        </div>
                        <Progress value={(data.revenue / 2400000) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-900 dark:text-green-100">
                          Отличная динамика!
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Рост продаж на 28% по сравнению с прошлым периодом
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Быстрые действия</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Новая работа
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Запланировать выставку
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Связаться с галереями
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Экспорт портфолио
                  </Button>

                  {stats.pendingRequests > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        {stats.pendingRequests} новых запросов
                      </p>
                      <Button variant="link" className="p-0 h-auto text-sm mt-1">
                        Просмотреть
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Artworks Tab */}
          <TabsContent value="artworks">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">
                  Мои работы ({artworks.length} из {stats.totalArtworks})
                </h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Фильтр
                  </Button>
                  <Button size="sm" onClick={() => setShowUploadDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {artworks.map((artwork, index) => (
                  <motion.div
                    key={artwork.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative aspect-square overflow-hidden group">
                        <img
                          src={artwork.image}
                          alt={artwork.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute top-3 right-3">
                          {getStatusBadge(artwork.status)}
                        </div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => navigate(`/artwork-passport/${artwork.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Просмотр
                          </Button>
                          <Button size="sm" variant="secondary">
                            <Edit className="w-4 h-4 mr-1" />
                            Редактировать
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-lg mb-1">{artwork.title}</h4>
                        <p className="text-sm text-gray-500 mb-3">{artwork.category}</p>

                        <div className="flex items-center justify-between text-sm mb-3">
                          <span className="font-semibold text-lg">
                            ₽{artwork.price.toLocaleString()}
                          </span>
                          <div className="flex items-center gap-3 text-gray-500">
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {artwork.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              {artwork.likes}
                            </span>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500">
                          Создано: {new Date(artwork.createdAt).toLocaleDateString('ru-RU')}
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
                  Запланировать выставку
                </Button>
              </div>

              <div className="space-y-4">
                {exhibitions.map((exhibition, index) => (
                  <motion.div
                    key={exhibition.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h4 className="font-semibold text-lg">{exhibition.name}</h4>
                              {getExhibitionStatusBadge(exhibition.status)}
                            </div>

                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                              <p className="flex items-center gap-2">
                                <Award className="w-4 h-4" />
                                {exhibition.venue}
                              </p>
                              <p className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(exhibition.startDate).toLocaleDateString('ru-RU')} -{' '}
                                {new Date(exhibition.endDate).toLocaleDateString('ru-RU')}
                              </p>
                              <p className="flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" />
                                {exhibition.artworksCount} произведений
                              </p>
                            </div>

                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                Подробнее
                              </Button>
                              {exhibition.status === 'upcoming' && (
                                <Button size="sm" variant="outline">
                                  <Edit className="w-4 h-4 mr-1" />
                                  Редактировать
                                </Button>
                              )}
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

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Популярные работы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {artworks
                      .sort((a, b) => b.views - a.views)
                      .slice(0, 5)
                      .map((artwork, index) => (
                        <div
                          key={artwork.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                        >
                          <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                            <img
                              src={artwork.image}
                              alt={artwork.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{artwork.title}</p>
                            <p className="text-sm text-gray-500">{artwork.views} просмотров</p>
                          </div>
                          <Badge variant="outline">{index + 1}</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Статистика аудитории</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Просмотры профиля</span>
                      <span className="font-semibold">{stats.profileViews.toLocaleString()}</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Подписчики</span>
                      <span className="font-semibold">{stats.followers.toLocaleString()}</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Engagement Rate</span>
                      <span className="font-semibold">8.4%</span>
                    </div>
                    <Progress value={84} className="h-2" />
                  </div>

                  <div className="pt-4 border-t">
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Скачать полный отчёт
                    </Button>
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

export default EnhancedArtistDashboard;
