import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  Calculator,
  Sparkles,
  Target,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Image as ImageIcon,
  Upload,
  Search,
  Filter,
  Download,
  RefreshCw,
  Info,
  ArrowRight,
  TrendingDown,
  Award,
  Globe,
  Calendar,
  Package,
  Eye,
  Heart,
  Share2,
  Lock,
  Unlock,
  Zap,
  Brain,
  LineChart,
  PieChart,
  Settings,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';

// Математическая модель ценообразования из документа pricing_model_document.md.pdf

interface PricingFactors {
  // Базовая стоимость (V₀) - определяется на основе сопоставимых продаж
  baseValue: number;
  
  // Корректировки (ΣΔVᵢ)
  sizeAdjustment: number;      // размер работы
  conditionAdjustment: number;  // состояние
  provenanceAdjustment: number; // происхождение
  materialAdjustment: number;   // материалы
  
  // Коэффициенты премий (R_f, R_a, R_m, R_c)
  fundamentalPremium: number;   // R_f - фундаментальная премия
  attributivePremium: number;   // R_a - атрибутивная премия
  marketPremium: number;        // R_m - рыночная премия
  conjuncturalPremium: number;  // R_c - конъюнктурная премия
}

interface CascadeCoefficients {
  // Коэффициенты влияния из документа (стр. 5-6)
  alpha_artist: number;    // 0.05 (5%)
  alpha_segment: number;   // 0.02 (2%)
  alpha_collector: number; // 0.01 (1%)
  
  // Множители переоценки
  M_self: number;          // 0.10 (10%) - собственная переоценка после продажи
  C_direct: number;        // 0.03 (3%) - базовый сигнал для связанных активов
}

interface MarketRevaluation {
  // Периодическая переоценка рынка (стр. 9-10)
  weekly_beta: number;     // β_weekly = 0.2
  monthly_gamma: number;   // γ = 0.05 (влияние дисбаланса спроса/предложения)
  K_demand: number;        // (Bids/Listings) × (Sales_Volume/Asking_Volume)
}

interface PricingResult {
  artworkId: number;
  title: string;
  artist: string;
  currentPrice: number;
  estimatedPrice: number;
  confidence: number;
  priceChange: number;
  factors: PricingFactors;
  cascadeImpact: number;
  marketTrend: 'rising' | 'stable' | 'falling';
  lastUpdated: string;
}

interface ArtworkData {
  id: number;
  title: string;
  artist: string;
  image: string;
  category: string;
  year: number;
  size: string;
  condition: string;
  provenance: string;
  currentPrice: number;
  comparableSales: number[];
}

