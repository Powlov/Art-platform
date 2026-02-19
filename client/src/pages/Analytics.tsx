import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart, Zap } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';

interface MarketStatistics {
  dealsPerDay: number;
  averagePrice: number;
  activeParticipants: number;
  trendingGenres: Array<{ name: string; count: number }>;
}

interface PriceHistory {
  date: string;
  price: number;
  volume: number;
}

interface ArtworkTrend {
  genre: string;
  priceChange: number;
  volume: number;
  trend: 'up' | 'down' | 'stable';
}

interface UserPortfolioStats {
  totalValue: number;
  artworksCount: number;
  profitLoss: number;
  profitLossPercent: number;
  topGenre: string;
  recentTransactions: Array<{
    id: string;
    artwork: string;
    price: number;
    date: string;
    type: 'buy' | 'sell';
  }>;
}

const MOCK_MARKET_STATS: MarketStatistics = {
  dealsPerDay: 127,
  averagePrice: 245000,
  activeParticipants: 342,
  trendingGenres: [
    { name: 'Абстракционизм', count: 45 },
    { name: 'Живопись', count: 38 },
    { name: 'Скульптура', count: 28 },
    { name: 'Фотография', count: 22 },
    { name: 'Видео-арт', count: 15 },
  ],
};

const MOCK_PRICE_HISTORY: PriceHistory[] = [
  { date: '01 Янв', price: 200000, volume: 45 },
  { date: '08 Янв', price: 215000, volume: 52 },
  { date: '15 Янв', price: 225000, volume: 38 },
  { date: '22 Янв', price: 235000, volume: 61 },
  { date: '29 Янв', price: 245000, volume: 55 },
  { date: '05 Фев', price: 255000, volume: 48 },
  { date: '12 Фев', price: 265000, volume: 72 },
];

const MOCK_TRENDS: ArtworkTrend[] = [
  { genre: 'Абстракционизм', priceChange: 12.5, volume: 450, trend: 'up' },
  { genre: 'Живопись', priceChange: 8.3, volume: 380, trend: 'up' },
  { genre: 'Скульптура', priceChange: -2.1, volume: 280, trend: 'down' },
  { genre: 'Фотография', priceChange: 5.7, volume: 220, trend: 'up' },
  { genre: 'Видео-арт', priceChange: 15.2, volume: 150, trend: 'up' },
  { genre: 'Инсталляция', priceChange: -1.3, volume: 95, trend: 'down' },
];

const MOCK_PORTFOLIO_STATS: UserPortfolioStats = {
  totalValue: 1250000,
  artworksCount: 8,
  profitLoss: 125000,
  profitLossPercent: 11.1,
  topGenre: 'Абстракционизм',
  recentTransactions: [
    {
      id: '1',
      artwork: 'Красная линия',
      price: 125000,
      date: '2025-01-12',
      type: 'buy',
    },
    {
      id: '2',
      artwork: 'Синий квадрат',
      price: 95000,
      date: '2025-01-10',
      type: 'sell',
    },
    {
      id: '3',
      artwork: 'Зелёный круг',
      price: 75000,
      date: '2025-01-08',
      type: 'buy',
    },
  ],
};

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

