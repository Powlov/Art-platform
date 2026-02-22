import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Database,
  Network,
  Brain,
  Shield,
  Building,
  Package,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Zap,
  Lock,
  Unlock,
  Eye,
  BarChart3,
  GitBranch,
  Cpu,
  Server,
  Layers,
  FileText,
  Users,
  DollarSign,
  Award,
  Target,
  Radio,
  Link as LinkIcon,
  ArrowRight,
  Clock,
  ThermometerSun,
  MapPin,
  Globe,
  Calendar,
  Download,
  Share2,
  Settings,
  RefreshCw,
  Info,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';

interface CoreModule {
  id: string;
  name: string;
  status: 'active' | 'processing' | 'idle' | 'warning';
  uptime: string;
  requests: number;
  avgResponseTime: number;
  icon: any;
  color: string;
}

interface GraphNode {
  id: string;
  type: 'artist' | 'gallery' | 'artwork' | 'collector' | 'transaction';
  name: string;
  connections: number;
  trustScore: number;
  verified: boolean;
}

interface MLValuation {
  artworkId: string;
  title: string;
  artist: string;
  currentPrice: number;
  fairValue: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  factors: string[];
  lastUpdated: string;
}

interface FraudAlert {
  id: string;
  type: 'wash_trading' | 'price_manipulation' | 'fake_provenance' | 'anomaly';
  severity: 'high' | 'medium' | 'low';
  artworkId: string;
  description: string;
  timestamp: string;
  status: 'investigating' | 'resolved' | 'flagged';
}

interface BankingIntegration {
  bankId: string;
  bankName: string;
  status: 'connected' | 'pending' | 'error';
  loanVolume: number;
  avgLTV: number;
  activeLoans: number;
  lastSync: string;
}

