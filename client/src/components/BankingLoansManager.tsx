import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Search,
  Filter,
  Download,
  Eye,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2,
  ArrowUpDown,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { trpc } from '@/lib/trpc';

/**
 * Banking Loans Manager - Comprehensive loan management dashboard
 */
const BankingLoansManager: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'loanId' | 'amount' | 'ltv' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Fetch loans from API
  const { data: loans, isLoading, refetch } = trpc.core.getBankingLoans.useQuery({
    status: statusFilter !== 'all' ? statusFilter : undefined,
    riskLevel: riskFilter !== 'all' ? riskFilter : undefined,
    limit: 100,
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: number | Date | string) => {
    const date = typeof dateString === 'number' ? new Date(dateString) : new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'margin_call':
        return 'bg-red-100 text-red-700';
      case 'paid':
        return 'bg-blue-100 text-blue-700';
      case 'defaulted':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'high':
        return 'bg-orange-100 text-orange-700';
      case 'critical':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getLTVColor = (ltv: number) => {
    if (ltv < 50) return 'text-green-600';
    if (ltv < 65) return 'text-blue-600';
    if (ltv < 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Filter and sort loans
  const filteredLoans = loans
    ?.filter((loan) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        loan.loanId?.toLowerCase().includes(query) ||
        loan.artworkId?.toString().includes(query)
      );
    })
    .sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case 'loanId':
          aVal = a.loanId || '';
          bVal = b.loanId || '';
          break;
        case 'amount':
          aVal = a.loanAmount || 0;
          bVal = b.loanAmount || 0;
          break;
        case 'ltv':
          aVal = a.currentLTV || 0;
          bVal = b.currentLTV || 0;
          break;
        case 'date':
          aVal = a.createdAt || 0;
          bVal = b.createdAt || 0;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    }) || [];

  const handleExport = () => {
    // Export to CSV
    const csvContent = [
      ['Loan ID', 'Artwork ID', 'Amount', 'LTV', 'Status', 'Risk', 'Created'].join(','),
      ...filteredLoans.map((loan) =>
        [
          loan.loanId,
          loan.artworkId,
          loan.loanAmount,
          loan.currentLTV?.toFixed(2),
          loan.status,
          loan.riskLevel,
          formatDate(loan.createdAt || Date.now()),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loans_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Загрузка займов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Поиск по ID займа..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Все статусы</option>
              <option value="active">Активные</option>
              <option value="pending">Ожидают</option>
              <option value="margin_call">Margin Call</option>
              <option value="paid">Оплачены</option>
              <option value="defaulted">Дефолт</option>
            </select>

            {/* Risk Filter */}
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Все риски</option>
              <option value="low">Низкий</option>
              <option value="medium">Средний</option>
              <option value="high">Высокий</option>
              <option value="critical">Критический</option>
            </select>

            {/* Export Button */}
            <Button onClick={handleExport} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Экспорт CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loans Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Займы ({filteredLoans.length})</span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (sortBy === 'date') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortBy('date');
                    setSortOrder('desc');
                  }
                }}
              >
                <ArrowUpDown className="w-4 h-4 mr-2" />
                Сортировка
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredLoans.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Займы не найдены</p>
              </div>
            ) : (
              filteredLoans.map((loan) => (
                <motion.div
                  key={loan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => {
                    setSelectedLoan(loan);
                    setShowDetails(true);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{loan.loanId}</h3>
                        <Badge className={getStatusColor(loan.status || '')}>
                          {loan.status === 'active' && 'Активный'}
                          {loan.status === 'pending' && 'Ожидание'}
                          {loan.status === 'margin_call' && 'Margin Call'}
                          {loan.status === 'paid' && 'Оплачен'}
                          {loan.status === 'defaulted' && 'Дефолт'}
                        </Badge>
                        <Badge className={getRiskColor(loan.riskLevel || '')}>
                          {loan.riskLevel === 'low' && 'Низкий риск'}
                          {loan.riskLevel === 'medium' && 'Средний'}
                          {loan.riskLevel === 'high' && 'Высокий'}
                          {loan.riskLevel === 'critical' && 'Критический'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Сумма займа</p>
                          <p className="font-semibold">
                            {formatCurrency(loan.loanAmount || 0)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Оценка artwork</p>
                          <p className="font-semibold">
                            {formatCurrency(loan.artworkValue || 0)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">LTV</p>
                          <p className={`font-semibold ${getLTVColor(loan.currentLTV || 0)}`}>
                            {loan.currentLTV?.toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Создан</p>
                          <p className="font-semibold">
                            {formatDate(loan.createdAt || Date.now())}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="ml-4">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* LTV Progress Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-500">LTV Progress</span>
                      <span className={getLTVColor(loan.currentLTV || 0)}>
                        {loan.currentLTV?.toFixed(1)}% / {loan.marginCallThreshold || 80}%
                      </span>
                    </div>
                    <Progress
                      value={(loan.currentLTV || 0)}
                      max={loan.marginCallThreshold || 80}
                      className="h-2"
                    />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Loan Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Детали займа {selectedLoan?.loanId}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          {selectedLoan && (
            <div className="space-y-6">
              {/* Status Cards */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Статус</p>
                      <Badge className={`${getStatusColor(selectedLoan.status)} text-lg px-4 py-1`}>
                        {selectedLoan.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Риск</p>
                      <Badge className={`${getRiskColor(selectedLoan.riskLevel)} text-lg px-4 py-1`}>
                        {selectedLoan.riskLevel}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">LTV</p>
                      <p className={`text-2xl font-bold ${getLTVColor(selectedLoan.currentLTV)}`}>
                        {selectedLoan.currentLTV?.toFixed(1)}%
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Loan Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Информация о займе</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">ID займа</p>
                      <p className="font-semibold">{selectedLoan.loanId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">ID произведения</p>
                      <p className="font-semibold">#{selectedLoan.artworkId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Сумма займа</p>
                      <p className="font-semibold text-lg">
                        {formatCurrency(selectedLoan.loanAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Оценка artwork</p>
                      <p className="font-semibold text-lg">
                        {formatCurrency(selectedLoan.artworkValue)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Процентная ставка</p>
                      <p className="font-semibold">{selectedLoan.interestRate}% годовых</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Срок</p>
                      <p className="font-semibold">{selectedLoan.termMonths} месяцев</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Margin Call порог</p>
                      <p className="font-semibold">{selectedLoan.marginCallThreshold}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Дата создания</p>
                      <p className="font-semibold">
                        {formatDate(selectedLoan.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-3">
                <Button className="flex-1">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Запросить переоценку
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Скачать отчет
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BankingLoansManager;
