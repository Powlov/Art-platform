import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  TrendingUp, 
  DollarSign, 
  PieChart,
  Filter,
  Download,
  Calendar,
  Search,
  Grid3x3,
  List,
  Eye,
  Edit,
  Trash2,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3
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
import { LineChart, Line, AreaChart, Area, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'wouter';

interface Artwork {
  id: number;
  title: string;
  artist: string;
  category: string;
  purchasePrice: number;
  currentValue: number;
  purchaseDate: string;
  imageUrl: string;
  condition: 'Excellent' | 'Good' | 'Fair';
  location: string;
  insurance: number;
  roi: number;
}

interface PortfolioStats {
  totalValue: number;
  totalInvested: number;
  totalArtworks: number;
  totalROI: number;
  avgArtworkValue: number;
  topPerformer: string;
  monthlyChange: number;
}

export default function PortfolioManager() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('value-desc');

  // Mock data - в реальности из API
  const artworks: Artwork[] = [
    {
      id: 1,
      title: "Абстрактная композиция №7",
      artist: "Анна Петрова",
      category: "Живопись",
      purchasePrice: 150000,
      currentValue: 195000,
      purchaseDate: "2023-06-15",
      imageUrl: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400",
      condition: "Excellent",
      location: "Главная галерея",
      insurance: 200000,
      roi: 30
    },
    {
      id: 2,
      title: "Городской пейзаж",
      artist: "Иван Сидоров",
      category: "Живопись",
      purchasePrice: 85000,
      currentValue: 98000,
      purchaseDate: "2023-08-22",
      imageUrl: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400",
      condition: "Excellent",
      location: "Домашняя коллекция",
      insurance: 100000,
      roi: 15.3
    },
    {
      id: 3,
      title: "Скульптура 'Движение'",
      artist: "Мария Козлова",
      category: "Скульптура",
      purchasePrice: 220000,
      currentValue: 280000,
      purchaseDate: "2022-11-10",
      imageUrl: "https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=400",
      condition: "Good",
      location: "Главная галерея",
      insurance: 300000,
      roi: 27.3
    },
    {
      id: 4,
      title: "Цифровое искусство #42",
      artist: "Алексей Новиков",
      category: "Цифровое",
      purchasePrice: 45000,
      currentValue: 72000,
      purchaseDate: "2024-01-05",
      imageUrl: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=400",
      condition: "Excellent",
      location: "Онлайн хранилище",
      insurance: 80000,
      roi: 60
    },
    {
      id: 5,
      title: "Фотография 'Момент'",
      artist: "Ольга Смирнова",
      category: "Фотография",
      purchasePrice: 32000,
      currentValue: 38000,
      purchaseDate: "2023-12-20",
      imageUrl: "https://images.unsplash.com/photo-1518640165326-7f615e0e1f64?w=400",
      condition: "Excellent",
      location: "Домашняя коллекция",
      insurance: 40000,
      roi: 18.8
    },
    {
      id: 6,
      title: "Абстракция 'Космос'",
      artist: "Дмитрий Волков",
      category: "Живопись",
      purchasePrice: 105000,
      currentValue: 124000,
      purchaseDate: "2023-09-30",
      imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400",
      condition: "Excellent",
      location: "Главная галерея",
      insurance: 130000,
      roi: 18.1
    }
  ];

  const stats: PortfolioStats = useMemo(() => {
    const totalInvested = artworks.reduce((sum, art) => sum + art.purchasePrice, 0);
    const totalValue = artworks.reduce((sum, art) => sum + art.currentValue, 0);
    const totalROI = ((totalValue - totalInvested) / totalInvested) * 100;
    const topPerformer = artworks.reduce((max, art) => art.roi > max.roi ? art : max, artworks[0]);

    return {
      totalValue,
      totalInvested,
      totalArtworks: artworks.length,
      totalROI,
      avgArtworkValue: totalValue / artworks.length,
      topPerformer: topPerformer.title,
      monthlyChange: 12.5
    };
  }, [artworks]);

  // Фильтрация и сортировка
  const filteredArtworks = useMemo(() => {
    let filtered = artworks.filter(art => {
      const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           art.artist.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || art.category === filterCategory;
      return matchesSearch && matchesCategory;
    });

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'value-desc': return b.currentValue - a.currentValue;
        case 'value-asc': return a.currentValue - b.currentValue;
        case 'roi-desc': return b.roi - a.roi;
        case 'roi-asc': return a.roi - b.roi;
        case 'date-desc': return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
        case 'date-asc': return new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime();
        default: return 0;
      }
    });

    return filtered;
  }, [artworks, searchQuery, filterCategory, sortBy]);

  // Данные для графиков
  const valueHistoryData = [
    { month: 'Янв', value: 520000, invested: 500000 },
    { month: 'Фев', value: 545000, invested: 520000 },
    { month: 'Мар', value: 580000, invested: 540000 },
    { month: 'Апр', value: 605000, invested: 560000 },
    { month: 'Май', value: 640000, invested: 580000 },
    { month: 'Июн', value: 687000, invested: 637000 }
  ];

  const categoryDistribution = [
    { name: 'Живопись', value: 45, color: '#8b5cf6' },
    { name: 'Скульптура', value: 25, color: '#3b82f6' },
    { name: 'Фотография', value: 15, color: '#10b981' },
    { name: 'Цифровое', value: 15, color: '#f59e0b' }
  ];

  const exportPortfolio = (format: 'pdf' | 'csv' | 'excel') => {
    console.log(`Экспорт в формате ${format}`);
    // Здесь логика экспорта
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', { year: 'numeric', month: 'short', day: 'numeric' });
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
              <Briefcase className="w-8 h-8 text-violet-600" />
              Портфель-менеджер
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Управление вашей художественной коллекцией
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => exportPortfolio('pdf')}>
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" onClick={() => exportPortfolio('csv')}>
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" onClick={() => exportPortfolio('excel')}>
              <Download className="w-4 h-4 mr-2" />
              Excel
            </Button>
            <Button className="bg-violet-600 hover:bg-violet-700">
              <Plus className="w-4 h-4 mr-2" />
              Добавить
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-violet-200 dark:border-violet-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Общая стоимость</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {formatCurrency(stats.totalValue)}
                    </h3>
                    <div className="flex items-center gap-1 mt-2">
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">
                        +{stats.monthlyChange}%
                      </span>
                      <span className="text-sm text-gray-500">за месяц</span>
                    </div>
                  </div>
                  <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-full">
                    <DollarSign className="w-6 h-6 text-violet-600" />
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
            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Общий ROI</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      +{stats.totalROI.toFixed(1)}%
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Прибыль: {formatCurrency(stats.totalValue - stats.totalInvested)}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
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
            <Card className="border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Произведений</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {stats.totalArtworks}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Ср. стоимость: {formatCurrency(stats.avgArtworkValue)}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <PieChart className="w-6 h-6 text-green-600" />
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
            <Card className="border-amber-200 dark:border-amber-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Топ исполнитель</p>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1 line-clamp-2">
                      {stats.topPerformer}
                    </h3>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="w-4 h-4 text-amber-600" />
                      <span className="text-sm text-amber-600 font-medium">
                        +60% ROI
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                    <BarChart3 className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="collection">Коллекция</TabsTrigger>
            <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Value History Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    История стоимости
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={valueHistoryData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.95)', border: 'none', borderRadius: '8px' }}
                        formatter={(value: number) => formatCurrency(value)}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" name="Текущая стоимость" />
                      <Area type="monotone" dataKey="invested" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorInvested)" name="Инвестировано" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Распределение по категориям
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={categoryDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Collection Tab */}
          <TabsContent value="collection" className="space-y-4">
            {/* Filters and Search */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Поиск по названию или художнику..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Категория" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все категории</SelectItem>
                      <SelectItem value="Живопись">Живопись</SelectItem>
                      <SelectItem value="Скульптура">Скульптура</SelectItem>
                      <SelectItem value="Фотография">Фотография</SelectItem>
                      <SelectItem value="Цифровое">Цифровое</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Сортировка" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="value-desc">Стоимость (убыв.)</SelectItem>
                      <SelectItem value="value-asc">Стоимость (возр.)</SelectItem>
                      <SelectItem value="roi-desc">ROI (убыв.)</SelectItem>
                      <SelectItem value="roi-asc">ROI (возр.)</SelectItem>
                      <SelectItem value="date-desc">Дата (новые)</SelectItem>
                      <SelectItem value="date-asc">Дата (старые)</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid3x3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Artworks Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArtworks.map((artwork, index) => (
                  <motion.div
                    key={artwork.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={artwork.imageUrl}
                          alt={artwork.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                          <Badge className={`${artwork.roi > 25 ? 'bg-green-600' : artwork.roi > 15 ? 'bg-blue-600' : 'bg-gray-600'}`}>
                            +{artwork.roi}% ROI
                          </Badge>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <div className="p-4 w-full flex justify-between">
                            <Link href={`/artwork-passport/${artwork.id}`}>
                              <Button size="sm" variant="secondary">
                                <Eye className="w-4 h-4 mr-2" />
                                Детали
                              </Button>
                            </Link>
                            <div className="flex gap-2">
                              <Button size="sm" variant="secondary">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">
                            {artwork.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {artwork.artist}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-500">Текущая стоимость</p>
                            <p className="font-bold text-violet-600">
                              {formatCurrency(artwork.currentValue)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Инвестировано</p>
                            <p className="font-medium text-gray-700 dark:text-gray-300">
                              {formatCurrency(artwork.purchasePrice)}
                            </p>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Рост</span>
                            <span className={`font-medium ${artwork.roi > 20 ? 'text-green-600' : 'text-blue-600'}`}>
                              {formatCurrency(artwork.currentValue - artwork.purchasePrice)}
                            </span>
                          </div>
                          <Progress value={artwork.roi} className="mt-2" />
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2">
                          <Badge variant="outline">{artwork.category}</Badge>
                          <Badge variant="outline">{artwork.condition}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredArtworks.map((artwork, index) => (
                  <motion.div
                    key={artwork.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          <img
                            src={artwork.imageUrl}
                            alt={artwork.title}
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                          <div className="flex-1 space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                  {artwork.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                  {artwork.artist} • {artwork.category}
                                </p>
                              </div>
                              <Badge className={`${artwork.roi > 25 ? 'bg-green-600' : artwork.roi > 15 ? 'bg-blue-600' : 'bg-gray-600'}`}>
                                +{artwork.roi}% ROI
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <p className="text-xs text-gray-500">Инвестировано</p>
                                <p className="font-medium">{formatCurrency(artwork.purchasePrice)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Текущая стоимость</p>
                                <p className="font-bold text-violet-600">{formatCurrency(artwork.currentValue)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Прибыль</p>
                                <p className="font-medium text-green-600">{formatCurrency(artwork.currentValue - artwork.purchasePrice)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Дата покупки</p>
                                <p className="font-medium">{formatDate(artwork.purchaseDate)}</p>
                              </div>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                              <div className="flex gap-2">
                                <Badge variant="outline">{artwork.condition}</Badge>
                                <Badge variant="outline">{artwork.location}</Badge>
                              </div>
                              <div className="flex gap-2">
                                <Link href={`/artwork-passport/${artwork.id}`}>
                                  <Button size="sm" variant="outline">
                                    <Eye className="w-4 h-4 mr-2" />
                                    Детали
                                  </Button>
                                </Link>
                                <Button size="sm" variant="outline">
                                  <Edit className="w-4 h-4 mr-2" />
                                  Изменить
                                </Button>
                                <Button size="sm" variant="destructive">
                                  <Trash2 className="w-4 h-4" />
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
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Детальная аналитика портфеля</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Общая страховая сумма</p>
                    <p className="text-2xl font-bold">{formatCurrency(artworks.reduce((sum, art) => sum + art.insurance, 0))}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Средний срок владения</p>
                    <p className="text-2xl font-bold">1.2 года</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Лучший месяц</p>
                    <p className="text-2xl font-bold">Май 2024</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="font-semibold mb-4">Топ-5 произведений по ROI</h4>
                  <div className="space-y-3">
                    {artworks
                      .sort((a, b) => b.roi - a.roi)
                      .slice(0, 5)
                      .map((artwork) => (
                        <div key={artwork.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <img src={artwork.imageUrl} alt={artwork.title} className="w-12 h-12 object-cover rounded" />
                            <div>
                              <p className="font-medium">{artwork.title}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{artwork.artist}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">+{artwork.roi}%</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{formatCurrency(artwork.currentValue - artwork.purchasePrice)}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
