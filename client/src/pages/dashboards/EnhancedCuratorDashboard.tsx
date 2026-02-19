import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Users,
  Palette,
  TrendingUp,
  Eye,
  Heart,
  Award,
  Sparkles,
  MapPin,
  Clock,
  DollarSign,
  Package,
  FileText,
  Image,
  BarChart3,
  Plus,
  Search,
  Filter,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Target,
  MessageSquare,
  Share2,
  Download,
  Layers,
  Grid,
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

interface CuratorStats {
  activeExhibitions: number;
  plannedExhibitions: number;
  totalVisitors: number;
  curatedArtworks: number;
  totalBudget: number;
  spentBudget: number;
  collaboratingArtists: number;
  avgVisitorRating: number;
}

interface Exhibition {
  id: string;
  title: string;
  type: 'solo' | 'group' | 'thematic' | 'retrospective';
  status: 'planning' | 'active' | 'completed' | 'upcoming';
  startDate: string;
  endDate: string;
  venue: string;
  artworks: number;
  visitors: number;
  budget: number;
  revenue: number;
  artists: { id: string; name: string; avatar: string }[];
  progress: number;
}

interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: number;
  medium: string;
  dimensions: string;
  price: number;
  status: 'available' | 'reserved' | 'sold';
  imageUrl: string;
  exhibitionFit: number;
  popularity: number;
}

interface Artist {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  artworks: number;
  exhibitions: number;
  rating: number;
  availability: 'available' | 'busy' | 'unavailable';
}

