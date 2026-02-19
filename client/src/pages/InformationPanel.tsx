import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Star, Heart, Share2, Settings } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';

interface InformationWidget {
  id: string;
  type: 'news' | 'stats' | 'chart' | 'trending' | 'recommendations' | 'events';
  title: string;
  enabled: boolean;
  position: number;
}

interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: 'artwork' | 'artist' | 'style' | 'market';
  date: string;
  source: string;
  image?: string;
}

interface PersonalizedWidget {
  id: string;
  title: string;
  type: string;
  data: any;
}

const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Абстракционизм показывает рост на 12.5% за месяц',
    content: 'Спрос на абстрактные произведения значительно вырос благодаря новым коллекторам',
    category: 'style',
    date: '2025-01-15',
    source: 'ART BANK MARKET',
    image: '🎨',
  },
  {
    id: '2',
    title: 'Новая выставка художника Александра Виноградова',
    content: 'Открывается экспозиция "Красные линии" в главном зале маркета',
    category: 'artist',
    date: '2025-01-14',
    source: 'Галерея Триумф',
    image: '🖼️',
  },
  {
    id: '3',
    title: 'Произведение "Синий квадрат" выросло в цене на 8%',
    content: 'Каскадный эффект привел к переоценке работ в стиле минимализм',
    category: 'artwork',
    date: '2025-01-13',
    source: 'ART BANK MARKET',
    image: '📈',
  },
  {
    id: '4',
    title: 'Рынок современного искусства показывает стабильность',
    content: 'Аналитики отмечают устойчивый рост спроса на качественные произведения',
    category: 'market',
    date: '2025-01-12',
    source: 'Финансовый анализ',
    image: '📊',
  },
];

const MOCK_TRENDING = [
  { name: 'Абстракционизм', growth: 12.5, artworks: 450 },
  { name: 'Живопись', growth: 8.3, artworks: 380 },
  { name: 'Фотография', growth: 5.7, artworks: 220 },
  { name: 'Видео-арт', growth: 15.2, artworks: 150 },
  { name: 'Инсталляция', growth: -1.3, artworks: 95 },
];

const MOCK_RECOMMENDATIONS = [
  {
    id: '1',
    title: 'Красная линия',
    artist: 'Александр Виноградов',
    price: 125000,
    reason: 'Похожа на ваши предыдущие покупки',
    match: 92,
  },
  {
    id: '2',
    title: 'Зелёный круг',
    artist: 'Мария Сафронова',
    price: 85000,
    reason: 'Растущий тренд в абстракционизме',
    match: 87,
  },
  {
    id: '3',
    title: 'Синий треугольник',
    artist: 'Дмитрий Кавarga',
    price: 95000,
    reason: 'Рекомендуется экспертами',
    match: 85,
  },
];

const MOCK_EVENTS = [
  {
    id: '1',
    title: 'Панель "Искусство как класс активов"',
    date: '2025-01-20',
    time: '12:00',
    location: 'Конференц-зал',
    type: 'discussion',
  },
  {
    id: '2',
    title: 'Приватный просмотр новых работ',
    date: '2025-01-22',
    time: '10:00',
    location: 'Главный зал',
    type: 'exhibition',
  },
  {
    id: '3',
    title: 'Консультация с финансовым экспертом',
    date: '2025-01-25',
    time: '15:00',
    location: 'Приватный кабинет',
    type: 'consultation',
  },
];

