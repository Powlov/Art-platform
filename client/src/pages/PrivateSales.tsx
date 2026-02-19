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
  Lock,
  Eye,
  EyeOff,
  Users,
  Send,
  Calendar,
  DollarSign,
  Image,
  Plus,
  Edit,
  Trash2,
  Copy,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  Shield,
  Mail,
  Phone,
  MapPin,
  FileText,
  Download,
  Upload,
  Search,
  Filter,
  AlertCircle,
  TrendingUp,
  Briefcase,
  Tag,
  Link2,
  Share2,
  MessageSquare,
  Video,
  Phone as PhoneIcon
} from 'lucide-react';

interface PrivateSale {
  id: string;
  artworkId: string;
  artworkTitle: string;
  artistName: string;
  price: number;
  status: 'draft' | 'active' | 'pending' | 'sold' | 'expired' | 'cancelled';
  visibility: 'invite-only' | 'vip-clients' | 'selected-list';
  invitedClients: number;
  viewedBy: number;
  interested: number;
  expires: string;
  createdAt: string;
  description: string;
  images: string[];
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'vip' | 'collector' | 'corporate' | 'institution';
  totalPurchases: number;
  lastPurchase?: string;
  interests: string[];
  status: 'invited' | 'viewed' | 'interested' | 'declined';
}

