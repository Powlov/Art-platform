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
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { 
  Users, 
  Palette, 
  TrendingUp, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin,
  DollarSign,
  Star,
  MessageSquare,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Send,
  Tag,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Briefcase,
  Lock,
  ChevronRight,
  Settings
} from 'lucide-react';

interface Contact {
  id: string;
  type: 'client' | 'artist';
  name: string;
  email: string;
  phone: string;
  location: string;
  status: 'active' | 'inactive' | 'vip' | 'prospect';
  totalPurchases?: number;
  totalSales?: number;
  lastContact: string;
  tags: string[];
  avatar?: string;
  notes?: string;
}

interface Deal {
  id: string;
  artworkTitle: string;
  artistName: string;
  clientName: string;
  value: number;
  stage: 'lead' | 'negotiation' | 'proposal' | 'closing' | 'won' | 'lost';
  probability: number;
  expectedCloseDate: string;
  createdDate: string;
  lastActivity: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  type: 'call' | 'email' | 'meeting' | 'follow-up';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed' | 'overdue';
  assignedTo: string;
  relatedTo: string;
  dueDate: string;
}

interface Exhibition {
  id: string;
  title: string;
  venue: string;
  startDate: string;
  endDate: string;
  artists: string[];
  artworks: number;
  visitors: number;
  sales: number;
  status: 'planned' | 'active' | 'completed';
}