export default function InformationPanel() {
  const { user } = useAuth();
  const [widgets, setWidgets] = useState<InformationWidget[]>([
    { id: '1', type: 'news', title: 'Новости', enabled: true, position: 1 },
    { id: '2', type: 'stats', title: 'Статистика', enabled: true, position: 2 },
    { id: '3', type: 'trending', title: 'В тренде', enabled: true, position: 3 },
    { id: '4', type: 'recommendations', title: 'Рекомендации', enabled: true, position: 4 },
    { id: '5', type: 'events', title: 'События', enabled: true, position: 5 },
  ]);
  const [news, setNews] = useState<NewsItem[]>(MOCK_NEWS);
  const [customizations, setCustomizations] = useState<Record<string, any>>({});
  const [editMode, setEditMode] = useState(false);

  // Toggle widget visibility
  const toggleWidget = (widgetId: string) => {
    setWidgets(widgets.map(w =>
      w.id === widgetId ? { ...w, enabled: !w.enabled } : w
    ));
  };

  // Reorder widgets
  const reorderWidget = (widgetId: string, direction: 'up' | 'down') => {
    const index = widgets.findIndex(w => w.id === widgetId);
    if ((direction === 'up' && index > 0) || (direction === 'down' && index < widgets.length - 1)) {
      const newWidgets = [...widgets];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      [newWidgets[index], newWidgets[targetIndex]] = [newWidgets[targetIndex], newWidgets[index]];
      setWidgets(newWidgets.map((w, i) => ({ ...w, position: i + 1 })));
    }
  };

  // Filter news by category
  const filterNews = (category: string) => {
    if (category === 'all') return news;
    return news.filter(n => n.category === category);
  };

  const renderNewsWidget = () => (
    <Card>
      <CardHeader>
        <CardTitle>Новости</CardTitle>
        <CardDescription>Последние обновления с платформы</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">Все</TabsTrigger>
            <TabsTrigger value="artwork">Работы</TabsTrigger>
            <TabsTrigger value="artist">Художники</TabsTrigger>
            <TabsTrigger value="style">Стили</TabsTrigger>
            <TabsTrigger value="market">Рынок</TabsTrigger>
          </TabsList>
          {['all', 'artwork', 'artist', 'style', 'market'].map(category => (
            <TabsContent key={category} value={category} className="space-y-3 mt-4">
              {filterNews(category).map(item => (
                <div key={item.id} className="p-3 border border-border rounded-lg hover:bg-accent transition">
                  <div className="flex gap-3">
                    <span className="text-2xl">{item.image}</span>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{item.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline">{item.source}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.date).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );

  const renderStatsWidget = () => (
    <Card>
      <CardHeader>
        <CardTitle>Статистика</CardTitle>
        <CardDescription>Ваша активность на платформе</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-accent rounded-lg">
            <p className="text-sm text-muted-foreground">Просмотры</p>
            <p className="text-2xl font-bold text-foreground">1,234</p>
            <p className="text-xs text-green-600 mt-1">+12% от вчера</p>
          </div>
          <div className="p-3 bg-accent rounded-lg">
            <p className="text-sm text-muted-foreground">Избранное</p>
            <p className="text-2xl font-bold text-foreground">87</p>
            <p className="text-xs text-green-600 mt-1">+5 новых</p>
          </div>
          <div className="p-3 bg-accent rounded-lg">
            <p className="text-sm text-muted-foreground">Сделки</p>
            <p className="text-2xl font-bold text-foreground">12</p>
            <p className="text-xs text-green-600 mt-1">+2 за неделю</p>
          </div>
          <div className="p-3 bg-accent rounded-lg">
            <p className="text-sm text-muted-foreground">Портфель</p>
            <p className="text-2xl font-bold text-foreground">1.2M ₽</p>
            <p className="text-xs text-green-600 mt-1">+8% прибыль</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderTrendingWidget = () => (
    <Card>
      <CardHeader>
        <CardTitle>В тренде</CardTitle>
        <CardDescription>Популярные жанры и стили</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {MOCK_TRENDING.map((trend, index) => (
            <div key={index} className="flex items-center justify-between p-2 hover:bg-accent rounded transition">
              <div>
                <p className="font-medium text-foreground">{trend.name}</p>
                <p className="text-xs text-muted-foreground">{trend.artworks} произведений</p>
              </div>
              <div className={`flex items-center gap-1 ${trend.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend.growth > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="font-medium">{trend.growth > 0 ? '+' : ''}{trend.growth.toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderRecommendationsWidget = () => (
    <Card>
      <CardHeader>
        <CardTitle>Рекомендации для вас</CardTitle>
        <CardDescription>На основе ваших предпочтений</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {MOCK_RECOMMENDATIONS.map(rec => (
            <div key={rec.id} className="p-3 border border-border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-foreground">{rec.title}</p>
                  <p className="text-sm text-muted-foreground">{rec.artist}</p>
                </div>
                <Badge variant="secondary">{rec.match}%</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{rec.reason}</p>
              <div className="flex items-center justify-between">
                <p className="font-bold text-foreground">{(rec.price / 1000).toFixed(0)}K ₽</p>
                <Button size="sm" variant="outline">Подробнее</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderEventsWidget = () => (
    <Card>
      <CardHeader>
        <CardTitle>Предстоящие события</CardTitle>
        <CardDescription>Не пропустите важные мероприятия</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {MOCK_EVENTS.map(event => (
            <div key={event.id} className="p-3 border border-border rounded-lg">
              <p className="font-medium text-foreground">{event.title}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>📅 {new Date(event.date).toLocaleDateString('ru-RU')}</span>
                <span>🕐 {event.time}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">📍 {event.location}</p>
              <Button size="sm" className="mt-2 w-full" variant="outline">Зарегистрироваться</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderWidget = (widget: InformationWidget) => {
    switch (widget.type) {
      case 'news':
        return renderNewsWidget();
      case 'stats':
        return renderStatsWidget();
      case 'trending':
        return renderTrendingWidget();
      case 'recommendations':
        return renderRecommendationsWidget();
      case 'events':
        return renderEventsWidget();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Информационная Панель</h1>
            <p className="text-muted-foreground">
              Персональная подборка новостей и статистики
            </p>
          </div>
          <Button
            variant={editMode ? 'default' : 'outline'}
            onClick={() => setEditMode(!editMode)}
          >
            <Settings className="w-4 h-4 mr-2" />
            {editMode ? 'Готово' : 'Настроить'}
          </Button>
        </div>

        {editMode ? (
          // Edit Mode
          <Card>
            <CardHeader>
              <CardTitle>Управление виджетами</CardTitle>
              <CardDescription>Включайте/отключайте виджеты и меняйте их порядок</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {widgets.map((widget, index) => (
                  <div key={widget.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={widget.enabled}
                        onChange={() => toggleWidget(widget.id)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="font-medium text-foreground">{widget.title}</span>
                      <Badge variant="outline">#{widget.position}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => reorderWidget(widget.id, 'up')}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => reorderWidget(widget.id, 'down')}
                        disabled={index === widgets.length - 1}
                      >
                        ↓
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          // View Mode
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {widgets
                .filter(w => w.enabled)
                .sort((a, b) => a.position - b.position)
                .map(widget => (
                  <div key={widget.id}>{renderWidget(widget)}</div>
                ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Быстрые действия</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" variant="outline">
                    <Heart className="w-4 h-4 mr-2" />
                    Мои избранные
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Star className="w-4 h-4 mr-2" />
                    Мои рекомендации
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Поделиться
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Фильтры</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-foreground">Жанр</label>
                    <select className="w-full mt-1 px-3 py-2 rounded border border-border text-sm">
                      <option>Все жанры</option>
                      <option>Абстракционизм</option>
                      <option>Живопись</option>
                      <option>Скульптура</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Ценовой диапазон</label>
                    <select className="w-full mt-1 px-3 py-2 rounded border border-border text-sm">
                      <option>Все цены</option>
                      <option>До 50K</option>
                      <option>50K - 200K</option>
                      <option>200K+</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
