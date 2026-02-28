import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Building,
  DollarSign,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Loader2,
  FileSpreadsheet,
  Filter,
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
import { Checkbox } from '@/components/ui/checkbox';

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

const BankingLTVReportGenerator: React.FC = () => {
  const [selectedBank, setSelectedBank] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [selectedLoans, setSelectedLoans] = useState<Set<string>>(new Set());
  const [generating, setGenerating] = useState(false);
  const [loans, setLoans] = useState<BankingLoan[]>([]);

  // Mock data
  React.useEffect(() => {
    const mockLoans: BankingLoan[] = [
      {
        loanId: 'LOAN-001',
        bankId: 'sberbank',
        bankName: 'Сбербанк',
        artworkId: 'artwork-001',
        artworkTitle: 'Композиция VIII',
        artworkValue: 17594700,
        loanAmount: 11500000,
        ltv: 65.4,
        currentLTV: 65.4,
        interestRate: 8.5,
        term: 24,
        status: 'active',
        marginCallThreshold: 80,
        lastValuation: new Date().toISOString(),
        nextValuation: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        riskLevel: 'low',
      },
      {
        loanId: 'LOAN-002',
        bankId: 'vtb',
        bankName: 'ВТБ',
        artworkId: 'artwork-002',
        artworkTitle: 'Городской пейзаж',
        artworkValue: 33250000,
        loanAmount: 25000000,
        ltv: 75.2,
        currentLTV: 75.2,
        interestRate: 9.0,
        term: 36,
        status: 'active',
        marginCallThreshold: 80,
        lastValuation: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        nextValuation: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        riskLevel: 'medium',
      },
      {
        loanId: 'LOAN-003',
        bankId: 'sberbank',
        bankName: 'Сбербанк',
        artworkId: 'artwork-003',
        artworkTitle: 'Абстрактная композиция №12',
        artworkValue: 8500000,
        loanAmount: 7200000,
        ltv: 84.7,
        currentLTV: 84.7,
        interestRate: 10.5,
        term: 12,
        status: 'active',
        marginCallThreshold: 80,
        lastValuation: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        nextValuation: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
        riskLevel: 'critical',
      },
      {
        loanId: 'LOAN-004',
        bankId: 'alfabank',
        bankName: 'Альфа-Банк',
        artworkId: 'artwork-004',
        artworkTitle: 'Портрет неизвестной',
        artworkValue: 12000000,
        loanAmount: 7800000,
        ltv: 65.0,
        currentLTV: 65.0,
        interestRate: 8.0,
        term: 24,
        status: 'active',
        marginCallThreshold: 80,
        lastValuation: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        nextValuation: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        riskLevel: 'low',
      },
    ];

    setLoans(mockLoans);
  }, []);

  const filteredLoans = loans.filter((loan) => {
    if (selectedBank !== 'all' && loan.bankId !== selectedBank) return false;
    if (selectedRisk !== 'all' && loan.riskLevel !== selectedRisk) return false;
    return true;
  });

  const toggleLoanSelection = (loanId: string) => {
    const newSelection = new Set(selectedLoans);
    if (newSelection.has(loanId)) {
      newSelection.delete(loanId);
    } else {
      newSelection.add(loanId);
    }
    setSelectedLoans(newSelection);
  };

  const selectAll = () => {
    setSelectedLoans(new Set(filteredLoans.map((l) => l.loanId)));
  };

  const deselectAll = () => {
    setSelectedLoans(new Set());
  };

  const generateReport = async (format: 'pdf' | 'excel' | 'json') => {
    setGenerating(true);

    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const selectedLoanData = loans.filter((l) => selectedLoans.has(l.loanId));

    // In production: call backend API to generate report
    // const response = await fetch('/api/banking/generate-report', {
    //   method: 'POST',
    //   body: JSON.stringify({ loans: selectedLoanData, format }),
    // });

    // Mock download
    const reportData = {
      generated: new Date().toISOString(),
      format,
      totalLoans: selectedLoanData.length,
      totalValue: selectedLoanData.reduce((sum, l) => sum + l.artworkValue, 0),
      totalLoanAmount: selectedLoanData.reduce((sum, l) => sum + l.loanAmount, 0),
      avgLTV: selectedLoanData.reduce((sum, l) => sum + l.currentLTV, 0) / selectedLoanData.length,
      loans: selectedLoanData,
    };

    // Create downloadable file
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ltv-report-${Date.now()}.${format === 'json' ? 'json' : format}`;
    link.click();
    URL.revokeObjectURL(url);

    setGenerating(false);
  };

  const getRiskColor = (risk: string) => {
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-orange-100 text-orange-700',
      critical: 'bg-red-100 text-red-700',
    };
    return colors[risk] || 'bg-gray-100 text-gray-700';
  };

  const getLTVColor = (ltv: number, threshold: number) => {
    if (ltv >= threshold) return 'text-red-600';
    if (ltv >= threshold - 10) return 'text-orange-600';
    return 'text-green-600';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const totalValue = filteredLoans.reduce((sum, l) => sum + l.artworkValue, 0);
  const totalLoan = filteredLoans.reduce((sum, l) => sum + l.loanAmount, 0);
  const avgLTV = filteredLoans.length > 0 
    ? filteredLoans.reduce((sum, l) => sum + l.currentLTV, 0) / filteredLoans.length 
    : 0;
  const criticalLoans = filteredLoans.filter((l) => l.riskLevel === 'critical').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <Badge variant="outline">{filteredLoans.length}</Badge>
            </div>
            <p className="text-2xl font-bold text-blue-600">{selectedLoans.size}</p>
            <p className="text-sm text-gray-600">Selected Loans</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-xl font-bold text-green-600">{formatCurrency(totalValue)}</p>
            <p className="text-sm text-gray-600">Total Value</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingDown className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-600">{avgLTV.toFixed(1)}%</p>
            <p className="text-sm text-gray-600">Avg LTV</p>
          </CardContent>
        </Card>

        <Card className={criticalLoans > 0 ? 'border-red-300' : ''}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              {criticalLoans > 0 && <Badge className="bg-red-100 text-red-700">!</Badge>}
            </div>
            <p className="text-2xl font-bold text-red-600">{criticalLoans}</p>
            <p className="text-sm text-gray-600">Critical Risk</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600" />
              Banking LTV Report Generator
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedBank} onValueChange={setSelectedBank}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все банки</SelectItem>
                  <SelectItem value="sberbank">Сбербанк</SelectItem>
                  <SelectItem value="vtb">ВТБ</SelectItem>
                  <SelectItem value="alfabank">Альфа-Банк</SelectItem>
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

              <Button variant="outline" size="sm" onClick={selectAll}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={deselectAll}>
                Deselect All
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredLoans.map((loan) => (
              <motion.div
                key={loan.loanId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 border-2 rounded-lg transition-all ${
                  selectedLoans.has(loan.loanId) 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={selectedLoans.has(loan.loanId)}
                    onCheckedChange={() => toggleLoanSelection(loan.loanId)}
                    className="mt-1"
                  />

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900">{loan.artworkTitle}</h3>
                        <Badge variant="outline">{loan.loanId}</Badge>
                        <Badge className={getRiskColor(loan.riskLevel)}>
                          {loan.riskLevel.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">LTV</p>
                        <p className={`text-2xl font-bold ${getLTVColor(loan.currentLTV, loan.marginCallThreshold)}`}>
                          {loan.currentLTV.toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-600">Bank</p>
                        <p className="font-semibold text-sm flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          {loan.bankName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Artwork Value</p>
                        <p className="font-semibold text-sm">{formatCurrency(loan.artworkValue)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Loan Amount</p>
                        <p className="font-semibold text-sm">{formatCurrency(loan.loanAmount)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Interest Rate</p>
                        <p className="font-semibold text-sm">{loan.interestRate}%</p>
                      </div>
                    </div>

                    <div className="mb-2">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>LTV Progress</span>
                        <span>Margin Call at {loan.marginCallThreshold}%</span>
                      </div>
                      <Progress 
                        value={(loan.currentLTV / loan.marginCallThreshold) * 100} 
                        className={`h-2 ${
                          loan.currentLTV >= loan.marginCallThreshold 
                            ? '[&>div]:bg-red-600' 
                            : loan.currentLTV >= loan.marginCallThreshold - 10
                            ? '[&>div]:bg-orange-600'
                            : '[&>div]:bg-green-600'
                        }`}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Last: {formatDate(loan.lastValuation)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Next: {formatDate(loan.nextValuation)}
                      </span>
                      <span>Term: {loan.term} months</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredLoans.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No loans match the current filters</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      {selectedLoans.size > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-blue-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-600" />
                Export Report ({selectedLoans.size} loans selected)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button
                  onClick={() => generateReport('pdf')}
                  disabled={generating}
                  className="flex-1"
                >
                  {generating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4 mr-2" />
                  )}
                  Export as PDF
                </Button>

                <Button
                  onClick={() => generateReport('excel')}
                  disabled={generating}
                  variant="outline"
                  className="flex-1"
                >
                  {generating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                  )}
                  Export as Excel
                </Button>

                <Button
                  onClick={() => generateReport('json')}
                  disabled={generating}
                  variant="outline"
                  className="flex-1"
                >
                  {generating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4 mr-2" />
                  )}
                  Export as JSON
                </Button>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                <p className="font-semibold mb-1">Report will include:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Selected {selectedLoans.size} loan details</li>
                  <li>LTV calculations and risk assessments</li>
                  <li>Artwork valuations and loan amounts</li>
                  <li>Margin call alerts and recommendations</li>
                  <li>Bank-specific summaries</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default BankingLTVReportGenerator;