export default function Analytics() {
  const { user } = useAuth();
  const [marketStats, setMarketStats] = useState<MarketStatistics>(MOCK_MARKET_STATS);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>(MOCK_PRICE_HISTORY);
  const [trends, setTrends] = useState<ArtworkTrend[]>(MOCK_TRENDS);
  const [portfolioStats, setPortfolioStats] = useState<UserPortfolioStats>(MOCK_PORTFOLIO_STATS);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  useEffect(() => {
    // Load analytics data from backend
    const loadAnalytics = async () => {
      try {
        // Market statistics
        const marketResponse = await fetch('/api/v1/analytics/market');
        if (marketResponse.ok) {
          const data = await marketResponse.json();
          setMarketStats(data);
        }

        // User portfolio statistics
        if (user?.id) {
          const portfolioResponse = await fetch(`/api/v1/analytics/user/${user.id}`);
          if (portfolioResponse.ok) {
            const data = await portfolioResponse.json();
            setPortfolioStats(data);
          }

          // Price history
          const priceResponse = await fetch(`/api/v1/analytics/price-history`);
          if (priceResponse.ok) {
            const data = await priceResponse.json();
            setPriceHistory(data);
          }
        }

        // Trends
        const trendsResponse = await fetch('/api/v1/analytics/trends');
        if (trendsResponse.ok) {
          const data = await trendsResponse.json();
          setTrends(data);
        }
      } catch (error) {
        console.error('Error loading analytics:', error);
      }
    };

    loadAnalytics();
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Аналитика и Статистика</h1>
          <p className="text-muted-foreground">
            Полная информация о рынке и вашем портфеле произведений искусства
          </p>
        </div>

        <Tabs defaultValue="market" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="market">Рынок</TabsTrigger>
            <TabsTrigger value="portfolio">Мой портфель</TabsTrigger>
            <TabsTrigger value="trends">Тренды</TabsTrigger>
          </TabsList>

          {/* Market Statistics Tab */}
          <TabsContent value="market" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Сделок за день</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{marketStats.dealsPerDay}</div>
                  <p className="text-xs text-muted-foreground">+12% от вчерашнего дня</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Средняя цена</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(marketStats.averagePrice / 1000).toFixed(0)}K ₽
                  </div>
                  <p className="text-xs text-muted-foreground">+5% от прошлой недели</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Активных участников</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{marketStats.activeParticipants}</div>
                  <p className="text-xs text-muted-foreground">+8 новых сегодня</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">В тренде</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{marketStats.trendingGenres[0].name}</div>
                  <p className="text-xs text-muted-foreground">
                    {marketStats.trendingGenres[0].count} работ
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Price History Chart */}
            <Card>
              <CardHeader>
                <CardTitle>История цен на рынке</CardTitle>
                <CardDescription>Средняя цена произведений за последние 6 недель</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value.toLocaleString()} ₽`} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#3b82f6"
                      name="Средняя цена"
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Trending Genres */}
            <Card>
              <CardHeader>
                <CardTitle>Популярные жанры</CardTitle>
                <CardDescription>Количество произведений в каждом жанре</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={marketStats.trendingGenres}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, count }) => `${name} (${count})`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {marketStats.trendingGenres.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            {/* Portfolio Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Общая стоимость</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(portfolioStats.totalValue / 1000000).toFixed(2)}M ₽
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {portfolioStats.artworksCount} произведений
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Прибыль/Убыток</CardTitle>
                  {portfolioStats.profitLoss > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold ${
                      portfolioStats.profitLoss > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {portfolioStats.profitLoss > 0 ? '+' : ''}
                    {(portfolioStats.profitLoss / 1000).toFixed(0)}K ₽
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {portfolioStats.profitLossPercent > 0 ? '+' : ''}
                    {portfolioStats.profitLossPercent.toFixed(1)}%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Топ жанр</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{portfolioStats.topGenre}</div>
                  <p className="text-xs text-muted-foreground">Ваш основной фокус</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Последние транзакции</CardTitle>
                <CardDescription>Ваша история покупок и продаж</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolioStats.recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-foreground">{transaction.artwork}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-medium ${
                            transaction.type === 'buy'
                              ? 'text-red-600'
                              : 'text-green-600'
                          }`}
                        >
                          {transaction.type === 'buy' ? '-' : '+'}
                          {(transaction.price / 1000).toFixed(0)}K ₽
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.type === 'buy' ? 'Покупка' : 'Продажа'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Тренды по жанрам</CardTitle>
                <CardDescription>Изменение цен и объемов торговли</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trends.map((trend) => (
                    <div
                      key={trend.genre}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent transition"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{trend.genre}</p>
                        <p className="text-sm text-muted-foreground">
                          {trend.volume} произведений на продажу
                        </p>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-lg font-bold flex items-center gap-1 ${
                            trend.trend === 'up'
                              ? 'text-green-600'
                              : trend.trend === 'down'
                              ? 'text-red-600'
                              : 'text-gray-600'
                          }`}
                        >
                          {trend.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                          {trend.trend === 'down' && <TrendingDown className="w-4 h-4" />}
                          {trend.priceChange > 0 ? '+' : ''}
                          {trend.priceChange.toFixed(1)}%
                        </div>
                        <p className="text-xs text-muted-foreground">Изменение цены</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Price Index Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Индекс цен по жанрам</CardTitle>
                <CardDescription>Сравнение средних цен</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="genre" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value.toLocaleString()} ₽`} />
                    <Bar dataKey="priceChange" fill="#3b82f6" name="Изменение цены (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
