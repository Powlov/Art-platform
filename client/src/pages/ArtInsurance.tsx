import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { 
  Shield, 
  TrendingUp, 
  FileText, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Building,
  Globe,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Users,
  Award,
  Info,
  Download,
  Upload,
  Search,
  Filter,
  ChevronRight,
  Star,
  Lock,
  Zap
} from 'lucide-react';

interface InsurancePolicy {
  id: string;
  artworkId: string;
  artworkTitle: string;
  artistName: string;
  policyNumber: string;
  provider: string;
  coverageAmount: number;
  premium: number;
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  coverageType: 'all-risk' | 'transit' | 'exhibition' | 'storage';
  lastClaim?: string;
}

interface InsuranceProvider {
  id: string;
  name: string;
  logo: string;
  rating: number;
  specialization: string[];
  coverage: string[];
  minValue: number;
  maxValue: number;
  premium: number; // процент от стоимости
  responseTime: string;
  claimsApprovalRate: number;
  description: string;
}

interface Claim {
  id: string;
  policyId: string;
  policyNumber: string;
  artworkTitle: string;
  claimAmount: number;
  incidentDate: string;
  submittedDate: string;
  status: 'submitted' | 'reviewing' | 'approved' | 'rejected' | 'paid';
  description: string;
  documents: string[];
}

