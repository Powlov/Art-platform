import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building,
  CreditCard,
  TrendingUp,
  Shield,
  Settings,
  Users,
  FileText,
  AlertTriangle,
  Activity,
  DollarSign,
  PieChart,
  BarChart3,
  Clock,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';

/**
 * Bank Partner Portal - Main Dashboard for Bank Partners
 * Provides comprehensive overview and management tools for banking partners
 */
const BankPortal: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');

  // Mock data - в production заменить на tRPC API
  const bankInfo = {
    bankId: 'sberbank-001',
    bankName: 'Сбербанк',
    status: 'active' as const,
    connectionStatus: 'connected' as const,
    apiVersion: 'v2.1',
    lastSync: new Date(),
  };

  const stats = {
    totalLoans: 342,
    activeLoans: 287,
    pendingApplications: 18,
    totalVolume: 1250000000,
    avgLTV: 64.5,
    portfolioRisk: 'low' as const,
    marginCalls: 3,
    defaultRate: 1.2,
  };

  const recentActivity = [
    {
      id: '1',
      type: 'loan_created',
      description: 'New loan application #LN-2847',
      artwork: 'Композиция VIII',
      amount: 15000000,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: '2',
      type: 'ltv_alert',
      description: 'LTV threshold reached for #LN-2801',
      artwork: 'Городской пейзаж',
      ltv: 78.5,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      id: '3',
      type: 'valuation_update',
      description: 'Artwork revaluation completed',
      artwork: 'Абстракция №12',
      change: 12.5,
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    },
  ];

  const ltvDistribution = [
    { range: '0-50%', count: 89, percentage: 31 },
    { range: '50-65%', count: 142, percentage: 49 },
    { range: '65-75%', count: 48, percentage: 17 },
    { range: '75-85%', count: 8, percentage: 3 },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatTimeAgo = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Только что';
    if (hours < 24) return `${hours}ч назад`;
    return `${Math.floor(hours / 24)}д назад`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Bank Info Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white">
                <Building className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{bankInfo.bankName}</h1>
                <p className="text-gray-600">Bank Partner Portal</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className="bg-green-100 text-green-700">
                <Activity className="w-3 h-3 mr-1 animate-pulse" />
                {bankInfo.connectionStatus === 'connected' ? 'Подключен' : 'Отключен'}
              </Badge>
              <Badge variant="outline">API {bankInfo.apiVersion}</Badge>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Настройки
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.activeLoans}</div>
                <p className="text-sm text-gray-600">Активных займов</p>
                <div className="mt-2 text-xs text-gray-500">
                  +{stats.pendingApplications} ожидают одобрения
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-purple-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalVolume)}
                </div>
                <p className="text-sm text-gray-600">Объём портфеля</p>
                <div className="mt-2 text-xs text-gray-500">
                  {stats.totalLoans} всего займов
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-orange-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <PieChart className="w-5 h-5 text-orange-600" />
                  <span className="text-xs font-semibold text-orange-600">AVG</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.avgLTV}%</div>
                <p className="text-sm text-gray-600">Средний LTV</p>
                <Progress value={stats.avgLTV} className="mt-2 h-1" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className={`border-${stats.marginCalls > 0 ? 'red' : 'green'}-200`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <AlertTriangle className={`w-5 h-5 text-${stats.marginCalls > 0 ? 'red' : 'green'}-600`} />
                  {stats.marginCalls > 0 && <span className="text-xs font-semibold text-red-600 animate-pulse">!</span>}
                </div>
                <div className={`text-2xl font-bold text-${stats.marginCalls > 0 ? 'red' : 'green'}-600`}>
                  {stats.marginCalls}
                </div>
                <p className="text-sm text-gray-600">Margin Calls</p>
                <div className="mt-2 text-xs text-gray-500">
                  Default rate: {stats.defaultRate}%
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            <TabsTrigger value="overview">
              <BarChart3 className="w-4 h-4 mr-2" />
              Обзор
            </TabsTrigger>
            <TabsTrigger value="loans">
              <CreditCard className="w-4 h-4 mr-2" />
              Займы
            </TabsTrigger>
            <TabsTrigger value="risk">
              <Shield className="w-4 h-4 mr-2" />
              Риски
            </TabsTrigger>
            <TabsTrigger value="team">
              <Users className="w-4 h-4 mr-2" />
              Команда
            </TabsTrigger>
            <TabsTrigger value="reports">
              <FileText className="w-4 h-4 mr-2" />
              Отчеты
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* LTV Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-purple-600" />
                    Распределение LTV
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ltvDistribution.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{item.range}</span>
                          <span className="font-semibold">{item.count} займов</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={item.percentage} className="flex-1" />
                          <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                            {item.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Последняя активность
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.type === 'loan_created' ? 'bg-blue-100' :
                          activity.type === 'ltv_alert' ? 'bg-orange-100' :
                          'bg-green-100'
                        }`}>
                          {activity.type === 'loan_created' && <CreditCard className="w-5 h-5 text-blue-600" />}
                          {activity.type === 'ltv_alert' && <AlertTriangle className="w-5 h-5 text-orange-600" />}
                          {activity.type === 'valuation_update' && <TrendingUp className="w-5 h-5 text-green-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{activity.description}</p>
                          <p className="text-sm text-gray-600">{activity.artwork}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(activity.timestamp)}</p>
                        </div>
                        {'amount' in activity && (
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">
                              {formatCurrency(activity.amount)}
                            </p>
                          </div>
                        )}
                        {'ltv' in activity && (
                          <div className="text-right">
                            <Badge className="bg-orange-100 text-orange-700">
                              {activity.ltv}%
                            </Badge>
                          </div>
                        )}
                        {'change' in activity && (
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                              <ArrowUpRight className="w-4 h-4" />
                              +{activity.change}%
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Быстрые действия</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-24 flex-col gap-2">
                    <CreditCard className="w-6 h-6" />
                    <span>Новый займ</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col gap-2">
                    <FileText className="w-6 h-6" />
                    <span>Отчет</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col gap-2">
                    <Users className="w-6 h-6" />
                    <span>Команда</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col gap-2">
                    <Settings className="w-6 h-6" />
                    <span>Настройки API</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loans">
            <Card>
              <CardContent className="p-12 text-center">
                <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Управление займами</h3>
                <p className="text-gray-600 mb-4">
                  Полный список займов, создание новых заявок, управление LTV
                </p>
                <Button>Перейти к займам</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk">
            <Card>
              <CardContent className="p-12 text-center">
                <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Управление рисками</h3>
                <p className="text-gray-600 mb-4">
                  Мониторинг рисков, настройка порогов, алерты
                </p>
                <Button>Открыть панель рисков</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Управление командой</h3>
                <p className="text-gray-600 mb-4">
                  Добавление пользователей, настройка ролей и доступов
                </p>
                <Button>Управление командой</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Отчеты и аналитика</h3>
                <p className="text-gray-600 mb-4">
                  Генерация отчетов, экспорт данных, аналитика портфеля
                </p>
                <Button>Создать отчет</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BankPortal;