const AIPricingEngine: React.FC = () => {
  const [activeTab, setActiveTab] = useState('calculator');
  const [loading, setLoading] = useState(false);
  
  // Коэффициенты каскадной переоценки из документа
  const cascadeCoefficients: CascadeCoefficients = {
    alpha_artist: 0.05,    // 5% влияние художника
    alpha_segment: 0.02,   // 2% влияние сегмента
    alpha_collector: 0.01, // 1% влияние коллекционера
    M_self: 0.10,          // 10% собственная переоценка
    C_direct: 0.03,        // 3% базовый сигнал
  };
  
  // Коэффициенты периодической переоценки
  const marketRevaluation: MarketRevaluation = {
    weekly_beta: 0.2,      // β для недельного обновления R_m
    monthly_gamma: 0.05,   // γ для месячной корректировки V₀
    K_demand: 1.15,        // пример: дисбаланс спроса/предложения
  };

  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkData | null>(null);
  const [pricingResult, setPricingResult] = useState<PricingResult | null>(null);
  
  const [pricingFactors, setPricingFactors] = useState<PricingFactors>({
    baseValue: 0,
    sizeAdjustment: 0,
    conditionAdjustment: 0,
    provenanceAdjustment: 0,
    materialAdjustment: 0,
    fundamentalPremium: 0.05,
    attributivePremium: 0.03,
    marketPremium: 0.02,
    conjuncturalPremium: 0.01,
  });

  // Mock данные для тестирования
  const mockArtworks: ArtworkData[] = [
    {
      id: 1,
      title: 'Абстрактная композиция',
      artist: 'Василий Кандинский',
      image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=400',
      category: 'Абстракционизм',
      year: 1923,
      size: '100x80 см',
      condition: 'Отличное',
      provenance: 'Галерея «Третьяковская»',
      currentPrice: 15000000,
      comparableSales: [14500000, 15200000, 14800000, 16000000],
    },
    {
      id: 2,
      title: 'Натюрморт с фруктами',
      artist: 'Казимир Малевич',
      image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400',
      category: 'Супрематизм',
      year: 1915,
      size: '80x60 см',
      condition: 'Хорошее',
      provenance: 'Частная коллекция',
      currentPrice: 25000000,
      comparableSales: [24000000, 26500000, 23800000, 27000000],
    },
    {
      id: 3,
      title: 'Городской пейзаж',
      artist: 'Марк Шагал',
      image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=400',
      category: 'Авангард',
      year: 1930,
      size: '120x90 см',
      condition: 'Отличное',
      provenance: 'Галерея «Эрмитаж»',
      currentPrice: 35000000,
      comparableSales: [33000000, 36500000, 34200000, 38000000],
    },
  ];

  const [recentPricings, setRecentPricings] = useState<PricingResult[]>([
    {
      artworkId: 1,
      title: 'Абстрактная композиция',
      artist: 'Василий Кандинский',
      currentPrice: 15000000,
      estimatedPrice: 16750000,
      confidence: 92,
      priceChange: 11.67,
      factors: pricingFactors,
      cascadeImpact: 0.05,
      marketTrend: 'rising',
      lastUpdated: '2026-02-17T10:30:00',
    },
    {
      artworkId: 2,
      title: 'Натюрморт с фруктами',
      artist: 'Казимир Малевич',
      currentPrice: 25000000,
      estimatedPrice: 27875000,
      confidence: 88,
      priceChange: 11.50,
      factors: pricingFactors,
      cascadeImpact: 0.03,
      marketTrend: 'rising',
      lastUpdated: '2026-02-17T09:15:00',
    },
    {
      artworkId: 3,
      title: 'Городской пейзаж',
      artist: 'Марк Шагал',
      currentPrice: 35000000,
      estimatedPrice: 39025000,
      confidence: 95,
      priceChange: 11.50,
      factors: pricingFactors,
      cascadeImpact: 0.04,
      marketTrend: 'stable',
      lastUpdated: '2026-02-17T08:00:00',
    },
  ]);

  // Основная формула ценообразования из документа (стр. 3):
  // P = (V₀ + ΣΔVᵢ) × (1 + R_f + R_a + R_m + R_c)
  const calculatePrice = (factors: PricingFactors): number => {
    const { baseValue, sizeAdjustment, conditionAdjustment, provenanceAdjustment, materialAdjustment } = factors;
    const { fundamentalPremium, attributivePremium, marketPremium, conjuncturalPremium } = factors;
    
    // V₀ + ΣΔVᵢ
    const adjustedValue = baseValue + sizeAdjustment + conditionAdjustment + provenanceAdjustment + materialAdjustment;
    
    // 1 + R_f + R_a + R_m + R_c
    const premiumMultiplier = 1 + fundamentalPremium + attributivePremium + marketPremium + conjuncturalPremium;
    
    // P = (V₀ + ΣΔVᵢ) × (1 + R_f + R_a + R_m + R_c)
    return adjustedValue * premiumMultiplier;
  };

  // Каскадная переоценка связанных работ (стр. 5-7)
  const calculateCascadeRevaluation = (
    soldPrice: number,
    oldPrice: number,
    relationshipFactors: { artist: number; segment: number; collector: number },
    relatedArtworkPrice: number
  ): number => {
    // Множитель влияния: M = (P_k_final / P_k_old) - 1
    const impactMultiplier = (soldPrice / oldPrice) - 1;
    
    // Переоценка связанной работы:
    // ΔV_i = [(α_artist·I_artist) + (α_segment·I_segment) + (α_collector·I_collector)] × C_direct × P_i_old
    const weightedRelationship = 
      (cascadeCoefficients.alpha_artist * relationshipFactors.artist) +
      (cascadeCoefficients.alpha_segment * relationshipFactors.segment) +
      (cascadeCoefficients.alpha_collector * relationshipFactors.collector);
    
    const revaluation = weightedRelationship * cascadeCoefficients.C_direct * relatedArtworkPrice;
    
    return revaluation;
  };

  // Недельная переоценка рыночной премии R_m (стр. 9)
  const calculateWeeklyMarketPremium = (priceChangePercent: number): number => {
    // ΔR_m = β_weekly × ((Σ(P_i_final·w_i) / Σ(P_i_start·w_i)) - 1)
    // Пример: 1% рост цен → ΔR_m = 0.002 (0.2 pp)
    return marketRevaluation.weekly_beta * (priceChangePercent / 100);
  };

  // Расчёт оценки для выбранного произведения
  const handleCalculatePrice = () => {
    if (!selectedArtwork) return;
    
    setLoading(true);
    
    setTimeout(() => {
      // Базовая стоимость V₀ - среднее сопоставимых продаж
      const baseValue = selectedArtwork.comparableSales.reduce((a, b) => a + b, 0) / selectedArtwork.comparableSales.length;
      
      // Корректировки ΔVᵢ
      const sizeAdjustment = 500000; // корректировка на размер
      const conditionAdjustment = selectedArtwork.condition === 'Отличное' ? 1000000 : 
                                   selectedArtwork.condition === 'Хорошее' ? 500000 : 0;
      const provenanceAdjustment = selectedArtwork.provenance.includes('Галерея') ? 1500000 : 0;
      const materialAdjustment = 300000;
      
      const updatedFactors: PricingFactors = {
        baseValue,
        sizeAdjustment,
        conditionAdjustment,
        provenanceAdjustment,
        materialAdjustment,
        fundamentalPremium: 0.05,
        attributivePremium: 0.03,
        marketPremium: 0.02,
        conjuncturalPremium: 0.01,
      };
      
      setPricingFactors(updatedFactors);
      
      const estimatedPrice = calculatePrice(updatedFactors);
      const priceChange = ((estimatedPrice - selectedArtwork.currentPrice) / selectedArtwork.currentPrice) * 100;
      
      // Каскадное влияние (пример)
      const cascadeImpact = calculateCascadeRevaluation(
        estimatedPrice,
        selectedArtwork.currentPrice,
        { artist: 1, segment: 0.8, collector: 0.5 },
        selectedArtwork.currentPrice
      );
      
      const result: PricingResult = {
        artworkId: selectedArtwork.id,
        title: selectedArtwork.title,
        artist: selectedArtwork.artist,
        currentPrice: selectedArtwork.currentPrice,
        estimatedPrice,
        confidence: 90 + Math.random() * 10,
        priceChange,
        factors: updatedFactors,
        cascadeImpact: (cascadeImpact / selectedArtwork.currentPrice) * 100,
        marketTrend: priceChange > 5 ? 'rising' : priceChange < -5 ? 'falling' : 'stable',
        lastUpdated: new Date().toISOString(),
      };
      
      setPricingResult(result);
      setRecentPricings(prev => [result, ...prev.slice(0, 9)]);
      setLoading(false);
    }, 1500);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // Статистика модели
  const modelStats = [
    {
      label: 'Всего оценок',
      value: '12,847',
      icon: Calculator,
      trend: '+15%',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Средняя точность',
      value: '91.5%',
      icon: Target,
      trend: '+2.3%',
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Активных моделей',
      value: '8',
      icon: Brain,
      trend: '+2',
      color: 'from-green-500 to-emerald-500',
    },
    {
      label: 'Рыночная премия R_m',
      value: '+2.0%',
      icon: TrendingUp,
      trend: '+0.2pp',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <Navigation user={{ id: 1, name: 'Admin', email: 'admin@artbank.ru', role: 'admin' }} />
      <Header
        title="AI Pricing Engine"
        subtitle="Интеллектуальная система ценообразования произведений искусства"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Model Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-6 h-6" />
                <h3 className="text-xl font-bold">Математическая модель ART BANK</h3>
              </div>
              <p className="text-purple-100 mb-3">
                Основана на научной методологии оценки стоимости произведений искусства
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  <span>P = (V₀ + ΣΔVᵢ) × (1 + R_f + R_a + R_m + R_c)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  <span>Каскадная переоценка: α_artist = 5%, α_segment = 2%</span>
                </div>
                <div className="flex items-center gap-2">
                  <LineChart className="w-4 h-4" />
                  <span>Недельное обновление R_m: β = 0.2</span>
                </div>
              </div>
            </div>
            <Badge className="bg-white/20 text-white border-0">
              v3.36.0
            </Badge>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {modelStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden hover:shadow-lg transition-all">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`}></div>
                <CardContent className="p-6 relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {stat.trend}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="calculator">
              <Calculator className="w-4 h-4 mr-2" />
              Калькулятор
            </TabsTrigger>
            <TabsTrigger value="history">
              <Clock className="w-4 h-4 mr-2" />
              История оценок
            </TabsTrigger>
            <TabsTrigger value="model">
              <Brain className="w-4 h-4 mr-2" />
              Модель и формулы
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Аналитика
            </TabsTrigger>
          </TabsList>

          {/* Calculator Tab */}
          <TabsContent value="calculator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Artwork Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Выбор произведения
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockArtworks.map((artwork) => (
                    <motion.div
                      key={artwork.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedArtwork(artwork)}
                      className={`
                        p-4 rounded-xl border-2 cursor-pointer transition-all
                        ${selectedArtwork?.id === artwork.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                        }
                      `}
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={artwork.image}
                          alt={artwork.title}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{artwork.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{artwork.artist}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {artwork.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {artwork.year}
                            </Badge>
                          </div>
                          <p className="text-sm font-semibold text-purple-600 mt-2">
                            {formatCurrency(artwork.currentPrice)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {selectedArtwork && (
                    <Button
                      onClick={handleCalculatePrice}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Расчёт...
                        </>
                      ) : (
                        <>
                          <Calculator className="w-4 h-4 mr-2" />
                          Рассчитать оценку
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Pricing Result */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Результат оценки
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pricingResult ? (
                    <div className="space-y-6">
                      {/* Price Comparison */}
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Текущая цена</p>
                            <p className="text-xl font-bold text-gray-900">
                              {formatCurrency(pricingResult.currentPrice)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Оценочная цена</p>
                            <p className="text-xl font-bold text-purple-600">
                              {formatCurrency(pricingResult.estimatedPrice)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {pricingResult.priceChange > 0 ? (
                              <TrendingUp className="w-5 h-5 text-green-600" />
                            ) : (
                              <TrendingDown className="w-5 h-5 text-red-600" />
                            )}
                            <span className={`text-lg font-semibold ${
                              pricingResult.priceChange > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {formatPercent(pricingResult.priceChange)}
                            </span>
                          </div>
                          <Badge className={`
                            ${pricingResult.marketTrend === 'rising' ? 'bg-green-100 text-green-700' :
                              pricingResult.marketTrend === 'falling' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }
                          `}>
                            {pricingResult.marketTrend === 'rising' ? 'Рост' :
                             pricingResult.marketTrend === 'falling' ? 'Падение' : 'Стабильно'}
                          </Badge>
                        </div>
                      </div>

                      {/* Confidence Score */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-gray-700">Уверенность модели</p>
                          <span className="text-sm font-semibold text-purple-600">
                            {pricingResult.confidence.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={pricingResult.confidence} className="h-2" />
                      </div>

                      {/* Pricing Factors Breakdown */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <Info className="w-4 h-4" />
                          Факторы ценообразования
                        </h4>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Базовая стоимость (V₀)</span>
                            <span className="font-semibold">{formatCurrency(pricingResult.factors.baseValue)}</span>
                          </div>
                          
                          <div className="border-t border-gray-200 pt-2 mt-2">
                            <p className="text-xs text-gray-500 mb-2">Корректировки (ΣΔVᵢ):</p>
                            <div className="flex justify-between items-center ml-4">
                              <span className="text-gray-600">• Размер</span>
                              <span className="font-semibold">{formatCurrency(pricingResult.factors.sizeAdjustment)}</span>
                            </div>
                            <div className="flex justify-between items-center ml-4">
                              <span className="text-gray-600">• Состояние</span>
                              <span className="font-semibold">{formatCurrency(pricingResult.factors.conditionAdjustment)}</span>
                            </div>
                            <div className="flex justify-between items-center ml-4">
                              <span className="text-gray-600">• Происхождение</span>
                              <span className="font-semibold">{formatCurrency(pricingResult.factors.provenanceAdjustment)}</span>
                            </div>
                            <div className="flex justify-between items-center ml-4">
                              <span className="text-gray-600">• Материалы</span>
                              <span className="font-semibold">{formatCurrency(pricingResult.factors.materialAdjustment)}</span>
                            </div>
                          </div>

                          <div className="border-t border-gray-200 pt-2 mt-2">
                            <p className="text-xs text-gray-500 mb-2">Премии (R_f + R_a + R_m + R_c):</p>
                            <div className="flex justify-between items-center ml-4">
                              <span className="text-gray-600">• Фундаментальная (R_f)</span>
                              <span className="font-semibold">{formatPercent(pricingResult.factors.fundamentalPremium * 100)}</span>
                            </div>
                            <div className="flex justify-between items-center ml-4">
                              <span className="text-gray-600">• Атрибутивная (R_a)</span>
                              <span className="font-semibold">{formatPercent(pricingResult.factors.attributivePremium * 100)}</span>
                            </div>
                            <div className="flex justify-between items-center ml-4">
                              <span className="text-gray-600">• Рыночная (R_m)</span>
                              <span className="font-semibold">{formatPercent(pricingResult.factors.marketPremium * 100)}</span>
                            </div>
                            <div className="flex justify-between items-center ml-4">
                              <span className="text-gray-600">• Конъюнктурная (R_c)</span>
                              <span className="font-semibold">{formatPercent(pricingResult.factors.conjuncturalPremium * 100)}</span>
                            </div>
                          </div>

                          <div className="border-t border-gray-200 pt-2 mt-2">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Каскадное влияние</span>
                              <span className="font-semibold text-purple-600">
                                {formatPercent(pricingResult.cascadeImpact)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">
                          <Download className="w-4 h-4 mr-2" />
                          Скачать отчёт
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Share2 className="w-4 h-4 mr-2" />
                          Поделиться
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calculator className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600">
                        Выберите произведение и нажмите "Рассчитать оценку"
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    История оценок
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Фильтры
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPricings.map((pricing, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 border border-gray-200 rounded-xl hover:border-purple-300 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{pricing.title}</h4>
                          <p className="text-sm text-gray-600">{pricing.artist}</p>
                        </div>
                        <Badge className={`
                          ${pricing.marketTrend === 'rising' ? 'bg-green-100 text-green-700' :
                            pricing.marketTrend === 'falling' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }
                        `}>
                          {pricing.marketTrend === 'rising' ? 'Рост' :
                           pricing.marketTrend === 'falling' ? 'Падение' : 'Стабильно'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Текущая</p>
                          <p className="text-sm font-semibold">{formatCurrency(pricing.currentPrice)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Оценочная</p>
                          <p className="text-sm font-semibold text-purple-600">{formatCurrency(pricing.estimatedPrice)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Изменение</p>
                          <p className={`text-sm font-semibold ${
                            pricing.priceChange > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatPercent(pricing.priceChange)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-4">
                          <span>Уверенность: {pricing.confidence.toFixed(1)}%</span>
                          <span>Каскад: {formatPercent(pricing.cascadeImpact)}</span>
                        </div>
                        <span>{new Date(pricing.lastUpdated).toLocaleString('ru-RU')}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Model & Formulas Tab */}
          <TabsContent value="model" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Математическая модель ценообразования
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Main Formula */}
                <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
                  <h3 className="text-lg font-semibold mb-4">Основная формула (стр. 3 документа)</h3>
                  <div className="bg-white p-4 rounded-lg font-mono text-center text-lg mb-4">
                    P = (V₀ + ΣΔVᵢ) × (1 + R_f + R_a + R_m + R_c)
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-semibold mb-2">Компоненты базовой стоимости:</p>
                      <ul className="space-y-1 text-gray-700">
                        <li>• V₀ — базовая стоимость (сопоставимые продажи)</li>
                        <li>• ΔV_size — корректировка на размер</li>
                        <li>• ΔV_condition — корректировка на состояние</li>
                        <li>• ΔV_provenance — корректировка на происхождение</li>
                        <li>• ΔV_material — корректировка на материалы</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">Премиальные коэффициенты:</p>
                      <ul className="space-y-1 text-gray-700">
                        <li>• R_f — фундаментальная премия (репутация)</li>
                        <li>• R_a — атрибутивная премия (характеристики)</li>
                        <li>• R_m — рыночная премия (тренды)</li>
                        <li>• R_c — конъюнктурная премия (события)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Cascade Revaluation */}
                <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <h3 className="text-lg font-semibold mb-4">Каскадная переоценка (стр. 5-7)</h3>
                  <div className="bg-white p-4 rounded-lg font-mono text-sm text-center mb-4">
                    ΔV_i = [(α_artist·I_artist) + (α_segment·I_segment) + (α_collector·I_collector)] × C_direct × P_i_old
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Влияние художника</p>
                      <p className="text-2xl font-bold text-green-600">α_artist = 5%</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Влияние сегмента</p>
                      <p className="text-2xl font-bold text-green-600">α_segment = 2%</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Влияние коллекционера</p>
                      <p className="text-2xl font-bold text-green-600">α_collector = 1%</p>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-white rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Множитель собственной переоценки:</strong> M_self = 10% (после продажи произведения)
                    </p>
                    <p className="text-sm text-gray-700 mt-2">
                      <strong>Базовый сигнал для связанных активов:</strong> C_direct = 3%
                    </p>
                  </div>
                </div>

                {/* Periodic Revaluation */}
                <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                  <h3 className="text-lg font-semibold mb-4">Периодическая переоценка (стр. 9-10)</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg">
                      <p className="font-semibold mb-2">Недельное обновление R_m:</p>
                      <div className="font-mono text-sm mb-2">
                        ΔR_m = β_weekly × ((Σ(P_i_final·w_i) / Σ(P_i_start·w_i)) - 1)
                      </div>
                      <p className="text-sm text-gray-700">
                        β_weekly = <strong>0.2</strong> (20% влияние недельных изменений)
                      </p>
                      <p className="text-xs text-gray-600 mt-2">
                        Пример: 1% рост цен → ΔR_m = 0.002 (0.2 процентных пункта)
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg">
                      <p className="font-semibold mb-2">Месячная корректировка V₀:</p>
                      <div className="font-mono text-sm mb-2">
                        K_demand = (Bids/Listings) × (Sales_Volume/Asking_Volume)
                      </div>
                      <p className="text-sm text-gray-700">
                        γ = <strong>0.05</strong> (5% влияние дисбаланса спроса/предложения)
                      </p>
                      <p className="text-xs text-gray-600 mt-2">
                        Скользящее среднее последних продаж с учётом K_demand
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg">
                      <p className="font-semibold mb-2">Годовая и 5-летняя калибровка:</p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Многофакторная регрессия всех коэффициентов</li>
                        <li>• Индекс культурного воздействия</li>
                        <li>• Исторический доход искусства: ~11.5% годовых</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Model Performance */}
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <h3 className="text-lg font-semibold mb-4">Производительность модели</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg text-center">
                      <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-600">91.5%</p>
                      <p className="text-sm text-gray-600">Средняя точность</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg text-center">
                      <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-600">12,847</p>
                      <p className="text-sm text-gray-600">Всего оценок</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg text-center">
                      <Brain className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-600">8</p>
                      <p className="text-sm text-gray-600">Активных моделей</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="w-5 h-5" />
                    Динамика точности модели
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">График точности модели по времени</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Распределение по категориям
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Круговая диаграмма категорий</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Рыночная премия R_m
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">График изменения R_m</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Каскадное влияние
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Диаграмма каскадных эффектов</p>
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

export default AIPricingEngine;
