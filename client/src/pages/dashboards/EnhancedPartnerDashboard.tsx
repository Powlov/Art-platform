import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  QrCode,
  Users,
  TrendingUp,
  Share2,
  Globe,
  BarChart3,
  Link2,
  Smartphone,
  Eye,
  Clock,
  DollarSign,
  Target,
  Award,
  Zap,
  Download,
  Copy,
  ExternalLink,
  Plus,
  Filter,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Settings,
  Package,
  MessageSquare,
  FileText,
  Code,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useLocation } from 'wouter';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import { LoadingState } from '@/components/LoadingState';

interface PartnerStats {
  totalIntegrations: number;
  activeQRCodes: number;
  totalScans: number;
  conversionRate: number;
  partneredVenues: number;
  totalRevenue: number;
  avgEngagement: number;
  monthlyGrowth: number;
}

interface Integration {
  id: string;
  name: string;
  type: 'api' | 'qr' | 'widget' | 'embed';
  status: 'active' | 'pending' | 'inactive';
  scans: number;
  conversions: number;
  revenue: number;
  createdAt: string;
  venue?: string;
}

interface QRCode {
  id: string;
  title: string;
  type: 'artwork' | 'exhibition' | 'artist' | 'venue' | 'custom';
  targetUrl: string;
  scans: number;
  uniqueVisitors: number;
  conversions: number;
  createdAt: string;
  expiresAt?: string;
  status: 'active' | 'expired' | 'paused';
}

interface Analytics {
  date: string;
  scans: number;
  conversions: number;
  revenue: number;
}