const TransactionLedCore: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [systemMetrics, setSystemMetrics] = useState<any>(null);

  // Загрузка метрик системы при монтировании
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/core/health');
        const data = await response.json();
        console.log('Core health:', data);
      } catch (error) {
        console.error('Failed to fetch core metrics:', error);
      }
    };
    fetchMetrics();
  }, []);

  // Core Modules Status
  const coreModules: CoreModule[] = [
    {
      id: 'graph-trust',
      name: 'Graph Trust',
      status: 'active',
      uptime: '99.98%',
      requests: 145789,
      avgResponseTime: 12,
      icon: Network,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'ml-valuation',
      name: 'ML-Valuation Engine',
      status: 'processing',
      uptime: '99.95%',
      requests: 89456,
      avgResponseTime: 245,
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'anti-fraud',
      name: 'Anti-Fraud Guardian',
      status: 'active',
      uptime: '100%',
      requests: 234567,
      avgResponseTime: 8,
      icon: Shield,
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'banking-api',
      name: 'Banking API Bridge',
      status: 'active',
      uptime: '99.99%',
      requests: 56789,
      avgResponseTime: 15,
      icon: Building,
      color: 'from-orange-500 to-red-500',
    },
    {
      id: 'asset-custody',
      name: 'Asset Management',
      status: 'active',
      uptime: '99.97%',
      requests: 34567,
      avgResponseTime: 18,
      icon: Package,
      color: 'from-indigo-500 to-purple-500',
    },
  ];

  // System Stats
  const systemStats = [
    {
      label: 'Всего объектов в графе',
      value: '1.2M',
      change: '+12.5K',
      icon: Database,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Транзакций обработано',
      value: '560K',
      change: '+2.3K/день',
      icon: Activity,
      color: 'from-green-500 to-emerald-500',
    },
    {
      label: 'ML-оценок выполнено',
      value: '89K',
      change: '+340/час',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Банковских интеграций',
      value: '12',
      change: '+3',
      icon: Building,
      color: 'from-orange-500 to-red-500',
    },
  ];

  // Graph Nodes Sample
  const graphNodes: GraphNode[] = [
    {
      id: 'artist-1',
      type: 'artist',
      name: 'Василий Кандинский',
      connections: 347,
      trustScore: 98.5,
      verified: true,
    },
    {
      id: 'gallery-1',
      type: 'gallery',
      name: 'Третьяковская галерея',
      connections: 1234,
      trustScore: 99.8,
      verified: true,
    },
    {
      id: 'artwork-1',
      type: 'artwork',
      name: 'Абстрактная композиция №7',
      connections: 45,
      trustScore: 95.2,
      verified: true,
    },
    {
      id: 'collector-1',
      type: 'collector',
      name: 'Частная коллекция "Арт-Инвест"',
      connections: 189,
      trustScore: 92.4,
      verified: true,
    },
  ];

  // ML Valuations Sample
  const mlValuations: MLValuation[] = [
    {
      artworkId: 'art-001',
      title: 'Абстрактная композиция №7',
      artist: 'Василий Кандинский',
      currentPrice: 15000000,
      fairValue: 16750000,
      confidence: 92.5,
      trend: 'up',
      factors: ['Выставочная активность +15%', 'Рост сегмента +8%', 'Аукционные данные'],
      lastUpdated: '2026-02-22T20:15:00',
    },
    {
      artworkId: 'art-002',
      title: 'Городской пейзаж',
      artist: 'Марк Шагал',
      currentPrice: 35000000,
      fairValue: 33250000,
      confidence: 88.3,
      trend: 'down',
      factors: ['Сезонное снижение -5%', 'Избыток похожих работ', 'Валютные колебания'],
      lastUpdated: '2026-02-22T19:45:00',
    },
  ];

  // Fraud Alerts Sample
  const fraudAlerts: FraudAlert[] = [
    {
      id: 'fraud-001',
      type: 'wash_trading',
      severity: 'high',
      artworkId: 'art-123',
      description: 'Обнаружена циркуляция актива между 3 аффилированными лицами за 30 дней',
      timestamp: '2026-02-22T18:30:00',
      status: 'investigating',
    },
    {
      id: 'fraud-002',
      type: 'price_manipulation',
      severity: 'medium',
      artworkId: 'art-456',
      description: 'Цена выросла на 250% без подтверждающих событий (выставок, публикаций)',
      timestamp: '2026-02-22T16:15:00',
      status: 'flagged',
    },
  ];

  // Banking Integrations Sample
  const bankingIntegrations: BankingIntegration[] = [
    {
      bankId: 'bank-001',
      bankName: 'Сбербанк',
      status: 'connected',
      loanVolume: 450000000,
      avgLTV: 65.5,
      activeLoans: 34,
      lastSync: '2026-02-22T20:30:00',
    },
    {
      bankId: 'bank-002',
      bankName: 'ВТБ',
      status: 'connected',
      loanVolume: 320000000,
      avgLTV: 62.3,
      activeLoans: 28,
      lastSync: '2026-02-22T20:28:00',
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-700',
      processing: 'bg-blue-100 text-blue-700',
      idle: 'bg-gray-100 text-gray-700',
      warning: 'bg-yellow-100 text-yellow-700',
      error: 'bg-red-100 text-red-700',
      connected: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      investigating: 'bg-orange-100 text-orange-700',
      resolved: 'bg-green-100 text-green-700',
      flagged: 'bg-red-100 text-red-700',
    };
    return colors[status as keyof typeof colors] || colors.idle;
  };

  const getNodeTypeIcon = (type: string) => {
    const icons = {
      artist: Users,
      gallery: Building,
      artwork: Package,
      collector: Award,
      transaction: Activity,
    };
    return icons[type as keyof typeof icons] || Database;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <Navigation user={{ id: 1, name: 'Admin', email: 'admin@artbank.ru', role: 'admin' }} />
      <Header
        title="Transaction-Led Core"
        subtitle="Интеллектуальное ядро платформы ART BANK"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Cpu className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Transaction-Led Core OS</h2>
                  <p className="text-purple-100">Высокотехнологичный интеллектуальный процессинг арт-рынка</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Network className="w-5 h-5" />
                  <span>Графовая база данных</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  <span>ML-оценка в реальном времени</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span>Защита от манипуляций</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  <span>Банковские интеграции</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500/20 text-white border-0 text-lg px-4 py-2">
                <Radio className="w-4 h-4 mr-2 animate-pulse" />
                LIVE
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {systemStats.map((stat, index) => (
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
                    <Badge variant="outline" className="text-green-600">
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Core Modules Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              Статус модулей ядра
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {coreModules.map((module, index) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 border border-gray-200 rounded-xl hover:border-purple-300 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${module.color} text-white`}>
                        <module.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{module.name}</h3>
                          <Badge className={getStatusColor(module.status)}>
                            {module.status === 'active' && 'Активен'}
                            {module.status === 'processing' && 'Обработка'}
                            {module.status === 'idle' && 'Ожидание'}
                            {module.status === 'warning' && 'Предупреждение'}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Activity className="w-4 h-4" />
                            Uptime: {module.uptime}
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="w-4 h-4" />
                            {module.requests.toLocaleString('ru-RU')} запросов
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {module.avgResponseTime}ms avg
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Настройки
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">
              <Eye className="w-4 h-4 mr-2" />
              Обзор
            </TabsTrigger>
            <TabsTrigger value="graph-trust">
              <Network className="w-4 h-4 mr-2" />
              Graph Trust
            </TabsTrigger>
            <TabsTrigger value="ml-valuation">
              <Brain className="w-4 h-4 mr-2" />
              ML-Оценка
            </TabsTrigger>
            <TabsTrigger value="anti-fraud">
              <Shield className="w-4 h-4 mr-2" />
              Anti-Fraud
            </TabsTrigger>
            <TabsTrigger value="banking">
              <Building className="w-4 h-4 mr-2" />
              Banking API
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Производительность системы
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">График загрузки CPU и памяти</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Транзакции в реальном времени
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Поток транзакций</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Архитектура Transaction-Led Core</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {coreModules.map((module, index) => (
                    <div key={module.id} className="text-center">
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${module.color} text-white mb-3 mx-auto w-fit`}>
                        <module.icon className="w-8 h-8" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{module.name}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {index === 0 && 'Реестр связей'}
                        {index === 1 && 'Динамическая оценка'}
                        {index === 2 && 'Защита от манипуляций'}
                        {index === 3 && 'Шлюз ликвидности'}
                        {index === 4 && 'Управление активами'}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Graph Trust Tab */}
          <TabsContent value="graph-trust" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="w-5 h-5" />
                  Графовая база данных — Узлы и связи
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {graphNodes.map((node, index) => {
                    const NodeIcon = getNodeTypeIcon(node.type);
                    return (
                      <motion.div
                        key={node.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 border border-gray-200 rounded-xl hover:border-purple-300 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-purple-100">
                              <NodeIcon className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900">{node.name}</h4>
                                {node.verified && (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600">
                                {node.type === 'artist' && 'Художник'}
                                {node.type === 'gallery' && 'Галерея'}
                                {node.type === 'artwork' && 'Произведение'}
                                {node.type === 'collector' && 'Коллекционер'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Связей</p>
                              <p className="text-lg font-bold text-gray-900">{node.connections}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Trust Score</p>
                              <p className="text-lg font-bold text-green-600">{node.trustScore}%</p>
                            </div>
                            <Button variant="outline" size="sm">
                              <GitBranch className="w-4 h-4 mr-2" />
                              Граф
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ключевые метрики Graph Trust</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-semibold text-gray-700">Узлов в графе</span>
                    </div>
                    <p className="text-3xl font-bold text-blue-600">1,245,678</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <LinkIcon className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-semibold text-gray-700">Связей</span>
                    </div>
                    <p className="text-3xl font-bold text-green-600">5,678,234</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-semibold text-gray-700">Верифицировано</span>
                    </div>
                    <p className="text-3xl font-bold text-purple-600">892,345</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ML-Valuation Tab */}
          <TabsContent value="ml-valuation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  ML-оценки в реальном времени
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mlValuations.map((valuation, index) => (
                    <motion.div
                      key={valuation.artworkId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 border border-gray-200 rounded-xl hover:border-purple-300 transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{valuation.title}</h3>
                          <p className="text-gray-600">{valuation.artist}</p>
                        </div>
                        <Badge className={`${
                          valuation.trend === 'up' ? 'bg-green-100 text-green-700' :
                          valuation.trend === 'down' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {valuation.trend === 'up' && <TrendingUp className="w-3 h-3 mr-1" />}
                          {valuation.trend === 'down' && <TrendingUp className="w-3 h-3 mr-1 rotate-180" />}
                          {valuation.trend === 'up' ? 'Рост' : valuation.trend === 'down' ? 'Снижение' : 'Стабильно'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Текущая цена</p>
                          <p className="text-2xl font-bold text-gray-900">{formatCurrency(valuation.currentPrice)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Fair Value (ML)</p>
                          <p className="text-2xl font-bold text-purple-600">{formatCurrency(valuation.fairValue)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Уверенность модели</p>
                          <div className="flex items-center gap-2">
                            <Progress value={valuation.confidence} className="h-2 flex-1" />
                            <span className="text-sm font-semibold text-purple-600">{valuation.confidence}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Факторы оценки:</p>
                        <div className="flex flex-wrap gap-2">
                          {valuation.factors.map((factor, idx) => (
                            <Badge key={idx} variant="outline">{factor}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="text-xs text-gray-500">
                        Обновлено: {new Date(valuation.lastUpdated).toLocaleString('ru-RU')}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Anti-Fraud Tab */}
          <TabsContent value="anti-fraud" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Оповещения системы защиты
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fraudAlerts.map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 border-l-4 rounded-lg ${
                        alert.severity === 'high' ? 'border-red-500 bg-red-50' :
                        alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                        'border-blue-500 bg-blue-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className={`w-6 h-6 ${
                            alert.severity === 'high' ? 'text-red-600' :
                            alert.severity === 'medium' ? 'text-yellow-600' :
                            'text-blue-600'
                          }`} />
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {alert.type === 'wash_trading' && 'Wash Trading'}
                              {alert.type === 'price_manipulation' && 'Манипуляция ценой'}
                              {alert.type === 'fake_provenance' && 'Подозрительный провинанс'}
                              {alert.type === 'anomaly' && 'Аномалия'}
                            </h4>
                            <p className="text-sm text-gray-600">ID: {alert.artworkId}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(alert.status)}>
                          {alert.status === 'investigating' && 'Расследование'}
                          {alert.status === 'resolved' && 'Решено'}
                          {alert.status === 'flagged' && 'Помечено'}
                        </Badge>
                      </div>
                      <p className="text-gray-700 mb-3">{alert.description}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          {new Date(alert.timestamp).toLocaleString('ru-RU')}
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Подробнее
                          </Button>
                          <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600">
                            Действия
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Banking Tab */}
          <TabsContent value="banking" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Банковские интеграции
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bankingIntegrations.map((bank, index) => (
                    <motion.div
                      key={bank.bankId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-6 border border-gray-200 rounded-xl hover:border-purple-300 transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 text-white">
                            <Building className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{bank.bankName}</h3>
                            <p className="text-sm text-gray-600">ID: {bank.bankId}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(bank.status)}>
                          {bank.status === 'connected' ? 'Подключен' : 
                           bank.status === 'pending' ? 'Ожидание' : 'Ошибка'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Объём кредитов</p>
                          <p className="text-lg font-bold text-gray-900">{formatCurrency(bank.loanVolume)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Средний LTV</p>
                          <p className="text-lg font-bold text-purple-600">{bank.avgLTV}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Активных займов</p>
                          <p className="text-lg font-bold text-gray-900">{bank.activeLoans}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Последняя синхронизация</p>
                          <p className="text-sm text-gray-900">
                            {new Date(bank.lastSync).toLocaleTimeString('ru-RU')}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Синхронизировать
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Отчёт
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4 mr-2" />
                          Настройки API
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TransactionLedCore;
