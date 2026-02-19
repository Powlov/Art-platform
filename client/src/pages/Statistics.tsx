import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Users, ShoppingCart, DollarSign, Activity, Zap,
  Filter, Download, Share2, Palette, Building2, Calendar,
  Eye, Heart, Award, Flame, BarChart3, PieChart, LineChart,
  RefreshCw, Settings, Info, ChevronDown, X, Search, Star,
  Briefcase, CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { toast } from 'sonner';

interface FilterState {
  timeRange: '24h' | '7d' | '30d' | '90d' | '1y' | 'all';
  genres: string[];
  artists: string[];
  priceRange: { min: number; max: number };
  galleries: string[];
  events: string[];
  sortBy: 'volume' | 'growth' | 'popularity' | 'recent';
}

interface PersonalizedStats {
  myCollection: {
    totalValue: number;
    totalArtworks: number;
    avgGrowth: number;
    topPerformer: string;
  };
  marketComparison: {
    myGrowth: number;
    marketGrowth: number;
    difference: number;
  };
  recommendations: Array<{
    type: 'artist' | 'genre' | 'event';
    name: string;
    reason: string;
    potential: number;
  }>;
}

interface GroupedData {
  byGenre: Array<{ name: string; volume: number; growth: number; count: number }>;
  byArtist: Array<{ name: string; sales: number; revenue: number; growth: number; avatar?: string }>;
  byGallery: Array<{ name: string; artworks: number; revenue: number; rating: number }>;
  byEvent: Array<{ name: string; date: string; participants: number; volume: number }>;
  byPriceRange: Array<{ range: string; count: number; avgPrice: number }>;
  byStyle: Array<{ style: string; demand: number; trend: 'up' | 'down' | 'stable' }>;
}

