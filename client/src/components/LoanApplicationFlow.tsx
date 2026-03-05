import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Image as ImageIcon,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Calculator,
  FileText,
  Building,
  Clock,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface Artwork {
  id: number;
  title: string;
  artistId: number;
  artistName?: string;
  year: number;
  technique: string;
  currentPrice: number;
  imageUrl: string;
  status: string;
  blockchainVerified: boolean;
}

interface LoanCalculation {
  artworkValue: number;
  loanAmount: number;
  ltv: number;
  interestRate: number;
  term: number;
  monthlyPayment: number;
  totalPayment: number;
  riskLevel: 'low' | 'medium' | 'high';
}

type Step = 'artwork' | 'calculator' | 'form' | 'review' | 'submitted';

export default function LoanApplicationFlow() {
  const [currentStep, setCurrentStep] = useState<Step>('artwork');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [loanCalculation, setLoanCalculation] = useState<LoanCalculation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  // Mock artworks data
  const artworks: Artwork[] = [
    {
      id: 1,
      title: 'Закат над морем',
      artistId: 1,
      artistName: 'Иван Айвазовский',
      year: 1850,
      technique: 'Масло на холсте',
      currentPrice: 25000000,
      imageUrl: '/api/placeholder/400/300',
      status: 'available',
      blockchainVerified: true,
    },
    {
      id: 2,
      title: 'Портрет дамы',
      artistId: 2,
      artistName: 'Валентин Серов',
      year: 1895,
      technique: 'Масло на холсте',
      currentPrice: 18000000,
      imageUrl: '/api/placeholder/400/300',
      status: 'available',
      blockchainVerified: true,
    },
    {
      id: 3,
      title: 'Натюрморт с фруктами',
      artistId: 3,
      artistName: 'Илья Машков',
      year: 1910,
      technique: 'Масло на холсте',
      currentPrice: 12500000,
      imageUrl: '/api/placeholder/400/300',
      status: 'available',
      blockchainVerified: false,
    },
    {
      id: 4,
      title: 'Московский пейзаж',
      artistId: 4,
      artistName: 'Константин Коровин',
      year: 1902,
      technique: 'Масло на холсте',
      currentPrice: 22000000,
      imageUrl: '/api/placeholder/400/300',
      status: 'available',
      blockchainVerified: true,
    },
  ];

  const banks = [
    { id: 'sberbank', name: 'Сбербанк', maxLTV: 70, minValue: 1000000, rates: { low: 8.5, medium: 10.5, high: 12.5 } },
    { id: 'vtb', name: 'ВТБ', maxLTV: 65, minValue: 1500000, rates: { low: 9.0, medium: 11.0, high: 13.0 } },
    { id: 'alfabank', name: 'Альфа-Банк', maxLTV: 75, minValue: 800000, rates: { low: 8.0, medium: 10.0, high: 12.0 } },
    { id: 'tinkoff', name: 'Тинькофф Банк', maxLTV: 68, minValue: 1200000, rates: { low: 8.8, medium: 10.8, high: 12.8 } },
  ];

  const filteredArtworks = artworks.filter(artwork =>
    artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artwork.artistName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateLoan = (artwork: Artwork, bank: typeof banks[0], requestedAmount: number, term: number) => {
    const ltv = (requestedAmount / artwork.currentPrice) * 100;
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    let interestRate = bank.rates.low;

    if (ltv > 65) {
      riskLevel = 'high';
      interestRate = bank.rates.high;
    } else if (ltv > 50) {
      riskLevel = 'medium';
      interestRate = bank.rates.medium;
    }

    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment = (requestedAmount * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                          (Math.pow(1 + monthlyRate, term) - 1);
    const totalPayment = monthlyPayment * term;

    return {
      artworkValue: artwork.currentPrice,
      loanAmount: requestedAmount,
      ltv,
      interestRate,
      term,
      monthlyPayment,
      totalPayment,
      riskLevel,
    };
  };

  const handleSelectArtwork = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setCurrentStep('calculator');
  };

  const handleCalculate = (amount: number, term: number) => {
    if (!selectedArtwork || !selectedBank) return;

    const bank = banks.find(b => b.id === selectedBank);
    if (!bank) return;

    const calculation = calculateLoan(selectedArtwork, bank, amount, term);
    setLoanCalculation(calculation);
    setCurrentStep('form');
  };

  const handleSubmitApplication = () => {
    toast.success('Заявка успешно отправлена!', {
      description: 'Банк рассмотрит вашу заявку в течение 2-3 рабочих дней',
    });
    setCurrentStep('submitted');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const renderStepIndicator = () => {
    const steps = [
      { id: 'artwork', label: 'Выбор произведения' },
      { id: 'calculator', label: 'Расчёт займа' },
      { id: 'form', label: 'Заявка' },
      { id: 'review', label: 'Проверка' },
    ];

    const currentIndex = steps.findIndex(s => s.id === currentStep);

    return (
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index <= currentIndex
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index < currentIndex ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                index <= currentIndex ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-4 ${
                index < currentIndex ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      {currentStep !== 'submitted' && renderStepIndicator()}

      <AnimatePresence mode="wait">
        {/* Step 1: Artwork Selection */}
        {currentStep === 'artwork' && (
          <motion.div
            key="artwork"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Выберите произведение искусства</CardTitle>
                <CardDescription>Выберите работу из вашей коллекции для залога</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Поиск по названию или автору..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {filteredArtworks.map((artwork) => (
                    <motion.div
                      key={artwork.id}
                      whileHover={{ scale: 1.02 }}
                      className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => handleSelectArtwork(artwork)}
                    >
                      <div className="aspect-video bg-gray-200 flex items-center justify-center">
                        <ImageIcon className="w-16 h-16 text-gray-400" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">{artwork.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{artwork.artistName}, {artwork.year}</p>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-500">{artwork.technique}</span>
                          {artwork.blockchainVerified && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Верифицировано
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-900">
                            {formatCurrency(artwork.currentPrice)}
                          </span>
                          <Button size="sm">
                            Выбрать
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Calculator */}
        {currentStep === 'calculator' && selectedArtwork && (
          <motion.div
            key="calculator"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <LoanCalculator
              artwork={selectedArtwork}
              banks={banks}
              selectedBank={selectedBank}
              onSelectBank={setSelectedBank}
              onCalculate={handleCalculate}
              onBack={() => setCurrentStep('artwork')}
              formatCurrency={formatCurrency}
            />
          </motion.div>
        )}

        {/* Step 3: Application Form */}
        {currentStep === 'form' && selectedArtwork && loanCalculation && (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <LoanApplicationForm
              artwork={selectedArtwork}
              calculation={loanCalculation}
              bank={banks.find(b => b.id === selectedBank)!}
              onSubmit={handleSubmitApplication}
              onBack={() => setCurrentStep('calculator')}
              formatCurrency={formatCurrency}
            />
          </motion.div>
        )}

        {/* Step 4: Submitted */}
        {currentStep === 'submitted' && (
          <motion.div
            key="submitted"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Заявка отправлена!</h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Ваша заявка на займ успешно отправлена в банк. Ожидайте уведомление о решении в течение 2-3 рабочих дней.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <Button onClick={() => window.location.reload()}>
                    Подать новую заявку
                  </Button>
                  <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
                    Вернуться в панель
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Loan Calculator Component
function LoanCalculator({
  artwork,
  banks,
  selectedBank,
  onSelectBank,
  onCalculate,
  onBack,
  formatCurrency,
}: any) {
  const [requestedAmount, setRequestedAmount] = useState(artwork.currentPrice * 0.6);
  const [term, setTerm] = useState(24);

  const bank = banks.find((b: any) => b.id === selectedBank);
  const maxLoanAmount = bank ? (artwork.currentPrice * bank.maxLTV) / 100 : 0;
  const ltv = (requestedAmount / artwork.currentPrice) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Расчёт параметров займа</CardTitle>
        <CardDescription>Настройте параметры займа под ваши потребности</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selected Artwork Info */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Выбранное произведение:</h3>
          <p className="text-gray-700">{artwork.title}</p>
          <p className="text-sm text-gray-600">{artwork.artistName}, {artwork.year}</p>
          <p className="text-lg font-bold text-gray-900 mt-2">
            Оценка: {formatCurrency(artwork.currentPrice)}
          </p>
        </div>

        {/* Bank Selection */}
        <div className="space-y-2">
          <Label>Выберите банк</Label>
          <Select value={selectedBank} onValueChange={onSelectBank}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите банк..." />
            </SelectTrigger>
            <SelectContent>
              {banks.map((bank: any) => (
                <SelectItem key={bank.id} value={bank.id}>
                  {bank.name} (макс. LTV: {bank.maxLTV}%)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedBank && (
          <>
            {/* Loan Amount */}
            <div className="space-y-2">
              <Label>Сумма займа: {formatCurrency(requestedAmount)}</Label>
              <Input
                type="range"
                min={artwork.currentPrice * 0.3}
                max={maxLoanAmount}
                step={100000}
                value={requestedAmount}
                onChange={(e) => setRequestedAmount(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{formatCurrency(artwork.currentPrice * 0.3)}</span>
                <span>{formatCurrency(maxLoanAmount)}</span>
              </div>
            </div>

            {/* Term */}
            <div className="space-y-2">
              <Label>Срок займа: {term} месяцев</Label>
              <Input
                type="range"
                min={6}
                max={60}
                step={6}
                value={term}
                onChange={(e) => setTerm(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>6 мес</span>
                <span>60 мес</span>
              </div>
            </div>

            {/* LTV Indicator */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">LTV (Loan-to-Value):</span>
                <Badge variant={ltv > 65 ? 'destructive' : ltv > 50 ? 'default' : 'secondary'}>
                  {ltv.toFixed(1)}%
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    ltv > 65 ? 'bg-red-600' : ltv > 50 ? 'bg-yellow-600' : 'bg-green-600'
                  }`}
                  style={{ width: `${Math.min(ltv, 100)}%` }}
                />
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
          <Button
            onClick={() => onCalculate(requestedAmount, term)}
            disabled={!selectedBank}
            className="flex-1"
          >
            Продолжить
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Loan Application Form Component
function LoanApplicationForm({ artwork, calculation, bank, onSubmit, onBack, formatCurrency }: any) {
  return (
    <div className="space-y-6">
      {/* Loan Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Сводка по займу</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Произведение</p>
              <p className="font-semibold text-gray-900">{artwork.title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Оценка</p>
              <p className="font-semibold text-gray-900">{formatCurrency(calculation.artworkValue)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Сумма займа</p>
              <p className="font-semibold text-gray-900">{formatCurrency(calculation.loanAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">LTV</p>
              <Badge variant={calculation.ltv > 65 ? 'destructive' : 'default'}>
                {calculation.ltv.toFixed(1)}%
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Процентная ставка</p>
              <p className="font-semibold text-gray-900">{calculation.interestRate}% годовых</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Срок</p>
              <p className="font-semibold text-gray-900">{calculation.term} месяцев</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Ежемесячный платёж</p>
              <p className="font-semibold text-gray-900">{formatCurrency(calculation.monthlyPayment)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Общая сумма выплат</p>
              <p className="font-semibold text-gray-900">{formatCurrency(calculation.totalPayment)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Form */}
      <Card>
        <CardHeader>
          <CardTitle>Контактная информация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Имя</Label>
              <Input placeholder="Иван" />
            </div>
            <div className="space-y-2">
              <Label>Фамилия</Label>
              <Input placeholder="Иванов" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" placeholder="ivan@example.com" />
          </div>
          <div className="space-y-2">
            <Label>Телефон</Label>
            <Input placeholder="+7 (999) 123-45-67" />
          </div>
          <div className="space-y-2">
            <Label>Комментарий (опционально)</Label>
            <Textarea placeholder="Дополнительная информация для банка..." rows={3} />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>
        <Button onClick={onSubmit} className="flex-1">
          Отправить заявку
          <CheckCircle2 className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
