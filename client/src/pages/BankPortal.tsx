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
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import { trpc } from '@/lib/trpc';
import BankingLoansManager from '@/components/BankingLoansManager';
import RiskManagementDashboard from '@/components/RiskManagementDashboard';
import ApiIntegrationSettings from '@/components/ApiIntegrationSettings';
import TeamManagement from '@/components/TeamManagement';

/**
 * Bank Partner Portal - Main Dashboard for Bank Partners
 * Provides comprehensive overview and management tools for banking partners
 */
const BankPortal: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');

  // Fetch real data from tRPC API
  const { data: bankPartner, isLoading: bankLoading } = trpc.core.getBankPartner.useQuery({});
  const { data: bankStats, isLoading: statsLoading } = trpc.core.getBankingStatistics.useQuery({
    period: selectedPeriod,
  });
  const { data: loans, isLoading: loansLoading } = trpc.core.getBankingLoans.useQuery({
    limit: 10,
  });

  const isLoading = bankLoading || statsLoading || loansLoading;

  // Use real data or fallback to defaults
  const bankInfo = {
    bankId: bankPartner?.bankCode || 'loading',
    bankName: bankPartner?.bankName || 'Загрузка...',
    status: 'active' as const,
    connectionStatus: (bankPartner?.connectionStatus || 'connected') as const,
    apiVersion: 'v2.1',
    lastSync: bankPartner?.lastSyncAt ? new Date(bankPartner.lastSyncAt) : new Date(),
  };

  const stats = {
    totalLoans: bankStats?.totalLoans || 0,
    activeLoans: bankStats?.activeLoans || 0,
    pendingApplications: bankStats?.pendingApplications || 0,
    totalVolume: bankStats?.totalVolume || 0,
    avgLTV: bankStats?.avgLTV || 0,
    portfolioRisk: (bankStats?.portfolioRisk || 'low') as const,
    marginCalls: bankStats?.marginCalls || 0,
    defaultRate: bankStats?.defaultRate || 0,
  };

  // Recent activity from recent loans
  const recentActivity = loans?.slice(0, 3).map((loan) => ({
    id: loan.id?.toString() || '',
    type: 'loan_created',
    description: `Займ ${loan.loanId}`,
    artwork: `Artwork #${loan.artworkId}`,
    amount: loan.loanAmount || 0,
    timestamp: loan.createdAt ? new Date(loan.createdAt) : new Date(),
  })) || [];

  // LTV distribution from stats
  const ltvDistribution = bankStats?.ltvDistribution?.map((item) => ({
    range: item.range,
    count: item.count,
    percentage: stats.activeLoans > 0 ? Math.round((item.count / stats.activeLoans) * 100) : 0,
  })) || [
    { range: '0-50%', count: 0, percentage: 0 },
    { range: '50-65%', count: 0, percentage: 0 },
    { range: '65-75%', count: 0, percentage: 0 },
    { range: '75-85%', count: 0, percentage: 0 },
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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Загрузка данных банковского портала...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              API
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
            <BankingLoansManager />
          </TabsContent>

          <TabsContent value="risk">
            <RiskManagementDashboard />
          </TabsContent>

          <TabsContent value="settings">
            <ApiIntegrationSettings bankPartner={bankPartnerData} />
          </TabsContent>

          <TabsContent value="team">
            <TeamManagement />
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
