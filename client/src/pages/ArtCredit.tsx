import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard, Calculator, TrendingUp, Shield, Clock, CheckCircle2,
  AlertCircle, FileText, DollarSign, Percent, Calendar, Building2,
  User, Phone, Mail, Home, Briefcase, Plus, Info
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/_core/hooks/useAuth';
import { toast } from 'sonner';

interface LoanApplication {
  id: string;
  amount: number;
  term: number; // months
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'closed';
  interestRate: number;
  monthlyPayment: number;
  artwork?: {
    title: string;
    artist: string;
    value: number;
  };
  appliedAt: string;
  decidedAt?: string;
}

interface LoanOffer {
  id: string;
  title: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  interestRate: { min: number; max: number };
  term: { min: number; max: number }; // months
  features: string[];
  requirements: string[];
}

export default function ArtCreditPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'offers' | 'calculator' | 'my-loans' | 'apply'>('offers');
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  // Calculator State
  const [loanAmount, setLoanAmount] = useState(10000);
  const [loanTerm, setLoanTerm] = useState(24);
  const [interestRate, setInterestRate] = useState(12);

  // Application Form State
  const [application, setApplication] = useState({
    amount: '',
    term: '24',
    purpose: 'purchase',
    artworkId: '',
    fullName: '',
    email: '',
    phone: '',
    income: '',
    employment: '',
    address: '',
  });

  // Mock Data
  const loanOffers: LoanOffer[] = [
    {
      id: '1',
      title: 'Арт-кредит Стандарт',
      description: 'Для покупки произведений искусства стоимостью до $50,000',
      minAmount: 5000,
      maxAmount: 50000,
      interestRate: { min: 10, max: 15 },
      term: { min: 12, max: 60 },
      features: [
        'Быстрое рассмотрение (2-3 дня)',
        'Без первоначального взноса',
        'Гибкий график платежей',
        'Страхование в подарок на 1 год',
      ],
      requirements: [
        'Возраст от 21 года',
        'Стабильный доход',
        'Кредитная история',
      ],
    },
    {
      id: '2',
      title: 'Арт-кредит Премиум',
      description: 'Для покупки ценных произведений от $50,000',
      minAmount: 50000,
      maxAmount: 500000,
      interestRate: { min: 8, max: 12 },
      term: { min: 24, max: 120 },
      features: [
        'Персональный менеджер',
        'Индивидуальные условия',
        'Консультация экспертов',
        'Полное страхование включено',
        'Льготный период до 6 месяцев',
      ],
      requirements: [
        'Высокий уровень дохода',
        'Отличная кредитная история',
        'Подтверждение финансовых активов',
      ],
    },
    {
      id: '3',
      title: 'Арт-кредит для галерей',
      description: 'Для пополнения коллекции галереи',
      minAmount: 25000,
      maxAmount: 1000000,
      interestRate: { min: 7, max: 10 },
      term: { min: 12, max: 84 },
      features: [
        'Кредитная линия для галерей',
        'Возобновляемый лимит',
        'Специальные условия для B2B',
        'Отсрочка платежей при выставках',
      ],
      requirements: [
        'Регистрация галереи',
        'История работы от 2 лет',
        'Финансовая отчётность',
      ],
    },
  ];

  const mockApplications: LoanApplication[] = [
    {
      id: '1',
      amount: 15000,
      term: 36,
      purpose: 'Покупка картины "Закат"',
      status: 'active',
      interestRate: 12,
      monthlyPayment: 498,
      artwork: {
        title: 'Закат над морем',
        artist: 'Иван Петров',
        value: 18000,
      },
      appliedAt: '2026-01-15',
    },
  ];

  // Calculate monthly payment
  const calculateMonthlyPayment = (amount: number, term: number, rate: number): number => {
    const monthlyRate = rate / 100 / 12;
    const numPayments = term;
    const payment =
      (amount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);
    return Math.round(payment);
  };

  const calculateTotalPayment = (amount: number, term: number, rate: number): number => {
    return calculateMonthlyPayment(amount, term, rate) * term;
  };

  const calculateTotalInterest = (amount: number, term: number, rate: number): number => {
    return calculateTotalPayment(amount, term, rate) - amount;
  };

  const monthlyPayment = calculateMonthlyPayment(loanAmount, loanTerm, interestRate);
  const totalPayment = calculateTotalPayment(loanAmount, loanTerm, interestRate);
  const totalInterest = calculateTotalInterest(loanAmount, loanTerm, interestRate);

  const handleSubmitApplication = () => {
    if (!application.amount || !application.fullName || !application.email || !application.phone) {
      toast.error('Заполните все обязательные поля');
      return;
    }

    // TODO: API call
    toast.success('Заявка отправлена! Мы свяжемся с вами в течение 24 часов.');
    setShowApplicationForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <CreditCard className="w-10 h-10 text-green-600" />
                Арт-кредитование
              </h1>
              <p className="text-gray-600">
                Финансирование покупки произведений искусства на выгодных условиях
              </p>
            </div>
            <Button onClick={() => setShowApplicationForm(true)} size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Подать заявку
            </Button>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Быстрое решение</p>
                    <p className="text-xl font-bold">2-3 дня</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Percent className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ставка от</p>
                    <p className="text-xl font-bold">7%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Сумма до</p>
                    <p className="text-xl font-bold">$1M</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Shield className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Страхование</p>
                    <p className="text-xl font-bold">Включено</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="offers">
              <FileText className="w-4 h-4 mr-2" />
              Кредитные продукты
            </TabsTrigger>
            <TabsTrigger value="calculator">
              <Calculator className="w-4 h-4 mr-2" />
              Калькулятор
            </TabsTrigger>
            <TabsTrigger value="my-loans">
              <CreditCard className="w-4 h-4 mr-2" />
              Мои кредиты ({mockApplications.length})
            </TabsTrigger>
          </TabsList>

          {/* Offers Tab */}
          <TabsContent value="offers" className="space-y-6">
            {loanOffers.map((offer, index) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl mb-2">{offer.title}</CardTitle>
                        <CardDescription>{offer.description}</CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800 text-lg px-4 py-1">
                        От {offer.interestRate.min}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Сумма кредита</p>
                        <p className="text-xl font-bold">
                          ${offer.minAmount.toLocaleString()} - ${offer.maxAmount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Процентная ставка</p>
                        <p className="text-xl font-bold">
                          {offer.interestRate.min}% - {offer.interestRate.max}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Срок кредита</p>
                        <p className="text-xl font-bold">
                          {offer.term.min} - {offer.term.max} мес.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <p className="font-semibold mb-3">Преимущества:</p>
                        <ul className="space-y-2">
                          {offer.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold mb-3">Требования:</p>
                        <ul className="space-y-2">
                          {offer.requirements.map((req, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Button className="w-full" size="lg" onClick={() => setShowApplicationForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Подать заявку
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* Calculator Tab */}
          <TabsContent value="calculator">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Параметры кредита</CardTitle>
                  <CardDescription>Настройте параметры для расчёта</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Сумма кредита: ${loanAmount.toLocaleString()}</Label>
                    <Slider
                      value={[loanAmount]}
                      onValueChange={(v) => setLoanAmount(v[0])}
                      min={5000}
                      max={500000}
                      step={5000}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>$5,000</span>
                      <span>$500,000</span>
                    </div>
                  </div>

                  <div>
                    <Label>Срок кредита: {loanTerm} месяцев</Label>
                    <Slider
                      value={[loanTerm]}
                      onValueChange={(v) => setLoanTerm(v[0])}
                      min={12}
                      max={120}
                      step={12}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>12 мес</span>
                      <span>120 мес</span>
                    </div>
                  </div>

                  <div>
                    <Label>Процентная ставка: {interestRate}%</Label>
                    <Slider
                      value={[interestRate]}
                      onValueChange={(v) => setInterestRate(v[0])}
                      min={7}
                      max={20}
                      step={0.5}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>7%</span>
                      <span>20%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Результат расчёта</CardTitle>
                  <CardDescription>Прогнозируемые платежи</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Ежемесячный платёж</p>
                    <p className="text-4xl font-bold text-green-600">
                      ${monthlyPayment.toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Общая сумма выплат</span>
                      <span className="text-lg font-bold">${totalPayment.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Переплата</span>
                      <span className="text-lg font-bold text-orange-600">
                        ${totalInterest.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Срок кредита</span>
                      <span className="text-lg font-bold">
                        {loanTerm} мес. ({Math.round(loanTerm / 12)} лет)
                      </span>
                    </div>
                  </div>

                  <Button className="w-full" size="lg" onClick={() => setShowApplicationForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Подать заявку на этих условиях
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* My Loans Tab */}
          <TabsContent value="my-loans">
            {mockApplications.length > 0 ? (
              <div className="space-y-4">
                {mockApplications.map((loan) => (
                  <Card key={loan.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{loan.purpose}</CardTitle>
                          <CardDescription>Заявка от {new Date(loan.appliedAt).toLocaleDateString('ru-RU')}</CardDescription>
                        </div>
                        <Badge
                          className={
                            loan.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : loan.status === 'approved'
                              ? 'bg-blue-100 text-blue-800'
                              : loan.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {loan.status === 'active' && 'Активен'}
                          {loan.status === 'approved' && 'Одобрен'}
                          {loan.status === 'pending' && 'На рассмотрении'}
                          {loan.status === 'rejected' && 'Отклонён'}
                          {loan.status === 'closed' && 'Закрыт'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Сумма кредита</p>
                          <p className="text-xl font-bold">${loan.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Ежемесячный платёж</p>
                          <p className="text-xl font-bold">${loan.monthlyPayment.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Ставка</p>
                          <p className="text-xl font-bold">{loan.interestRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Срок</p>
                          <p className="text-xl font-bold">{loan.term} мес.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">У вас пока нет активных кредитов</p>
                  <Button onClick={() => setShowApplicationForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Подать заявку
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Application Form Dialog */}
      <Dialog open={showApplicationForm} onOpenChange={setShowApplicationForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Заявка на арт-кредит</DialogTitle>
            <DialogDescription>
              Заполните форму, и мы свяжемся с вами в течение 24 часов
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Loan Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Желаемая сумма ($) *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="10000"
                  value={application.amount}
                  onChange={(e) => setApplication({ ...application, amount: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="term">Срок кредита *</Label>
                <Select
                  value={application.term}
                  onValueChange={(value) => setApplication({ ...application, term: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12 месяцев</SelectItem>
                    <SelectItem value="24">24 месяца</SelectItem>
                    <SelectItem value="36">36 месяцев</SelectItem>
                    <SelectItem value="48">48 месяцев</SelectItem>
                    <SelectItem value="60">60 месяцев</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <User className="w-4 h-4" />
                Личная информация
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">ФИО *</Label>
                  <Input
                    id="fullName"
                    placeholder="Иванов Иван Иванович"
                    value={application.fullName}
                    onChange={(e) => setApplication({ ...application, fullName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ivan@example.com"
                    value={application.email}
                    onChange={(e) => setApplication({ ...application, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Телефон *</Label>
                  <Input
                    id="phone"
                    placeholder="+7 (999) 123-45-67"
                    value={application.phone}
                    onChange={(e) => setApplication({ ...application, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="income">Ежемесячный доход ($)</Label>
                  <Input
                    id="income"
                    type="number"
                    placeholder="5000"
                    value={application.income}
                    onChange={(e) => setApplication({ ...application, income: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Info Block */}
            <div className="flex items-start gap-2 p-4 bg-blue-50 rounded-lg">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Как мы обрабатываем вашу заявку:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Проверка заявки: 2-4 часа</li>
                  <li>Кредитный скоринг: 1 день</li>
                  <li>Финальное решение: 2-3 дня</li>
                </ul>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApplicationForm(false)}>
              Отмена
            </Button>
            <Button onClick={handleSubmitApplication}>
              <FileText className="w-4 h-4 mr-2" />
              Отправить заявку
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
