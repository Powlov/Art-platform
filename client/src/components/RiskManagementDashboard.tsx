import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Gauge,
  Bell,
  Settings,
  Download,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { trpc } from '@/lib/trpc';

/**
 * Risk Management Dashboard - Monitor and manage portfolio risk
 */
const RiskManagementDashboard: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'day' | 'week' | 'month' | 'quarter'>('month');

  // Fetch banking statistics for risk analysis
  const { data: stats, isLoading } = trpc.core.getBankingStatistics.useQuery({
    period: selectedTimeframe,
  });

  const { data: loans } = trpc.core.getBankingLoans.useQuery({
    limit: 1000,
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Calculate risk metrics
  const riskMetrics = React.useMemo(() => {
    if (!loans) return null;

    const activeLoans = loans.filter(l => l.status === 'active');
    const marginCallLoans = loans.filter(l => l.status === 'margin_call');
    const highRiskLoans = loans.filter(l => l.riskLevel === 'high' || l.riskLevel === 'critical');
    
    const totalExposure = activeLoans.reduce((sum, loan) => sum + (loan.loanAmount || 0), 0);
    const atRiskExposure = highRiskLoans.reduce((sum, loan) => sum + (loan.loanAmount || 0), 0);
    
    const avgLTV = activeLoans.length > 0
      ? activeLoans.reduce((sum, loan) => sum + (loan.currentLTV || 0), 0) / activeLoans.length
      : 0;
    
    const portfolioHealth = avgLTV < 60 ? 'excellent' : avgLTV < 70 ? 'good' : avgLTV < 75 ? 'fair' : 'poor';
    
    // LTV buckets
    const ltvBuckets = {
      safe: activeLoans.filter(l => (l.currentLTV || 0) < 60).length,
      moderate: activeLoans.filter(l => (l.currentLTV || 0) >= 60 && (l.currentLTV || 0) < 70).length,
      elevated: activeLoans.filter(l => (l.currentLTV || 0) >= 70 && (l.currentLTV || 0) < 80).length,
      critical: activeLoans.filter(l => (l.currentLTV || 0) >= 80).length,
    };

    // Risk concentration by artwork value
    const highValueLoans = activeLoans.filter(l => (l.artworkValue || 0) > 20000000);
    const concentrationRisk = (highValueLoans.length / activeLoans.length) * 100;

    return {
      totalExposure,
      atRiskExposure,
      riskExposurePercent: totalExposure > 0 ? (atRiskExposure / totalExposure) * 100 : 0,
      avgLTV,
      portfolioHealth,
      marginCallCount: marginCallLoans.length,
      highRiskCount: highRiskLoans.length,
      ltvBuckets,
      concentrationRisk,
      activeLoansCount: activeLoans.length,
    };
  }, [loans]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Загрузка данных рисков...</p>
        </div>
      </div>
    );
  }

  if (!riskMetrics) {
    return (
      <div className="text-center py-12">
        <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">Нет данных для анализа рисков</p>
      </div>
    );
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent':
        return 'text-green-600 bg-green-100';
      case 'good':
        return 'text-blue-600 bg-blue-100';
      case 'fair':
        return 'text-yellow-600 bg-yellow-100';
      case 'poor':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthLabel = (health: string) => {
    switch (health) {
      case 'excellent':
        return 'Отличное';
      case 'good':
        return 'Хорошее';
      case 'fair':
        return 'Удовлетворительное';
      case 'poor':
        return 'Плохое';
      default:
        return 'Н/Д';
    }
  };

  return (
    <div className="space-y-6">
      {/* Timeframe Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Управление рисками</h2>
        <div className="flex items-center gap-2">
          {(['day', 'week', 'month', 'quarter'] as const).map((period) => (
            <Button
              key={period}
              variant={selectedTimeframe === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeframe(period)}
            >
              {period === 'day' && 'День'}
              {period === 'week' && 'Неделя'}
              {period === 'month' && 'Месяц'}
              {period === 'quarter' && 'Квартал'}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Risk Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <Shield className="w-8 h-8 text-blue-600" />
                <Badge className={getHealthColor(riskMetrics.portfolioHealth)}>
                  {getHealthLabel(riskMetrics.portfolioHealth)}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1">Здоровье портфеля</p>
              <p className="text-2xl font-bold">{riskMetrics.avgLTV.toFixed(1)}%</p>
              <p className="text-xs text-gray-500 mt-1">Средний LTV</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <AlertTriangle className="w-8 h-8 text-orange-600" />
                {riskMetrics.highRiskCount > 0 && (
                  <Badge className="bg-orange-100 text-orange-700 animate-pulse">
                    {riskMetrics.highRiskCount}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-1">Высокий риск</p>
              <p className="text-2xl font-bold">{formatCurrency(riskMetrics.atRiskExposure)}</p>
              <p className="text-xs text-gray-500 mt-1">
                {riskMetrics.riskExposurePercent.toFixed(1)}% от портфеля
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <Target className="w-8 h-8 text-purple-600" />
                {riskMetrics.marginCallCount > 0 && (
                  <Badge className="bg-red-100 text-red-700">
                    {riskMetrics.marginCallCount}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-1">Margin Calls</p>
              <p className="text-2xl font-bold">{riskMetrics.marginCallCount}</p>
              <p className="text-xs text-gray-500 mt-1">Требуют действий</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <Gauge className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Концентрация</p>
              <p className="text-2xl font-bold">{riskMetrics.concentrationRisk.toFixed(1)}%</p>
              <p className="text-xs text-gray-500 mt-1">Высокая стоимость</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* LTV Distribution Risk */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Распределение рисков по LTV
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm font-medium">Безопасная зона (0-60%)</span>
                  </div>
                  <span className="font-semibold">{riskMetrics.ltvBuckets.safe} займов</span>
                </div>
                <Progress
                  value={(riskMetrics.ltvBuckets.safe / riskMetrics.activeLoansCount) * 100}
                  className="h-3 bg-green-100"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm font-medium">Умеренная (60-70%)</span>
                  </div>
                  <span className="font-semibold">{riskMetrics.ltvBuckets.moderate} займов</span>
                </div>
                <Progress
                  value={(riskMetrics.ltvBuckets.moderate / riskMetrics.activeLoansCount) * 100}
                  className="h-3 bg-blue-100"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-sm font-medium">Повышенная (70-80%)</span>
                  </div>
                  <span className="font-semibold">{riskMetrics.ltvBuckets.elevated} займов</span>
                </div>
                <Progress
                  value={(riskMetrics.ltvBuckets.elevated / riskMetrics.activeLoansCount) * 100}
                  className="h-3 bg-yellow-100"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-sm font-medium">Критическая (80%+)</span>
                  </div>
                  <span className="font-semibold text-red-600">{riskMetrics.ltvBuckets.critical} займов</span>
                </div>
                <Progress
                  value={(riskMetrics.ltvBuckets.critical / riskMetrics.activeLoansCount) * 100}
                  className="h-3 bg-red-100"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-600" />
              Рекомендации
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {riskMetrics.marginCallCount > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-900">Margin Call требует действий</p>
                      <p className="text-sm text-red-700">
                        {riskMetrics.marginCallCount} займ(ов) требуют немедленного внимания
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {riskMetrics.ltvBuckets.elevated > 0 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-yellow-900">Мониторинг LTV</p>
                      <p className="text-sm text-yellow-700">
                        {riskMetrics.ltvBuckets.elevated} займ(ов) в зоне повышенного риска (70-80%)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {riskMetrics.concentrationRisk > 30 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-blue-900">Диверсификация портфеля</p>
                      <p className="text-sm text-blue-700">
                        Высокая концентрация в дорогих произведениях: {riskMetrics.concentrationRisk.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {riskMetrics.portfolioHealth === 'excellent' && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900">Портфель здоров</p>
                      <p className="text-sm text-green-700">
                        Средний LTV ниже 60%, риски под контролем
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-600" />
              Действия
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Экспорт отчета по рискам
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Target className="w-4 h-4 mr-2" />
                Настроить пороги риска
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Bell className="w-4 h-4 mr-2" />
                Настроить уведомления
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Activity className="w-4 h-4 mr-2" />
                Просмотреть стресс-тесты
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RiskManagementDashboard;
