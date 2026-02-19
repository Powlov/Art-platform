import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Newspaper,
  TrendingUp,
  Calendar,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  BookmarkCheck,
  Clock,
  User,
  Search,
  Filter,
  ChevronRight,
  Globe,
  Award,
  Zap,
  Image as ImageIcon,
  Video,
  Mic,
  FileText,
  Tag,
  ArrowRight,
  Users,
  Star,
  ThumbsUp,
  AlertCircle,
  CheckCircle,
  BarChart3,
  TrendingDown,
  DollarSign,
  Briefcase,
  Building,
  Palette,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';

interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  content?: string;
  category: 'market' | 'exhibitions' | 'interviews' | 'analytics' | 'trends' | 'auctions';
  type: 'article' | 'video' | 'podcast' | 'gallery';
  author: string;
  authorAvatar?: string;
  date: string;
  readTime: string;
  image: string;
  views: number;
  likes: number;
  comments: number;
  tags: string[];
  featured: boolean;
  trending: boolean;
  saved: boolean;
}

interface Exhibition {
  id: number;
  title: string;
  location: string;
  gallery: string;
  startDate: string;
  endDate: string;
  image: string;
  description: string;
  artists: string[];
  price: string;
}

interface MarketData {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: any;
  color: string;
}

const ARTNews: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedArticles, setSavedArticles] = useState<number[]>([1, 3]);

  const categories = [
    { id: 'all', label: 'Все новости', icon: Newspaper },
    { id: 'market', label: 'Рынок', icon: TrendingUp },
    { id: 'exhibitions', label: 'Выставки', icon: Building },
    { id: 'interviews', label: 'Интервью', icon: Mic },
    { id: 'analytics', label: 'Аналитика', icon: BarChart3 },
    { id: 'trends', label: 'Тренды', icon: Sparkles },
    { id: 'auctions', label: 'Аукционы', icon: Briefcase },
  ];

  const articles: NewsArticle[] = [
    {
      id: 1,
      title: 'Рекордная продажа работы Кандинского на аукционе Sotheby\'s',
      excerpt: 'Абстрактная композиция 1923 года ушла с молотка за $45 млн, установив новый рекорд для русского авангарда',
      category: 'auctions',
      type: 'article',
      author: 'Михаил Соколов',
      date: '2026-02-18',
      readTime: '5 мин',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
      views: 12450,
      likes: 892,
      comments: 156,
      tags: ['Кандинский', 'Аукцион', 'Рекорд', 'Sotheby\'s'],
      featured: true,
      trending: true,
      saved: true,
    },
    {
      id: 2,
      title: 'Новая выставка молодых российских художников в Эрмитаже',
      excerpt: 'Государственный Эрмитаж открывает масштабную выставку современного искусства с участием 30 молодых авторов',
      category: 'exhibitions',
      type: 'article',
      author: 'Анна Петрова',
      date: '2026-02-17',
      readTime: '8 мин',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
      views: 8920,
      likes: 654,
      comments: 89,
      tags: ['Эрмитаж', 'Выставка', 'Молодые художники'],
      featured: false,
      trending: true,
      saved: false,
    },
    {
      id: 3,
      title: 'Интервью с куратором Венецианской биеннале 2026',
      excerpt: 'Эксклюзивное интервью с главным куратором о концепции предстоящей биеннале и участниках от России',
      category: 'interviews',
      type: 'video',
      author: 'Ольга Смирнова',
      date: '2026-02-16',
      readTime: '15 мин',
      image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
      views: 15780,
      likes: 1203,
      comments: 234,
      tags: ['Венецианская биеннале', 'Интервью', 'Кураторство'],
      featured: true,
      trending: false,
      saved: true,
    },
    {
      id: 4,
      title: 'Анализ арт-рынка: итоги первого квартала 2026 года',
      excerpt: 'Комплексный анализ мирового арт-рынка показывает рост на 18% по сравнению с аналогичным периодом прошлого года',
      category: 'analytics',
      type: 'article',
      author: 'Дмитрий Кузнецов',
      date: '2026-02-15',
      readTime: '12 мин',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
      views: 10230,
      likes: 756,
      comments: 178,
      tags: ['Аналитика', 'Рынок', 'Статистика'],
      featured: false,
      trending: true,
      saved: false,
    },
    {
      id: 5,
      title: 'NFT в искусстве: тренд или революция?',
      excerpt: 'Разбираемся, как блокчейн-технологии меняют традиционный арт-рынок и что ждёт NFT-искусство в будущем',
      category: 'trends',
      type: 'article',
      author: 'Елена Волкова',
      date: '2026-02-14',
      readTime: '10 мин',
      image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800',
      views: 18950,
      likes: 1456,
      comments: 389,
      tags: ['NFT', 'Блокчейн', 'Тренды', 'Цифровое искусство'],
      featured: false,
      trending: true,
      saved: false,
    },
    {
      id: 6,
      title: 'Рост цен на произведения молодых художников',
      excerpt: 'Работы художников до 35 лет показали наибольший рост стоимости за последние 6 месяцев — в среднем +42%',
      category: 'market',
      type: 'article',
      author: 'Андрей Морозов',
      date: '2026-02-13',
      readTime: '7 мин',
      image: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800',
      views: 9870,
      likes: 678,
      comments: 134,
      tags: ['Рынок', 'Молодые художники', 'Инвестиции'],
      featured: false,
      trending: false,
      saved: false,
    },
    {
      id: 7,
      title: 'Подкаст: История русского авангарда с искусствоведом',
      excerpt: 'Новый эпизод нашего подкаста посвящён ключевым фигурам русского авангарда начала XX века',
      category: 'interviews',
      type: 'podcast',
      author: 'Сергей Иванов',
      date: '2026-02-12',
      readTime: '45 мин',
      image: 'https://images.unsplash.com/photo-1576166284135-f79f5e6e8b45?w=800',
      views: 6540,
      likes: 432,
      comments: 67,
      tags: ['Подкаст', 'Русский авангард', 'История'],
      featured: false,
      trending: false,
      saved: false,
    },
    {
      id: 8,
      title: 'Фотогалерея: Лучшие работы Art Basel 2026',
      excerpt: 'Эксклюзивная фотогалерея самых ярких произведений с главной мировой ярмарки современного искусства',
      category: 'exhibitions',
      type: 'gallery',
      author: 'Мария Белова',
      date: '2026-02-11',
      readTime: '3 мин',
      image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=800',
      views: 14230,
      likes: 1089,
      comments: 201,
      tags: ['Art Basel', 'Фотогалерея', 'Выставка'],
      featured: false,
      trending: false,
      saved: false,
    },
  ];

  const exhibitions: Exhibition[] = [
    {
      id: 1,
      title: 'Современное русское искусство',
      location: 'Москва, Россия',
      gallery: 'Третьяковская галерея',
      startDate: '2026-03-01',
      endDate: '2026-05-31',
      image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=400',
      description: 'Масштабная ретроспектива современного русского искусства с работами более 50 художников',
      artists: ['Иван Иванов', 'Мария Петрова', 'Алексей Сидоров'],
      price: 'Бесплатно',
    },
    {
      id: 2,
      title: 'Импрессионизм: новый взгляд',
      location: 'Санкт-Петербург, Россия',
      gallery: 'Эрмитаж',
      startDate: '2026-02-15',
      endDate: '2026-04-30',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400',
      description: 'Уникальная коллекция произведений импрессионистов из частных собраний',
      artists: ['Клод Моне', 'Огюст Ренуар', 'Эдгар Дега'],
      price: '500 ₽',
    },
    {
      id: 3,
      title: 'Цифровое искусство будущего',
      location: 'Москва, Россия',
      gallery: 'Garage Museum',
      startDate: '2026-03-15',
      endDate: '2026-06-15',
      image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=400',
      description: 'Выставка цифрового и NFT-искусства ведущих мировых художников',
      artists: ['Beeple', 'Pak', 'FEWOCiOUS'],
      price: '800 ₽',
    },
  ];

  const marketData: MarketData[] = [
    {
      label: 'Индекс арт-рынка',
      value: '1,245',
      change: 18.5,
      trend: 'up',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
    },
    {
      label: 'Средняя цена работы',
      value: '2.4М ₽',
      change: 12.3,
      trend: 'up',
      icon: DollarSign,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Объём торгов',
      value: '156М ₽',
      change: 8.7,
      trend: 'up',
      icon: BarChart3,
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Активных галерей',
      value: '342',
      change: 5.2,
      trend: 'up',
      icon: Building,
      color: 'from-orange-500 to-red-500',
    },
  ];

  const toggleSave = (articleId: number) => {
    setSavedArticles(prev =>
      prev.includes(articleId)
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  const getArticleIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'podcast': return Mic;
      case 'gallery': return ImageIcon;
      default: return FileText;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      market: 'bg-blue-100 text-blue-700',
      exhibitions: 'bg-purple-100 text-purple-700',
      interviews: 'bg-green-100 text-green-700',
      analytics: 'bg-orange-100 text-orange-700',
      trends: 'bg-pink-100 text-pink-700',
      auctions: 'bg-indigo-100 text-indigo-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' ||
                      (activeTab === 'featured' && article.featured) ||
                      (activeTab === 'trending' && article.trending) ||
                      (activeTab === 'saved' && savedArticles.includes(article.id));
    return matchesCategory && matchesSearch && matchesTab;
  });

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <Navigation user={{ id: 1, name: 'User', email: 'user@artbank.ru', role: 'user' }} />
      <Header
        title="ART News"
        subtitle="Новости, тренды и аналитика арт-рынка"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Newspaper className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">ART News — Пульс арт-рынка</h2>
                  <p className="text-purple-100">Актуальные новости, аналитика и эксклюзивные интервью</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Newspaper className="w-5 h-5" />
                  <span>Ежедневные обновления</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>Экспертная аналитика</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  <span>Мировые новости</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  <span>Эксклюзивы</span>
                </div>
              </div>
            </div>
            <Badge className="bg-white/20 text-white border-0 text-lg px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              LIVE
            </Badge>
          </div>
        </motion.div>

        {/* Market Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {marketData.map((data, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden hover:shadow-lg transition-all">
                <div className={`absolute inset-0 bg-gradient-to-br ${data.color} opacity-5`}></div>
                <CardContent className="p-6 relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${data.color} text-white`}>
                      <data.icon className="w-6 h-6" />
                    </div>
                    <Badge variant="outline" className={`${
                      data.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {data.trend === 'up' ? '+' : '-'}{data.change}%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{data.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{data.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Search and Tabs */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Поиск новостей..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 whitespace-nowrap ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                        : ''
                    }`}
                  >
                    <category.icon className="w-4 h-4" />
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Все</TabsTrigger>
                <TabsTrigger value="featured">
                  <Star className="w-4 h-4 mr-2" />
                  Избранное
                </TabsTrigger>
                <TabsTrigger value="trending">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Популярное
                </TabsTrigger>
                <TabsTrigger value="saved">
                  <BookmarkCheck className="w-4 h-4 mr-2" />
                  Сохранённое ({savedArticles.length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Featured Articles */}
        {activeTab === 'all' && filteredArticles.filter(a => a.featured).length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              Главные новости
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredArticles.filter(a => a.featured).map((article) => {
                const ArticleIcon = getArticleIcon(article.type);
                return (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card className="group hover:shadow-2xl transition-all cursor-pointer h-full flex flex-col overflow-hidden">
                      <div className="relative overflow-hidden">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <Badge className={getCategoryColor(article.category)}>
                            {categories.find(c => c.id === article.category)?.label}
                          </Badge>
                          {article.trending && (
                            <Badge className="bg-red-500 text-white border-0">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Trending
                            </Badge>
                          )}
                        </div>
                        <div className="absolute top-4 right-4">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => toggleSave(article.id)}
                            className="bg-white/90 hover:bg-white"
                          >
                            {savedArticles.includes(article.id) ? (
                              <BookmarkCheck className="w-4 h-4 text-purple-600" />
                            ) : (
                              <Bookmark className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <CardContent className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {article.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {article.readTime}
                          </div>
                          <div className="flex items-center gap-1">
                            <ArticleIcon className="w-4 h-4" />
                          </div>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 flex-1">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {article.excerpt}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {formatNumber(article.views)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              {formatNumber(article.likes)}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              {article.comments}
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Читать
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* All Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredArticles.filter(a => !a.featured || activeTab !== 'all').map((article, index) => {
            const ArticleIcon = getArticleIcon(article.type);
            return (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group hover:shadow-xl transition-all cursor-pointer h-full flex flex-col">
                  <div className="relative overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className={getCategoryColor(article.category)}>
                        {categories.find(c => c.id === article.category)?.label}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => toggleSave(article.id)}
                        className="bg-white/90 hover:bg-white"
                      >
                        {savedArticles.includes(article.id) ? (
                          <BookmarkCheck className="w-4 h-4 text-purple-600" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    {article.trending && (
                      <Badge className="absolute bottom-3 left-3 bg-red-500 text-white border-0">
                        <Zap className="w-3 h-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <ArticleIcon className="w-3 h-3" />
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </div>
                      <span>•</span>
                      <span>{new Date(article.date).toLocaleDateString('ru-RU')}</span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 flex-1">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {formatNumber(article.views)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {formatNumber(article.likes)}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Upcoming Exhibitions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Предстоящие выставки
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {exhibitions.map((exhibition) => (
                <motion.div
                  key={exhibition.id}
                  whileHover={{ scale: 1.02 }}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <img
                      src={exhibition.image}
                      alt={exhibition.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 right-3 bg-purple-600 text-white border-0">
                      {exhibition.price}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{exhibition.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Building className="w-4 h-4" />
                    {exhibition.gallery}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Calendar className="w-4 h-4" />
                    {new Date(exhibition.startDate).toLocaleDateString('ru-RU')} - {new Date(exhibition.endDate).toLocaleDateString('ru-RU')}
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Подробнее
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ARTNews;