interface Message {
  id: string;
  saleId: string;
  clientId: string;
  clientName: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function PrivateSales() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSale, setSelectedSale] = useState<string>('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Mock данные для демонстрации
  const [sales] = useState<PrivateSale[]>([
    {
      id: 's1',
      artworkId: 'art-1',
      artworkTitle: 'Абстрактная композиция #12',
      artistName: 'Мария Петрова',
      price: 125000,
      status: 'active',
      visibility: 'vip-clients',
      invitedClients: 8,
      viewedBy: 6,
      interested: 3,
      expires: '2024-02-20',
      createdAt: '2024-02-05',
      description: 'Уникальная абстрактная работа из новой коллекции художницы. Масло, холст, 120x100 см.',
      images: []
    },
    {
      id: 's2',
      artworkId: 'art-2',
      artworkTitle: 'Портрет в интерьере',
      artistName: 'Иван Козлов',
      price: 85000,
      status: 'pending',
      visibility: 'selected-list',
      invitedClients: 5,
      viewedBy: 4,
      interested: 2,
      expires: '2024-02-15',
      createdAt: '2024-02-01',
      description: 'Классический портрет маслом, выполнен на заказ. Размер 90x70 см.',
      images: []
    },
    {
      id: 's3',
      artworkId: 'art-3',
      artworkTitle: 'Городской пейзаж',
      artistName: 'Анна Смирнова',
      price: 65000,
      status: 'sold',
      visibility: 'invite-only',
      invitedClients: 3,
      viewedBy: 3,
      interested: 1,
      expires: '2024-02-10',
      createdAt: '2024-01-25',
      description: 'Современный взгляд на городскую архитектуру. Акрил, холст, 100x80 см.',
      images: []
    }
  ]);

  const [clients] = useState<Client[]>([
    {
      id: 'c1',
      name: 'Александр Смирнов',
      email: 'smirnov@example.com',
      phone: '+7 (495) 123-45-67',
      type: 'vip',
      totalPurchases: 450000,
      lastPurchase: '2024-01-15',
      interests: ['Современное искусство', 'Абстракционизм'],
      status: 'interested'
    },
    {
      id: 'c2',
      name: 'Елена Волкова',
      email: 'volkova@example.com',
      phone: '+7 (495) 234-56-78',
      type: 'collector',
      totalPurchases: 280000,
      lastPurchase: '2024-01-20',
      interests: ['Портреты', 'Классическая живопись'],
      status: 'viewed'
    },
    {
      id: 'c3',
      name: 'Корпорация "Арт Инвест"',
      email: 'info@artinvest.com',
      phone: '+7 (495) 345-67-89',
      type: 'corporate',
      totalPurchases: 1200000,
      lastPurchase: '2023-12-10',
      interests: ['Инвестиции', 'Современное искусство'],
      status: 'invited'
    }
  ]);

  const [messages] = useState<Message[]>([
    {
      id: 'm1',
      saleId: 's1',
      clientId: 'c1',
      clientName: 'Александр Смирнов',
      message: 'Очень заинтересован в этой работе. Можно ли увидеть её вживую?',
      timestamp: '2024-02-08T14:30:00',
      read: true
    },
    {
      id: 'm2',
      saleId: 's1',
      clientId: 'c2',
      clientName: 'Елена Волкова',
      message: 'Есть ли возможность рассрочки?',
      timestamp: '2024-02-07T10:15:00',
      read: false
    }
  ]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', icon: any }> = {
      draft: { variant: 'secondary', icon: Edit },
      active: { variant: 'default', icon: Eye },
      pending: { variant: 'outline', icon: Clock },
      sold: { variant: 'default', icon: CheckCircle2 },
      expired: { variant: 'secondary', icon: XCircle },
      cancelled: { variant: 'destructive', icon: XCircle }
    };

    const config = variants[status] || variants.draft;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status === 'draft' ? 'Черновик' :
         status === 'active' ? 'Активна' :
         status === 'pending' ? 'Ожидание' :
         status === 'sold' ? 'Продано' :
         status === 'expired' ? 'Истекла' : 'Отменена'}
      </Badge>
    );
  };

  const getClientStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'outline', label: string }> = {
      invited: { variant: 'secondary', label: 'Приглашён' },
      viewed: { variant: 'outline', label: 'Просмотрел' },
      interested: { variant: 'default', label: 'Интересуется' },
      declined: { variant: 'outline', label: 'Отказался' }
    };

    const config = variants[status] || variants.invited;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleCreateSale = () => {
    toast({
      title: 'Приватная продажа создана',
      description: 'Приглашения отправлены выбранным клиентам',
    });
    setShowCreateDialog(false);
  };

  const handleSendInvite = () => {
    toast({
      title: 'Приглашение отправлено',
      description: 'Клиент получит уведомление на email',
    });
  };

  const activeSales = sales.filter(s => s.status === 'active' || s.status === 'pending');
  const totalRevenue = sales.filter(s => s.status === 'sold').reduce((sum, s) => sum + s.price, 0);
  const totalInterested = sales.reduce((sum, s) => sum + s.interested, 0);
  const conversionRate = sales.length > 0 
    ? ((sales.filter(s => s.status === 'sold').length / sales.length) * 100).toFixed(1)
    : 0;

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
              Для доступа к приватным продажам необходимо войти как галерея
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
          <Lock className="h-10 w-10 text-purple-500" />
          Приватные продажи
        </h1>
        <p className="text-muted-foreground">
          Эксклюзивные предложения для избранных клиентов
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="sales">Продажи</TabsTrigger>
          <TabsTrigger value="clients">Клиенты</TabsTrigger>
          <TabsTrigger value="messages">Сообщения</TabsTrigger>
          <TabsTrigger value="create">Создать</TabsTrigger>
        </TabsList>

        {/* ОБЗОР */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Активные продажи</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeSales.length}</div>
                <p className="text-xs text-muted-foreground">
                  Из {sales.length} всего
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Заинтересованы</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalInterested}</div>
                <p className="text-xs text-muted-foreground">
                  Потенциальных покупателей
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Конверсия</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{conversionRate}%</div>
                <p className="text-xs text-muted-foreground">
                  Успешных сделок
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Выручка</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(totalRevenue / 1000).toFixed(0)}K</div>
                <p className="text-xs text-muted-foreground">
                  Продано произведений
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Преимущества приватных продаж
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Lock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Конфиденциальность</h4>
                    <p className="text-sm text-muted-foreground">
                      Только избранные клиенты видят предложение
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Star className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">VIP сервис</h4>
                    <p className="text-sm text-muted-foreground">
                      Персональные условия для лучших клиентов
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Премиальные цены</h4>
                    <p className="text-sm text-muted-foreground">
                      Более высокая маржа за эксклюзивность
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Ограниченное время</h4>
                    <p className="text-sm text-muted-foreground">
                      Создаёт срочность и повышает ценность
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Активные продажи</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeSales.slice(0, 3).map(sale => (
                  <div key={sale.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{sale.artworkTitle}</h4>
                        {getStatusBadge(sale.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{sale.artistName}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {sale.interested} интересуются
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {sale.viewedBy} просмотров
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          до {new Date(sale.expires).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">${sale.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ПРОДАЖИ */}
        <TabsContent value="sales" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Все приватные продажи</h2>
            <Button onClick={() => setActiveTab('create')}>
              <Plus className="mr-2 h-4 w-4" />
              Создать продажу
            </Button>
          </div>

          <div className="grid gap-6">
            {sales.map(sale => (
              <Card key={sale.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{sale.artworkTitle}</CardTitle>
                        {getStatusBadge(sale.status)}
                      </div>
                      <CardDescription className="flex items-center gap-4 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {sale.artistName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Lock className="h-4 w-4" />
                          {sale.visibility === 'invite-only' ? 'Только по приглашениям' :
                           sale.visibility === 'vip-clients' ? 'VIP клиенты' : 'Выбранный список'}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">${sale.price.toLocaleString()}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{sale.description}</p>

                  <div className="grid gap-4 md:grid-cols-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Приглашено</p>
                      <p className="font-bold text-lg">{sale.invitedClients}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Просмотрели</p>
                      <p className="font-bold text-lg">{sale.viewedBy}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Интересуются</p>
                      <p className="font-bold text-lg">{sale.interested}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Истекает</p>
                      <p className="font-bold text-lg">
                        {Math.ceil((new Date(sale.expires).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} дн.
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Просмотр
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Редактировать
                    </Button>
                    <Button variant="outline" size="sm">
                      <Send className="mr-2 h-4 w-4" />
                      Отправить приглашение
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="mr-2 h-4 w-4" />
                      Поделиться
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* КЛИЕНТЫ */}
        <TabsContent value="clients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>База клиентов для приватных продаж</CardTitle>
              <CardDescription>
                Выбирайте клиентов на основе их истории покупок и интересов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clients.map(client => (
                  <div key={client.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-bold">
                        {client.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{client.name}</h4>
                          <Badge variant={client.type === 'vip' ? 'default' : 'secondary'}>
                            {client.type === 'vip' ? 'VIP' :
                             client.type === 'collector' ? 'Коллекционер' :
                             client.type === 'corporate' ? 'Корпорация' : 'Институция'}
                          </Badge>
                          {getClientStatusBadge(client.status)}
                        </div>
                        <div className="grid gap-2 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            {client.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            {client.phone}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {client.interests.map(interest => (
                            <Badge key={interest} variant="outline">
                              <Tag className="mr-1 h-3 w-3" />
                              {interest}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Покупок на ${client.totalPurchases.toLocaleString()}
                          {client.lastPurchase && ` • Последняя покупка: ${new Date(client.lastPurchase).toLocaleDateString('ru-RU')}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleSendInvite}>
                        <Send className="mr-2 h-4 w-4" />
                        Пригласить
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Написать
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* СООБЩЕНИЯ */}
        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Сообщения от клиентов</CardTitle>
              <CardDescription>
                Отвечайте на вопросы о приватных продажах
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.map(message => (
                  <Card key={message.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold">{message.clientName}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(message.timestamp).toLocaleString('ru-RU')}
                          </p>
                        </div>
                        {!message.read && (
                          <Badge variant="default">Новое</Badge>
                        )}
                      </div>
                      <p className="text-sm mb-3">{message.message}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Ответить
                        </Button>
                        <Button variant="outline" size="sm">
                          <PhoneIcon className="mr-2 h-4 w-4" />
                          Позвонить
                        </Button>
                        <Button variant="outline" size="sm">
                          <Video className="mr-2 h-4 w-4" />
                          Видео-встреча
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* СОЗДАТЬ */}
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Создать приватную продажу</CardTitle>
              <CardDescription>
                Выберите произведение и настройте параметры эксклюзивного предложения
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="artwork">Произведение</Label>
                  <Select>
                    <SelectTrigger id="artwork">
                      <SelectValue placeholder="Выберите произведение" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="art-1">Абстрактная композиция #12 - Мария Петрова</SelectItem>
                      <SelectItem value="art-2">Портрет в интерьере - Иван Козлов</SelectItem>
                      <SelectItem value="art-3">Городской пейзаж - Анна Смирнова</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="price">Цена ($)</Label>
                    <Input id="price" type="number" placeholder="125000" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expires">Срок действия</Label>
                    <Input id="expires" type="date" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visibility">Видимость</Label>
                  <Select>
                    <SelectTrigger id="visibility">
                      <SelectValue placeholder="Выберите уровень доступа" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="invite-only">Только по приглашениям</SelectItem>
                      <SelectItem value="vip-clients">Все VIP клиенты</SelectItem>
                      <SelectItem value="selected-list">Выбранный список</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Описание</Label>
                  <Textarea 
                    id="description"
                    rows={4}
                    placeholder="Опишите произведение, его историю и уникальность..."
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Выберите клиентов для приглашения</Label>
                  <div className="space-y-2">
                    {clients.slice(0, 3).map(client => (
                      <div key={client.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <input type="checkbox" className="w-4 h-4" />
                          <div>
                            <p className="font-medium">{client.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {client.interests.join(', ')}
                            </p>
                          </div>
                        </div>
                        <Badge variant={client.type === 'vip' ? 'default' : 'secondary'}>
                          {client.type === 'vip' ? 'VIP' : client.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1" onClick={handleCreateSale}>
                    <Send className="mr-2 h-4 w-4" />
                    Создать и отправить приглашения
                  </Button>
                  <Button variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    Предпросмотр
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Настройки приватных продаж</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Автоматическое продление</Label>
                  <p className="text-sm text-muted-foreground">
                    Продлевать срок при наличии активных переговоров
                  </p>
                </div>
                <Switch />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Уведомления о просмотрах</Label>
                  <p className="text-sm text-muted-foreground">
                    Получать уведомления когда клиент просматривает предложение
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Показывать другие работы</Label>
                  <p className="text-sm text-muted-foreground">
                    Предлагать клиенту похожие произведения
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
