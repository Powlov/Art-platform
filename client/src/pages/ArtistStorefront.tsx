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
  Globe,
  Palette,
  Image,
  Layout,
  Settings,
  Eye,
  Share2,
  Link2,
  Upload,
  Download,
  Edit,
  Trash2,
  Save,
  Copy,
  ExternalLink,
  Smartphone,
  Monitor,
  Tablet,
  Check,
  X,
  Plus,
  Lock,
  Unlock,
  Star,
  TrendingUp,
  Users,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin
} from 'lucide-react';

interface Portfolio {
  id: string;
  name: string;
  subdomain: string;
  theme: 'minimal' | 'modern' | 'classic' | 'bold';
  primaryColor: string;
  status: 'published' | 'draft' | 'private';
  customDomain?: string;
  createdAt: string;
  lastUpdated: string;
  views: number;
  artworks: number;
}

interface StorefrontSettings {
  title: string;
  tagline: string;
  bio: string;
  avatar: string;
  coverImage: string;
  email: string;
  phone: string;
  location: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
  };
  features: {
    showPrices: boolean;
    enableInquiry: boolean;
    showContact: boolean;
    enableNewsletter: boolean;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

export default function ArtistStorefront() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>('');

  // Mock данные для демонстрации
  const [portfolios] = useState<Portfolio[]>([
    {
      id: 'p1',
      name: 'Основное портфолио',
      subdomain: 'ivan-petrov',
      theme: 'modern',
      primaryColor: '#3B82F6',
      status: 'published',
      customDomain: 'ivanpetrov.art',
      createdAt: '2024-01-15',
      lastUpdated: '2024-02-08',
      views: 2534,
      artworks: 24
    },
    {
      id: 'p2',
      name: 'Современная абстракция',
      subdomain: 'ivan-petrov-abstract',
      theme: 'minimal',
      primaryColor: '#8B5CF6',
      status: 'published',
      createdAt: '2024-01-20',
      lastUpdated: '2024-02-05',
      views: 892,
      artworks: 12
    },
    {
      id: 'p3',
      name: 'Персональная выставка 2024',
      subdomain: 'ivan-petrov-2024',
      theme: 'classic',
      primaryColor: '#F59E0B',
      status: 'draft',
      createdAt: '2024-02-01',
      lastUpdated: '2024-02-08',
      views: 0,
      artworks: 8
    }
  ]);

  const [settings, setSettings] = useState<StorefrontSettings>({
    title: 'Иван Петров',
    tagline: 'Современный художник-абстракционист',
    bio: 'Работаю с абстрактными формами, исследуя взаимодействие цвета и пространства. Мои произведения находятся в частных коллекциях России, Европы и США.',
    avatar: '',
    coverImage: '',
    email: 'ivan.petrov@example.com',
    phone: '+7 (495) 123-45-67',
    location: 'Москва, Россия',
    socialLinks: {
      instagram: '@ivanpetrov.art',
      facebook: 'ivanpetrov.art',
    },
    features: {
      showPrices: true,
      enableInquiry: true,
      showContact: true,
      enableNewsletter: false
    },
    seo: {
      metaTitle: 'Иван Петров - Современный художник-абстракционист',
      metaDescription: 'Официальный сайт художника Ивана Петрова. Портфолио, выставки, продажа произведений.',
      keywords: ['современное искусство', 'абстракционизм', 'живопись', 'художник']
    }
  });

  const themes = [
    { value: 'minimal', label: 'Минимализм', preview: '🤍' },
    { value: 'modern', label: 'Современный', preview: '🎨' },
    { value: 'classic', label: 'Классический', preview: '🏛️' },
    { value: 'bold', label: 'Смелый', preview: '🔥' }
  ];

  const colorSchemes = [
    { value: '#3B82F6', label: 'Синий' },
    { value: '#8B5CF6', label: 'Фиолетовый' },
    { value: '#F59E0B', label: 'Янтарный' },
    { value: '#10B981', label: 'Зелёный' },
    { value: '#EF4444', label: 'Красный' },
    { value: '#6366F1', label: 'Индиго' }
  ];

  const handleCreatePortfolio = () => {
    toast({
      title: 'Портфолио создано',
      description: 'Ваш новый сайт успешно создан и готов к настройке',
    });
  };

  const handlePublish = () => {
    toast({
      title: 'Сайт опубликован',
      description: 'Ваше портфолио теперь доступно по адресу https://ivan-petrov.artbank.market',
    });
  };

  const handleSaveSettings = () => {
    toast({
      title: 'Настройки сохранены',
      description: 'Изменения применены к вашему портфолио',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'outline', icon: any }> = {
      published: { variant: 'default', icon: Check },
      draft: { variant: 'secondary', icon: Edit },
      private: { variant: 'outline', icon: Lock }
    };

    const config = variants[status] || variants.draft;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status === 'published' ? 'Опубликовано' :
         status === 'draft' ? 'Черновик' : 'Приватно'}
      </Badge>
    );
  };

  const getPreviewWidth = () => {
    switch (previewDevice) {
      case 'mobile': return 'max-w-[375px]';
      case 'tablet': return 'max-w-[768px]';
      default: return 'max-w-full';
    }
  };

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
              Для создания витринного сайта необходимо войти как художник
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
          <Globe className="h-10 w-10 text-blue-500" />
          Витрина художника
        </h1>
        <p className="text-muted-foreground">
          Создайте персональный сайт-портфолио для продвижения своих работ
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="design">Дизайн</TabsTrigger>
          <TabsTrigger value="content">Контент</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
          <TabsTrigger value="preview">Предпросмотр</TabsTrigger>
        </TabsList>

        {/* ОБЗОР */}
        <TabsContent value="overview" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Мои сайты</h2>
            <Button onClick={handleCreatePortfolio}>
              <Plus className="mr-2 h-4 w-4" />
              Создать новый сайт
            </Button>
          </div>

          <div className="grid gap-6">
            {portfolios.map(portfolio => (
              <Card key={portfolio.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{portfolio.name}</CardTitle>
                        {getStatusBadge(portfolio.status)}
                      </div>
                      <CardDescription className="flex items-center gap-4 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Globe className="h-4 w-4" />
                          {portfolio.customDomain || `${portfolio.subdomain}.artbank.market`}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {portfolio.views} просмотров
                        </span>
                        <span className="flex items-center gap-1">
                          <Image className="h-4 w-4" />
                          {portfolio.artworks} работ
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-6 h-6 rounded border-2"
                      style={{ backgroundColor: portfolio.primaryColor }}
                    />
                    <span className="text-sm text-muted-foreground">
                      Тема: {themes.find(t => t.value === portfolio.theme)?.label}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Создан: {new Date(portfolio.createdAt).toLocaleDateString('ru-RU')}</span>
                    <span>Обновлён: {new Date(portfolio.lastUpdated).toLocaleDateString('ru-RU')}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedPortfolio(portfolio.id);
                        setActiveTab('design');
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Редактировать
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="mr-2 h-4 w-4" />
                      Дублировать
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="mr-2 h-4 w-4" />
                      Поделиться
                    </Button>
                    {portfolio.status !== 'published' && (
                      <Button size="sm" onClick={handlePublish}>
                        <Upload className="mr-2 h-4 w-4" />
                        Опубликовать
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Возможности витрины
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Layout className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Профессиональный дизайн</h4>
                    <p className="text-sm text-muted-foreground">
                      4 готовых темы, полная кастомизация цветов и шрифтов
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Globe className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Собственный домен</h4>
                    <p className="text-sm text-muted-foreground">
                      Подключите свой домен или используйте бесплатный поддомен
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Адаптивность</h4>
                    <p className="text-sm text-muted-foreground">
                      Идеально отображается на всех устройствах
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">SEO оптимизация</h4>
                    <p className="text-sm text-muted-foreground">
                      Настройка мета-тегов для продвижения в поисковиках
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ДИЗАЙН */}
        <TabsContent value="design" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Выбор темы</CardTitle>
              <CardDescription>
                Выберите базовую тему оформления для вашего сайта
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {themes.map(theme => (
                  <Card 
                    key={theme.value}
                    className="cursor-pointer hover:border-primary transition-colors"
                  >
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-3">{theme.preview}</div>
                      <h3 className="font-semibold mb-1">{theme.label}</h3>
                      <Button variant="outline" size="sm" className="mt-2">
                        Выбрать
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Цветовая схема</CardTitle>
              <CardDescription>
                Основной цвет будет использоваться для акцентов на сайте
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-6">
                {colorSchemes.map(color => (
                  <div key={color.value} className="text-center">
                    <div 
                      className="w-16 h-16 rounded-lg mx-auto mb-2 cursor-pointer hover:scale-110 transition-transform border-2"
                      style={{ backgroundColor: color.value }}
                    />
                    <p className="text-sm text-muted-foreground">{color.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Изображения</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Аватар художника</Label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                    ИП
                  </div>
                  <div className="flex-1">
                    <Button variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      Загрузить фото
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      Рекомендуемый размер: 400x400px
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Обложка портфолио</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium mb-1">Перетащите изображение или нажмите для выбора</p>
                  <p className="text-xs text-muted-foreground">
                    Рекомендуемый размер: 1920x600px
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* КОНТЕНТ */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Имя художника</Label>
                  <Input 
                    id="title"
                    value={settings.title}
                    onChange={(e) => setSettings({...settings, title: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagline">Слоган</Label>
                  <Input 
                    id="tagline"
                    value={settings.tagline}
                    onChange={(e) => setSettings({...settings, tagline: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Биография</Label>
                <Textarea 
                  id="bio"
                  rows={5}
                  value={settings.bio}
                  onChange={(e) => setSettings({...settings, bio: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Контактная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({...settings, email: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <Input 
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => setSettings({...settings, phone: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Местоположение</Label>
                  <Input 
                    id="location"
                    value={settings.location}
                    onChange={(e) => setSettings({...settings, location: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Социальные сети</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="instagram" className="flex items-center gap-2">
                    <Instagram className="h-4 w-4" />
                    Instagram
                  </Label>
                  <Input 
                    id="instagram"
                    placeholder="@username"
                    value={settings.socialLinks.instagram || ''}
                    onChange={(e) => setSettings({
                      ...settings, 
                      socialLinks: {...settings.socialLinks, instagram: e.target.value}
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facebook" className="flex items-center gap-2">
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </Label>
                  <Input 
                    id="facebook"
                    placeholder="username"
                    value={settings.socialLinks.facebook || ''}
                    onChange={(e) => setSettings({
                      ...settings, 
                      socialLinks: {...settings.socialLinks, facebook: e.target.value}
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter" className="flex items-center gap-2">
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </Label>
                  <Input 
                    id="twitter"
                    placeholder="@username"
                    value={settings.socialLinks.twitter || ''}
                    onChange={(e) => setSettings({
                      ...settings, 
                      socialLinks: {...settings.socialLinks, twitter: e.target.value}
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtube" className="flex items-center gap-2">
                    <Youtube className="h-4 w-4" />
                    YouTube
                  </Label>
                  <Input 
                    id="youtube"
                    placeholder="channel/username"
                    value={settings.socialLinks.youtube || ''}
                    onChange={(e) => setSettings({
                      ...settings, 
                      socialLinks: {...settings.socialLinks, youtube: e.target.value}
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* НАСТРОЙКИ */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Функции сайта</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Показывать цены</Label>
                  <p className="text-sm text-muted-foreground">
                    Отображать стоимость произведений на сайте
                  </p>
                </div>
                <Switch 
                  checked={settings.features.showPrices}
                  onCheckedChange={(checked) => 
                    setSettings({
                      ...settings,
                      features: {...settings.features, showPrices: checked}
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Форма запроса</Label>
                  <p className="text-sm text-muted-foreground">
                    Позволить посетителям отправлять запросы о покупке
                  </p>
                </div>
                <Switch 
                  checked={settings.features.enableInquiry}
                  onCheckedChange={(checked) => 
                    setSettings({
                      ...settings,
                      features: {...settings.features, enableInquiry: checked}
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Контактная информация</Label>
                  <p className="text-sm text-muted-foreground">
                    Отображать email, телефон и местоположение
                  </p>
                </div>
                <Switch 
                  checked={settings.features.showContact}
                  onCheckedChange={(checked) => 
                    setSettings({
                      ...settings,
                      features: {...settings.features, showContact: checked}
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Подписка на новости</Label>
                  <p className="text-sm text-muted-foreground">
                    Форма подписки на email-рассылку
                  </p>
                </div>
                <Switch 
                  checked={settings.features.enableNewsletter}
                  onCheckedChange={(checked) => 
                    setSettings({
                      ...settings,
                      features: {...settings.features, enableNewsletter: checked}
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO настройки</CardTitle>
              <CardDescription>
                Оптимизация для поисковых систем
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input 
                  id="metaTitle"
                  value={settings.seo.metaTitle}
                  onChange={(e) => setSettings({
                    ...settings,
                    seo: {...settings.seo, metaTitle: e.target.value}
                  })}
                />
                <p className="text-xs text-muted-foreground">
                  Рекомендуемая длина: 50-60 символов
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea 
                  id="metaDescription"
                  rows={3}
                  value={settings.seo.metaDescription}
                  onChange={(e) => setSettings({
                    ...settings,
                    seo: {...settings.seo, metaDescription: e.target.value}
                  })}
                />
                <p className="text-xs text-muted-foreground">
                  Рекомендуемая длина: 150-160 символов
                </p>
              </div>

              <div className="space-y-2">
                <Label>Ключевые слова</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {settings.seo.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary">
                      {keyword}
                      <X className="ml-1 h-3 w-3 cursor-pointer" />
                    </Badge>
                  ))}
                </div>
                <Input placeholder="Добавить ключевое слово" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Домен</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Бесплатный поддомен</Label>
                <div className="flex gap-2">
                  <Input 
                    value="ivan-petrov"
                    className="flex-1"
                  />
                  <span className="flex items-center px-3 bg-muted rounded-md text-sm">
                    .artbank.market
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Собственный домен</Label>
                <Input 
                  placeholder="example.com"
                  value={portfolios[0].customDomain}
                />
                <p className="text-xs text-muted-foreground">
                  Подключите свой домен для более профессионального вида
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button onClick={handleSaveSettings} className="flex-1">
              <Save className="mr-2 h-4 w-4" />
              Сохранить настройки
            </Button>
            <Button variant="outline" onClick={handlePublish}>
              <Upload className="mr-2 h-4 w-4" />
              Опубликовать
            </Button>
          </div>
        </TabsContent>

        {/* ПРЕДПРОСМОТР */}
        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Предпросмотр сайта</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant={previewDevice === 'desktop' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewDevice('desktop')}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={previewDevice === 'tablet' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewDevice('tablet')}
                  >
                    <Tablet className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={previewDevice === 'mobile' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewDevice('mobile')}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`mx-auto border rounded-lg overflow-hidden ${getPreviewWidth()}`}>
                {/* Mockup предпросмотра */}
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 h-64 flex items-center justify-center text-white">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold mb-2">{settings.title}</h1>
                    <p className="text-xl">{settings.tagline}</p>
                  </div>
                </div>
                <div className="p-8 bg-white dark:bg-gray-800">
                  <h2 className="text-2xl font-bold mb-4">О художнике</h2>
                  <p className="text-muted-foreground mb-6">{settings.bio}</p>
                  
                  <h3 className="text-xl font-bold mb-4">Портфолио</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[1,2,3,4,5,6].map(i => (
                      <div key={i} className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg"></div>
                    ))}
                  </div>

                  {settings.features.showContact && (
                    <div className="mt-8 pt-8 border-t">
                      <h3 className="text-xl font-bold mb-4">Контакты</h3>
                      <div className="space-y-2">
                        <p className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {settings.email}
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {settings.phone}
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {settings.location}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-center gap-3">
                <Button variant="outline">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Открыть в новой вкладке
                </Button>
                <Button variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  Поделиться ссылкой
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
