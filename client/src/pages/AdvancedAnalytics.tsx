import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Brain,
  Target,
  Award,
  Sparkles,
  DollarSign,
  Users,
  Activity,
  Eye,
  Heart,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Zap,
  PieChart,
  LineChart,
  Package,
  ShoppingCart,
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

interface MarketTrend {
  category: string;
  growth: number;
  volume: number;
  avgPrice: number;
  prediction: 'bullish' | 'bearish' | 'neutral';
}

interface ArtistRanking {
  id: string;
  name: string;
  rank: number;
  sales: number;
  revenue: number;
  growth: number;
  popularityScore: number;
}

interface PricePrediction {
  artworkId: string;
  title: string;
  artist: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  timeframe: string;
  factors: string[];
}

interface InvestmentRecommendation {
  type: 'buy' | 'hold' | 'sell';
  artwork: {
    id: string;
    title: string;
    artist: string;
    price: number;
  };
  score: number;
  roi_prediction: number;
  risk_level: 'low' | 'medium' | 'high';
  timeframe: string;
  reasoning: string[];
}

const AdvancedAnalytics: React.FC = () => {
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('market');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([]);
  const [artistRankings, setArtistRankings] = useState<ArtistRanking[]>([]);
  const [pricePredictions, setPricePredictions] = useState<PricePrediction[]>([]);
  const [recommendations, setRecommendations] = useState<InvestmentRecommendation[]>([]);

  useEffect(() => {
    setTimeout(() => {
      // Generate mock data
      setMarketTrends([
        { category: 'Живопись', growth: 23.5, volume: 456, avgPrice: 850000, prediction: 'bullish' },
        { category: 'Скульптура', growth: 18.2, volume: 234, avgPrice: 1200000, prediction: 'bullish' },
        { category: 'Фотография', growth: 15.7, volume: 342, avgPrice: 450000, prediction: 'neutral' },
        { category: 'NFT', growth: -8.3, volume: 189, avgPrice: 320000, prediction: 'bearish' },
        { category: 'Графика', growth: 12.4, volume: 267, avgPrice: 280000, prediction: 'neutral' },
      ]);

      setArtistRankings([
        { id: '1', name: 'Анна Петрова', rank: 1, sales: 47, revenue: 18500000, growth: 32.8, popularityScore: 95 },
        { id: '2', name: 'Михаил Иванов', rank: 2, sales: 38, revenue: 14200000, growth: 28.4, popularityScore: 89 },
        { id: '3', name: 'Елена Смирнова', rank: 3, sales: 34, revenue: 12800000, growth: 24.1, popularityScore: 84 },
        { id: '4', name: 'Дмитрий Козлов', rank: 4, sales: 29, revenue: 10500000, growth: 19.5, popularityScore: 78 },
        { id: '5', name: 'Ольга Новикова', rank: 5, sales: 26, revenue: 9200000, growth: 16.8, popularityScore: 72 },
      ]);

      setPricePredictions([
        {
          artworkId: '1',
          title: 'Красная композиция',
          artist: 'Анна Петрова',
          currentPrice: 850000,
          predictedPrice: 1150000,
          confidence: 87,
          timeframe: '6 месяцев',
          factors: ['Растущий спрос', 'Участие в выставках', 'Рост популярности художника'],
        },
        {
          artworkId: '2',
          title: 'Городской пейзаж',
          artist: 'Михаил Иванов',
          currentPrice: 620000,
          predictedPrice: 780000,
          confidence: 82,
          timeframe: '3 месяца',
          factors: ['Историческая динамика', 'Похожие продажи', 'Тренд категории'],
        },
      ]);

      setRecommendations([
        {
          type: 'buy',
          artwork: { id: '1', title: 'Абстракция №7', artist: 'Елена Смирнова', price: 450000 },
          score: 92,
          roi_prediction: 38.5,
          risk_level: 'low',
          timeframe: '12 месяцев',
          reasoning: [
            'Высокий потенциал роста стоимости',
            'Растущая популярность художника',
            'Низкая рыночная цена относительно аналогов',
          ],
        },
        {
          type: 'hold',
          artwork: { id: '2', title: 'Портрет', artist: 'Дмитрий Козлов', price: 720000 },
          score: 75,
          roi_prediction: 18.2,
          risk_level: 'medium',
          timeframe: '6 месяцев',
          reasoning: [
            'Стабильная динамика цены',
            'Ожидаемая выставка через 3 месяца',
            'Средний уровень спроса',
          ],
        },
      ]);

      setLoading(false);
    }, 800);
  }, [selectedPeriod]);

  if (loading) {
    return <LoadingState fullScreen message="Загрузка аналитики..." />;
  }

  const getPredictionIcon = (prediction: MarketTrend['prediction']) => {
    switch (prediction) {
      case 'bullish': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'bearish': return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'neutral': return <Activity className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getRecommendationColor = (type: InvestmentRecommendation['type']) => {
    switch (type) {
      case 'buy': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'hold': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'sell': return 'bg-red-500/10 text-red-600 border-red-500/20';
    }
  };

  const getRiskColor = (risk: InvestmentRecommendation['risk_level']) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
    }
  };

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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <Brain className="w-8 h-8 text-primary" />
                Продвинутая Аналитика
                <Badge variant="outline" className="ml-2">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI-Powered
                </Badge>
              </h1>
              <p className="text-muted-foreground">
                Machine Learning анализ и прогнозы рынка искусства
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex gap-2">
                <Button
                  variant={selectedPeriod === '7d' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPeriod('7d')}
                >
                  7 дней
                </Button>
                <Button
                  variant={selectedPeriod === '30d' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPeriod('30d')}
                >
                  30 дней
                </Button>
                <Button
                  variant={selectedPeriod === '90d' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPeriod('90d')}
                >
                  90 дней
                </Button>
              </div>
              <Button variant="outline" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Обновить
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Экспорт
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Точность прогнозов</p>
                    <p className="text-2xl font-bold">87.4%</p>
                    <p className="text-xs text-green-600 mt-1">+2.3% за месяц</p>
                  </div>
                  <Target className="w-10 h-10 text-primary opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Анализируемых работ</p>
                    <p className="text-2xl font-bold">1,247</p>
                    <p className="text-xs text-blue-600 mt-1">+156 за неделю</p>
                  </div>
                  <Package className="w-10 h-10 text-primary opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Средний ROI</p>
                    <p className="text-2xl font-bold text-green-600">+24.5%</p>
                    <p className="text-xs text-green-600 mt-1">По рекомендациям</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-green-600 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">ML Confidence</p>
                    <p className="text-2xl font-bold">92%</p>
                    <p className="text-xs text-purple-600 mt-1">Надёжность модели</p>
                  </div>
                  <Brain className="w-10 h-10 text-primary opacity-20" />
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="market">Рынок</TabsTrigger>
            <TabsTrigger value="predictions">Прогнозы</TabsTrigger>
            <TabsTrigger value="recommendations">Рекомендации</TabsTrigger>
            <TabsTrigger value="artists">Рейтинги</TabsTrigger>
          </TabsList>

          {/* Market Trends Tab */}
          <TabsContent value="market" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Тренды рынка по категориям
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketTrends.map((trend, index) => (
                    <motion.div
                      key={trend.category}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            {getPredictionIcon(trend.prediction)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{trend.category}</h3>
                            <p className="text-sm text-muted-foreground">{trend.volume} сделок</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="gap-1">
                          {trend.growth > 0 ? (
                            <ArrowUpRight className="w-3 h-3 text-green-600" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 text-red-600" />
                          )}
                          {Math.abs(trend.growth)}%
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Средняя цена</p>
                          <p className="font-semibold">₽{(trend.avgPrice / 1000).toFixed(0)}K</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Объём</p>
                          <p className="font-semibold">₽{((trend.avgPrice * trend.volume) / 1000000).toFixed(1)}M</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Прогноз</p>
                          <p className={`font-semibold ${
                            trend.prediction === 'bullish' ? 'text-green-600' :
                            trend.prediction === 'bearish' ? 'text-red-600' :
                            'text-yellow-600'
                          }`}>
                            {trend.prediction === 'bullish' ? 'Рост' :
                             trend.prediction === 'bearish' ? 'Падение' : 'Стабильно'}
                          </p>
                        </div>
                      </div>

                      <Progress value={Math.abs(trend.growth) * 2} />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Price Predictions Tab */}
          <TabsContent value="predictions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="w-5 h-5" />
                  ML-прогнозы цен
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pricePredictions.map((prediction, index) => (
                    <motion.div
                      key={prediction.artworkId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{prediction.title}</h3>
                          <p className="text-sm text-muted-foreground">{prediction.artist}</p>
                        </div>
                        <Badge variant="outline">
                          <Zap className="w-3 h-3 mr-1" />
                          {prediction.confidence}% уверенность
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Текущая цена</p>
                          <p className="text-lg font-bold">₽{(prediction.currentPrice / 1000).toFixed(0)}K</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Прогноз через {prediction.timeframe}</p>
                          <p className="text-lg font-bold text-green-600">
                            ₽{(prediction.predictedPrice / 1000).toFixed(0)}K
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Потенциальный рост</p>
                          <p className="text-lg font-bold text-green-600">
                            +{(((prediction.predictedPrice - prediction.currentPrice) / prediction.currentPrice) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Факторы прогноза:</p>
                        <div className="flex flex-wrap gap-2">
                          {prediction.factors.map((factor, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  AI-рекомендации по инвестициям
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <motion.div
                      key={rec.artwork.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border rounded-lg hover:border-primary transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getRecommendationColor(rec.type)}>
                              {rec.type === 'buy' ? 'Покупать' :
                               rec.type === 'hold' ? 'Держать' : 'Продавать'}
                            </Badge>
                            <Badge variant="outline">
                              <Award className="w-3 h-3 mr-1" />
                              Рейтинг: {rec.score}/100
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-lg">{rec.artwork.title}</h3>
                          <p className="text-sm text-muted-foreground">{rec.artwork.artist}</p>
                        </div>
                        <p className="text-2xl font-bold">₽{(rec.artwork.price / 1000).toFixed(0)}K</p>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Прогноз ROI</p>
                          <p className="text-lg font-bold text-green-600">+{rec.roi_prediction}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Горизонт</p>
                          <p className="font-semibold">{rec.timeframe}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Риск</p>
                          <p className={`font-semibold ${getRiskColor(rec.risk_level)}`}>
                            {rec.risk_level === 'low' ? 'Низкий' :
                             rec.risk_level === 'medium' ? 'Средний' : 'Высокий'}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Обоснование:</p>
                        <ul className="space-y-1">
                          {rec.reasoning.map((reason, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button className="w-full" onClick={() => navigate(`/artwork-passport/${rec.artwork.id}`)}>
                        Подробнее
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Artist Rankings Tab */}
          <TabsContent value="artists" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Рейтинг художников
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {artistRankings.map((artist, index) => (
                    <motion.div
                      key={artist.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xl font-bold">#{artist.rank}</span>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{artist.name}</h3>
                              <p className="text-sm text-muted-foreground">{artist.sales} продаж</p>
                            </div>
                            <Badge variant="outline" className="gap-1">
                              <ArrowUpRight className="w-3 h-3 text-green-600" />
                              +{artist.growth}%
                            </Badge>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-2">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Доход</p>
                              <p className="font-semibold">₽{(artist.revenue / 1000000).toFixed(1)}M</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Средний чек</p>
                              <p className="font-semibold">₽{(artist.revenue / artist.sales / 1000).toFixed(0)}K</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Популярность</p>
                              <p className="font-semibold">{artist.popularityScore}/100</p>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Рейтинг популярности</span>
                              <span>{artist.popularityScore}%</span>
                            </div>
                            <Progress value={artist.popularityScore} />
                          </div>
                        </div>
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

export default AdvancedAnalytics;