export default function GalleryCRM() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock данные для демонстрации
  const [contacts] = useState<Contact[]>([
    {
      id: 'c1',
      type: 'client',
      name: 'Александр Смирнов',
      email: 'smirnov@example.com',
      phone: '+7 (495) 123-45-67',
      location: 'Москва, Россия',
      status: 'vip',
      totalPurchases: 450000,
      lastContact: '2024-02-01',
      tags: ['VIP', 'Коллекционер', 'Современное искусство'],
      notes: 'Интересуется абстракционизмом, готов к крупным покупкам'
    },
    {
      id: 'c2',
      type: 'artist',
      name: 'Мария Петрова',
      email: 'petrova@example.com',
      phone: '+7 (495) 234-56-78',
      location: 'Санкт-Петербург, Россия',
      status: 'active',
      totalSales: 280000,
      lastContact: '2024-01-28',
      tags: ['Живопись', 'Портреты', 'Эксклюзив'],
      notes: 'Готовит новую коллекцию к весне 2024'
    },
    {
      id: 'c3',
      type: 'client',
      name: 'Елена Волкова',
      email: 'volkova@example.com',
      phone: '+7 (495) 345-67-89',
      location: 'Москва, Россия',
      status: 'prospect',
      totalPurchases: 0,
      lastContact: '2024-01-25',
      tags: ['Новый клиент', 'Интерес к графике'],
      notes: 'Посетила последнюю выставку, запросила каталог'
    },
    {
      id: 'c4',
      type: 'artist',
      name: 'Иван Козлов',
      email: 'kozlov@example.com',
      phone: '+7 (812) 456-78-90',
      location: 'Санкт-Петербург, Россия',
      status: 'active',
      totalSales: 150000,
      lastContact: '2024-01-20',
      tags: ['Скульптура', 'Современное искусство'],
      notes: 'Работает над инсталляцией для следующей выставки'
    }
  ]);

  const [deals] = useState<Deal[]>([
    {
      id: 'd1',
      artworkTitle: 'Абстрактная композиция #12',
      artistName: 'Мария Петрова',
      clientName: 'Александр Смирнов',
      value: 85000,
      stage: 'negotiation',
      probability: 75,
      expectedCloseDate: '2024-02-15',
      createdDate: '2024-01-20',
      lastActivity: '2024-02-01'
    },
    {
      id: 'd2',
      artworkTitle: 'Городской пейзаж',
      artistName: 'Иван Козлов',
      clientName: 'Елена Волкова',
      value: 45000,
      stage: 'proposal',
      probability: 60,
      expectedCloseDate: '2024-02-20',
      createdDate: '2024-01-25',
      lastActivity: '2024-01-30'
    },
    {
      id: 'd3',
      artworkTitle: 'Портрет в интерьере',
      artistName: 'Мария Петрова',
      clientName: 'Корпорация "Арт Инвест"',
      value: 120000,
      stage: 'closing',
      probability: 90,
      expectedCloseDate: '2024-02-10',
      createdDate: '2024-01-15',
      lastActivity: '2024-02-02'
    }
  ]);

  const [tasks] = useState<Task[]>([
    {
      id: 't1',
      title: 'Звонок Александру Смирнову',
      description: 'Обсудить детали сделки по "Абстрактной композиции #12"',
      type: 'call',
      priority: 'high',
      status: 'pending',
      assignedTo: 'Менеджер 1',
      relatedTo: 'Александр Смирнов',
      dueDate: '2024-02-05'
    },
    {
      id: 't2',
      title: 'Отправить каталог Елене Волковой',
      description: 'Отправить PDF каталог с работами по графике',
      type: 'email',
      priority: 'medium',
      status: 'pending',
      assignedTo: 'Менеджер 2',
      relatedTo: 'Елена Волкова',
      dueDate: '2024-02-06'
    },
    {
      id: 't3',
      title: 'Встреча с Марией Петровой',
      description: 'Обсудить новую коллекцию и условия следующей выставки',
      type: 'meeting',
      priority: 'high',
      status: 'completed',
      assignedTo: 'Директор галереи',
      relatedTo: 'Мария Петрова',
      dueDate: '2024-01-28'
    }
  ]);

  const [exhibitions] = useState<Exhibition[]>([
    {
      id: 'e1',
      title: 'Современный взгляд',
      venue: 'Главный зал',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      artists: ['Мария Петрова', 'Иван Козлов'],
      artworks: 24,
      visitors: 1250,
      sales: 3,
      status: 'active'
    },
    {
      id: 'e2',
      title: 'Портреты эпохи',
      venue: 'Малый зал',
      startDate: '2024-02-20',
      endDate: '2024-03-20',
      artists: ['Мария Петрова'],
      artworks: 15,
      visitors: 0,
      sales: 0,
      status: 'planned'
    },
    {
      id: 'e3',
      title: 'Абстракция и реальность',
      venue: 'Главный зал',
      startDate: '2023-12-01',
      endDate: '2024-01-10',
      artists: ['Несколько авторов'],
      artworks: 32,
      visitors: 2100,
      sales: 8,
      status: 'completed'
    }
  ]);

  const getStatusBadge = (status: string, type: 'contact' | 'deal' | 'task' | 'exhibition') => {
    if (type === 'contact') {
      const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
        active: { variant: 'default', label: 'Активен' },
        inactive: { variant: 'secondary', label: 'Неактивен' },
        vip: { variant: 'default', label: 'VIP' },
        prospect: { variant: 'outline', label: 'Потенциал' }
      };
      const config = variants[status] || variants.active;
      return <Badge variant={config.variant}>{config.label}</Badge>;
    }

    if (type === 'deal') {
      const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
        lead: { variant: 'secondary', label: 'Лид' },
        negotiation: { variant: 'outline', label: 'Переговоры' },
        proposal: { variant: 'outline', label: 'Предложение' },
        closing: { variant: 'default', label: 'Закрытие' },
        won: { variant: 'default', label: 'Выиграна' },
        lost: { variant: 'destructive', label: 'Проиграна' }
      };
      const config = variants[status] || variants.lead;
      return <Badge variant={config.variant}>{config.label}</Badge>;
    }

    if (type === 'task') {
      const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string, icon: any }> = {
        pending: { variant: 'outline', label: 'Ожидает', icon: Clock },
        completed: { variant: 'default', label: 'Выполнено', icon: CheckCircle2 },
        overdue: { variant: 'destructive', label: 'Просрочено', icon: AlertCircle }
      };
      const config = variants[status] || variants.pending;
      const Icon = config.icon;
      return (
        <Badge variant={config.variant} className="gap-1">
          <Icon className="h-3 w-3" />
          {config.label}
        </Badge>
      );
    }

    // exhibition
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
      planned: { variant: 'outline', label: 'Запланирована' },
      active: { variant: 'default', label: 'Активна' },
      completed: { variant: 'secondary', label: 'Завершена' }
    };
    const config = variants[status] || variants.planned;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesType = filterType === 'all' || contact.type === filterType;
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          contact.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const clientCount = contacts.filter(c => c.type === 'client').length;
  const artistCount = contacts.filter(c => c.type === 'artist').length;
  const vipCount = contacts.filter(c => c.status === 'vip').length;
  const totalRevenue = deals.filter(d => d.stage === 'won').reduce((sum, d) => sum + d.value, 0);
  const activeDeals = deals.filter(d => !['won', 'lost'].includes(d.stage)).length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;

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
              Для доступа к CRM системе необходимо войти как представитель галереи
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
          <Briefcase className="h-10 w-10 text-purple-500" />
          CRM для галерей
        </h1>
        <p className="text-muted-foreground">
          Управление клиентами, художниками, сделками и выставками в одном месте
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 lg:w-auto">
          <TabsTrigger value="dashboard">Дашборд</TabsTrigger>
          <TabsTrigger value="contacts">Контакты</TabsTrigger>
          <TabsTrigger value="deals">Сделки</TabsTrigger>
          <TabsTrigger value="tasks">Задачи</TabsTrigger>
          <TabsTrigger value="exhibitions">Выставки</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
        </TabsList>

        {/* ДАШБОРД */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Клиенты</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clientCount}</div>
                <p className="text-xs text-muted-foreground">
                  {vipCount} VIP клиентов
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Художники</CardTitle>
                <Palette className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{artistCount}</div>
                <p className="text-xs text-muted-foreground">
                  Активные партнёры
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Активные сделки</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeDeals}</div>
                <p className="text-xs text-muted-foreground">
                  Общая стоимость: ${deals.reduce((sum, d) => sum + d.value, 0).toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Задачи</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingTasks}</div>
                <p className="text-xs text-muted-foreground">
                  Требуют внимания
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Предстоящие задачи</CardTitle>
                <CardDescription>Срочные дела на ближайшие дни</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {tasks.filter(t => t.status === 'pending').slice(0, 5).map(task => (
                  <div key={task.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(task.dueDate).toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                    <Badge variant={task.priority === 'high' ? 'destructive' : 'outline'}>
                      {task.priority === 'high' ? 'Срочно' : task.priority === 'medium' ? 'Средний' : 'Низкий'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Горячие сделки</CardTitle>
                <CardDescription>Сделки на стадии закрытия</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {deals.filter(d => ['closing', 'negotiation'].includes(d.stage)).slice(0, 5).map(deal => (
                  <div key={deal.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="font-medium">{deal.artworkTitle}</p>
                      <p className="text-sm text-muted-foreground">{deal.clientName}</p>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-3 w-3" />
                        <span className="text-sm font-medium">${deal.value.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(deal.stage, 'deal')}
                      <p className="text-xs text-muted-foreground mt-1">{deal.probability}%</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Активные выставки</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {exhibitions.filter(e => e.status === 'active').map(exhibition => (
                  <Card key={exhibition.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{exhibition.title}</CardTitle>
                      <CardDescription>{exhibition.venue}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold">{exhibition.artworks}</p>
                          <p className="text-xs text-muted-foreground">Работ</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{exhibition.visitors}</p>
                          <p className="text-xs text-muted-foreground">Посетителей</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{exhibition.sales}</p>
                          <p className="text-xs text-muted-foreground">Продаж</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>До {new Date(exhibition.endDate).toLocaleDateString('ru-RU')}</span>
                        {getStatusBadge(exhibition.status, 'exhibition')}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* КОНТАКТЫ */}
        <TabsContent value="contacts" className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск контактов..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все контакты</SelectItem>
                  <SelectItem value="client">Клиенты</SelectItem>
                  <SelectItem value="artist">Художники</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Добавить контакт
            </Button>
          </div>

          <div className="grid gap-6">
            {filteredContacts.map(contact => (
              <Card key={contact.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                        {contact.name.charAt(0)}
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-2">{contact.name}</CardTitle>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {getStatusBadge(contact.status, 'contact')}
                          <Badge variant="outline">
                            {contact.type === 'client' ? 'Клиент' : 'Художник'}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {contact.tags.map(tag => (
                            <Badge key={tag} variant="secondary">
                              <Tag className="mr-1 h-3 w-3" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{contact.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Контакт: {new Date(contact.lastContact).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </div>

                  {contact.notes && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">{contact.notes}</p>
                    </div>
                  )}

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      {contact.type === 'client' && contact.totalPurchases !== undefined && (
                        <div>
                          <p className="text-muted-foreground">Покупки</p>
                          <p className="font-bold text-lg">${contact.totalPurchases.toLocaleString()}</p>
                        </div>
                      )}
                      {contact.type === 'artist' && contact.totalSales !== undefined && (
                        <div>
                          <p className="text-muted-foreground">Продажи</p>
                          <p className="font-bold text-lg">${contact.totalSales.toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Phone className="mr-2 h-4 w-4" />
                        Позвонить
                      </Button>
                      <Button variant="outline" size="sm">
                        <Send className="mr-2 h-4 w-4" />
                        Написать
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* СДЕЛКИ */}
        <TabsContent value="deals" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Воронка продаж</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Новая сделка
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-5">
            {['lead', 'negotiation', 'proposal', 'closing', 'won'].map(stage => {
              const stageDeals = deals.filter(d => d.stage === stage);
              const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
              
              return (
                <Card key={stage}>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      {stage === 'lead' ? 'Лиды' :
                       stage === 'negotiation' ? 'Переговоры' :
                       stage === 'proposal' ? 'Предложения' :
                       stage === 'closing' ? 'Закрытие' : 'Выиграно'}
                    </CardTitle>
                    <CardDescription>
                      {stageDeals.length} • ${(stageValue / 1000).toFixed(0)}K
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {stageDeals.map(deal => (
                      <Card key={deal.id} className="p-3">
                        <h4 className="font-semibold text-sm mb-1">{deal.artworkTitle}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{deal.clientName}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold">${(deal.value / 1000).toFixed(0)}K</span>
                          <span className="text-xs text-muted-foreground">{deal.probability}%</span>
                        </div>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Все сделки</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deals.map(deal => (
                  <div key={deal.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{deal.artworkTitle}</h4>
                        {getStatusBadge(deal.stage, 'deal')}
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {deal.clientName}
                          </span>
                        </div>
                        <div>
                          <span className="flex items-center gap-1">
                            <Palette className="h-3 w-3" />
                            {deal.artistName}
                          </span>
                        </div>
                        <div>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(deal.expectedCloseDate).toLocaleDateString('ru-RU')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">${deal.value.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{deal.probability}% вероятность</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ЗАДАЧИ */}
        <TabsContent value="tasks" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Задачи и активности</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Создать задачу
            </Button>
          </div>

          <div className="grid gap-6">
            {tasks.map(task => (
              <Card key={task.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{task.title}</CardTitle>
                      <CardDescription>{task.description}</CardDescription>
                    </div>
                    {getStatusBadge(task.status, 'task')}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Тип</p>
                      <div className="flex items-center gap-2">
                        {task.type === 'call' && <Phone className="h-4 w-4" />}
                        {task.type === 'email' && <Mail className="h-4 w-4" />}
                        {task.type === 'meeting' && <Users className="h-4 w-4" />}
                        {task.type === 'follow-up' && <Activity className="h-4 w-4" />}
                        <span className="font-medium">
                          {task.type === 'call' ? 'Звонок' :
                           task.type === 'email' ? 'Email' :
                           task.type === 'meeting' ? 'Встреча' : 'Повторный контакт'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Приоритет</p>
                      <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'outline'}>
                        {task.priority === 'high' ? 'Высокий' : task.priority === 'medium' ? 'Средний' : 'Низкий'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Срок</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">
                          {new Date(task.dueDate).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Связано с</p>
                      <span className="font-medium">{task.relatedTo}</span>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex gap-2">
                    {task.status === 'pending' && (
                      <Button size="sm">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Выполнено
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Изменить
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Удалить
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ВЫСТАВКИ */}
        <TabsContent value="exhibitions" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Управление выставками</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Создать выставку
            </Button>
          </div>

          <div className="grid gap-6">
            {exhibitions.map(exhibition => (
              <Card key={exhibition.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-2">{exhibition.title}</CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {exhibition.venue}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(exhibition.startDate).toLocaleDateString('ru-RU')} - {new Date(exhibition.endDate).toLocaleDateString('ru-RU')}
                        </span>
                      </CardDescription>
                    </div>
                    {getStatusBadge(exhibition.status, 'exhibition')}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <p className="text-3xl font-bold">{exhibition.artworks}</p>
                        <p className="text-sm text-muted-foreground">Произведений</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <p className="text-3xl font-bold">{exhibition.artists.length}</p>
                        <p className="text-sm text-muted-foreground">Художников</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <p className="text-3xl font-bold">{exhibition.visitors}</p>
                        <p className="text-sm text-muted-foreground">Посетителей</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <p className="text-3xl font-bold">{exhibition.sales}</p>
                        <p className="text-sm text-muted-foreground">Продаж</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Участвующие художники:</h4>
                    <div className="flex flex-wrap gap-2">
                      {exhibition.artists.map(artist => (
                        <Badge key={artist} variant="secondary">
                          <Palette className="mr-1 h-3 w-3" />
                          {artist}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Подробнее
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Редактировать
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Отчёт
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* АНАЛИТИКА */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Конверсия лидов</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
                <p className="text-xs text-muted-foreground">
                  +5% к прошлому месяцу
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Средний чек</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$83,300</div>
                <p className="text-xs text-muted-foreground">
                  +12% к прошлому месяцу
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Цикл сделки</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28 дней</div>
                <p className="text-xs text-muted-foreground">
                  -3 дня к прошлому месяцу
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Производительность команды</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                      А
                    </div>
                    <div>
                      <p className="font-medium">Анна Сидорова</p>
                      <p className="text-sm text-muted-foreground">Менеджер</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">$420K</p>
                    <p className="text-sm text-muted-foreground">12 сделок</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      Д
                    </div>
                    <div>
                      <p className="font-medium">Дмитрий Ковалёв</p>
                      <p className="text-sm text-muted-foreground">Менеджер</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">$380K</p>
                    <p className="text-sm text-muted-foreground">10 сделок</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold">
                      Е
                    </div>
                    <div>
                      <p className="font-medium">Елена Морозова</p>
                      <p className="text-sm text-muted-foreground">Менеджер</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">$250K</p>
                    <p className="text-sm text-muted-foreground">8 сделок</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Источники лидов
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Выставки</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Сайт</span>
                      <span className="text-sm font-medium">30%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Рефералы</span>
                      <span className="text-sm font-medium">15%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Другое</span>
                      <span className="text-sm font-medium">10%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Популярные жанры
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Современное искусство</span>
                      <span className="text-sm font-medium">$580K</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Классическая живопись</span>
                      <span className="text-sm font-medium">$320K</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Скульптура</span>
                      <span className="text-sm font-medium">$250K</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '32%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Графика</span>
                      <span className="text-sm font-medium">$120K</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '16%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
