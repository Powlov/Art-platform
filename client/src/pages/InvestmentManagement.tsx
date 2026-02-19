import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Download,
  Eye,
  Plus,
  Minus,
  RefreshCw,
  Info,
  Shield,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLocation } from 'wouter';

interface Investment {
  id: number;
  artworkId: number;
  artworkTitle: string;
  artist: string;
  artworkImage: string;
  investmentDate: string;
  initialPrice: number;
  currentPrice: number;
  shares: number;
  totalInvested: number;
  currentValue: number;
  roi: number;
  performance: 'positive' | 'negative' | 'neutral';
  riskLevel: 'low' | 'medium' | 'high';
  category: string;
}

interface PortfolioStats {
  totalValue: number;
  totalInvested: number;
  totalProfit: number;
  avgRoi: number;
  activeInvestments: number;
  topPerformer: string;
  worstPerformer: string;
}

interface MarketOpportunity {
  id: number;
  artworkTitle: string;
  artist: string;
  artworkImage: string;
  currentPrice: number;
  projectedGrowth: number;
  riskLevel: 'low' | 'medium' | 'high';
  category: string;
  matchScore: number;
  reason: string;
}

export default function InvestmentManagement() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const [showSellDialog, setShowSellDialog] = useState(false);
  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');

  // Mock data
  const stats: PortfolioStats = {
    totalValue: 2450000,
    totalInvested: 2000000,
    totalProfit: 450000,
    avgRoi: 22.5,
    activeInvestments: 12,
    topPerformer: 'Абстракция №5',
    worstPerformer: 'Городской пейзаж',
  };

  const investments: Investment[] = [
    {
      id: 1,
      artworkId: 101,
      artworkTitle: 'Абстракция №5',
      artist: 'Мария Петрова',
      artworkImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
      investmentDate: '2025-01-15',
      initialPrice: 150000,
      currentPrice: 195000,
      shares: 2,
      totalInvested: 300000,
      currentValue: 390000,
      roi: 30,
      performance: 'positive',
      riskLevel: 'low',
      category: 'Современное искусство',
    },
    {
      id: 2,
      artworkId: 102,
      artworkTitle: 'Морской бриз',
      artist: 'Игорь Соколов',
      artworkImage: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800',
      investmentDate: '2024-11-20',
      initialPrice: 200000,
      currentPrice: 245000,
      shares: 1,
      totalInvested: 200000,
      currentValue: 245000,
      roi: 22.5,
      performance: 'positive',
      riskLevel: 'medium',
      category: 'Живопись',
    },
    {
      id: 3,
      artworkId: 103,
      artworkTitle: 'Городской ритм',
      artist: 'Анна Волкова',
      artworkImage: 'https://images.unsplash.com/photo-1577083552431-6e5fd01d3276?w=800',
      investmentDate: '2025-02-01',
      initialPrice: 120000,
      currentPrice: 108000,
      shares: 1,
      totalInvested: 120000,
      currentValue: 108000,
      roi: -10,
      performance: 'negative',
      riskLevel: 'high',
      category: 'Графика',
    },
  ];

  const opportunities: MarketOpportunity[] = [
    {
      id: 1,
      artworkTitle: 'Закатная симфония',
      artist: 'Дмитрий Новиков',
      artworkImage: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800',
      currentPrice: 180000,
      projectedGrowth: 35,
      riskLevel: 'low',
      category: 'Современное искусство',
      matchScore: 95,
      reason: 'Художник активно растёт, работы регулярно продаются на аукционах',
    },
    {
      id: 2,
      artworkTitle: 'Геометрия мысли',
      artist: 'Елена Кузнецова',
      artworkImage: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800',
      currentPrice: 250000,
      projectedGrowth: 28,
      riskLevel: 'medium',
      category: 'Абстракция',
      matchScore: 88,
      reason: 'Работы художника показывают стабильный рост цены',
    },
    {
      id: 3,
      artworkTitle: 'Ночной город',
      artist: 'Сергей Михайлов',
      artworkImage: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800',
      currentPrice: 95000,
      projectedGrowth: 45,
      riskLevel: 'high',
      category: 'Фотография',
      matchScore: 75,
      reason: 'Молодой художник с потенциалом, высокий риск и доходность',
    },
  ];

  const handleBuy = (investment: Investment) => {
    setSelectedInvestment(investment);
    setShowBuyDialog(true);
  };

  const handleSell = (investment: Investment) => {
    setSelectedInvestment(investment);
    setShowSellDialog(true);
  };

  const confirmBuy = () => {
    console.log('Buying shares:', buyAmount);
    setShowBuyDialog(false);
    setBuyAmount('');
  };

  const confirmSell = () => {
    console.log('Selling shares:', sellAmount);
    setShowSellDialog(false);
    setSellAmount('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <Navigation user={user} onLogout={logout} />

      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            Управление инвестициями
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Отслеживайте и управляйте своим арт-портфелем
          </p>
        </motion.div>

        {/* Portfolio Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="border-2 border-transparent hover:border-green-500 transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Общая стоимость
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                ₽{stats.totalValue.toLocaleString()}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-2">
                <ArrowUpRight className="w-3 h-3" />
                +{((stats.totalValue - stats.totalInvested) / stats.totalInvested * 100).toFixed(1)}% от начальной
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-transparent hover:border-blue-500 transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Средний ROI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.avgRoi}%
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                По всем инвестициям
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-transparent hover:border-purple-500 transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Прибыль
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                +₽{stats.totalProfit.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Нереализованная прибыль
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-transparent hover:border-orange-500 transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                Активные инвестиции
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.activeInvestments}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Произведений в портфеле
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="overview">Обзор</TabsTrigger>
              <TabsTrigger value="portfolio">Портфель</TabsTrigger>
              <TabsTrigger value="opportunities">Возможности</TabsTrigger>
              <TabsTrigger value="analytics">Аналитика</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="w-5 h-5" />
                      Динамика портфеля
                    </CardTitle>
                    <CardDescription>
                      Изменение стоимости за последние 6 месяцев
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                      <div className="text-center">
                        <LineChart className="w-16 h-16 mx-auto text-green-500 mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">
                          График будет здесь
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Asset Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5" />
                      Распределение активов
                    </CardTitle>
                    <CardDescription>
                      По категориям искусства
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Современное искусство</span>
                          <span className="text-sm font-medium">45%</span>
                        </div>
                        <Progress value={45} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Живопись</span>
                          <span className="text-sm font-medium">30%</span>
                        </div>
                        <Progress value={30} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Графика</span>
                          <span className="text-sm font-medium">15%</span>
                        </div>
                        <Progress value={15} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Фотография</span>
                          <span className="text-sm font-medium">10%</span>
                        </div>
                        <Progress value={10} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Performers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Лучшие и худшие инвестиции
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <h3 className="font-semibold text-green-900 dark:text-green-300">
                          Лучшая инвестиция
                        </h3>
                      </div>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {stats.topPerformer}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ROI: +30%
                      </p>
                    </div>

                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="w-5 h-5 text-red-600" />
                        <h3 className="font-semibold text-red-900 dark:text-red-300">
                          Требует внимания
                        </h3>
                      </div>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {stats.worstPerformer}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ROI: -10%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Portfolio Tab */}
            <TabsContent value="portfolio" className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Мои инвестиции
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {investments.length} активных позиций
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Фильтры
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Экспорт
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {investments.map((investment) => (
                  <Card key={investment.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <img
                          src={investment.artworkImage}
                          alt={investment.artworkTitle}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {investment.artworkTitle}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {investment.artist}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Badge
                                variant={
                                  investment.performance === 'positive' ? 'default' :
                                  investment.performance === 'negative' ? 'destructive' : 'secondary'
                                }
                              >
                                {investment.roi > 0 ? '+' : ''}{investment.roi}%
                              </Badge>
                              <Badge
                                variant={
                                  investment.riskLevel === 'low' ? 'default' :
                                  investment.riskLevel === 'high' ? 'destructive' : 'secondary'
                                }
                              >
                                {investment.riskLevel === 'low' ? 'Низкий риск' :
                                 investment.riskLevel === 'high' ? 'Высокий риск' : 'Средний риск'}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                Инвестировано
                              </p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                ₽{investment.totalInvested.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                Текущая стоимость
                              </p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                ₽{investment.currentValue.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                Доли
                              </p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {investment.shares}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                Прибыль
                              </p>
                              <p className={`text-sm font-semibold ${
                                investment.roi > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {investment.roi > 0 ? '+' : ''}₽{(investment.currentValue - investment.totalInvested).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/artworks/${investment.artworkId}`)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Просмотр
                            </Button>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleBuy(investment)}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Докупить
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleSell(investment)}
                            >
                              <Minus className="w-4 h-4 mr-2" />
                              Продать
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Opportunities Tab */}
            <TabsContent value="opportunities" className="space-y-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Рекомендованные инвестиции
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  На основе вашего портфеля и рыночных трендов
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {opportunities.map((opportunity) => (
                  <Card key={opportunity.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <img
                      src={opportunity.artworkImage}
                      alt={opportunity.artworkTitle}
                      className="w-full h-48 object-cover"
                    />
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            {opportunity.artworkTitle}
                          </CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {opportunity.artist}
                          </p>
                        </div>
                        <Badge
                          variant={
                            opportunity.matchScore >= 90 ? 'default' :
                            opportunity.matchScore >= 80 ? 'secondary' : 'outline'
                          }
                        >
                          {opportunity.matchScore}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Цена
                          </span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            ₽{opportunity.currentPrice.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Прогноз роста
                          </span>
                          <span className="text-sm font-semibold text-green-600">
                            +{opportunity.projectedGrowth}%
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Риск
                          </span>
                          <Badge
                            variant={
                              opportunity.riskLevel === 'low' ? 'default' :
                              opportunity.riskLevel === 'high' ? 'destructive' : 'secondary'
                            }
                          >
                            {opportunity.riskLevel === 'low' ? 'Низкий' :
                             opportunity.riskLevel === 'high' ? 'Высокий' : 'Средний'}
                          </Badge>
                        </div>

                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2">
                            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            {opportunity.reason}
                          </p>
                        </div>

                        <Button className="w-full" onClick={() => navigate(`/artworks/${opportunity.id}`)}>
                          Подробнее
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Доходность по категориям</CardTitle>
                    <CardDescription>Средний ROI за последний год</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <span className="font-medium">Современное искусство</span>
                        <span className="text-green-600 font-bold">+28%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <span className="font-medium">Живопись</span>
                        <span className="text-blue-600 font-bold">+22%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <span className="font-medium">Графика</span>
                        <span className="text-yellow-600 font-bold">+15%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <span className="font-medium">Фотография</span>
                        <span className="text-purple-600 font-bold">+18%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Риск-профиль портфеля</CardTitle>
                    <CardDescription>Распределение по уровням риска</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm flex items-center gap-2">
                            <Shield className="w-4 h-4 text-green-500" />
                            Низкий риск
                          </span>
                          <span className="text-sm font-medium">50%</span>
                        </div>
                        <Progress value={50} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm flex items-center gap-2">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            Средний риск
                          </span>
                          <span className="text-sm font-medium">30%</span>
                        </div>
                        <Progress value={30} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            Высокий риск
                          </span>
                          <span className="text-sm font-medium">20%</span>
                        </div>
                        <Progress value={20} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Рекомендации по диверсификации</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg">
                      <p className="font-medium text-gray-900 dark:text-white mb-1">
                        Рассмотрите фотографию
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Ваш портфель содержит только 10% фотографии. Рекомендуем увеличить до 15-20%.
                      </p>
                    </div>
                    <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-r-lg">
                      <p className="font-medium text-gray-900 dark:text-white mb-1">
                        Отличная диверсификация
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Ваше распределение по современному искусству и живописи оптимально.
                      </p>
                    </div>
                    <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 rounded-r-lg">
                      <p className="font-medium text-gray-900 dark:text-white mb-1">
                        Следите за рисками
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        20% портфеля в высокорисковых активах. Убедитесь, что вы готовы к волатильности.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Buy Dialog */}
      <Dialog open={showBuyDialog} onOpenChange={setShowBuyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Докупить доли</DialogTitle>
            <DialogDescription>
              {selectedInvestment?.artworkTitle} - {selectedInvestment?.artist}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Текущая цена доли</Label>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₽{selectedInvestment?.currentPrice.toLocaleString()}
              </p>
            </div>
            <div>
              <Label htmlFor="buyAmount">Количество долей</Label>
              <Input
                id="buyAmount"
                type="number"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
                placeholder="1"
              />
            </div>
            {buyAmount && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Итого к оплате
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ₽{((selectedInvestment?.currentPrice || 0) * parseInt(buyAmount)).toLocaleString()}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBuyDialog(false)}>
              Отмена
            </Button>
            <Button onClick={confirmBuy}>
              Купить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sell Dialog */}
      <Dialog open={showSellDialog} onOpenChange={setShowSellDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Продать доли</DialogTitle>
            <DialogDescription>
              {selectedInvestment?.artworkTitle} - {selectedInvestment?.artist}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Текущая цена доли</Label>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₽{selectedInvestment?.currentPrice.toLocaleString()}
              </p>
            </div>
            <div>
              <Label htmlFor="sellAmount">Количество долей</Label>
              <Input
                id="sellAmount"
                type="number"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
                placeholder="1"
                max={selectedInvestment?.shares}
              />
              <p className="text-xs text-gray-500 mt-1">
                У вас {selectedInvestment?.shares} долей
              </p>
            </div>
            {sellAmount && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Вы получите
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ₽{((selectedInvestment?.currentPrice || 0) * parseInt(sellAmount)).toLocaleString()}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSellDialog(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={confirmSell}>
              Продать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
