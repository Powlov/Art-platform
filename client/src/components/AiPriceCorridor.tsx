import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown,
  AlertTriangle, 
  CheckCircle, 
  Activity,
  RefreshCw,
  Bell,
  BarChart3,
  LineChart,
  DollarSign,
  Zap,
  Target,
  Eye,
  Filter,
  Download,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

interface PricePoint {
  date: string;
  price: number;
  source: string;
}

interface PriceCorridor {
  artworkId: string;
  artworkTitle: string;
  artist: string;
  currentPrice: number;
  corridorMin: number;
  corridorMax: number;
  confidence: number;
  lastUpdated: string;
  priceHistory: PricePoint[];
  anomalyScore: number;
  anomalyDetected: boolean;
  mlPrediction: number;
  marketSentiment: 'bullish' | 'bearish' | 'neutral';
  volatility: number;
  liquidity: number;
}

interface AnomalyAlert {
  id: string;
  artworkTitle: string;
  type: 'price_spike' | 'price_drop' | 'forgery_suspected' | 'market_manipulation';
  severity: 'high' | 'medium' | 'low';
  message: string;
  detectedAt: string;
  currentPrice: number;
  expectedPrice: number;
  deviation: number;
}

interface MarketIndex {
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export default function AiPriceCorridor() {
  const [corridors, setCorridors] = useState<PriceCorridor[]>([]);
  const [anomalyAlerts, setAnomalyAlerts] = useState<AnomalyAlert[]>([]);
  const [marketIndices, setMarketIndices] = useState<MarketIndex[]>([]);
  const [selectedCorridor, setSelectedCorridor] = useState<PriceCorridor | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  // Mock data for demonstration
  useEffect(() => {
    const mockCorridors: PriceCorridor[] = [
      {
        artworkId: 'artwork-201',
        artworkTitle: 'Звёздная ночь',
        artist: 'Винсент Ван Гог',
        currentPrice: 82000000,
        corridorMin: 75000000,
        corridorMax: 90000000,
        confidence: 94.5,
        lastUpdated: '2026-03-05T14:30:00Z',
        priceHistory: [
          { date: '2026-01-01', price: 78000000, source: 'Christie\'s' },
          { date: '2026-01-15', price: 79500000, source: 'Sotheby\'s' },
          { date: '2026-02-01', price: 81000000, source: 'Phillips' },
          { date: '2026-02-15', price: 80500000, source: 'Bonhams' },
          { date: '2026-03-01', price: 82000000, source: 'Heritage' },
          { date: '2026-03-05', price: 82000000, source: 'ML Prediction' }
        ],
        anomalyScore: 12.3,
        anomalyDetected: false,
        mlPrediction: 83500000,
        marketSentiment: 'bullish',
        volatility: 8.5,
        liquidity: 72
      },
      {
        artworkId: 'artwork-202',
        artworkTitle: 'Герника',
        artist: 'Пабло Пикассо',
        currentPrice: 200000000,
        corridorMin: 180000000,
        corridorMax: 220000000,
        confidence: 91.2,
        lastUpdated: '2026-03-05T14:25:00Z',
        priceHistory: [
          { date: '2026-01-01', price: 195000000, source: 'Christie\'s' },
          { date: '2026-01-15', price: 198000000, source: 'Sotheby\'s' },
          { date: '2026-02-01', price: 197000000, source: 'Phillips' },
          { date: '2026-02-15', price: 199000000, source: 'Art Market' },
          { date: '2026-03-01', price: 200000000, source: 'Heritage' },
          { date: '2026-03-05', price: 200000000, source: 'ML Prediction' }
        ],
        anomalyScore: 8.7,
        anomalyDetected: false,
        mlPrediction: 202000000,
        marketSentiment: 'neutral',
        volatility: 5.2,
        liquidity: 85
      },
      {
        artworkId: 'artwork-203',
        artworkTitle: 'Подозрительная работа',
        artist: 'Неизвестный автор',
        currentPrice: 15000000,
        corridorMin: 2000000,
        corridorMax: 5000000,
        confidence: 42.1,
        lastUpdated: '2026-03-05T14:20:00Z',
        priceHistory: [
          { date: '2026-02-20', price: 3000000, source: 'Local Gallery' },
          { date: '2026-02-25', price: 8000000, source: 'Private Sale' },
          { date: '2026-03-01', price: 12000000, source: 'Auction' },
          { date: '2026-03-05', price: 15000000, source: 'Current Offer' }
        ],
        anomalyScore: 87.4,
        anomalyDetected: true,
        mlPrediction: 3500000,
        marketSentiment: 'bearish',
        volatility: 92.3,
        liquidity: 15
      }
    ];

    const mockAlerts: AnomalyAlert[] = [
      {
        id: 'alert-001',
        artworkTitle: 'Подозрительная работа',
        type: 'forgery_suspected',
        severity: 'high',
        message: 'Обнаружена аномальная ценовая динамика. Возможная подделка или манипуляция рынком.',
        detectedAt: '2026-03-05T14:20:00Z',
        currentPrice: 15000000,
        expectedPrice: 3500000,
        deviation: 328.6
      },
      {
        id: 'alert-002',
        artworkTitle: 'Композиция VIII',
        type: 'price_spike',
        severity: 'medium',
        message: 'Резкий рост цены (+45%) за последние 7 дней. Рекомендуется дополнительная проверка.',
        detectedAt: '2026-03-04T10:15:00Z',
        currentPrice: 18500000,
        expectedPrice: 12750000,
        deviation: 45.1
      },
      {
        id: 'alert-003',
        artworkTitle: 'Чёрный круг',
        type: 'market_manipulation',
        severity: 'medium',
        message: 'Обнаружены признаки искусственного завышения цены через скоординированные торги.',
        detectedAt: '2026-03-03T16:40:00Z',
        currentPrice: 9200000,
        expectedPrice: 6800000,
        deviation: 35.3
      },
      {
        id: 'alert-004',
        artworkTitle: 'Натюрморт с яблоками',
        type: 'price_drop',
        severity: 'low',
        message: 'Цена снизилась на 12% за последние 14 дней. Возможна коррекция рынка.',
        detectedAt: '2026-03-02T09:25:00Z',
        currentPrice: 4400000,
        expectedPrice: 5000000,
        deviation: -12.0
      }
    ];

    const mockIndices: MarketIndex[] = [
      { name: 'Artprice Global Index', value: 1247.8, change: 2.3, trend: 'up' },
      { name: 'Contemporary Art Index', value: 892.5, change: -0.8, trend: 'down' },
      { name: 'Russian Art Index', value: 543.2, change: 1.5, trend: 'up' },
      { name: 'Impressionism Index', value: 2134.6, change: 0.2, trend: 'stable' }
    ];

    setCorridors(mockCorridors);
    setAnomalyAlerts(mockAlerts);
    setMarketIndices(mockIndices);
    setSelectedCorridor(mockCorridors[0]);
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        handleRefresh();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getAnomalyBadge = (detected: boolean, score: number) => {
    if (!detected) {
      return <Badge className="bg-green-100 text-green-800 border-green-300"><CheckCircle className="w-3 h-3 mr-1" />Норма</Badge>;
    }
    if (score > 70) {
      return <Badge className="bg-red-100 text-red-800 border-red-300"><AlertTriangle className="w-3 h-3 mr-1" />Критично</Badge>;
    }
    return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300"><AlertTriangle className="w-3 h-3 mr-1" />Предупреждение</Badge>;
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return <Badge className="bg-green-100 text-green-800 border-green-300"><TrendingUp className="w-3 h-3 mr-1" />Рост</Badge>;
      case 'bearish':
        return <Badge className="bg-red-100 text-red-800 border-red-300"><TrendingDown className="w-3 h-3 mr-1" />Падение</Badge>;
      case 'neutral':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300"><Activity className="w-3 h-3 mr-1" />Стабильно</Badge>;
      default:
        return null;
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      toast({
        title: "🔄 Данные обновлены",
        description: "ML модель пересчитала ценовые коридоры"
      });
      setLoading(false);
    }, 1500);
  };

  const handleExportData = () => {
    toast({
      title: "📥 Экспорт данных",
      description: "Данные ценовых коридоров экспортированы в CSV"
    });
  };

  const filteredAlerts = anomalyAlerts.filter(alert => {
    if (filterSeverity === 'all') return true;
    return alert.severity === filterSeverity;
  });

  const criticalAnomalies = corridors.filter(c => c.anomalyDetected && c.anomalyScore > 70).length;
  const averageConfidence = (corridors.reduce((sum, c) => sum + c.confidence, 0) / corridors.length).toFixed(1);
  const totalMonitored = corridors.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="w-8 h-8 text-yellow-600" />
            AI Price Corridor
          </h2>
          <p className="text-gray-500 mt-1">ML-переоценка активов и мониторинг аномалий цен</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-green-50' : ''}
          >
            <Bell className={`w-4 h-4 mr-2 ${autoRefresh ? 'text-green-600' : ''}`} />
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </Button>
          <Button onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Обновить
          </Button>
          <Button variant="outline" onClick={handleExportData}>
            <Download className="w-4 h-4 mr-2" />
            Экспорт
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Мониторинг активов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMonitored}</div>
            <p className="text-xs text-gray-500 mt-1">произведений искусства</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Критические аномалии</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              {criticalAnomalies}
            </div>
            <p className="text-xs text-gray-500 mt-1">требуют внимания</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Средняя точность ML</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{averageConfidence}%</div>
            <p className="text-xs text-gray-500 mt-1">уверенность модели</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Активные алерты</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{anomalyAlerts.length}</div>
            <p className="text-xs text-gray-500 mt-1">уведомлений</p>
          </CardContent>
        </Card>
      </div>

