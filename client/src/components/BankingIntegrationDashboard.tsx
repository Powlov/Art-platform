import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building,
  DollarSign,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity,
  CreditCard,
  PieChart,
  Loader2,
  Info,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { trpc } from '@/lib/trpc';

interface BankingIntegration {
  bankId: string;
  bankName: string;
  status: 'connected' | 'disconnected' | 'error';
  loanVolume: number;
  avgLTV: number;
  activeLoans: number;
  lastSync: string;
}

interface BankingLoan {
  loanId: string;
  bankId: string;
  bankName: string;
  artworkId: string;
  artworkTitle: string;
  artworkValue: number;
  loanAmount: number;
  ltv: number;
  currentLTV: number;
  interestRate: number;
  term: number;
  status: 'active' | 'pending' | 'defaulted' | 'paid';
  marginCallThreshold: number;
  lastValuation: string;
  nextValuation: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

const BankingIntegrationDashboard: React.FC = () => {
  const [selectedBank, setSelectedBank] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch banking data from tRPC API
  const { data: bankingData, isLoading, error, refetch } = trpc.core.getBankingIntegrations.useQuery({
    limit: 20,
  });

  // Fetch banking stats
  const { data: bankingStats } = trpc.core.getBankingStatistics.useQuery();

  // Fetch loans data
  const { data: bankingLoans } = trpc.core.getBankingLoans.useQuery({
    bankId: selectedBank === 'all' ? undefined : selectedBank,
    riskLevel: selectedRisk === 'all' ? undefined : selectedRisk as any,
    limit: 50,
  });

  // Auto-refresh every 60 seconds if enabled
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      refetch();
    }, 60000);

    return () => clearInterval(interval);
  }, [autoRefresh, refetch]);

  const getRiskColor = (risk: string) => {
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-orange-100 text-orange-700',
      critical: 'bg-red-100 text-red-700',
    };
    return colors[risk] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      connected: <CheckCircle className="w-4 h-4 text-green-600" />,
      disconnected: <AlertTriangle className="w-4 h-4 text-orange-600" />,
      error: <AlertTriangle className="w-4 h-4 text-red-600" />,
    };
    return icons[status] || <Activity className="w-4 h-4 text-gray-600" />;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-gray-600">Загрузка данных Banking API...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-200 flex items-center justify-center">
                <Info className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-semibold text-red-900">Ошибка загрузки данных</h4>
                <p className="text-sm text-red-700">{error.message}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => refetch()}
                >
                  Повторить
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Dashboard - only show when data is loaded */}
      {!isLoading && !error && (
        <>
          {/* Stats Cards */}
          {bankingStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Building className="w-5 h-5 text-blue-600" />
                    <Badge className="bg-blue-100 text-blue-700">Active</Badge>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{bankingStats.connectedBanks}</p>
                  <p className="text-sm text-gray-600">Connected Banks</p>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <CreditCard className="w-5 h-5 text-green-600" />
                    <span className="text-xs text-green-600 font-semibold">TOTAL</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{bankingStats.activeLoans}</p>
                  <p className="text-sm text-gray-600">Active Loans</p>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{formatCurrency(bankingStats.totalLoanVolume)}</p>
                  <p className="text-sm text-gray-600">Loan Volume</p>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <PieChart className="w-5 h-5 text-orange-600" />
                    <span className="text-xs text-orange-600 font-semibold">AVG</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-600">{bankingStats.avgLTV.toFixed(1)}%</p>
                  <p className="text-sm text-gray-600">Average LTV</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Bank Connections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-600" />
                  Bank Integrations
                  <Badge variant="secondary" className="ml-2">
                    {bankingData?.length || 0} банков
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                  <Button
                    variant={autoRefresh ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAutoRefresh(!autoRefresh)}
                  >
                    Auto-refresh
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bankingData?.map((bank) => (
                  <motion.div
                    key={bank.bankId}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 border rounded-xl hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Building className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{bank.bankName}</p>
                          <p className="text-xs text-gray-500">{bank.bankId}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(bank.status)}
                        <Badge
                          variant={bank.status === 'connected' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {bank.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Active Loans</p>
                        <p className="text-lg font-bold text-gray-900">{bank.activeLoans}</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Avg LTV</p>
                        <p className="text-lg font-bold text-gray-900">{bank.avgLTV.toFixed(1)}%</p>
                      </div>
                    </div>

                    <div className="mb-2">
                      <p className="text-xs text-gray-600 mb-1">Loan Volume</p>
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(bank.loanVolume)}</p>
                    </div>

                    <div className="text-xs text-gray-500">
                      Last sync: {formatDate(bank.lastSync)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Loans Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  Active Loans
                  <Badge variant="secondary" className="ml-2">
                    {bankingLoans?.length || 0} займов
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={selectedBank} onValueChange={setSelectedBank}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все банки</SelectItem>
                      {bankingData?.map((bank) => (
                        <SelectItem key={bank.bankId} value={bank.bankId}>
                          {bank.bankName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedRisk} onValueChange={setSelectedRisk}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все риски</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bankingLoans?.map((loan) => (
                  <motion.div
                    key={loan.loanId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-5 border-2 rounded-xl ${
                      loan.riskLevel === 'critical' ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                    } hover:shadow-md transition-all`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            loan.riskLevel === 'critical'
                              ? 'bg-red-100'
                              : loan.riskLevel === 'high'
                              ? 'bg-orange-100'
                              : 'bg-green-100'
                          }`}
                        >
                          <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{loan.artworkTitle}</h4>
                            <Badge className={getRiskColor(loan.riskLevel)}>
                              {loan.riskLevel}
                            </Badge>
                            <Badge variant="outline">{loan.bankName}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">Loan ID: {loan.loanId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {formatCurrency(loan.loanAmount)}
                        </div>
                        <p className="text-xs text-gray-500">
                          / {formatCurrency(loan.artworkValue)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Current LTV</p>
                        <div className="flex items-center gap-2">
                          <Progress value={loan.currentLTV} className="flex-1" />
                          <span className="text-sm font-semibold">{loan.currentLTV.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Interest Rate</p>
                        <p className="text-lg font-semibold text-gray-900">{loan.interestRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Term</p>
                        <p className="text-lg font-semibold text-gray-900">{loan.term} мес</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Margin Call</p>
                        <p className="text-lg font-semibold text-orange-600">{loan.marginCallThreshold}%</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
                      <div className="flex items-center gap-4">
                        <span>Last valuation: {formatDate(loan.lastValuation)}</span>
                        <span>Next valuation: {formatDate(loan.nextValuation)}</span>
                      </div>
                      <Badge
                        variant={loan.status === 'active' ? 'default' : 'secondary'}
                      >
                        {loan.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}

                {/* Empty State */}
                {bankingLoans?.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-12">
                    <CreditCard className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-gray-600">Нет активных займов</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default BankingIntegrationDashboard;
