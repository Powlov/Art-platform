import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  Users,
  Eye,
  Heart,
  Star,
  Award,
  Zap,
  Filter,
  Search,
  MapPin,
  Palette,
  Calendar,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  Radio
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'wouter';

interface Artist {
  id: number;
  name: string;
  avatar: string;
  specialty: string;
  location: string;
  experience: number;
  artworksCount: number;
  followers: number;
  avgPrice: number;
  growthRate: number;
  matchScore: number;
  featured: boolean;
  topArtwork: {
    title: string;
    imageUrl: string;
    price: number;
  };
  styles: string[];
  exhibitions: number;
  awards: number;
  recentSales: number;
}

interface DiscoveryStats {
  totalArtists: number;
  newThisMonth: number;
  emergingTalents: number;
  avgMatchScore: number;
}

export default function ArtistDiscovery() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [sortBy, setSortBy] = useState('match-score');
  const [selectedTab, setSelectedTab] = useState('recommended');

  // Mock data
  const stats: DiscoveryStats = {
    totalArtists: 1247,
    newThisMonth: 84,
    emergingTalents: 156,
    avgMatchScore: 78.5
  };

  const artists: Artist[] = [
    {
      id: 1,
      name: "Анна Петрова",
      avatar: "https://i.pravatar.cc/150?img=1",
      specialty: "Живопись",
      location: "Москва",
      experience: 8,
      artworksCount: 47,
      followers: 2840,
      avgPrice: 125000,
      growthRate: 45,
      matchScore: 94,
      featured: true,
      topArtwork: {
        title: "Абстрактная композиция #7",
        imageUrl: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400",
        price: 195000
      },
      styles: ["Абстракция", "Современное искусство"],
      exhibitions: 12,
      awards: 3,
      recentSales: 8
    },
    {
      id: 2,
      name: "Иван Козлов",
      avatar: "https://i.pravatar.cc/150?img=12",
      specialty: "Скульптура",
      location: "Санкт-Петербург",
      experience: 15,
      artworksCount: 32,
      followers: 3250,
      avgPrice: 185000,
      growthRate: 32,
      matchScore: 89,
      featured: true,
      topArtwork: {
        title: "Скульптура 'Движение'",
        imageUrl: "https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=400",
        price: 280000
      },
      styles: ["Классическая скульптура", "Бронза"],
      exhibitions: 18,
      awards: 5,
      recentSales: 6
    },
    {
      id: 3,
      name: "Мария Волкова",
      avatar: "https://i.pravatar.cc/150?img=5",
      specialty: "Фотография",
      location: "Екатеринбург",
      experience: 6,
      artworksCount: 89,
      followers: 1890,
      avgPrice: 45000,
      growthRate: 68,
      matchScore: 86,
      featured: false,
      topArtwork: {
        title: "Городской пейзаж",
        imageUrl: "https://images.unsplash.com/photo-1518640165326-7f615e0e1f64?w=400",
        price: 72000
      },
      styles: ["Документальная", "Уличная фотография"],
      exhibitions: 8,
      awards: 2,
      recentSales: 15
    },
    {
      id: 4,
      name: "Алексей Новиков",
      avatar: "https://i.pravatar.cc/150?img=33",
      specialty: "Цифровое",
      location: "Москва",
      experience: 4,
      artworksCount: 124,
      followers: 4520,
      avgPrice: 65000,
      growthRate: 92,
      matchScore: 91,
      featured: true,
      topArtwork: {
        title: "Цифровое искусство #42",
        imageUrl: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=400",
        price: 95000
      },
      styles: ["NFT", "Generative Art"],
      exhibitions: 5,
      awards: 1,
      recentSales: 24
    },
    {
      id: 5,
      name: "Ольга Смирнова",
      avatar: "https://i.pravatar.cc/150?img=9",
      specialty: "Живопись",
      location: "Казань",
      experience: 10,
      artworksCount: 56,
      followers: 2140,
      avgPrice: 98000,
      growthRate: 28,
      matchScore: 82,
      featured: false,
      topArtwork: {
        title: "Натюрморт с цветами",
        imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400",
        price: 124000
      },
      styles: ["Реализм", "Импрессионизм"],
      exhibitions: 14,
      awards: 4,
      recentSales: 9
    },
    {
      id: 6,
      name: "Дмитрий Соколов",
      avatar: "https://i.pravatar.cc/150?img=13",
      specialty: "Графика",
      location: "Новосибирск",
      experience: 7,
      artworksCount: 78,
      followers: 1650,
      avgPrice: 38000,
      growthRate: 54,
      matchScore: 79,
      featured: false,
      topArtwork: {
        title: "Иллюстрация 'Город будущего'",
        imageUrl: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400",
        price: 52000
      },
      styles: ["Иллюстрация", "Концепт-арт"],
      exhibitions: 6,
      awards: 1,
      recentSales: 12
    }
  ];

  const emergingArtists = artists.filter(a => a.experience < 5 || a.growthRate > 60);
  const featuredArtists = artists.filter(a => a.featured);
  const trendingArtists = artists.sort((a, b) => b.growthRate - a.growthRate).slice(0, 4);

  const filteredArtists = artists.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         artist.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = filterSpecialty === 'all' || artist.specialty === filterSpecialty;
    const matchesLocation = filterLocation === 'all' || artist.location === filterLocation;
    return matchesSearch && matchesSpecialty && matchesLocation;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'match-score': return b.matchScore - a.matchScore;
      case 'growth': return b.growthRate - a.growthRate;
      case 'price-asc': return a.avgPrice - b.avgPrice;
      case 'price-desc': return b.avgPrice - a.avgPrice;
      case 'followers': return b.followers - a.followers;
      default: return 0;
    }
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', { 
      style: 'currency', 
      currency: 'RUB',
      maximumFractionDigits: 0 
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('ru-RU').format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-amber-600" />
              Открытие талантов
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Найдите новых художников с помощью AI-рекомендаций
            </p>
          </div>

          <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
            <Zap className="w-4 h-4 mr-2" />
            AI-подбор
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-amber-200 dark:border-amber-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Всего художников</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {formatNumber(stats.totalArtists)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      +{stats.newThisMonth} за месяц
                    </p>
                  </div>
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                    <Users className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Новые таланты</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {formatNumber(stats.emergingTalents)}
                    </h3>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">
                        Рост +68%
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <Sparkles className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-violet-200 dark:border-violet-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">AI Match Score</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {stats.avgMatchScore}%
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Средняя точность
                    </p>
                  </div>
                  <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-full">
                    <Zap className="w-6 h-6 text-violet-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Избранные</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {featuredArtists.length}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Лучшие художники
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="recommended">Рекомендуем</TabsTrigger>
            <TabsTrigger value="trending">Тренды</TabsTrigger>
            <TabsTrigger value="emerging">Новые</TabsTrigger>
            <TabsTrigger value="all">Все</TabsTrigger>
          </TabsList>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Поиск по имени или специализации..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Специализация" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все специализации</SelectItem>
                    <SelectItem value="Живопись">Живопись</SelectItem>
                    <SelectItem value="Скульптура">Скульптура</SelectItem>
                    <SelectItem value="Фотография">Фотография</SelectItem>
                    <SelectItem value="Цифровое">Цифровое</SelectItem>
                    <SelectItem value="Графика">Графика</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterLocation} onValueChange={setFilterLocation}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Город" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все города</SelectItem>
                    <SelectItem value="Москва">Москва</SelectItem>
                    <SelectItem value="Санкт-Петербург">Санкт-Петербург</SelectItem>
                    <SelectItem value="Екатеринбург">Екатеринбург</SelectItem>
                    <SelectItem value="Новосибирск">Новосибирск</SelectItem>
                    <SelectItem value="Казань">Казань</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Сортировка" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="match-score">AI Match Score</SelectItem>
                    <SelectItem value="growth">Рост популярности</SelectItem>
                    <SelectItem value="price-desc">Цена (убыв.)</SelectItem>
                    <SelectItem value="price-asc">Цена (возр.)</SelectItem>
                    <SelectItem value="followers">Подписчики</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Tab */}
          <TabsContent value="recommended" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredArtists.map((artist, index) => (
                <motion.div
                  key={artist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-2 border-amber-200 dark:border-amber-800">
                    <div className="relative">
                      <Badge className="absolute top-4 right-4 bg-amber-600 z-10">
                        <Star className="w-3 h-3 mr-1" />
                        Избранный
                      </Badge>
                      <img
                        src={artist.topArtwork.imageUrl}
                        alt={artist.topArtwork.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <Avatar className="w-16 h-16 border-2 border-amber-200">
                          <AvatarImage src={artist.avatar} alt={artist.name} />
                          <AvatarFallback>{artist.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            {artist.name}
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {artist.specialty} • {artist.location}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1 text-sm">
                              <Eye className="w-4 h-4 text-gray-400" />
                              <span>{formatNumber(artist.followers)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <Palette className="w-4 h-4 text-gray-400" />
                              <span>{artist.artworksCount}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <Award className="w-4 h-4 text-gray-400" />
                              <span>{artist.awards}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* AI Match Score */}
                      <div className="mb-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium flex items-center gap-2">
                            <Zap className="w-4 h-4 text-amber-600" />
                            AI Match Score
                          </span>
                          <span className="text-lg font-bold text-amber-600">{artist.matchScore}%</span>
                        </div>
                        <Progress value={artist.matchScore} className="h-2" />
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                          Высокое соответствие вашим предпочтениям
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Опыт</p>
                          <p className="font-bold">{artist.experience} лет</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Ср. цена</p>
                          <p className="font-bold">{formatCurrency(artist.avgPrice)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Рост</p>
                          <p className="font-bold text-green-600">+{artist.growthRate}%</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {artist.styles.map((style, i) => (
                          <Badge key={i} variant="outline">{style}</Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/user/${artist.name.toLowerCase().replace(' ', '-')}`} className="flex-1">
                          <Button className="w-full" variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            Профиль
                          </Button>
                        </Link>
                        <Button className="flex-1 bg-amber-600 hover:bg-amber-700">
                          <Heart className="w-4 h-4 mr-2" />
                          Подписаться
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Trending Tab */}
          <TabsContent value="trending" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trendingArtists.map((artist, index) => (
                <motion.div
                  key={artist.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl font-bold text-gradient bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                          #{index + 1}
                        </div>
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={artist.avatar} alt={artist.name} />
                          <AvatarFallback>{artist.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg">{artist.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{artist.specialty}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className="bg-green-600">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              +{artist.growthRate}%
                            </Badge>
                            <Badge variant="outline">{artist.recentSales} продаж</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Emerging Tab */}
          <TabsContent value="emerging" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {emergingArtists.map((artist, index) => (
                <motion.div
                  key={artist.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={artist.topArtwork.imageUrl}
                        alt={artist.topArtwork.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <Badge className="absolute top-4 left-4 bg-green-600">
                        <Radio className="w-3 h-3 mr-1 animate-pulse" />
                        Новый талант
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={artist.avatar} alt={artist.name} />
                          <AvatarFallback>{artist.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-bold">{artist.name}</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{artist.specialty}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-gray-500">Рост</p>
                          <p className="font-bold text-green-600">+{artist.growthRate}%</p>
                        </div>
                        <Link href={`/user/${artist.name.toLowerCase().replace(' ', '-')}`}>
                          <Button size="sm">
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* All Tab */}
          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {filteredArtists.map((artist, index) => (
                <motion.div
                  key={artist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <img
                          src={artist.topArtwork.imageUrl}
                          alt={artist.topArtwork.title}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-start gap-4">
                              <Avatar className="w-16 h-16">
                                <AvatarImage src={artist.avatar} alt={artist.name} />
                                <AvatarFallback>{artist.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="text-xl font-bold">{artist.name}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{artist.specialty}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <MapPin className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm">{artist.location}</span>
                                </div>
                              </div>
                            </div>
                            <Badge className={`${artist.matchScore > 85 ? 'bg-green-600' : 'bg-blue-600'}`}>
                              {artist.matchScore}% Match
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-gray-500">Опыт</p>
                              <p className="font-medium">{artist.experience} лет</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Работ</p>
                              <p className="font-medium">{artist.artworksCount}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Подписчики</p>
                              <p className="font-medium">{formatNumber(artist.followers)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Ср. цена</p>
                              <p className="font-medium">{formatCurrency(artist.avgPrice)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Рост</p>
                              <p className="font-medium text-green-600">+{artist.growthRate}%</p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="flex flex-wrap gap-2">
                              {artist.styles.slice(0, 2).map((style, i) => (
                                <Badge key={i} variant="outline">{style}</Badge>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Link href={`/user/${artist.name.toLowerCase().replace(' ', '-')}`}>
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4 mr-2" />
                                  Профиль
                                </Button>
                              </Link>
                              <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                                <Heart className="w-4 h-4 mr-2" />
                                Подписаться
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