const EnhancedCuratorDashboard: React.FC = () => {
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<CuratorStats>({
    activeExhibitions: 3,
    plannedExhibitions: 5,
    totalVisitors: 12847,
    curatedArtworks: 156,
    totalBudget: 4500000,
    spentBudget: 2850000,
    collaboratingArtists: 42,
    avgVisitorRating: 4.7,
  });

  const [exhibitions, setExhibitions] = useState<Exhibition[]>([
    {
      id: '1',
      title: 'Современная Абстракция',
      type: 'thematic',
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2024-03-30',
      venue: 'Главный зал',
      artworks: 24,
      visitors: 3847,
      budget: 850000,
      revenue: 1240000,
      artists: [
        { id: '1', name: 'Анна Петрова', avatar: '/avatars/anna.jpg' },
        { id: '2', name: 'Михаил Иванов', avatar: '/avatars/mikhail.jpg' },
      ],
      progress: 65,
    },
    {
      id: '2',
      title: 'Ретроспектива Кандинского',
      type: 'retrospective',
      status: 'planning',
      startDate: '2024-04-01',
      endDate: '2024-06-15',
      venue: 'Зал А',
      artworks: 45,
      visitors: 0,
      budget: 1500000,
      revenue: 0,
      artists: [
        { id: '3', name: 'Василий Кандинский', avatar: '/avatars/kandinsky.jpg' },
      ],
      progress: 35,
    },
    {
      id: '3',
      title: 'Молодые Таланты',
      type: 'group',
      status: 'upcoming',
      startDate: '2024-05-01',
      endDate: '2024-07-31',
      venue: 'Зал В',
      artworks: 32,
      visitors: 0,
      budget: 600000,
      revenue: 0,
      artists: [
        { id: '4', name: 'Елена Смирнова', avatar: '/avatars/elena.jpg' },
        { id: '5', name: 'Дмитрий Козлов', avatar: '/avatars/dmitry.jpg' },
        { id: '6', name: 'Ольга Новикова', avatar: '/avatars/olga.jpg' },
      ],
      progress: 15,
    },
  ]);

  const [artworks, setArtworks] = useState<Artwork[]>([
    {
      id: '1',
      title: 'Красная композиция',
      artist: 'Анна Петрова',
      year: 2023,
      medium: 'Масло на холсте',
      dimensions: '100x120 см',
      price: 280000,
      status: 'available',
      imageUrl: '/artworks/red-composition.jpg',
      exhibitionFit: 92,
      popularity: 87,
    },
    {
      id: '2',
      title: 'Городской пейзаж',
      artist: 'Михаил Иванов',
      year: 2022,
      medium: 'Акрил',
      dimensions: '80x100 см',
      price: 195000,
      status: 'reserved',
      imageUrl: '/artworks/cityscape.jpg',
      exhibitionFit: 88,
      popularity: 92,
    },
  ]);

  const [artists, setArtists] = useState<Artist[]>([
    {
      id: '1',
      name: 'Анна Петрова',
      avatar: '/avatars/anna.jpg',
      specialty: 'Абстракция',
      artworks: 34,
      exhibitions: 12,
      rating: 4.8,
      availability: 'available',
    },
    {
      id: '2',
      name: 'Михаил Иванов',
      avatar: '/avatars/mikhail.jpg',
      specialty: 'Реализм',
      artworks: 28,
      exhibitions: 9,
      rating: 4.6,
      availability: 'busy',
    },
  ]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (loading) {
    return <LoadingState fullScreen message="Загрузка панели куратора..." />;
  }

  const budgetPercentage = (stats.spentBudget / stats.totalBudget) * 100;

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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <Palette className="w-8 h-8 text-primary" />
                Панель Куратора
              </h1>
              <p className="text-muted-foreground">
                Управление выставками, подбор произведений и работа с художниками
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => navigate('/exhibitions/new')} className="gap-2">
                <Plus className="w-4 h-4" />
                Создать выставку
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Экспорт отчёта
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Активные выставки</p>
                  <p className="text-2xl font-bold">{stats.activeExhibitions}</p>
                  <p className="text-xs text-green-600 mt-1">+{stats.plannedExhibitions} в планах</p>
                </div>
                <Calendar className="w-10 h-10 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Всего посетителей</p>
                  <p className="text-2xl font-bold">{stats.totalVisitors.toLocaleString()}</p>
                  <p className="text-xs text-blue-600 mt-1">Рейтинг {stats.avgVisitorRating}/5.0</p>
                </div>
                <Users className="w-10 h-10 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Курируемых работ</p>
                  <p className="text-2xl font-bold">{stats.curatedArtworks}</p>
                  <p className="text-xs text-purple-600 mt-1">{stats.collaboratingArtists} художников</p>
                </div>
                <Package className="w-10 h-10 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Бюджет выставок</p>
                  <p className="text-2xl font-bold">₽{(stats.totalBudget / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-orange-600 mt-1">Использовано {budgetPercentage.toFixed(0)}%</p>
                </div>
                <DollarSign className="w-10 h-10 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="exhibitions">Выставки</TabsTrigger>
            <TabsTrigger value="artworks">Подбор работ</TabsTrigger>
            <TabsTrigger value="artists">Художники</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Active Exhibitions */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Текущие выставки
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {exhibitions.filter(e => e.status === 'active').map((exhibition) => (
                      <motion.div
                        key={exhibition.id}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer"
                        onClick={() => navigate(`/exhibitions/${exhibition.id}`)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold mb-1">{exhibition.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              {exhibition.venue}
                            </div>
                          </div>
                          <Badge>{exhibition.type}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Произведений</p>
                            <p className="font-semibold">{exhibition.artworks}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Посетителей</p>
                            <p className="font-semibold">{exhibition.visitors.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Доход</p>
                            <p className="font-semibold">₽{(exhibition.revenue / 1000).toFixed(0)}K</p>
                          </div>
                        </div>

                        <div className="mb-2">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Прогресс</span>
                            <span>{exhibition.progress}%</span>
                          </div>
                          <Progress value={exhibition.progress} />
                        </div>

                        <div className="flex items-center gap-2">
                          {exhibition.artists.slice(0, 3).map((artist) => (
                            <div
                              key={artist.id}
                              className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs"
                              title={artist.name}
                            >
                              {artist.name.charAt(0)}
                            </div>
                          ))}
                          {exhibition.artists.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{exhibition.artists.length - 3}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Budget Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Бюджет
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Использовано</span>
                        <span className="text-sm font-semibold">
                          ₽{(stats.spentBudget / 1000000).toFixed(2)}M / ₽{(stats.totalBudget / 1000000).toFixed(1)}M
                        </span>
                      </div>
                      <Progress value={budgetPercentage} />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Современная Абстракция</span>
                        <span className="text-sm font-semibold">₽850K</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Ретроспектива</span>
                        <span className="text-sm font-semibold">₽1.5M</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Молодые Таланты</span>
                        <span className="text-sm font-semibold">₽600K</span>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full gap-2">
                      <FileText className="w-4 h-4" />
                      Детальный отчёт
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Exhibitions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Планируемые выставки
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {exhibitions.filter(e => ['planning', 'upcoming'].includes(e.status)).map((exhibition) => (
                    <motion.div
                      key={exhibition.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer"
                    >
                      <Badge className="mb-2">{exhibition.status === 'planning' ? 'В планах' : 'Скоро'}</Badge>
                      <h3 className="font-semibold mb-2">{exhibition.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {new Date(exhibition.startDate).toLocaleDateString()} - {new Date(exhibition.endDate).toLocaleDateString()}
                      </p>
                      <div className="flex justify-between text-sm">
                        <span>{exhibition.artworks} работ</span>
                        <span>₽{(exhibition.budget / 1000).toFixed(0)}K</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exhibitions Tab */}
          <TabsContent value="exhibitions" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Все выставки</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Фильтр
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exhibitions.map((exhibition) => (
                    <motion.div
                      key={exhibition.id}
                      whileHover={{ scale: 1.01 }}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{exhibition.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {exhibition.venue}
                            </span>
                            <span>{new Date(exhibition.startDate).toLocaleDateString()} - {new Date(exhibition.endDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Badge variant={exhibition.status === 'active' ? 'default' : 'secondary'}>
                          {exhibition.status === 'active' ? 'Активна' :
                           exhibition.status === 'planning' ? 'В планах' :
                           exhibition.status === 'upcoming' ? 'Скоро' : 'Завершена'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Произведений</p>
                          <p className="font-semibold">{exhibition.artworks}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Посетители</p>
                          <p className="font-semibold">{exhibition.visitors > 0 ? exhibition.visitors.toLocaleString() : '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Бюджет</p>
                          <p className="font-semibold">₽{(exhibition.budget / 1000).toFixed(0)}K</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Доход</p>
                          <p className="font-semibold text-green-600">
                            {exhibition.revenue > 0 ? `₽${(exhibition.revenue / 1000).toFixed(0)}K` : '—'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">ROI</p>
                          <p className="font-semibold">
                            {exhibition.revenue > 0 ? 
                              `${(((exhibition.revenue - exhibition.budget) / exhibition.budget) * 100).toFixed(0)}%` : 
                              '—'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {exhibition.artists.map((artist) => (
                            <div
                              key={artist.id}
                              className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm"
                              title={artist.name}
                            >
                              {artist.name.charAt(0)}
                            </div>
                          ))}
                        </div>
                        <Button variant="ghost" size="sm" className="gap-2">
                          Подробнее
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Artworks Tab */}
          <TabsContent value="artworks" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Подбор произведений</CardTitle>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Поиск работ..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64"
                    />
                    <Button variant="outline">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {artworks.map((artwork) => (
                    <motion.div
                      key={artwork.id}
                      whileHover={{ scale: 1.02 }}
                      className="border rounded-lg overflow-hidden cursor-pointer"
                    >
                      <div className="aspect-square bg-muted flex items-center justify-center">
                        <Image className="w-16 h-16 text-muted-foreground opacity-20" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-1">{artwork.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{artwork.artist}</p>
                        <div className="text-xs text-muted-foreground mb-3">
                          <p>{artwork.medium}</p>
                          <p>{artwork.dimensions}</p>
                        </div>

                        <div className="space-y-2 mb-3">
                          <div className="flex justify-between text-xs">
                            <span>Соответствие</span>
                            <span className="font-semibold text-green-600">{artwork.exhibitionFit}%</span>
                          </div>
                          <Progress value={artwork.exhibitionFit} />
                          
                          <div className="flex justify-between text-xs">
                            <span>Популярность</span>
                            <span className="font-semibold text-blue-600">{artwork.popularity}%</span>
                          </div>
                          <Progress value={artwork.popularity} />
                        </div>

                        <div className="flex justify-between items-center">
                          <Badge variant={artwork.status === 'available' ? 'default' : 'secondary'}>
                            {artwork.status === 'available' ? 'Доступно' :
                             artwork.status === 'reserved' ? 'Забронировано' : 'Продано'}
                          </Badge>
                          <span className="font-bold">₽{(artwork.price / 1000).toFixed(0)}K</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Artists Tab */}
          <TabsContent value="artists" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Сотрудничество с художниками</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {artists.map((artist) => (
                    <motion.div
                      key={artist.id}
                      whileHover={{ scale: 1.01 }}
                      className="p-4 border rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg font-semibold">
                          {artist.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{artist.name}</h3>
                          <p className="text-sm text-muted-foreground">{artist.specialty}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-sm font-semibold">{artist.artworks}</p>
                          <p className="text-xs text-muted-foreground">Работ</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold">{artist.exhibitions}</p>
                          <p className="text-xs text-muted-foreground">Выставок</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold">{artist.rating}</p>
                          <p className="text-xs text-muted-foreground">Рейтинг</p>
                        </div>
                        <Badge variant={artist.availability === 'available' ? 'default' : 'secondary'}>
                          {artist.availability === 'available' ? 'Доступен' :
                           artist.availability === 'busy' ? 'Занят' : 'Недоступен'}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default EnhancedCuratorDashboard;
