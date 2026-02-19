import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Globe,
  Users,
  DollarSign,
  Calendar,
  Award,
  Zap,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface MarketTrend {
  category: string;
  change: number;
  volume: number;
  avgPrice: number;
  topArtist: string;
  prediction: 'bullish' | 'bearish' | 'neutral';
}

interface MarketStats {
  totalVolume: number;
  totalTransactions: number;
  avgPrice: number;
  marketCap: number;
  activeUsers: number;
  topCategory: string;
  monthlyGrowth: number;
  yearlyGrowth: number;
}

export default function MarketInsights() {
  const [timeframe, setTimeframe] = useState('6m');
  const [category, setCategory] = useState('all');

  // Mock data
  const marketStats: MarketStats = {
    totalVolume: 1245000000,
    totalTransactions: 15420,
    avgPrice: 80750,
    marketCap: 4850000000,
    activeUsers: 28450,
    topCategory: 'Живопись',
    monthlyGrowth: 18.5,
    yearlyGrowth: 142.3
  };

  const marketTrends: MarketTrend[] = [
    {
      category: 'Живопись',
      change: 23.5,
      volume: 485000000,
      avgPrice: 125000,
      topArtist: 'Анна Петрова',
      prediction: 'bullish'
    },
    {
      category: 'Скульптура',
      change: 18.2,
      volume: 324000000,
      avgPrice: 185000,
      topArtist: 'Иван Козлов',
      prediction: 'bullish'
    },
    {
      category: 'Фотография',
      change: -5.3,
      volume: 156000000,
      avgPrice: 45000,
      topArtist: 'Ольга Смирнова',
      prediction: 'neutral'
    },
    {
      category: 'Цифровое',
      change: 45.8,
      volume: 280000000,
      avgPrice: 65000,
      topArtist: 'Алексей Новиков',
      prediction: 'bullish'
    }
  ];

  const priceHistoryData = [
    { month: 'Янв', painting: 98, sculpture: 105, photo: 52, digital: 42 },
    { month: 'Фев', painting: 105, sculpture: 108, photo: 48, digital: 52 },
    { month: 'Мар', painting: 112, sculpture: 115, photo: 50, digital: 68 },
    { month: 'Апр', painting: 118, sculpture: 118, photo: 49, digital: 78 },
    { month: 'Май', painting: 120, sculpture: 125, photo: 47, digital: 88 },
    { month: 'Июн', painting: 125, sculpture: 128, photo: 45, digital: 95 }
  ];

  const volumeData = [
    { category: 'Живопись', value: 485, color: '#8b5cf6' },
    { category: 'Скульптура', value: 324, color: '#3b82f6' },
    { category: 'Цифровое', value: 280, color: '#f59e0b' },
    { category: 'Фотография', value: 156, color: '#10b981' }
  ];

  const regionalData = [
    { region: 'Москва', volume: 520, growth: 25 },
    { region: 'Санкт-Петербург', volume: 385, growth: 18 },
    { region: 'Екатеринбург', volume: 145, growth: 32 },
    { region: 'Новосибирск', volume: 95, growth: 15 },
    { region: 'Казань', volume: 100, growth: 28 }
  ];

  const demographicData = [
    { age: '18-25', painting: 65, sculpture: 45, photo: 75, digital: 95 },
    { age: '26-35', painting: 85, sculpture: 72, photo: 88, digital: 92 },
    { age: '36-45', painting: 95, sculpture: 88, photo: 78, digital: 65 },
    { age: '46-55', painting: 88, sculpture: 92, photo: 55, digital: 42 },
    { age: '56+', painting: 75, sculpture: 85, photo: 45, digital: 25 }
  ];

  const artistPerformanceData = [
    { name: 'А. Петрова', sales: 485, avgPrice: 125, growth: 45 },
    { name: 'И. Козлов', sales: 324, avgPrice: 185, growth: 32 },
    { name: 'О. Смирнова', sales: 280, avgPrice: 65, growth: 28 },
    { name: 'А. Новиков', sales: 245, avgPrice: 95, growth: 52 },
    { name: 'М. Волкова', sales: 210, avgPrice: 75, growth: 38 }
  ];

  const forecastData = [
    { month: 'Июл', actual: 125, predicted: 130, lower: 120, upper: 140 },
    { month: 'Авг', actual: null, predicted: 138, lower: 128, upper: 148 },
    { month: 'Сен', actual: null, predicted: 145, lower: 135, upper: 155 },
    { month: 'Окт', actual: null, predicted: 152, lower: 140, upper: 164 },
    { month: 'Ноя', actual: null, predicted: 158, lower: 145, upper: 171 },
    { month: 'Дек', actual: null, predicted: 165, lower: 150, upper: 180 }
  ];

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `₽${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `₽${(value / 1000000).toFixed(0)}M`;
    }
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
              <Activity className="w-8 h-8 text-blue-600" />
              Аналитика рынка
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Глубокий анализ трендов и прогнозы развития арт-рынка
            </p>
          </div>

          <div className="flex gap-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1 месяц</SelectItem>
                <SelectItem value="3m">3 месяца</SelectItem>
                <SelectItem value="6m">6 месяцев</SelectItem>
                <SelectItem value="1y">1 год</SelectItem>
                <SelectItem value="all">Всё время</SelectItem>
              </SelectContent>
            </Select>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                <SelectItem value="painting">Живопись</SelectItem>
                <SelectItem value="sculpture">Скульптура</SelectItem>
                <SelectItem value="photo">Фотография</SelectItem>
                <SelectItem value="digital">Цифровое</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Объём торгов</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {formatCurrency(marketStats.totalVolume)}
                    </h3>
                    <div className="flex items-center gap-1 mt-2">
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">
                        +{marketStats.monthlyGrowth}%
                      </span>
                      <span className="text-sm text-gray-500">за месяц</span>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <DollarSign className="w-6 h-6 text-blue-600" />
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
            <Card className="border-violet-200 dark:border-violet-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Транзакций</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {formatNumber(marketStats.totalTransactions)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Ср. цена: {formatCurrency(marketStats.avgPrice)}
                    </p>
                  </div>
                  <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-full">
                    <Activity className="w-6 h-6 text-violet-600" />
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
                    <p className="text-sm text-gray-600 dark:text-gray-400">Активных пользователей</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {formatNumber(marketStats.activeUsers)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Рост: +{marketStats.yearlyGrowth}% годовых
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <Users className="w-6 h-6 text-green-600" />
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
                    <p className="text-sm text-gray-600 dark:text-gray-400">Топ категория</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {marketStats.topCategory}
                    </h3>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="w-4 h-4 text-amber-600" />
                      <span className="text-sm text-amber-600 font-medium">
                        {formatCurrency(marketTrends[0].volume)}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                    <Award className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Trends by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Тренды по категориям
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {marketTrends.map((trend, index) => (
                <motion.div
                  key={trend.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-lg">{trend.category}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Топ художник: {trend.topArtist}
                      </p>
                    </div>
                    <Badge className={`${
                      trend.prediction === 'bullish' ? 'bg-green-600' :
                      trend.prediction === 'bearish' ? 'bg-red-600' :
                      'bg-gray-600'
                    }`}>
                      {trend.prediction === 'bullish' ? '📈 Рост' :
                       trend.prediction === 'bearish' ? '📉 Спад' :
                       '➡️ Стабильно'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Изменение</p>
                      <p className={`font-bold flex items-center gap-1 ${trend.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {trend.change > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {Math.abs(trend.change)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Объём</p>
                      <p className="font-bold">{formatCurrency(trend.volume)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Ср. цена</p>
                      <p className="font-bold">{formatCurrency(trend.avgPrice)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Analytics Tabs */}
        <Tabs defaultValue="trends" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trends">Тренды</TabsTrigger>
            <TabsTrigger value="forecast">Прогнозы</TabsTrigger>
            <TabsTrigger value="regional">Регионы</TabsTrigger>
            <TabsTrigger value="artists">Художники</TabsTrigger>
          </TabsList>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Price History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChartIcon className="w-5 h-5" />
                    История цен
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={priceHistoryData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.95)', border: 'none', borderRadius: '8px' }}
                        formatter={(value: number) => `₽${value}K`}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="painting" stroke="#8b5cf6" strokeWidth={2} name="Живопись" />
                      <Line type="monotone" dataKey="sculpture" stroke="#3b82f6" strokeWidth={2} name="Скульптура" />
                      <Line type="monotone" dataKey="photo" stroke="#10b981" strokeWidth={2} name="Фотография" />
                      <Line type="monotone" dataKey="digital" stroke="#f59e0b" strokeWidth={2} name="Цифровое" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Volume Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5" />
                    Объём по категориям
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={volumeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, value }) => `${category}: ₽${value}M`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {volumeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `₽${value}M`} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Demographics */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Предпочтения по возрастным группам
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={demographicData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis dataKey="age" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.95)', border: 'none', borderRadius: '8px' }}
                      />
                      <Legend />
                      <Bar dataKey="painting" fill="#8b5cf6" name="Живопись" />
                      <Bar dataKey="sculpture" fill="#3b82f6" name="Скульптура" />
                      <Bar dataKey="photo" fill="#10b981" name="Фотография" />
                      <Bar dataKey="digital" fill="#f59e0b" name="Цифровое" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Forecast Tab */}
          <TabsContent value="forecast" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  AI-прогноз цен на 6 месяцев
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900 dark:text-blue-100">
                        ML-модель с точностью 89.2%
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Прогноз основан на историческ данных, трендах и сезонности. Доверительный интервал 95%.
                      </p>
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={forecastData}>
                    <defs>
                      <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.95)', border: 'none', borderRadius: '8px' }}
                      formatter={(value: number) => `₽${value}K`}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="upper" stroke="none" fill="#e0e7ff" name="Верхняя граница" />
                    <Area type="monotone" dataKey="lower" stroke="none" fill="#e0e7ff" name="Нижняя граница" />
                    <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} name="Фактические" />
                    <Area type="monotone" dataKey="predicted" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorPredicted)" dot={{ r: 5 }} name="Прогноз" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Regional Tab */}
          <TabsContent value="regional" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Региональный анализ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={regionalData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis type="number" />
                    <YAxis dataKey="region" type="category" width={150} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.95)', border: 'none', borderRadius: '8px' }}
                      formatter={(value: number) => `₽${value}M`}
                    />
                    <Legend />
                    <Bar dataKey="volume" fill="#8b5cf6" name="Объём торгов (₽M)" />
                    <Bar dataKey="growth" fill="#10b981" name="Рост (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Artists Tab */}
          <TabsContent value="artists" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Топ-5 художников по продажам
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {artistPerformanceData.map((artist, index) => (
                    <motion.div
                      key={artist.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20 rounded-lg border border-violet-200 dark:border-violet-800"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div className="text-3xl font-bold text-violet-600">
                            #{index + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-lg">{artist.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {formatNumber(artist.sales)} продаж
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-green-600">
                          +{artist.growth}% рост
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Продаж</p>
                          <p className="font-bold text-violet-600">{formatNumber(artist.sales)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Ср. цена</p>
                          <p className="font-bold">{formatCurrency(artist.avgPrice * 1000)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Общий объём</p>
                          <p className="font-bold">{formatCurrency(artist.sales * artist.avgPrice * 1000)}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
