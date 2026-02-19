import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  GraduationCap,
  Award,
  Video,
  FileText,
  CheckCircle,
  Lock,
  Unlock,
  Clock,
  Users,
  Star,
  Play,
  Download,
  Share2,
  Heart,
  MessageSquare,
  TrendingUp,
  Search,
  Filter,
  ChevronRight,
  Target,
  Zap,
  Brain,
  Lightbulb,
  BookMarked,
  Library,
  Palette,
  Image as ImageIcon,
  History,
  Globe,
  ArrowRight,
  Calendar,
  BarChart3,
  Trophy,
  Sparkles,
  Eye,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  lessons: number;
  students: number;
  rating: number;
  price: number;
  image: string;
  instructor: string;
  progress?: number;
  isEnrolled: boolean;
  tags: string[];
}

interface Lesson {
  id: number;
  title: string;
  type: 'video' | 'article' | 'quiz' | 'assignment';
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
}

interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  views: number;
  likes: number;
  tags: string[];
}

interface UserStats {
  coursesEnrolled: number;
  coursesCompleted: number;
  totalLearningTime: string;
  certificatesEarned: number;
  currentStreak: number;
  totalPoints: number;
}

const KnowledgeBase: React.FC = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [userStats, setUserStats] = useState<UserStats>({
    coursesEnrolled: 8,
    coursesCompleted: 3,
    totalLearningTime: '42 часа',
    certificatesEarned: 3,
    currentStreak: 12,
    totalPoints: 3450,
  });

  const categories = [
    { id: 'all', label: 'Все курсы', icon: Library },
    { id: 'history', label: 'История искусства', icon: History },
    { id: 'techniques', label: 'Техники', icon: Palette },
    { id: 'market', label: 'Арт-рынок', icon: TrendingUp },
    { id: 'investment', label: 'Инвестиции', icon: BarChart3 },
    { id: 'authentication', label: 'Аутентификация', icon: Award },
  ];

  const courses: Course[] = [
    {
      id: 1,
      title: 'Основы истории искусства',
      description: 'Комплексный курс по истории искусства от древности до современности',
      category: 'history',
      level: 'beginner',
      duration: '8 недель',
      lessons: 32,
      students: 1245,
      rating: 4.8,
      price: 0,
      image: 'https://images.unsplash.com/photo-1576166284135-f79f5e6e8b45?w=400',
      instructor: 'Анна Петрова',
      progress: 65,
      isEnrolled: true,
      tags: ['История', 'Живопись', 'Скульптура'],
    },
    {
      id: 2,
      title: 'Инвестиции в искусство',
      description: 'Как выбирать произведения искусства для инвестиций и оценивать их потенциал',
      category: 'investment',
      level: 'intermediate',
      duration: '6 недель',
      lessons: 24,
      students: 856,
      rating: 4.9,
      price: 15000,
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
      instructor: 'Михаил Соколов',
      progress: 0,
      isEnrolled: false,
      tags: ['Инвестиции', 'Оценка', 'Рынок'],
    },
    {
      id: 3,
      title: 'Техники живописи маслом',
      description: 'Практический курс по классическим и современным техникам масляной живописи',
      category: 'techniques',
      level: 'intermediate',
      duration: '10 недель',
      lessons: 40,
      students: 623,
      rating: 4.7,
      price: 25000,
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400',
      instructor: 'Елена Волкова',
      progress: 30,
      isEnrolled: true,
      tags: ['Техники', 'Живопись', 'Практика'],
    },
    {
      id: 4,
      title: 'Экспертиза и аутентификация',
      description: 'Методы определения подлинности произведений искусства',
      category: 'authentication',
      level: 'advanced',
      duration: '12 недель',
      lessons: 36,
      students: 412,
      rating: 4.9,
      price: 35000,
      image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=400',
      instructor: 'Дмитрий Кузнецов',
      progress: 0,
      isEnrolled: false,
      tags: ['Экспертиза', 'Аутентификация', 'Анализ'],
    },
    {
      id: 5,
      title: 'Современное искусство',
      description: 'Обзор основных направлений и художников современного искусства',
      category: 'history',
      level: 'beginner',
      duration: '6 недель',
      lessons: 28,
      students: 1034,
      rating: 4.6,
      price: 0,
      image: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400',
      instructor: 'Ольга Смирнова',
      progress: 100,
      isEnrolled: true,
      tags: ['Современность', 'Тренды', 'Художники'],
    },
    {
      id: 6,
      title: 'Арт-рынок: структура и участники',
      description: 'Полное понимание структуры мирового арт-рынка',
      category: 'market',
      level: 'intermediate',
      duration: '8 недель',
      lessons: 30,
      students: 745,
      rating: 4.8,
      price: 20000,
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400',
      instructor: 'Андрей Морозов',
      progress: 0,
      isEnrolled: false,
      tags: ['Рынок', 'Галереи', 'Аукционы'],
    },
  ];

  const articles: Article[] = [
    {
      id: 1,
      title: 'Как оценить потенциал молодого художника',
      excerpt: 'Ключевые факторы, на которые стоит обратить внимание при выборе произведений начинающих художников',
      category: 'Инвестиции',
      author: 'Михаил Соколов',
      date: '2026-02-15',
      readTime: '8 мин',
      image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400',
      views: 1245,
      likes: 89,
      tags: ['Инвестиции', 'Молодые художники', 'Рынок'],
    },
    {
      id: 2,
      title: 'История импрессионизма: от отказов до триумфа',
      excerpt: 'Путь импрессионистов от отвергнутых художников до классиков мирового искусства',
      category: 'История',
      author: 'Анна Петрова',
      date: '2026-02-14',
      readTime: '12 мин',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400',
      views: 2341,
      likes: 156,
      tags: ['История', 'Импрессионизм', 'Живопись'],
    },
    {
      id: 3,
      title: 'Технология блокчейн в искусстве',
      excerpt: 'Как блокчейн меняет арт-рынок и защищает права художников',
      category: 'Технологии',
      author: 'Дмитрий Кузнецов',
      date: '2026-02-13',
      readTime: '10 мин',
      image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=400',
      views: 1876,
      likes: 123,
      tags: ['Блокчейн', 'NFT', 'Технологии'],
    },
    {
      id: 4,
      title: 'Топ-10 галерей современного искусства',
      excerpt: 'Обзор ведущих галерей, которые определяют тренды в современном искусстве',
      category: 'Рынок',
      author: 'Ольга Смирнова',
      date: '2026-02-12',
      readTime: '15 мин',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400',
      views: 3102,
      likes: 234,
      tags: ['Галереи', 'Современность', 'Рынок'],
    },
  ];

  const courseLessons: Lesson[] = [
    { id: 1, title: 'Введение в курс', type: 'video', duration: '15 мин', isCompleted: true, isLocked: false },
    { id: 2, title: 'Древнее искусство', type: 'video', duration: '45 мин', isCompleted: true, isLocked: false },
    { id: 3, title: 'Средневековое искусство', type: 'video', duration: '50 мин', isCompleted: true, isLocked: false },
    { id: 4, title: 'Тест: Древность и Средневековье', type: 'quiz', duration: '20 мин', isCompleted: false, isLocked: false },
    { id: 5, title: 'Ренессанс', type: 'video', duration: '60 мин', isCompleted: false, isLocked: false },
    { id: 6, title: 'Барокко и классицизм', type: 'video', duration: '55 мин', isCompleted: false, isLocked: true },
    { id: 7, title: 'Романтизм', type: 'video', duration: '45 мин', isCompleted: false, isLocked: true },
    { id: 8, title: 'Импрессионизм', type: 'video', duration: '50 мин', isCompleted: false, isLocked: true },
  ];

  const formatCurrency = (amount: number) => {
    if (amount === 0) return 'Бесплатно';
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getLevelBadge = (level: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-700',
      intermediate: 'bg-blue-100 text-blue-700',
      advanced: 'bg-purple-100 text-purple-700',
    };
    const labels = {
      beginner: 'Начальный',
      intermediate: 'Средний',
      advanced: 'Продвинутый',
    };
    return { color: colors[level as keyof typeof colors], label: labels[level as keyof typeof labels] };
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'article': return FileText;
      case 'quiz': return Target;
      case 'assignment': return BookMarked;
      default: return FileText;
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Stats Cards
  const statsCards = [
    {
      label: 'Курсов пройдено',
      value: userStats.coursesCompleted,
      total: userStats.coursesEnrolled,
      icon: GraduationCap,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Время обучения',
      value: userStats.totalLearningTime,
      icon: Clock,
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Сертификатов',
      value: userStats.certificatesEarned,
      icon: Award,
      color: 'from-green-500 to-emerald-500',
    },
    {
      label: 'Серия дней',
      value: userStats.currentStreak,
      suffix: 'дней',
      icon: Zap,
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <Navigation user={{ id: 1, name: 'User', email: 'user@artbank.ru', role: 'user' }} />
      <Header
        title="ART Step — База Знаний"
        subtitle="Образовательная платформа для изучения искусства и арт-рынка"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-white/20 rounded-lg">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Добро пожаловать в ART Step!</h2>
                  <p className="text-purple-100">Учитесь у лучших экспертов арт-рынка</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>120+ курсов</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>15,000+ студентов</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <span>Сертификаты</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Бесплатные курсы</span>
                </div>
              </div>
            </div>
            <Badge className="bg-white/20 text-white border-0 text-lg px-4 py-2">
              {userStats.totalPoints} баллов
            </Badge>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden hover:shadow-lg transition-all">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`}></div>
                <CardContent className="p-6 relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                    {stat.total && <span className="text-lg text-gray-500">/{stat.total}</span>}
                    {stat.suffix && <span className="text-lg text-gray-500 ml-1">{stat.suffix}</span>}
                  </p>
                  {stat.total && (
                    <Progress 
                      value={(stat.value / stat.total) * 100} 
                      className="h-2 mt-3"
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="courses">
              <BookOpen className="w-4 h-4 mr-2" />
              Курсы
            </TabsTrigger>
            <TabsTrigger value="my-learning">
              <GraduationCap className="w-4 h-4 mr-2" />
              Моё обучение
            </TabsTrigger>
            <TabsTrigger value="articles">
              <FileText className="w-4 h-4 mr-2" />
              Статьи
            </TabsTrigger>
            <TabsTrigger value="certificates">
              <Award className="w-4 h-4 mr-2" />
              Сертификаты
            </TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Поиск курсов..."
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
              </CardContent>
            </Card>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="group hover:shadow-xl transition-all cursor-pointer h-full flex flex-col">
                    <div className="relative overflow-hidden">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {course.isEnrolled && (
                        <Badge className="absolute top-3 right-3 bg-green-600 text-white border-0">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Записан
                        </Badge>
                      )}
                      {course.price === 0 && (
                        <Badge className="absolute top-3 left-3 bg-purple-600 text-white border-0">
                          Бесплатно
                        </Badge>
                      )}
                    </div>

                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className={getLevelBadge(course.level).color}>
                          {getLevelBadge(course.level).label}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{course.rating}</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                        {course.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Video className="w-4 h-4" />
                          {course.lessons} уроков
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{course.students.toLocaleString('ru-RU')} студентов</span>
                      </div>

                      {course.isEnrolled && course.progress !== undefined && course.progress > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-600">Прогресс</span>
                            <span className="font-semibold text-purple-600">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-xl font-bold text-purple-600">
                          {formatCurrency(course.price)}
                        </span>
                        <Button
                          className={`${
                            course.isEnrolled
                              ? 'bg-gradient-to-r from-green-600 to-emerald-600'
                              : 'bg-gradient-to-r from-purple-600 to-blue-600'
                          } hover:opacity-90`}
                        >
                          {course.isEnrolled ? 'Продолжить' : 'Записаться'}
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* My Learning Tab */}
          <TabsContent value="my-learning" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Current Course */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Play className="w-5 h-5" />
                      Продолжить обучение
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {courses.filter(c => c.isEnrolled && c.progress && c.progress > 0 && c.progress < 100).map((course) => (
                      <div key={course.id} className="p-4 border border-gray-200 rounded-xl hover:border-purple-300 transition-all">
                        <div className="flex items-start gap-4">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-24 h-24 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                            <p className="text-sm text-gray-600 mb-3">{course.instructor}</p>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-600">Прогресс</span>
                              <span className="text-sm font-semibold text-purple-600">{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2 mb-3" />
                            <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600">
                              <Play className="w-4 h-4 mr-2" />
                              Продолжить
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Course Content */}
                {selectedCourse && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Содержание курса
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {courseLessons.map((lesson) => {
                          const LessonIcon = getLessonIcon(lesson.type);
                          return (
                            <div
                              key={lesson.id}
                              className={`p-4 rounded-lg border transition-all ${
                                lesson.isLocked
                                  ? 'border-gray-200 bg-gray-50'
                                  : 'border-gray-200 hover:border-purple-300 cursor-pointer'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg ${
                                    lesson.isCompleted
                                      ? 'bg-green-100'
                                      : lesson.isLocked
                                      ? 'bg-gray-100'
                                      : 'bg-purple-100'
                                  }`}>
                                    {lesson.isCompleted ? (
                                      <CheckCircle className="w-5 h-5 text-green-600" />
                                    ) : lesson.isLocked ? (
                                      <Lock className="w-5 h-5 text-gray-400" />
                                    ) : (
                                      <LessonIcon className="w-5 h-5 text-purple-600" />
                                    )}
                                  </div>
                                  <div>
                                    <p className={`font-medium ${lesson.isLocked ? 'text-gray-400' : 'text-gray-900'}`}>
                                      {lesson.title}
                                    </p>
                                    <p className="text-sm text-gray-500">{lesson.duration}</p>
                                  </div>
                                </div>
                                {!lesson.isLocked && !lesson.isCompleted && (
                                  <Button size="sm" variant="outline">
                                    Начать
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      Достижения
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-lg ${
                            i <= 3
                              ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white'
                              : 'bg-gray-100 text-gray-400'
                          } flex items-center justify-center`}
                        >
                          <Trophy className="w-6 h-6" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Learning Streak */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-orange-500" />
                      Серия дней
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-orange-500 mb-2">
                        {userStats.currentStreak}
                      </div>
                      <p className="text-sm text-gray-600">
                        дней подряд вы занимаетесь!
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommended */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Рекомендуем
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {courses.slice(0, 2).filter(c => !c.isEnrolled).map((course) => (
                      <div key={course.id} className="p-3 border border-gray-200 rounded-lg hover:border-purple-300 transition-all">
                        <h4 className="font-medium text-sm text-gray-900 mb-2 line-clamp-2">
                          {course.title}
                        </h4>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-purple-600">
                            {formatCurrency(course.price)}
                          </span>
                          <Button size="sm" variant="outline">
                            Подробнее
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Articles Tab */}
          <TabsContent value="articles" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group hover:shadow-xl transition-all cursor-pointer h-full flex flex-col">
                    <div className="relative overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 left-3 bg-purple-600 text-white border-0">
                        {article.category}
                      </Badge>
                    </div>

                    <CardContent className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {article.readTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {article.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {article.likes}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="text-sm text-gray-600">
                          {article.author} • {new Date(article.date).toLocaleDateString('ru-RU')}
                        </div>
                        <Button variant="outline" size="sm">
                          Читать
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Мои сертификаты
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.filter(c => c.progress === 100).map((course) => (
                    <motion.div
                      key={course.id}
                      whileHover={{ scale: 1.02 }}
                      className="relative"
                    >
                      <div className="aspect-[4/3] bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white shadow-xl">
                        <div className="flex flex-col h-full justify-between">
                          <div>
                            <Award className="w-12 h-12 mb-4" />
                            <h3 className="text-lg font-bold mb-2">{course.title}</h3>
                          </div>
                          <div>
                            <p className="text-sm text-purple-100 mb-1">Преподаватель: {course.instructor}</p>
                            <p className="text-sm text-purple-100">ART BANK Platform</p>
                          </div>
                        </div>
                      </div>
                      <Button className="w-full mt-4" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Скачать PDF
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default KnowledgeBase;