export default function ArtInsurance() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [selectedArtwork, setSelectedArtwork] = useState<string>('');
  const [coverageType, setCoverageType] = useState<string>('');
  const [artworkValue, setArtworkValue] = useState<string>('');

  // Mock данные для демонстрации
  const [policies] = useState<InsurancePolicy[]>([
    {
      id: '1',
      artworkId: 'art-1',
      artworkTitle: 'Абстрактная композиция #5',
      artistName: 'Иван Петров',
      policyNumber: 'INS-2024-001',
      provider: 'ArtGuard International',
      coverageAmount: 125000,
      premium: 1875,
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2025-01-14',
      coverageType: 'all-risk',
      lastClaim: undefined
    },
    {
      id: '2',
      artworkId: 'art-2',
      artworkTitle: 'Городской пейзаж',
      artistName: 'Мария Соколова',
      policyNumber: 'INS-2024-002',
      provider: 'Fine Art Protection',
      coverageAmount: 85000,
      premium: 1190,
      status: 'active',
      startDate: '2024-02-01',
      endDate: '2025-01-31',
      coverageType: 'storage',
    },
    {
      id: '3',
      artworkId: 'art-3',
      artworkTitle: 'Портрет в сумерках',
      artistName: 'Алексей Волков',
      policyNumber: 'INS-2023-087',
      provider: 'Museum Insurance Co',
      coverageAmount: 210000,
      premium: 3150,
      status: 'expired',
      startDate: '2023-03-10',
      endDate: '2024-03-09',
      coverageType: 'exhibition',
      lastClaim: '2023-08-15'
    }
  ]);

  const [providers] = useState<InsuranceProvider[]>([
    {
      id: 'p1',
      name: 'ArtGuard International',
      logo: '🛡️',
      rating: 4.8,
      specialization: ['Современное искусство', 'Живопись', 'Скульптура'],
      coverage: ['Полное покрытие', 'Транспортировка', 'Выставки', 'Хранение'],
      minValue: 10000,
      maxValue: 10000000,
      premium: 1.5,
      responseTime: '24 часа',
      claimsApprovalRate: 94,
      description: 'Ведущий международный страховщик произведений искусства с 30-летним опытом'
    },
    {
      id: 'p2',
      name: 'Fine Art Protection',
      logo: '🎨',
      rating: 4.6,
      specialization: ['Классическое искусство', 'Антиквариат', 'Редкие коллекции'],
      coverage: ['Полное покрытие', 'Реставрация', 'Кража', 'Повреждения'],
      minValue: 50000,
      maxValue: 50000000,
      premium: 1.4,
      responseTime: '12 часов',
      claimsApprovalRate: 92,
      description: 'Специализация на высокоценных классических произведениях'
    },
    {
      id: 'p3',
      name: 'Museum Insurance Co',
      logo: '🏛️',
      rating: 4.9,
      specialization: ['Музейные коллекции', 'Выставки', 'Международные перевозки'],
      coverage: ['Выставочное покрытие', 'Транзит', 'Временные экспозиции'],
      minValue: 100000,
      maxValue: 100000000,
      premium: 1.3,
      responseTime: '6 часов',
      claimsApprovalRate: 97,
      description: 'Премиум-страхование для музеев и крупных коллекций'
    },
    {
      id: 'p4',
      name: 'Collector\'s Shield',
      logo: '💎',
      rating: 4.5,
      specialization: ['Частные коллекции', 'Начинающие коллекционеры', 'NFT искусство'],
      coverage: ['Базовое покрытие', 'Хранение', 'Онлайн-покупки'],
      minValue: 5000,
      maxValue: 1000000,
      premium: 2.0,
      responseTime: '48 часов',
      claimsApprovalRate: 88,
      description: 'Доступное страхование для частных коллекционеров'
    }
  ]);

  const [claims] = useState<Claim[]>([
    {
      id: 'c1',
      policyId: '3',
      policyNumber: 'INS-2023-087',
      artworkTitle: 'Портрет в сумерках',
      claimAmount: 15000,
      incidentDate: '2023-08-10',
      submittedDate: '2023-08-12',
      status: 'paid',
      description: 'Незначительное повреждение рамы во время транспортировки',
      documents: ['photo1.jpg', 'invoice.pdf', 'expert_report.pdf']
    },
    {
      id: 'c2',
      policyId: '1',
      policyNumber: 'INS-2024-001',
      artworkTitle: 'Абстрактная композиция #5',
      claimAmount: 8500,
      incidentDate: '2024-11-20',
      submittedDate: '2024-11-22',
      status: 'approved',
      description: 'Реставрация после повреждения водой',
      documents: ['damage_photos.zip', 'restoration_estimate.pdf']
    }
  ]);

  const handleQuoteRequest = () => {
    if (!selectedProvider || !selectedArtwork || !coverageType || !artworkValue) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, заполните все поля',
        variant: 'destructive'
      });
      return;
    }

    const provider = providers.find(p => p.id === selectedProvider);
    const value = parseFloat(artworkValue);
    const premium = (value * (provider?.premium || 1.5)) / 100;

    toast({
      title: 'Расчет получен',
      description: `Годовая премия: $${premium.toLocaleString()} (${provider?.premium}% от стоимости)`,
    });
  };

  const handleFileClaim = () => {
    toast({
      title: 'Претензия подана',
      description: 'Ваша претензия принята к рассмотрению. Ответ в течение 48 часов.',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', icon: any }> = {
      active: { variant: 'default', icon: CheckCircle2 },
      pending: { variant: 'secondary', icon: Clock },
      expired: { variant: 'outline', icon: XCircle },
      cancelled: { variant: 'destructive', icon: XCircle },
      submitted: { variant: 'secondary', icon: Upload },
      reviewing: { variant: 'secondary', icon: Search },
      approved: { variant: 'default', icon: CheckCircle2 },
      rejected: { variant: 'destructive', icon: XCircle },
      paid: { variant: 'default', icon: CheckCircle2 }
    };

    const config = variants[status] || { variant: 'outline' as const, icon: Info };
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status === 'active' ? 'Активен' :
         status === 'pending' ? 'В обработке' :
         status === 'expired' ? 'Истёк' :
         status === 'cancelled' ? 'Отменён' :
         status === 'submitted' ? 'Подана' :
         status === 'reviewing' ? 'На рассмотрении' :
         status === 'approved' ? 'Одобрена' :
         status === 'rejected' ? 'Отклонена' :
         status === 'paid' ? 'Выплачена' : status}
      </Badge>
    );
  };

  const activePolicies = policies.filter(p => p.status === 'active');
  const totalCoverage = activePolicies.reduce((sum, p) => sum + p.coverageAmount, 0);
  const totalPremium = activePolicies.reduce((sum, p) => sum + p.premium, 0);

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Требуется авторизация
            </CardTitle>
            <CardDescription>
              Для доступа к системе страхования необходимо войти в систему
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => window.location.href = '/login'}>
              Войти в систему
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Shield className="h-10 w-10 text-blue-500" />
          Арт-Страхование
        </h1>
        <p className="text-muted-foreground">
          Профессиональное страхование произведений искусства от ведущих мировых компаний
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="policies">Полисы</TabsTrigger>
          <TabsTrigger value="providers">Страховщики</TabsTrigger>
          <TabsTrigger value="quote">Расчёт</TabsTrigger>
          <TabsTrigger value="claims">Претензии</TabsTrigger>
        </TabsList>

        {/* ОБЗОР */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Активные полисы</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activePolicies.length}</div>
                <p className="text-xs text-muted-foreground">
                  Из {policies.length} всего
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Общее покрытие</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(totalCoverage / 1000).toFixed(0)}K</div>
                <p className="text-xs text-muted-foreground">
                  Застраховано произведений на сумму
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Годовая премия</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalPremium.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  ~{((totalPremium / totalCoverage) * 100).toFixed(2)}% от стоимости
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Почему важно страховать искусство?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex gap-3">
                  <Shield className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Полная защита</h4>
                    <p className="text-sm text-muted-foreground">
                      Покрытие от кражи, повреждений, пожара и природных катастроф
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Globe className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Мировое покрытие</h4>
                    <p className="text-sm text-muted-foreground">
                      Защита действует во время транспортировки по всему миру
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Zap className="h-5 w-5 text-yellow-500 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Быстрые выплаты</h4>
                    <p className="text-sm text-muted-foreground">
                      Оперативное рассмотрение претензий в течение 24-48 часов
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Award className="h-5 w-5 text-purple-500 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Экспертная оценка</h4>
                    <p className="text-sm text-muted-foreground">
                      Сертифицированные оценщики и реставраторы
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Последние обновления</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {claims.slice(0, 3).map(claim => (
                <div key={claim.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="font-medium">{claim.artworkTitle}</p>
                    <p className="text-sm text-muted-foreground">
                      Претензия #{claim.policyNumber} • ${claim.claimAmount.toLocaleString()}
                    </p>
                  </div>
                  {getStatusBadge(claim.status)}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ПОЛИСЫ */}
        <TabsContent value="policies" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Мои страховые полисы</h2>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Оформить новый полис
            </Button>
          </div>

          <div className="grid gap-6">
            {policies.map(policy => (
              <Card key={policy.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{policy.artworkTitle}</CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {policy.artistName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          {policy.provider}
                        </span>
                      </CardDescription>
                    </div>
                    {getStatusBadge(policy.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Номер полиса</p>
                      <p className="font-medium">{policy.policyNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Сумма покрытия</p>
                      <p className="font-medium">${policy.coverageAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Годовая премия</p>
                      <p className="font-medium">${policy.premium.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Тип покрытия</p>
                      <p className="font-medium">
                        {policy.coverageType === 'all-risk' ? 'Полное покрытие' :
                         policy.coverageType === 'transit' ? 'Транспортировка' :
                         policy.coverageType === 'exhibition' ? 'Выставки' :
                         'Хранение'}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(policy.startDate).toLocaleDateString('ru-RU')} - {new Date(policy.endDate).toLocaleDateString('ru-RU')}
                      </span>
                      {policy.lastClaim && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Последняя претензия: {new Date(policy.lastClaim).toLocaleDateString('ru-RU')}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Скачать
                      </Button>
                      <Button variant="outline" size="sm">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Претензия
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* СТРАХОВЩИКИ */}
        <TabsContent value="providers" className="space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Партнёры-страховщики</h2>
            <p className="text-muted-foreground">
              Ведущие мировые компании, специализирующиеся на страховании произведений искусства
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {providers.map(provider => (
              <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{provider.logo}</div>
                      <div>
                        <CardTitle className="text-xl">{provider.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(provider.rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{provider.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardDescription>{provider.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Специализация:</h4>
                    <div className="flex flex-wrap gap-2">
                      {provider.specialization.map(spec => (
                        <Badge key={spec} variant="secondary">{spec}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Типы покрытия:</h4>
                    <div className="flex flex-wrap gap-2">
                      {provider.coverage.map(cov => (
                        <Badge key={cov} variant="outline">{cov}</Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Диапазон стоимости:</span>
                      <span className="font-medium">
                        ${(provider.minValue / 1000).toFixed(0)}K - ${(provider.maxValue / 1000000).toFixed(0)}M
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Премия:</span>
                      <span className="font-medium">{provider.premium}% годовых</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Время ответа:</span>
                      <span className="font-medium">{provider.responseTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Одобрение претензий:</span>
                      <span className="font-medium text-green-600">{provider.claimsApprovalRate}%</span>
                    </div>
                  </div>

                  <Button className="w-full" onClick={() => {
                    setSelectedProvider(provider.id);
                    setActiveTab('quote');
                  }}>
                    Получить расчёт
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* РАСЧЁТ */}
        <TabsContent value="quote" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Расчёт стоимости страхования</CardTitle>
              <CardDescription>
                Получите мгновенный расчёт стоимости страхования для вашего произведения
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="provider">Страховая компания</Label>
                  <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                    <SelectTrigger id="provider">
                      <SelectValue placeholder="Выберите страховщика" />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map(p => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.logo} {p.name} ({p.premium}%)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="artwork">Произведение</Label>
                  <Select value={selectedArtwork} onValueChange={setSelectedArtwork}>
                    <SelectTrigger id="artwork">
                      <SelectValue placeholder="Выберите произведение" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="art-1">Абстрактная композиция #5</SelectItem>
                      <SelectItem value="art-2">Городской пейзаж</SelectItem>
                      <SelectItem value="art-3">Портрет в сумерках</SelectItem>
                      <SelectItem value="art-new">+ Новое произведение</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverage-type">Тип покрытия</Label>
                  <Select value={coverageType} onValueChange={setCoverageType}>
                    <SelectTrigger id="coverage-type">
                      <SelectValue placeholder="Выберите тип" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-risk">Полное покрытие (All-Risk)</SelectItem>
                      <SelectItem value="transit">Транспортировка</SelectItem>
                      <SelectItem value="exhibition">Выставки</SelectItem>
                      <SelectItem value="storage">Хранение</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value">Оценочная стоимость ($)</Label>
                  <Input
                    id="value"
                    type="number"
                    placeholder="100000"
                    value={artworkValue}
                    onChange={(e) => setArtworkValue(e.target.value)}
                  />
                </div>
              </div>

              {selectedProvider && artworkValue && (
                <Card className="bg-muted">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Расчёт страховой премии</h3>
                      <div className="grid gap-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Стоимость произведения:</span>
                          <span className="font-medium">${parseFloat(artworkValue || '0').toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Процентная ставка:</span>
                          <span className="font-medium">
                            {providers.find(p => p.id === selectedProvider)?.premium}% годовых
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg">
                          <span className="font-semibold">Годовая премия:</span>
                          <span className="font-bold text-primary">
                            ${((parseFloat(artworkValue || '0') * (providers.find(p => p.id === selectedProvider)?.premium || 0)) / 100).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Ежемесячный платёж:</span>
                          <span>
                            ${((parseFloat(artworkValue || '0') * (providers.find(p => p.id === selectedProvider)?.premium || 0)) / 100 / 12).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-3">
                <Button className="flex-1" onClick={handleQuoteRequest}>
                  Отправить заявку
                </Button>
                <Button variant="outline">
                  <Phone className="mr-2 h-4 w-4" />
                  Связаться с агентом
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Что влияет на стоимость?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold">Факторы удорожания:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
                    <li>Высокая рыночная стоимость</li>
                    <li>Частые перемещения и выставки</li>
                    <li>Хрупкие материалы</li>
                    <li>Отсутствие системы безопасности</li>
                    <li>История повреждений</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Факторы удешевления:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
                    <li>Постоянное хранение в одном месте</li>
                    <li>Профессиональная охрана</li>
                    <li>Климат-контроль</li>
                    <li>Регулярные оценки экспертов</li>
                    <li>Долгосрочный полис (2-3 года)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ПРЕТЕНЗИИ */}
        <TabsContent value="claims" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">История претензий</h2>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Подать претензию
            </Button>
          </div>

          <div className="grid gap-6">
            {claims.map(claim => (
              <Card key={claim.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{claim.artworkTitle}</CardTitle>
                      <CardDescription>
                        Претензия #{claim.policyNumber} • Подана {new Date(claim.submittedDate).toLocaleDateString('ru-RU')}
                      </CardDescription>
                    </div>
                    {getStatusBadge(claim.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Описание инцидента:</h4>
                    <p className="text-sm text-muted-foreground">{claim.description}</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Сумма претензии</p>
                      <p className="font-medium text-lg">${claim.claimAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Дата инцидента</p>
                      <p className="font-medium">{new Date(claim.incidentDate).toLocaleDateString('ru-RU')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Приложенные документы</p>
                      <p className="font-medium">{claim.documents.length} файлов</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Детали
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Документы
                    </Button>
                    {claim.status === 'reviewing' && (
                      <Button variant="outline" size="sm">
                        <Mail className="mr-2 h-4 w-4" />
                        Связаться с экспертом
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Как подать претензию?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Зафиксируйте повреждения</h4>
                    <p className="text-sm text-muted-foreground">
                      Сделайте фотографии с разных ракурсов, не перемещайте произведение
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Подайте заявку онлайн</h4>
                    <p className="text-sm text-muted-foreground">
                      Заполните форму, приложите фото и описание инцидента
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Дождитесь оценки эксперта</h4>
                    <p className="text-sm text-muted-foreground">
                      Эксперт свяжется с вами в течение 24-48 часов
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Получите выплату</h4>
                    <p className="text-sm text-muted-foreground">
                      После одобрения средства поступят на ваш счёт в течение 5-7 дней
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