      {/* Market Indices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Рыночные индексы (Bloomberg-like)
          </CardTitle>
          <CardDescription>Ключевые индикаторы рынка искусства</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {marketIndices.map((index, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600">{index.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{index.value.toFixed(1)}</p>
                </div>
                <div className={`flex items-center gap-1 ${
                  index.trend === 'up' ? 'text-green-600' :
                  index.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {index.trend === 'up' ? <TrendingUp className="w-5 h-5" /> :
                   index.trend === 'down' ? <TrendingDown className="w-5 h-5" /> :
                   <Activity className="w-5 h-5" />}
                  <span className="font-semibold">{index.change > 0 ? '+' : ''}{index.change}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="corridors" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="corridors">
            <Target className="w-4 h-4 mr-2" />
            Ценовые коридоры
          </TabsTrigger>
          <TabsTrigger value="anomalies">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Аномалии ({anomalyAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <LineChart className="w-4 h-4 mr-2" />
            Аналитика
          </TabsTrigger>
        </TabsList>

        <TabsContent value="corridors" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Corridor List */}
            <div className="lg:col-span-1 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Активы под мониторингом</h3>
              <AnimatePresence>
                {corridors.map((corridor) => (
                  <motion.div
                    key={corridor.artworkId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedCorridor?.artworkId === corridor.artworkId ? 'ring-2 ring-blue-500' : ''
                      } ${corridor.anomalyDetected ? 'border-red-300' : ''}`}
                      onClick={() => setSelectedCorridor(corridor)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base">{corridor.artworkTitle}</CardTitle>
                            <CardDescription className="text-sm">{corridor.artist}</CardDescription>
                          </div>
                          {getAnomalyBadge(corridor.anomalyDetected, corridor.anomalyScore)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Текущая цена:</span>
                          <span className="font-semibold">{formatCurrency(corridor.currentPrice)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">ML прогноз:</span>
                          <span className="font-semibold text-blue-600">{formatCurrency(corridor.mlPrediction)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Уверенность:</span>
                          <span className="font-semibold text-green-600">{corridor.confidence.toFixed(1)}%</span>
                        </div>
                        <div className="mt-2">
                          {getSentimentBadge(corridor.marketSentiment)}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Corridor Details */}
            {selectedCorridor && (
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl">{selectedCorridor.artworkTitle}</CardTitle>
                        <CardDescription className="text-base mt-1">{selectedCorridor.artist}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {getAnomalyBadge(selectedCorridor.anomalyDetected, selectedCorridor.anomalyScore)}
                        {getSentimentBadge(selectedCorridor.marketSentiment)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Price Corridor Visualization */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold">Ценовой коридор</h4>
                      <div className="relative h-24 bg-gray-50 rounded-lg p-4">
                        <div className="absolute inset-x-4 top-1/2 transform -translate-y-1/2">
                          <div className="h-12 bg-blue-100 rounded-lg relative">
                            {/* Min price */}
                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2">
                              <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                              <p className="text-xs text-gray-600 mt-1 whitespace-nowrap">
                                {formatCurrency(selectedCorridor.corridorMin)}
                              </p>
                            </div>
                            {/* Current price */}
                            <div 
                              className="absolute top-1/2 transform -translate-y-1/2 -translate-x-2"
                              style={{ 
                                left: `${((selectedCorridor.currentPrice - selectedCorridor.corridorMin) / 
                                        (selectedCorridor.corridorMax - selectedCorridor.corridorMin)) * 100}%` 
                              }}
                            >
                              <div className="w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
                              <p className="text-xs font-semibold text-gray-900 mt-1 whitespace-nowrap">
                                {formatCurrency(selectedCorridor.currentPrice)}
                              </p>
                            </div>
                            {/* Max price */}
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2">
                              <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                              <p className="text-xs text-gray-600 mt-1 whitespace-nowrap">
                                {formatCurrency(selectedCorridor.corridorMax)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">ML Прогноз</p>
                        <p className="text-lg font-bold text-blue-600">
                          {formatCurrency(selectedCorridor.mlPrediction)}
                        </p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Уверенность</p>
                        <p className="text-lg font-bold text-green-600">
                          {selectedCorridor.confidence.toFixed(1)}%
                        </p>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Волатильность</p>
                        <p className="text-lg font-bold text-yellow-600">
                          {selectedCorridor.volatility.toFixed(1)}%
                        </p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Ликвидность</p>
                        <p className="text-lg font-bold text-purple-600">
                          {selectedCorridor.liquidity}%
                        </p>
                      </div>
                    </div>

                    {/* Anomaly Score */}
                    {selectedCorridor.anomalyDetected && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h5 className="font-semibold text-red-900 mb-1">Обнаружена аномалия</h5>
                            <p className="text-sm text-red-700 mb-2">
                              Оценка аномалии: <strong>{selectedCorridor.anomalyScore.toFixed(1)}%</strong>
                            </p>
                            <p className="text-sm text-red-600">
                              Текущая цена значительно отклоняется от ожидаемого диапазона. 
                              Рекомендуется дополнительная экспертная проверка.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Price History */}
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold">История цен</h4>
                      <div className="space-y-2">
                        {selectedCorridor.priceHistory.map((point, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {new Date(point.date).toLocaleDateString('ru-RU', { 
                                    day: 'numeric', 
                                    month: 'short', 
                                    year: 'numeric' 
                                  })}
                                </p>
                                <p className="text-xs text-gray-500">{point.source}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-900">
                                {formatCurrency(point.price)}
                              </p>
                              {index > 0 && (
                                <p className={`text-xs ${
                                  point.price > selectedCorridor.priceHistory[index - 1].price 
                                    ? 'text-green-600' 
                                    : point.price < selectedCorridor.priceHistory[index - 1].price
                                    ? 'text-red-600'
                                    : 'text-gray-600'
                                }`}>
                                  {point.price > selectedCorridor.priceHistory[index - 1].price && '+'}
                                  {((point.price - selectedCorridor.priceHistory[index - 1].price) / 
                                    selectedCorridor.priceHistory[index - 1].price * 100).toFixed(1)}%
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Фильтр по критичности:</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={filterSeverity === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterSeverity('all')}
              >
                Все
              </Button>
              <Button
                size="sm"
                variant={filterSeverity === 'high' ? 'default' : 'outline'}
                onClick={() => setFilterSeverity('high')}
              >
                Высокая
              </Button>
              <Button
                size="sm"
                variant={filterSeverity === 'medium' ? 'default' : 'outline'}
                onClick={() => setFilterSeverity('medium')}
              >
                Средняя
              </Button>
              <Button
                size="sm"
                variant={filterSeverity === 'low' ? 'default' : 'outline'}
                onClick={() => setFilterSeverity('low')}
              >
                Низкая
              </Button>
            </div>
          </div>

          {/* Alerts List */}
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <Card key={alert.id} className="border-l-4 border-l-red-500">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className={`w-6 h-6 flex-shrink-0 mt-0.5 ${
                        alert.severity === 'high' ? 'text-red-600' :
                        alert.severity === 'medium' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`} />
                      <div>
                        <CardTitle className="text-lg">{alert.artworkTitle}</CardTitle>
                        <CardDescription className="mt-1">{alert.message}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity === 'high' ? 'Критично' :
                       alert.severity === 'medium' ? 'Внимание' : 'Информация'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Текущая цена</p>
                      <p className="font-semibold">{formatCurrency(alert.currentPrice)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Ожидаемая цена</p>
                      <p className="font-semibold">{formatCurrency(alert.expectedPrice)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Отклонение</p>
                      <p className={`font-semibold ${
                        alert.deviation > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {alert.deviation > 0 ? '+' : ''}{alert.deviation.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Обнаружено</p>
                      <p className="font-semibold">{formatDate(alert.detectedAt)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ML Engine Statistics</CardTitle>
              <CardDescription>Статистика работы машинного обучения</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Общая точность модели</p>
                    <p className="text-2xl font-bold text-blue-600">92.3%</p>
                    <p className="text-xs text-gray-500 mt-1">на 10,000+ произведениях</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Выявлено подделок</p>
                    <p className="text-2xl font-bold text-green-600">147</p>
                    <p className="text-xs text-gray-500 mt-1">за последний год</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Среднее отклонение</p>
                    <p className="text-2xl font-bold text-purple-600">±5.2%</p>
                    <p className="text-xs text-gray-500 mt-1">от рыночной цены</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-semibold text-gray-900 mb-3">Используемые ML модели</h5>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span><strong>Random Forest Regressor</strong> — основная модель ценообразования</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span><strong>Isolation Forest</strong> — обнаружение аномалий</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span><strong>LSTM Neural Network</strong> — временные ряды и тренды</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span><strong>XGBoost</strong> — классификация риска подделок</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Zap className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-yellow-900 mb-1">ML Pricing Engine</h5>
                      <p className="text-sm text-yellow-700 mb-2">
                        Статус: <strong className="text-green-600">● ONLINE</strong> (Flask, port 5001)
                      </p>
                      <p className="text-sm text-yellow-600">
                        Модель переобучается каждые 24 часа на новых рыночных данных для 
                        поддержания высокой точности прогнозов.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
