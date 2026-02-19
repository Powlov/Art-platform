import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { 
  Truck,
  Package,
  Wrench,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Shield,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Box,
  Home,
  Building,
  Plane,
  Ship,
  Upload,
  Download,
  FileText,
  Image,
  ThermometerSnowflake,
  Lock,
  Eye,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Star,
  TrendingUp,
  Users,
  Phone,
  Mail,
  Info,
  AlertTriangle,
  Tag,
  Palette
} from 'lucide-react';

interface ShipmentRequest {
  id: string;
  artworkTitle: string;
  artistName: string;
  type: 'local' | 'domestic' | 'international';
  status: 'pending' | 'quote' | 'booked' | 'transit' | 'delivered' | 'cancelled';
  pickup: {
    address: string;
    date: string;
    contact: string;
  };
  delivery: {
    address: string;
    date: string;
    contact: string;
  };
  insurance: boolean;
  insuranceValue?: number;
  specialHandling: string[];
  estimatedCost: number;
  createdAt: string;
}

interface StorageUnit {
  id: string;
  name: string;
  type: 'climate-controlled' | 'standard' | 'vault' | 'crate';
  location: string;
  size: string;
  artworks: number;
  capacity: number;
  monthlyRate: number;
  features: string[];
  status: 'active' | 'available' | 'maintenance';
  contractEnd?: string;
}

interface RestorationProject {
  id: string;
  artworkTitle: string;
  artistName: string;
  type: 'cleaning' | 'repair' | 'conservation' | 'framing';
  status: 'assessment' | 'quote' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  specialist: string;
  estimatedCost: number;
  estimatedDuration: string;
  completionDate?: string;
  description: string;
  photos: string[];
  createdAt: string;
}