const EnhancedPartnerDashboard: React.FC = () => {
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  
  const [stats, setStats] = useState<PartnerStats>({
    totalIntegrations: 12,
    activeQRCodes: 45,
    totalScans: 28473,
    conversionRate: 12.4,
    partneredVenues: 8,
    totalRevenue: 3850000,
    avgEngagement: 87,
    monthlyGrowth: 23.5,
  });

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'Главная галерея',
      type: 'qr',
      status: 'active',
      scans: 8473,
      conversions: 1042,
      revenue: 1240000,
      createdAt: '2024-01-01',
      venue: 'ЦВЗ Манеж',
    },
    {
      id: '2',
      name: 'Выставка API',
      type: 'api',
      status: 'active',
      scans: 5284,
      conversions: 782,
      revenue: 850000,
      createdAt: '2024-01-15',
    },
    {
      id: '3',
      name: 'Виджет коллекций',
      type: 'widget',
      status: 'active',
      scans: 3847,
      conversions: 456,
      revenue: 620000,
      createdAt: '2024-02-01',
    },
    {
      id: '4',
      name: 'Встроенный каталог',
      type: 'embed',
      status: 'pending',
      scans: 0,
      conversions: 0,
      revenue: 0,
      createdAt: '2024-02-15',
      venue: 'Третьяковская галерея',
    },
  ]);

  const [qrCodes, setQRCodes] = useState<QRCode[]>([
    {
      id: '1',
      title: 'Современная абстракция',
      type: 'exhibition',
      targetUrl: 'https://artbank.com/exhibitions/1',
      scans: 2847,
      uniqueVisitors: 2134,
      conversions: 342,
      createdAt: '2024-01-15',
      expiresAt: '2024-03-31',
      status: 'active',
    },
    {
      id: '2',
      title: 'Анна Петрова - Художник',
      type: 'artist',
      targetUrl: 'https://artbank.com/artists/anna-petrova',
      scans: 1847,
      uniqueVisitors: 1523,
      conversions: 218,
      createdAt: '2024-01-20',
      status: 'active',
    },
    {
      id: '3',
      title: 'Красная композиция',
      type: 'artwork',
      targetUrl: 'https://artbank.com/artworks/1',
      scans: 942,
      uniqueVisitors: 784,
      conversions: 123,
      createdAt: '2024-02-01',
      status: 'active',
    },
  ]);

  const [analytics, setAnalytics] = useState<Analytics[]>([
    { date: '2024-01', scans: 4200, conversions: 504, revenue: 620000 },
    { date: '2024-02', scans: 5100, conversions: 612, revenue: 750000 },
    { date: '2024-03', scans: 6800, conversions: 816, revenue: 980000 },
    { date: '2024-04', scans: 7200, conversions: 864, revenue: 1050000 },
    { date: '2024-05', scans: 8400, conversions: 1008, revenue: 1240000 },
    { date: '2024-06', scans: 9600, conversions: 1152, revenue: 1420000 },
  ]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (loading) {
    return <LoadingState fullScreen message="Загрузка панели партнёра..." />;
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    // TODO: Show toast notification
  };

  const handleDownloadQR = (qrId: string) => {
    // TODO: Implement QR code download
    console.log('Download QR:', qrId);
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <QrCode className="w-8 h-8 text-primary" />
                Панель Партнёра
              </h1>
              <p className="text-muted-foreground">
                Управление интеграциями, QR-кодами и аналитика аудитории
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => navigate('/qr/new')} className="gap-2">
                <Plus className="w-4 h-4" />
                Создать QR-код
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Экспорт данных
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Всего сканирований</p>
                  <p className="text-2xl font-bold">{stats.totalScans.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-1">+{stats.monthlyGrowth}% за месяц</p>
                </div>
                <QrCode className="w-10 h-10 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Активных QR-кодов</p>
                  <p className="text-2xl font-bold">{stats.activeQRCodes}</p>
                  <p className="text-xs text-blue-600 mt-1">{stats.totalIntegrations} интеграций</p>
                </div>
                <Link2 className="w-10 h-10 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Конверсия</p>
                  <p className="text-2xl font-bold">{stats.conversionRate}%</p>
                  <p className="text-xs text-purple-600 mt-1">Engagement {stats.avgEngagement}%</p>
                </div>
                <Target className="w-10 h-10 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Общий доход</p>
                  <p className="text-2xl font-bold">₽{(stats.totalRevenue / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-orange-600 mt-1">{stats.partneredVenues} площадок</p>
                </div>
                <DollarSign className="w-10 h-10 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="qr">QR-коды</TabsTrigger>
            <TabsTrigger value="integrations">Интеграции</TabsTrigger>
            <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Integrations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link2 className="w-5 h-5" />
                    Топ интеграции
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {integrations.slice(0, 3).map((integration, index) => (
                      <motion.div
                        key={integration.id}
                        whileHover={{ scale: 1.02 }}
                        className="p-3 border rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-bold">#{index + 1}</span>
                            </div>
                            <div>
                              <h4 className="font-semibold">{integration.name}</h4>
                              <p className="text-xs text-muted-foreground">{integration.venue || 'API Integration'}</p>
                            </div>
                          </div>
                          <Badge>{integration.type.toUpperCase()}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground text-xs">Сканы</p>
                            <p className="font-semibold">{integration.scans.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Конверсии</p>
                            <p className="font-semibold text-green-600">{integration.conversions}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Доход</p>
                            <p className="font-semibold">₽{(integration.revenue / 1000).toFixed(0)}K</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Динамика сканирований
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.slice(-6).map((data, index) => {
                      const maxScans = Math.max(...analytics.map(a => a.scans));
                      const percentage = (data.scans / maxScans) * 100;
                      
                      return (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">{data.date}</span>
                            <span className="font-semibold">{data.scans.toLocaleString()}</span>
                          </div>
                          <Progress value={percentage} />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent QR Codes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  Недавние QR-коды
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {qrCodes.slice(0, 3).map((qr) => (
                    <motion.div
                      key={qr.id}
                      whileHover={{ scale: 1.02 }}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <Badge>{qr.type}</Badge>
                        <Badge variant={qr.status === 'active' ? 'default' : 'secondary'}>
                          {qr.status === 'active' ? 'Активен' : qr.status === 'expired' ? 'Истёк' : 'Приостановлен'}
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold mb-2">{qr.title}</h3>
                      
                      <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">Сканы</p>
                          <p className="font-semibold">{qr.scans.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Конверсии</p>
                          <p className="font-semibold text-green-600">{qr.conversions}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDownloadQR(qr.id)}>
                          <Download className="w-3 h-3 mr-1" />
                          Скачать
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleCopyCode(qr.targetUrl)}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* QR Codes Tab */}
          <TabsContent value="qr" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Все QR-коды</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Фильтр
                    </Button>
                    <Button size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Создать
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {qrCodes.map((qr) => (
                    <motion.div
                      key={qr.id}
                      whileHover={{ scale: 1.01 }}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{qr.title}</h3>
                            <Badge>{qr.type}</Badge>
                            <Badge variant={qr.status === 'active' ? 'default' : 'secondary'}>
                              {qr.status === 'active' ? 'Активен' : qr.status === 'expired' ? 'Истёк' : 'Приостановлен'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{qr.targetUrl}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Создан: {new Date(qr.createdAt).toLocaleDateString()}</span>
                            {qr.expiresAt && (
                              <span>Истекает: {new Date(qr.expiresAt).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="w-24 h-24 border-2 border-dashed rounded flex items-center justify-center bg-muted">
                          <QrCode className="w-12 h-12 text-muted-foreground" />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Всего сканов</p>
                          <p className="text-lg font-semibold">{qr.scans.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Уникальных</p>
                          <p className="text-lg font-semibold">{qr.uniqueVisitors.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Конверсий</p>
                          <p className="text-lg font-semibold text-green-600">{qr.conversions}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleDownloadQR(qr.id)}>
                          <Download className="w-4 h-4 mr-2" />
                          Скачать QR
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleCopyCode(qr.targetUrl)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Копировать ссылку
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Открыть
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Активные интеграции</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {integrations.map((integration) => (
                    <motion.div
                      key={integration.id}
                      whileHover={{ scale: 1.01 }}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{integration.name}</h3>
                            <Badge variant={
                              integration.type === 'api' ? 'default' :
                              integration.type === 'qr' ? 'secondary' :
                              'outline'
                            }>
                              {integration.type.toUpperCase()}
                            </Badge>
                            <Badge variant={integration.status === 'active' ? 'default' : 'secondary'}>
                              {integration.status === 'active' ? 'Активна' : 
                               integration.status === 'pending' ? 'В ожидании' : 'Неактивна'}
                            </Badge>
                          </div>
                          {integration.venue && (
                            <p className="text-sm text-muted-foreground">{integration.venue}</p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Создана: {new Date(integration.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        
                        {integration.type === 'api' && (
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Code className="w-4 h-4 mr-2" />
                              API Key
                            </Button>
                            <Button variant="outline" size="sm">
                              <FileText className="w-4 h-4 mr-2" />
                              Docs
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Запросы</p>
                          <p className="text-lg font-semibold">{integration.scans.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Конверсии</p>
                          <p className="text-lg font-semibold text-green-600">{integration.conversions}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Коэф. конв.</p>
                          <p className="text-lg font-semibold">
                            {integration.scans > 0 ? ((integration.conversions / integration.scans) * 100).toFixed(1) : 0}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Доход</p>
                          <p className="text-lg font-semibold">₽{(integration.revenue / 1000).toFixed(0)}K</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Статистика
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4 mr-2" />
                          Настройки
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Integration Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="cursor-pointer hover:border-primary transition-colors">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <QrCode className="w-12 h-12 mx-auto mb-3 text-primary" />
                    <h3 className="font-semibold mb-2">QR-интеграция</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Генерация QR-кодов для офлайн-площадок
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Настроить
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:border-primary transition-colors">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Code className="w-12 h-12 mx-auto mb-3 text-primary" />
                    <h3 className="font-semibold mb-2">API</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      REST API для интеграции в ваши системы
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Документация
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:border-primary transition-colors">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Globe className="w-12 h-12 mx-auto mb-3 text-primary" />
                    <h3 className="font-semibold mb-2">Виджет</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Встраиваемый виджет для вашего сайта
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Получить код
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:border-primary transition-colors">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Package className="w-12 h-12 mx-auto mb-3 text-primary" />
                    <h3 className="font-semibold mb-2">Embed</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Встроенный каталог произведений
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Создать
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Аналитика эффективности</CardTitle>
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
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Revenue Chart */}
                  <div>
                    <h3 className="font-semibold mb-4">Динамика дохода</h3>
                    <div className="space-y-2">
                      {analytics.map((data, index) => {
                        const maxRevenue = Math.max(...analytics.map(a => a.revenue));
                        const percentage = (data.revenue / maxRevenue) * 100;
                        
                        return (
                          <div key={index}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{data.date}</span>
                              <span className="font-semibold">₽{(data.revenue / 1000).toFixed(0)}K</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Conversion Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground mb-1">Средняя конверсия</p>
                        <p className="text-3xl font-bold">{stats.conversionRate}%</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground mb-1">Средний engagement</p>
                        <p className="text-3xl font-bold">{stats.avgEngagement}%</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground mb-1">Рост за месяц</p>
                        <p className="text-3xl font-bold text-green-600">+{stats.monthlyGrowth}%</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default EnhancedPartnerDashboard;
