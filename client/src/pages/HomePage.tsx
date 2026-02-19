import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette, Users, TrendingUp, Eye, Calendar, Play, MessageCircle,
  ShoppingBag, Hammer, Video, Award, Star, ArrowRight, ChevronRight,
  BadgeCheck, Shield, Zap, Globe, Target, Crown, Heart, Sparkles,
  UserPlus, LogIn, Building2, Briefcase, UserCircle, Image, X, Newspaper
} from 'lucide-react';
import { trpc } from '../lib/trpc';
import { useAuth } from '../_core/hooks/useAuth';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Event {
  id: number;
  title: string;
  date: string;
  type: 'auction' | 'exhibition' | 'workshop' | 'live-stream';
  image?: string;
  participants?: number;
}

interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  source: string;
  date: string;
  image?: string;
  category: 'market' | 'exhibition' | 'artist' | 'auction' | 'event';
  url?: string;
}

interface PlatformFeature {
  icon: any;
  title: string;
  description: string;
  color: string;
  link: string;
}

interface UserRole {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  features: string[];
}

export default function HomePage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<'login' | 'register'>('register');

  // Fetch platform statistics
  const { data: artworks = [] } = trpc.artwork.list.useQuery({ limit: 100 });

  // Mock upcoming events - в будущем заменить на реальные данные
  const upcomingEvents: Event[] = [
    {
      id: 1,
      title: 'Современное искусство: Онлайн аукцион',
      date: '2026-02-10',
      type: 'auction',
      image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800',
      participants: 1250
    },
    {
      id: 2,
      title: 'Выставка: Абстракционизм XXI века',
      date: '2026-02-15',
      type: 'exhibition',
      image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=800',
      participants: 890
    },
    {
      id: 3,
      title: 'Мастер-класс: Акварельная живопись',
      date: '2026-02-18',
      type: 'workshop',
      image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
      participants: 45
    },
    {
      id: 4,
      title: 'Live Stream: Встреча с известным художником',
      date: '2026-02-20',
      type: 'live-stream',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
      participants: 2100
    }
  ];

  // Art world news - Mock data
  const newsArticles: NewsArticle[] = [
    {
      id: 1,
      title: 'Рекорд продаж: NFT-искусство достигло новых высот',
      excerpt: 'Цифровое искусство продолжает устанавливать рекорды на аукционах, с новыми продажами превышающими $10 миллионов.',
      source: 'ArtNews',
      date: '2026-02-05',
      image: 'https://images.unsplash.com/photo-1634926878768-2a5b3c42f139?w=600',
      category: 'market',
      url: '#'
    },
    {
      id: 2,
      title: 'Открытие новой выставки современного искусства в Третьяковской галерее',
      excerpt: 'Московская Третьяковская галерея представляет масштабную выставку современных российских художников.',
      source: 'The Art Newspaper',
      date: '2026-02-04',
      image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=600',
      category: 'exhibition',
      url: '#'
    },
    {
      id: 3,
      title: 'Молодой художник из России получил престижную премию',
      excerpt: 'Талантливый российский художник Иван Петров удостоен международной премии за вклад в современное искусство.',
      source: 'ARTnews',
      date: '2026-02-03',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600',
      category: 'artist',
      url: '#'
    },
    {
      id: 4,
      title: 'Christie\'s анонсировал весенний аукцион импрессионистов',
      excerpt: 'Аукционный дом Christie\'s представит коллекцию работ импрессионистов стоимостью более $50 млн.',
      source: 'Christie\'s',
      date: '2026-02-02',
      image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600',
      category: 'auction',
      url: '#'
    },
    {
      id: 5,
      title: 'Новые тренды в искусстве 2026 года',
      excerpt: 'Эксперты рынка искусства делятся прогнозами о главных направлениях и трендах текущего года.',
      source: 'Artsy',
      date: '2026-02-01',
      image: 'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=600',
      category: 'market',
      url: '#'
    },
    {
      id: 6,
      title: 'Виртуальные музеи: будущее доступа к искусству',
      excerpt: 'Крупнейшие музеи мира расширяют свои виртуальные коллекции, делая искусство доступным каждому.',
      source: 'The Guardian',
      date: '2026-01-31',
      image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600',
      category: 'event',
      url: '#'
    }
  ];

  // Platform features
  const platformFeatures: PlatformFeature[] = [
    {
      icon: ShoppingBag,
      title: 'Маркетплейс',
      description: 'Покупайте и продавайте произведения искусства',
      color: 'from-blue-500 to-cyan-500',
      link: '/marketplace'
    },
    {
      icon: Hammer,
      title: 'Аукционы',
      description: 'Участвуйте в онлайн-торгах в режиме реального времени',
      color: 'from-purple-500 to-pink-500',
      link: '/auctions'
    },
    {
      icon: Video,
      title: 'Стримы',
      description: 'Смотрите прямые трансляции от художников',
      color: 'from-red-500 to-orange-500',
      link: '/streams'
    },
    {
      icon: Users,
      title: 'Клубы',
      description: 'Присоединяйтесь к сообществам коллекционеров',
      color: 'from-green-500 to-emerald-500',
      link: '/clubs'
    }
  ];

  // User roles
  const userRoles: UserRole[] = [
    {
      id: 'artist',
      name: 'Художник',
      icon: Palette,
      color: 'from-purple-500 to-pink-500',
      description: 'Продавайте свои работы и развивайте карьеру',
      features: ['Загрузка произведений', 'Управление портфолио', 'Прямые трансляции', 'Аналитика продаж']
    },
    {
      id: 'collector',
      name: 'Коллекционер',
      icon: Crown,
      color: 'from-yellow-500 to-orange-500',
      description: 'Создавайте коллекции и инвестируйте в искусство',
      features: ['Покупка работ', 'Участие в аукционах', 'Управление коллекцией', 'Инвестиционная аналитика']
    },
    {
      id: 'gallery',
      name: 'Галерея',
      icon: Building2,
      color: 'from-blue-500 to-indigo-500',
      description: 'Управляйте выставками и представляйте художников',
      features: ['Организация выставок', 'Представление художников', 'Продажи', 'Маркетинг']
    },
    {
      id: 'curator',
      name: 'Куратор',
      icon: Award,
      color: 'from-green-500 to-teal-500',
      description: 'Создавайте выставки и кураторские проекты',
      features: ['Создание выставок', 'Модерация контента', 'Экспертная оценка', 'Публикации']
    },
    {
      id: 'consultant',
      name: 'Консультант',
      icon: Briefcase,
      color: 'from-red-500 to-pink-500',
      description: 'Консультируйте клиентов по вопросам искусства',
      features: ['Консультации', 'Оценка работ', 'Инвестиционные советы', 'Аналитика рынка']
    },
    {
      id: 'guest',
      name: 'Гость',
      icon: UserCircle,
      color: 'from-gray-500 to-slate-500',
      description: 'Просматривайте и изучайте произведения искусства',
      features: ['Просмотр галереи', 'Участие в мероприятиях', 'Доступ к контенту', 'Обучающие материалы']
    }
  ];

  // Platform statistics
  const stats = [
    {
      label: 'Произведений',
      value: artworks.length.toLocaleString(),
      icon: Image,
      change: '+15%',
      color: 'text-blue-600'
    },
    {
      label: 'Художников',
      value: new Set(artworks.map(a => a.artistName)).size.toLocaleString(),
      icon: Palette,
      change: '+12%',
      color: 'text-purple-600'
    },
    {
      label: 'Активных аукционов',
      value: '12',
      icon: Hammer,
      change: '+8%',
      color: 'text-pink-600'
    },
    {
      label: 'Пользователей',
      value: '12,500+',
      icon: Users,
      change: '+22%',
      color: 'text-green-600'
    }
  ];

  const handleRoleSelect = (roleId: string) => {
    if (selectedAction === 'login') {
      navigate(`/login?role=${roleId}`);
    } else {
      navigate(`/register?role=${roleId}`);
    }
    setShowRoleModal(false);
  };

  const getEventTypeIcon = (type: Event['type']) => {
    switch (type) {
      case 'auction': return Hammer;
      case 'exhibition': return Eye;
      case 'workshop': return Award;
      case 'live-stream': return Video;
    }
  };

  const getEventTypeBadge = (type: Event['type']) => {
    switch (type) {
      case 'auction': return { label: 'Аукцион', color: 'bg-purple-100 text-purple-700' };
      case 'exhibition': return { label: 'Выставка', color: 'bg-blue-100 text-blue-700' };
      case 'workshop': return { label: 'Мастер-класс', color: 'bg-green-100 text-green-700' };
      case 'live-stream': return { label: 'Стрим', color: 'bg-red-100 text-red-700' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-20 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-7xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Добро пожаловать в ART BANK Platform
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Мир искусства в<br />
            <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              одной платформе
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto">
            Покупайте, продавайте, участвуйте в аукционах и наслаждайтесь искусством
            вместе с тысячами художников и коллекционеров
          </p>
          
          {user ? (
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href={`/${user.role}/dashboard`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
                >
                  Перейти в панель управления
                  <ArrowRight className="inline-block ml-2 w-5 h-5" />
                </motion.button>
              </Link>
              <Link href="/marketplace">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
                >
                  Открыть маркетплейс
                </motion.button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedAction('register');
                  setShowRoleModal(true);
                }}
                className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Зарегистрироваться
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedAction('login');
                  setShowRoleModal(true);
                }}
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Войти
              </motion.button>
            </div>
          )}
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Platform Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="text-sm font-bold text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {stat.change}
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-1 font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Upcoming Events */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-20"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Предстоящие события</h2>
              <p className="text-gray-600 text-lg">Не пропустите интересные мероприятия</p>
            </div>
            <Link href="/events">
              <button className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 text-lg">
                Все события
                <ChevronRight className="w-5 h-5" />
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingEvents.map((event, index) => {
              const EventIcon = getEventTypeIcon(event.type);
              const badge = getEventTypeBadge(event.type);
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group cursor-pointer"
                >
                  <Link href={`/events/${event.id}`}>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-2 text-white text-sm">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">
                            {new Date(event.date).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'long'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {event.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>{event.participants} участников</span>
                        </div>
                        <EventIcon className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Art World News */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-20"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Newspaper className="w-8 h-8 text-blue-600" />
                <h2 className="text-4xl font-bold text-gray-900">Новости мира искусства</h2>
              </div>
              <p className="text-gray-600 text-lg">Будьте в курсе последних событий</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 text-lg">
              Все новости
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsArticles.slice(0, 6).map((article, index) => {
              const categoryColors = {
                market: 'bg-green-100 text-green-700',
                exhibition: 'bg-blue-100 text-blue-700',
                artist: 'bg-purple-100 text-purple-700',
                auction: 'bg-pink-100 text-pink-700',
                event: 'bg-orange-100 text-orange-700'
              };

              const categoryLabels = {
                market: 'Рынок',
                exhibition: 'Выставка',
                artist: 'Художник',
                auction: 'Аукцион',
                event: 'События'
              };

              return (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group cursor-pointer"
                >
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    <div className="relative h-48 overflow-hidden">
                      {article.image && (
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${categoryColors[article.category]}`}>
                          {categoryLabels[article.category]}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white text-xs font-medium opacity-90">
                          {article.source} · {new Date(article.date).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                        {article.excerpt}
                      </p>
                      <div className="mt-4 flex items-center text-blue-600 font-semibold text-sm">
                        Читать далее
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </a>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Platform Features */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Возможности платформы</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Всё необходимое для работы с искусством в одном месте
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -8 }}
              >
                <Link href={feature.link}>
                  <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${feature.color} p-8 cursor-pointer group h-full`}>
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                      <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '20px 20px'
                      }} />
                    </div>
                    <div className="relative">
                      <feature.icon className="w-12 h-12 text-white mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                      <p className="text-white/90 mb-4">{feature.description}</p>
                      <div className="flex items-center gap-2 text-white font-semibold">
                        Подробнее
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* User Roles Section */}
        {!user && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Выберите свою роль</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Присоединяйтесь к платформе в качестве художника, коллекционера, галереи или просто зрителя
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userRoles.map((role, index) => (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-gray-100"
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-4`}>
                    <role.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{role.name}</h3>
                  <p className="text-gray-600 mb-4">{role.description}</p>
                  
                  <ul className="space-y-2 mb-6">
                    {role.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <BadgeCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedAction('register');
                        handleRoleSelect(role.id);
                      }}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      Регистрация
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAction('login');
                        handleRoleSelect(role.id);
                      }}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                    >
                      Вход
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Why Choose Us Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '30px 30px'
              }} />
            </div>
            
            <div className="relative">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Почему выбирают ART BANK?</h2>
                <p className="text-xl text-white/90 max-w-2xl mx-auto">
                  Мы создали идеальную экосистему для всех участников арт-рынка
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { icon: Shield, title: 'Безопасность', desc: 'Защита данных и транзакций' },
                  { icon: Zap, title: 'Скорость', desc: 'Мгновенные сделки 24/7' },
                  { icon: Globe, title: 'Глобальность', desc: 'Доступ из любой точки мира' },
                  { icon: Target, title: 'Прозрачность', desc: 'Честные цены и условия' }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <item.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-white/80">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        {!user && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center"
          >
            <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Готовы начать?
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Присоединяйтесь к тысячам художников и коллекционеров уже сегодня
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedAction('register');
                    setShowRoleModal(true);
                  }}
                  className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
                >
                  <UserPlus className="w-6 h-6" />
                  Создать аккаунт бесплатно
                </motion.button>
                <Link href="/about">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all"
                  >
                    Узнать больше о платформе
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.section>
        )}
      </div>

      {/* Role Selection Modal */}
      <AnimatePresence>
        {showRoleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowRoleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedAction === 'login' ? 'Войти как...' : 'Зарегистрироваться как...'}
                  </h2>
                  <p className="text-gray-600">Выберите роль для продолжения</p>
                </div>
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userRoles.map((role) => (
                  <motion.button
                    key={role.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRoleSelect(role.id)}
                    className="p-6 border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all text-left"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-3`}>
                      <role.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{role.name}</h3>
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