export default function LogisticsStorage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock данные
  const [shipments] = useState<ShipmentRequest[]>([
    {
      id: 'ship-1',
      artworkTitle: 'Абстрактная композиция #12',
      artistName: 'Мария Петрова',
      type: 'domestic',
      status: 'transit',
      pickup: {
        address: 'Москва, ул. Тверская, 10',
        date: '2024-02-08',
        contact: '+7 (495) 123-45-67'
      },
      delivery: {
        address: 'Санкт-Петербург, Невский пр., 25',
        date: '2024-02-12',
        contact: '+7 (812) 234-56-78'
      },
      insurance: true,
      insuranceValue: 125000,
      specialHandling: ['Климат-контроль', 'Вибро защита', 'GPS трекинг'],
      estimatedCost: 5500,
      createdAt: '2024-02-05'
    },
    {
      id: 'ship-2',
      artworkTitle: 'Городской пейзаж',
      artistName: 'Анна Смирнова',
      type: 'international',
      status: 'quote',
      pickup: {
        address: 'Москва, ул. Арбат, 15',
        date: '2024-02-20',
        contact: '+7 (495) 345-67-89'
      },
      delivery: {
        address: 'Paris, Rue de Rivoli, 42',
        date: '2024-03-05',
        contact: '+33 1 23 45 67 89'
      },
      insurance: true,
      insuranceValue: 85000,
      specialHandling: ['Таможенное оформление', 'Музейное качество', 'Страховка transit'],
      estimatedCost: 12500,
      createdAt: '2024-02-01'
    }
  ]);

  const [storage] = useState<StorageUnit[]>([
    {
      id: 'stor-1',
      name: 'Блок A-12',
      type: 'climate-controlled',
      location: 'Москва, Складской комплекс "Арт-хаб"',
      size: '15 м² (20-25 работ)',
      artworks: 18,
      capacity: 25,
      monthlyRate: 8500,
      features: ['Климат 18-22°C', 'Влажность 45-55%', '24/7 охрана', 'Видеонаблюдение', 'Доступ 24/7'],
      status: 'active',
      contractEnd: '2025-01-31'
    },
    {
      id: 'stor-2',
      name: 'Сейф B-05',
      type: 'vault',
      location: 'Москва, Банковское хранилище "Сбережение"',
      size: '5 м² (5-8 работ)',
      artworks: 5,
      capacity: 8,
      monthlyRate: 15000,
      features: ['Банковский уровень защиты', 'Пожароустойчивость', 'Страховка включена', 'Индивидуальная ячейка'],
      status: 'active',
      contractEnd: '2024-12-31'
    },
    {
      id: 'stor-3',
      name: 'Стандарт C-28',
      type: 'standard',
      location: 'Подмосковье, Склад "Хранитель"',
      size: '25 м² (30-40 работ)',
      artworks: 0,
      capacity: 40,
      monthlyRate: 4500,
      features: ['Охрана', 'Базовая вентиляция', 'Доступ в рабочие часы'],
      status: 'available'
    }
  ]);

  const [restorations] = useState<RestorationProject[]>([
    {
      id: 'rest-1',
      artworkTitle: 'Портрет в интерьере',
      artistName: 'Иван Козлов',
      type: 'repair',
      status: 'in-progress',
      priority: 'high',
      specialist: 'Елена Реставрова',
      estimatedCost: 45000,
      estimatedDuration: '3-4 недели',
      completionDate: '2024-03-05',
      description: 'Восстановление поврежденного участка холста размером 15x20 см в правом нижнем углу',
      photos: [],
      createdAt: '2024-02-01'
    },
    {
      id: 'rest-2',
      artworkTitle: 'Абстрактная композиция #5',
      artistName: 'Мария Петрова',
      type: 'cleaning',
      status: 'quote',
      priority: 'medium',
      specialist: 'Артём Консерватор',
      estimatedCost: 18000,
      estimatedDuration: '1-2 недели',
      description: 'Профессиональная чистка поверхности, удаление пыли и загрязнений',
      photos: [],
      createdAt: '2024-02-05'
    }
  ]);

  const getShipmentStatus = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', icon: any }> = {
      pending: { variant: 'secondary', icon: Clock },
      quote: { variant: 'outline', icon: FileText },
      booked: { variant: 'default', icon: CheckCircle2 },
      transit: { variant: 'default', icon: Truck },
      delivered: { variant: 'default', icon: CheckCircle2 },
      cancelled: { variant: 'destructive', icon: XCircle }
    };

    const config = variants[status] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status === 'pending' ? 'Ожидание' :
         status === 'quote' ? 'Расчёт' :
         status === 'booked' ? 'Забронировано' :
         status === 'transit' ? 'В пути' :
         status === 'delivered' ? 'Доставлено' : 'Отменено'}
      </Badge>
    );
  };

  const getRestorationStatus = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', icon: any }> = {
      assessment: { variant: 'secondary', icon: Eye },
      quote: { variant: 'outline', icon: DollarSign },
      'in-progress': { variant: 'default', icon: Wrench },
      completed: { variant: 'default', icon: CheckCircle2 },
      cancelled: { variant: 'destructive', icon: XCircle }
    };

    const config = variants[status] || variants.assessment;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status === 'assessment' ? 'Оценка' :
         status === 'quote' ? 'Расчёт' :
         status === 'in-progress' ? 'В работе' :
         status === 'completed' ? 'Завершено' : 'Отменено'}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      low: 'secondary',
      medium: 'outline',
      high: 'default',
      urgent: 'destructive'
    };

    return (
      <Badge variant={variants[priority] || 'secondary'}>
        {priority === 'low' ? 'Низкий' :
         priority === 'medium' ? 'Средний' :
         priority === 'high' ? 'Высокий' : 'Срочно'}
      </Badge>
    );
  };

  const handleCreateShipment = () => {
    toast({
      title: 'Запрос создан',
      description: 'Наш менеджер свяжется с вами в течение 2 часов',
    });
  };

  const handleRequestRestoration = () => {
    toast({
      title: 'Заявка отправлена',
      description: 'Реставратор проведёт оценку и свяжется с вами',
    });
  };

  const activeShipments = shipments.filter(s => ['booked', 'transit'].includes(s.status));
  const activeStorage = storage.filter(s => s.status === 'active');
  const activeRestorations = restorations.filter(r => ['assessment', 'in-progress'].includes(r.status));

  const totalStorageCost = activeStorage.reduce((sum, s) => sum + s.monthlyRate, 0);
  const totalStoredArtworks = activeStorage.reduce((sum, s) => sum + s.artworks, 0);

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
              Для доступа к логистике и хранению необходимо войти в систему
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
          <Truck className="h-10 w-10 text-orange-500" />
          Логистика и хранение
        </h1>
        <p className="text-muted-foreground">
          Транспортировка, безопасное хранение и реставрация произведений искусства
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="shipping">Транспорт</TabsTrigger>
          <TabsTrigger value="storage">Хранение</TabsTrigger>
          <TabsTrigger value="restoration">Реставрация</TabsTrigger>
        </TabsList>

        {/* ОБЗОР */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Активные перевозки</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeShipments.length}</div>
                <p className="text-xs text-muted-foreground">
                  Из {shipments.length} всего
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">На хранении</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStoredArtworks}</div>
                <p className="text-xs text-muted-foreground">
                  Произведений
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Хранилища</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeStorage.length}</div>
                <p className="text-xs text-muted-foreground">
                  ${(totalStorageCost / 1000).toFixed(1)}K/месяц
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Реставрация</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeRestorations.length}</div>
                <p className="text-xs text-muted-foreground">
                  Проектов в работе
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-orange-500" />
                  Транспортировка
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Plane className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Международная доставка</p>
                    <p className="text-sm text-muted-foreground">В любую точку мира</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Страхование транзита</p>
                    <p className="text-sm text-muted-foreground">До $10M покрытие</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ThermometerSnowflake className="h-5 w-5 text-cyan-500" />
                  <div>
                    <p className="font-medium">Климат-контроль</p>
                    <p className="text-sm text-muted-foreground">Специализированный транспорт</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-purple-500" />
                  Хранение
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <ThermometerSnowflake className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Климат-контроль</p>
                    <p className="text-sm text-muted-foreground">18-22°C, 45-55% влажность</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-indigo-500" />
                  <div>
                    <p className="font-medium">24/7 мониторинг</p>
                    <p className="text-sm text-muted-foreground">Видеонаблюдение и охрана</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium">Банковские сейфы</p>
                    <p className="text-sm text-muted-foreground">Максимальная защита</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-green-500" />
                  Реставрация
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="font-medium">Сертифицированные мастера</p>
                    <p className="text-sm text-muted-foreground">Опыт 10-30 лет</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Palette className="h-5 w-5 text-pink-500" />
                  <div>
                    <p className="font-medium">Все виды работ</p>
                    <p className="text-sm text-muted-foreground">От чистки до реконструкции</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="font-medium">Документация</p>
                    <p className="text-sm text-muted-foreground">Полный отчёт о работах</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Недавняя активность</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeShipments.map(ship => (
                <div key={ship.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{ship.artworkTitle}</h4>
                      {getShipmentStatus(ship.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{ship.artistName}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {ship.delivery.address}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        до {new Date(ship.delivery.date).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </div>
                  <p className="text-lg font-bold">${ship.estimatedCost.toLocaleString()}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ТРАНСПОРТ */}
        <TabsContent value="shipping" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Заявки на транспортировку</h2>
            <Button onClick={handleCreateShipment}>
              <Plus className="mr-2 h-4 w-4" />
              Новая заявка
            </Button>
          </div>

          {shipments.map(ship => (
            <Card key={ship.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{ship.artworkTitle}</CardTitle>
                      {getShipmentStatus(ship.status)}
                    </div>
                    <CardDescription>
                      {ship.artistName} • {ship.type === 'local' ? 'Местная' :
                       ship.type === 'domestic' ? 'Внутри страны' : 'Международная'} доставка
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">${ship.estimatedCost.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Расчётная стоимость</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Отправка
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p>{ship.pickup.address}</p>
                      <p className="text-muted-foreground">
                        {new Date(ship.pickup.date).toLocaleDateString('ru-RU')}
                      </p>
                      <p className="text-muted-foreground">{ship.pickup.contact}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Получение
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p>{ship.delivery.address}</p>
                      <p className="text-muted-foreground">
                        {new Date(ship.delivery.date).toLocaleDateString('ru-RU')}
                      </p>
                      <p className="text-muted-foreground">{ship.delivery.contact}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Особые требования</h4>
                  <div className="flex flex-wrap gap-2">
                    {ship.specialHandling.map(req => (
                      <Badge key={req} variant="secondary">
                        <Tag className="mr-1 h-3 w-3" />
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>

                {ship.insurance && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span className="font-semibold">Страхование</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Покрытие: ${ship.insuranceValue?.toLocaleString()}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    Отследить
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Документы
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="mr-2 h-4 w-4" />
                    Связаться
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* ХРАНЕНИЕ */}
        <TabsContent value="storage" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Мои хранилища</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Арендовать хранилище
            </Button>
          </div>

          {storage.map(stor => (
            <Card key={stor.id} className={stor.status === 'available' ? 'border-green-500' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{stor.name}</CardTitle>
                      <Badge variant={stor.status === 'active' ? 'default' : 
                                     stor.status === 'available' ? 'outline' : 'secondary'}>
                        {stor.status === 'active' ? 'Активно' :
                         stor.status === 'available' ? 'Доступно' : 'Обслуживание'}
                      </Badge>
                      {stor.type === 'climate-controlled' && (
                        <Badge variant="secondary">
                          <ThermometerSnowflake className="mr-1 h-3 w-3" />
                          Климат-контроль
                        </Badge>
                      )}
                      {stor.type === 'vault' && (
                        <Badge variant="default">
                          <Lock className="mr-1 h-3 w-3" />
                          Сейф
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {stor.location}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">${stor.monthlyRate.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">/месяц</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Размер</p>
                    <p className="font-medium">{stor.size}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Заполненность</p>
                    <p className="font-medium">{stor.artworks}/{stor.capacity} работ</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Тип</p>
                    <p className="font-medium">
                      {stor.type === 'climate-controlled' ? 'Климат' :
                       stor.type === 'vault' ? 'Сейф' :
                       stor.type === 'crate' ? 'Ящик' : 'Стандарт'}
                    </p>
                  </div>
                  {stor.contractEnd && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Договор до</p>
                      <p className="font-medium">
                        {new Date(stor.contractEnd).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Возможности</h4>
                  <div className="flex flex-wrap gap-2">
                    {stor.features.map(feat => (
                      <Badge key={feat} variant="outline">{feat}</Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    Посмотреть работы
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Продлить договор
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Документы
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* РЕСТАВРАЦИЯ */}
        <TabsContent value="restoration" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Проекты реставрации</h2>
            <Button onClick={handleRequestRestoration}>
              <Plus className="mr-2 h-4 w-4" />
              Запросить реставрацию
            </Button>
          </div>

          {restorations.map(rest => (
            <Card key={rest.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{rest.artworkTitle}</CardTitle>
                      {getRestorationStatus(rest.status)}
                      {getPriorityBadge(rest.priority)}
                    </div>
                    <CardDescription>
                      {rest.artistName} • {rest.type === 'cleaning' ? 'Чистка' :
                       rest.type === 'repair' ? 'Ремонт' :
                       rest.type === 'conservation' ? 'Консервация' : 'Рамирование'}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">${rest.estimatedCost.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Расчётная стоимость</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{rest.description}</p>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Специалист</p>
                    <p className="font-medium">{rest.specialist}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Срок выполнения</p>
                    <p className="font-medium">{rest.estimatedDuration}</p>
                  </div>
                  {rest.completionDate && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Планируемое завершение</p>
                      <p className="font-medium">
                        {new Date(rest.completionDate).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Image className="mr-2 h-4 w-4" />
                    Фото до/после
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Отчёт
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="mr-2 h-4 w-4" />
                    Связаться
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