export default function Statistics() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'personal' | 'genres' | 'artists' | 'galleries' | 'events'>('overview');
  
  const [filters, setFilters] = useState<FilterState>({
    timeRange: '30d',
    genres: [],
    artists: [],
    priceRange: { min: 0, max: 1000000 },
    galleries: [],
    events: [],
    sortBy: 'volume'
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - в production заменить на реальные API запросы
  const [personalStats, setPersonalStats] = useState<PersonalizedStats>({
    myCollection: {
      totalValue: 125000,
      totalArtworks: 15,
      avgGrowth: 18.5,
      topPerformer: 'Абстрактная композиция #5'
    },
    marketComparison: {
      myGrowth: 18.5,
      marketGrowth: 12.5,
      difference: 6.0
    },
    recommendations: [
      { type: 'artist', name: 'Иван Петров', reason: 'Схожий стиль с вашей коллекцией', potential: 85 },
      { type: 'genre', name: 'Современный абстракционизм', reason: 'Растущий тренд в вашем сегменте', potential: 78 },
      { type: 'event', name: 'Аукцион современного искусства', reason: 'Интересные лоты по вашим параметрам', potential: 92 }
    ]
  });

  const [groupedData, setGroupedData] = useState<GroupedData>({
    byGenre: [
      { name: 'Современное', volume: 850000, growth: 15.5, count: 245 },
      { name: 'Абстракционизм', volume: 620000, growth: 22.3, count: 189 },
      { name: 'Реализм', volume: 480000, growth: 8.7, count: 156 },
      { name: 'Импрессионизм', volume: 390000, growth: 12.1, count: 98 },
      { name: 'Сюрреализм', volume: 280000, growth: 18.9, count: 72 }
    ],
    byArtist: [
      { name: 'Мария Иванова', sales: 45, revenue: 125000, growth: 28.5 },
      { name: 'Алексей Смирнов', sales: 38, revenue: 98500, growth: 15.2 },
      { name: 'София Петрова', sales: 32, revenue: 87200, growth: 32.8 },
      { name: 'Дмитрий Козлов', sales: 28, revenue: 76800, growth: 12.3 },
      { name: 'Екатерина Волкова', sales: 25, revenue: 68500, growth: 19.7 }
    ],
    byGallery: [
      { name: 'Галерея Современного Искусства', artworks: 156, revenue: 450000, rating: 4.8 },
      { name: 'Арт-Пространство "Муза"', artworks: 98, revenue: 320000, rating: 4.6 },
      { name: 'Центр Искусств "Палитра"', artworks: 76, revenue: 280000, rating: 4.5 },
      { name: 'Студия "Творчество"', artworks: 54, revenue: 180000, rating: 4.3 }
    ],
    byEvent: [
      { name: 'Весенний Аукцион 2026', date: '2026-03-15', participants: 1250, volume: 2500000 },
      { name: 'Выставка Молодых Художников', date: '2026-02-28', participants: 890, volume: 1800000 },
      { name: 'Аукцион Современного Искусства', date: '2026-02-10', participants: 640, volume: 1250000 }
    ],
    byPriceRange: [
      { range: '< $1,000', count: 456, avgPrice: 650 },
      { range: '$1,000 - $5,000', count: 289, avgPrice: 2800 },
      { range: '$5,000 - $10,000', count: 145, avgPrice: 7200 },
      { range: '$10,000 - $50,000', count: 87, avgPrice: 25000 },
      { range: '> $50,000', count: 34, avgPrice: 85000 }
    ],
    byStyle: [
      { style: 'Минимализм', demand: 28, trend: 'up' },
      { style: 'Экспрессионизм', demand: 24, trend: 'up' },
      { style: 'Поп-арт', demand: 18, trend: 'stable' },
      { style: 'Кубизм', demand: 15, trend: 'down' },
      { style: 'Футуризм', demand: 9, trend: 'stable' },
      { style: 'Другое', demand: 6, trend: 'stable' }
    ]
  });

  const timeRangeLabels = {
    '24h': '24 часа',
    '7d': '7 дней',
    '30d': '30 дней',
    '90d': '90 дней',
    '1y': '1 год',
    'all': 'Всё время'
  };

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      timeRange: '30d',
      genres: [],
      artists: [],
      priceRange: { min: 0, max: 1000000 },
      galleries: [],
      events: [],
      sortBy: 'volume'
    });
  };

  const exportData = () => {
    toast.success('Экспорт данных начат...');
    // Реализовать экспорт в CSV/Excel
  };

  useEffect(() => {
    setIsLoading(false);
  }, [filters]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Загрузка статистики...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Персонализированная статистика АРТ рынка
              </h1>
              <p className="text-gray-600">
                Аналитика адаптированная под {user ? 'вашу коллекцию и интересы' : 'рыночные тренды'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Фильтры
                {(filters.genres.length + filters.artists.length + filters.galleries.length) > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {filters.genres.length + filters.artists.length + filters.galleries.length}
                  </Badge>
                )}
              </Button>
              <Button onClick={exportData} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Экспорт
              </Button>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center gap-2 mb-4">
            {(Object.keys(timeRangeLabels) as Array<keyof typeof timeRangeLabels>).map((range) => (
              <Button
                key={range}
                variant={filters.timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateFilter('timeRange', range)}
              >
                {timeRangeLabels[range]}
              </Button>
            ))}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Фильтры и группировки</h3>
                <div className="flex gap-2">
                  <Button onClick={clearFilters} variant="ghost" size="sm">
                    Очистить всё
                  </Button>
                  <Button onClick={() => setShowFilters(false)} variant="ghost" size="sm">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Поиск
                  </label>
                  <Input
                    placeholder="Художник, жанр, галерея..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Sort By */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Сортировка
                  </label>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value: any) => updateFilter('sortBy', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="volume">По объёму продаж</SelectItem>
                      <SelectItem value="growth">По росту цен</SelectItem>
                      <SelectItem value="popularity">По популярности</SelectItem>
                      <SelectItem value="recent">По новизне</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Диапазон цен
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="От"
                      value={filters.priceRange.min}
                      onChange={(e) => updateFilter('priceRange', {
                        ...filters.priceRange,
                        min: Number(e.target.value)
                      })}
                      className="w-1/2"
                    />
                    <Input
                      type="number"
                      placeholder="До"
                      value={filters.priceRange.max}
                      onChange={(e) => updateFilter('priceRange', {
                        ...filters.priceRange,
                        max: Number(e.target.value)
                      })}
                      className="w-1/2"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {filters.genres.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Жанры:</span>
                    {filters.genres.map(genre => (
                      <Badge key={genre} variant="secondary" className="flex items-center gap-1">
                        {genre}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => updateFilter('genres', filters.genres.filter(g => g !== genre))}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="mb-8">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">
              <BarChart3 className="w-4 h-4 mr-2" />
              Обзор
            </TabsTrigger>
            <TabsTrigger value="personal">
              <Users className="w-4 h-4 mr-2" />
              Моя коллекция
            </TabsTrigger>
            <TabsTrigger value="genres">
              <Palette className="w-4 h-4 mr-2" />
              Жанры
            </TabsTrigger>
            <TabsTrigger value="partners">
              <Briefcase className="w-4 h-4 mr-2" />
              Партнёры
            </TabsTrigger>
            <TabsTrigger value="galleries">
              <Building2 className="w-4 h-4 mr-2" />
              Галереи
            </TabsTrigger>
            <TabsTrigger value="events">
              <Calendar className="w-4 h-4 mr-2" />
              Мероприятия
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Общий объём</CardTitle>
                  <DollarSign className="h-5 w-5 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$2.85M</div>
                  <p className="text-xs text-green-600 mt-1">↑ +12.5% за период</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Транзакций</CardTitle>
                  <ShoppingCart className="h-5 w-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">1,247</div>
                  <p className="text-xs text-blue-600 mt-1">↑ +8.3% за период</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Средняя цена</CardTitle>
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$2,285</div>
                  <p className="text-xs text-purple-600 mt-1">↑ +15.2% за период</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ликвидность</CardTitle>
                  <Zap className="h-5 w-5 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">78.5%</div>
                  <p className="text-xs text-yellow-600 mt-1">Высокая</p>
                </CardContent>
              </Card>
            </div>

            {/* Price Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Распределение по ценовым диапазонам</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {groupedData.byPriceRange.map((range, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{range.range}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-500">{range.count} работ</span>
                          <span className="text-sm font-semibold">
                            Сред: ${range.avgPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                          style={{ width: `${(range.count / 456) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Style Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Тренды по стилям</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {groupedData.byStyle.map((style, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{style.style}</span>
                        <div className="flex items-center">
                          {style.trend === 'up' && (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          )}
                          {style.trend === 'down' && (
                            <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
                          )}
                          {style.trend === 'stable' && (
                            <Activity className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{style.demand}%</div>
                      <p className="text-xs text-gray-500 mt-1">Доля рынка</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Personal Tab */}
          <TabsContent value="personal" className="space-y-6">
            {user ? (
              <>
                {/* My Collection Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    <CardContent className="pt-6">
                      <div className="text-sm opacity-90 mb-1">Стоимость коллекции</div>
                      <div className="text-3xl font-bold">
                        ${personalStats.myCollection.totalValue.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-gray-500 mb-1">Произведений</div>
                      <div className="text-3xl font-bold">{personalStats.myCollection.totalArtworks}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-gray-500 mb-1">Средний рост</div>
                      <div className="text-3xl font-bold text-green-600">
                        +{personalStats.myCollection.avgGrowth}%
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-gray-500 mb-1">Лучшее произведение</div>
                      <div className="text-lg font-semibold truncate">
                        {personalStats.myCollection.topPerformer}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Market Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle>Сравнение с рынком</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Ваш рост</p>
                          <p className="text-2xl font-bold text-green-600">
                            +{personalStats.marketComparison.myGrowth}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Средний по рынку</p>
                          <p className="text-2xl font-bold text-gray-900">
                            +{personalStats.marketComparison.marketGrowth}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Разница</p>
                          <p className="text-2xl font-bold text-blue-600">
                            +{personalStats.marketComparison.difference}%
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        🎉 Ваша коллекция показывает результаты выше среднерыночных на {personalStats.marketComparison.difference}%
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Персональные рекомендации</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {personalStats.recommendations.map((rec, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className={`p-3 rounded-lg ${
                            rec.type === 'artist' ? 'bg-purple-100' :
                            rec.type === 'genre' ? 'bg-blue-100' : 'bg-green-100'
                          }`}>
                            {rec.type === 'artist' && <Award className="w-6 h-6 text-purple-600" />}
                            {rec.type === 'genre' && <Palette className="w-6 h-6 text-blue-600" />}
                            {rec.type === 'event' && <Calendar className="w-6 h-6 text-green-600" />}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{rec.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{rec.reason}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                                  style={{ width: `${rec.potential}%` }}
                                />
                              </div>
                              <span className="text-sm font-semibold text-gray-700">
                                {rec.potential}% потенциал
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Войдите для персональной статистики
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Отслеживайте вашу коллекцию и получайте персональные рекомендации
                  </p>
                  <Button>Войти в систему</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Genres Tab */}
          <TabsContent value="genres" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Статистика по жанрам</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {groupedData.byGenre.map((genre, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg">{genre.name}</h4>
                            <p className="text-sm text-gray-500">{genre.count} произведений</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">${(genre.volume / 1000).toFixed(0)}K</p>
                          <p className="text-sm text-green-600">↑ +{genre.growth}%</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                          style={{ width: `${(genre.volume / 850000) * 100}%` }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Artists Tab */}
          <TabsContent value="partners" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Партнёры платформы
                  </span>
                  <Badge>12 активных</Badge>
                </CardTitle>
                <CardDescription>
                  Банки, страховые компании и сервисные партнёры
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      name: 'Сбербанк',
                      category: 'Финансовый партнёр',
                      services: 'Арт-кредитование, инвестиции',
                      clients: 450,
                      rating: 4.9,
                    },
                    {
                      name: 'Ингосстрах',
                      category: 'Страховая компания',
                      services: 'Страхование произведений',
                      clients: 280,
                      rating: 4.7,
                    },
                    {
                      name: 'Art Logistics Pro',
                      category: 'Логистический партнёр',
                      services: 'Транспорт и хранение',
                      clients: 320,
                      rating: 4.8,
                    },
                    {
                      name: 'Экспертиза Арт',
                      category: 'Сертификация',
                      services: 'Оценка и экспертиза',
                      clients: 190,
                      rating: 4.9,
                    },
                    {
                      name: 'ВТБ Арт',
                      category: 'Финансовый партнёр',
                      services: 'Кредитование, инвестфонды',
                      clients: 380,
                      rating: 4.6,
                    },
                    {
                      name: 'Альфа-Страхование',
                      category: 'Страховая компания',
                      services: 'Комплексное страхование',
                      clients: 210,
                      rating: 4.5,
                    },
                  ].map((partner, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-lg mb-1">{partner.name}</h3>
                            <Badge variant="secondary">{partner.category}</Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-semibold">{partner.rating}</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {partner.services}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Клиентов:</span>
                          <span className="font-semibold">{partner.clients}</span>
                        </div>
                        
                        <Button className="w-full mt-4" variant="outline" size="sm">
                          Подробнее
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Partner Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Категории партнёров</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { category: 'Финансовые', count: 3, color: 'bg-blue-500' },
                      { category: 'Страховые', count: 2, color: 'bg-green-500' },
                      { category: 'Логистика', count: 4, color: 'bg-purple-500' },
                      { category: 'Сертификация', count: 3, color: 'bg-orange-500' },
                    ].map((cat, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                          <span>{cat.category}</span>
                        </div>
                        <Badge>{cat.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Преимущества для партнёров</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Доступ к верифицированной аудитории</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Интеграция с платформой через API</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Аналитика и отчётность в реальном времени</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Маркетинговая поддержка платформы</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
            <Card>
              <CardHeader>
                <CardTitle>Топ художников</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {groupedData.byArtist.map((artist, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{artist.name}</h4>
                          <p className="text-sm text-gray-500">{artist.sales} продаж</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">${artist.revenue.toLocaleString()}</p>
                        <p className="text-sm text-green-600">↑ +{artist.growth}%</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Galleries Tab */}
          <TabsContent value="galleries" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ведущие галереи</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groupedData.byGallery.map((gallery, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <Building2 className="w-8 h-8 text-blue-600" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-1">{gallery.name}</h4>
                          <div className="flex items-center gap-1 mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(gallery.rating)
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="text-sm text-gray-600 ml-1">{gallery.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Произведений</p>
                          <p className="text-xl font-bold">{gallery.artworks}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Выручка</p>
                          <p className="text-xl font-bold">${(gallery.revenue / 1000).toFixed(0)}K</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Крупнейшие мероприятия</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {groupedData.byEvent.map((event, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-xl mb-2">{event.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(event.date).toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {event.participants.toLocaleString()} участников
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">${(event.volume / 1000000).toFixed(2)}M</p>
                          <p className="text-sm text-gray-500">Объём торгов</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary">Аукцион</Badge>
                        <Badge variant="secondary">Завершено</Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">О персонализированной статистике</h4>
                <p className="text-sm text-blue-800">
                  Данные обновляются в реальном времени и адаптируются под вашу коллекцию, интересы и активность на платформе.
                  Используйте фильтры для детального анализа конкретных сегментов рынка.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
