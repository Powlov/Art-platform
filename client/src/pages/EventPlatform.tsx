import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, Clock, MapPin, Users, Ticket, ShoppingBag,
  Video, CreditCard, Heart, Share2, Download, Filter,
  TrendingUp, DollarSign, Package, Eye, Star,
  CheckCircle, AlertCircle, ChevronRight, Search,
  Grid, List, Plus, Edit, Trash2, Play, Award,
  Globe, Lock, Zap, Gift, Tag, MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '../_core/hooks/useAuth';

interface Event {
  id: number;
  title: string;
  type: 'exhibition' | 'auction' | 'workshop' | 'conference' | 'fair' | 'online';
  date: string;
  time: string;
  location: string;
  organizer: string;
  description: string;
  image: string;
  status: 'upcoming' | 'ongoing' | 'ended';
  ticketPrice: number;
  availableTickets: number;
  totalTickets: number;
  hasStreaming: boolean;
  streamPrice?: number;
  merchandise: Merchandise[];
  rating: number;
  attendees: number;
  featured: boolean;
}

interface Merchandise {
  id: number;
  name: string;
  price: number;
  image: string;
  stock: number;
  category: 'catalog' | 'poster' | 'print' | 'souvenir' | 'clothing';
}

interface Ticket {
  id: number;
  eventId: number;
  eventTitle: string;
  ticketType: 'physical' | 'online';
  purchaseDate: string;
  price: number;
  qrCode: string;
  status: 'active' | 'used' | 'expired' | 'cancelled';
}

export default function EventPlatform() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showStreamModal, setShowStreamModal] = useState(false);
  const [selectedTicketType, setSelectedTicketType] = useState<'physical' | 'online'>('physical');

  // Mock data - события
  const events: Event[] = [
    {
      id: 1,
      title: 'Современное искусство Москвы 2026',
      type: 'exhibition',
      date: '2026-03-15',
      time: '10:00 - 20:00',
      location: 'ЦВЗ "Манеж", Москва',
      organizer: 'Московский музей современного искусства',
      description: 'Масштабная выставка современного российского искусства с участием 150+ художников',
      image: 'https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=800&q=80',
      status: 'upcoming',
      ticketPrice: 500,
      availableTickets: 1250,
      totalTickets: 2000,
      hasStreaming: true,
      streamPrice: 200,
      rating: 4.9,
      attendees: 750,
      featured: true,
      merchandise: [
        { id: 1, name: 'Каталог выставки', price: 1200, image: '', stock: 150, category: 'catalog' },
        { id: 2, name: 'Постер "Абстракция"', price: 800, image: '', stock: 85, category: 'poster' },
        { id: 3, name: 'Принт "Московский авангард"', price: 2500, image: '', stock: 45, category: 'print' }
      ]
    },
    {
      id: 2,
      title: 'Аукцион современного искусства',
      type: 'auction',
      date: '2026-03-20',
      time: '19:00 - 22:00',
      location: 'Аукционный дом "Империя", Санкт-Петербург',
      organizer: 'Империя Аукционы',
      description: '120 лотов от ведущих современных художников. Онлайн-трансляция и возможность делать ставки удалённо',
      image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&q=80',
      status: 'upcoming',
      ticketPrice: 1500,
      availableTickets: 85,
      totalTickets: 200,
      hasStreaming: true,
      streamPrice: 500,
      rating: 4.8,
      attendees: 115,
      featured: true,
      merchandise: [
        { id: 4, name: 'Каталог аукциона', price: 2500, image: '', stock: 100, category: 'catalog' }
      ]
    },
    {
      id: 3,
      title: 'Мастер-класс: Масляная живопись',
      type: 'workshop',
      date: '2026-03-18',
      time: '14:00 - 18:00',
      location: 'Арт-студия "Мастерская", Москва',
      organizer: 'Анна Петрова',
      description: 'Практический мастер-класс по технике масляной живописи для начинающих',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
      status: 'upcoming',
      ticketPrice: 3500,
      availableTickets: 8,
      totalTickets: 15,
      hasStreaming: true,
      streamPrice: 1500,
      rating: 5.0,
      attendees: 7,
      featured: false,
      merchandise: [
        { id: 5, name: 'Набор красок масляных', price: 4500, image: '', stock: 20, category: 'souvenir' },
        { id: 6, name: 'Холст на подрамнике 40x50', price: 800, image: '', stock: 30, category: 'souvenir' }
      ]
    },
    {
      id: 4,
      title: 'Art Tech Conference 2026',
      type: 'conference',
      date: '2026-04-05',
      time: '10:00 - 18:00',
      location: 'Онлайн + Москва, Digital Art Space',
      organizer: 'ART BANK Platform',
      description: 'Конференция о пересечении искусства и технологий: NFT, AI-art, виртуальные выставки',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
      status: 'upcoming',
      ticketPrice: 2500,
      availableTickets: 450,
      totalTickets: 500,
      hasStreaming: true,
      streamPrice: 1000,
      rating: 4.7,
      attendees: 50,
      featured: true,
      merchandise: [
        { id: 7, name: 'Футболка Art Tech', price: 1500, image: '', stock: 200, category: 'clothing' },
        { id: 8, name: 'Блокнот конференции', price: 600, image: '', stock: 150, category: 'souvenir' }
      ]
    },
    {
      id: 5,
      title: 'Moscow Art Fair 2026',
      type: 'fair',
      date: '2026-04-15',
      time: '11:00 - 21:00',
      location: 'Гостиный Двор, Москва',
      organizer: 'Moscow Art Fair',
      description: 'Крупнейшая арт-ярмарка России. 200+ галерей, 5000+ произведений',
      image: 'https://images.unsplash.com/photo-1569701813229-33c94a3e06e5?w=800&q=80',
      status: 'upcoming',
      ticketPrice: 800,
      availableTickets: 3500,
      totalTickets: 5000,
      hasStreaming: false,
      rating: 4.9,
      attendees: 1500,
      featured: true,
      merchandise: [
        { id: 9, name: 'Путеводитель по ярмарке', price: 500, image: '', stock: 500, category: 'catalog' },
        { id: 10, name: 'Эко-сумка MAF 2026', price: 900, image: '', stock: 300, category: 'souvenir' }
      ]
    },
    {
      id: 6,
      title: 'Онлайн-экскурсия: Эрмитаж',
      type: 'online',
      date: '2026-03-22',
      time: '15:00 - 16:30',
      location: 'Онлайн',
      organizer: 'Государственный Эрмитаж',
      description: 'Виртуальная экскурсия по залам Эрмитажа с искусствоведом',
      image: 'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=800&q=80',
      status: 'upcoming',
      ticketPrice: 0,
      availableTickets: 1000,
      totalTickets: 1000,
      hasStreaming: true,
      streamPrice: 300,
      rating: 4.6,
      attendees: 0,
      featured: false,
      merchandise: []
    }
  ];

  // Mock data - мои билеты
  const myTickets: Ticket[] = [
    {
      id: 1,
      eventId: 1,
      eventTitle: 'Современное искусство Москвы 2026',
      ticketType: 'physical',
      purchaseDate: '2026-02-10',
      price: 500,
      qrCode: 'QR12345ABC',
      status: 'active'
    },
    {
      id: 2,
      eventId: 3,
      eventTitle: 'Мастер-класс: Масляная живопись',
      ticketType: 'physical',
      purchaseDate: '2026-02-08',
      price: 3500,
      qrCode: 'QR67890DEF',
      status: 'active'
    }
  ];

  // Фильтрация событий
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || event.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Статистика
  const stats = [
    {
      label: 'Активных событий',
      value: events.filter(e => e.status === 'upcoming').length,
      icon: Calendar,
      color: 'from-blue-500 to-indigo-500',
      change: '+12%'
    },
    {
      label: 'Проданных билетов',
      value: events.reduce((sum, e) => sum + (e.totalTickets - e.availableTickets), 0),
      icon: Ticket,
      color: 'from-green-500 to-emerald-500',
      change: '+28%'
    },
    {
      label: 'Онлайн-трансляций',
      value: events.filter(e => e.hasStreaming).length,
      icon: Video,
      color: 'from-purple-500 to-pink-500',
      change: '+45%'
    },
    {
      label: 'Мои билеты',
      value: myTickets.filter(t => t.status === 'active').length,
      icon: CheckCircle,
      color: 'from-orange-500 to-red-500',
      change: '+2'
    }
  ];

  const handleBuyTicket = (event: Event, type: 'physical' | 'online') => {
    setSelectedEvent(event);
    setSelectedTicketType(type);
    setShowTicketModal(true);
  };

  const handleWatchStream = (event: Event) => {
    setSelectedEvent(event);
    setShowStreamModal(true);
  };

  const confirmPurchase = () => {
    console.log('Покупка билета:', selectedEvent, selectedTicketType);
    setShowTicketModal(false);
    // TODO: Интеграция с платёжной системой
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                <Calendar className="inline-block w-10 h-10 mr-3 text-blue-600" />
                Мероприятия
              </h1>
              <p className="text-gray-600">
                Выставки, аукционы, мастер-классы и онлайн-трансляции
              </p>
            </div>
            {user?.role === 'gallery' && (
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Plus className="w-5 h-5 mr-2" />
                Создать событие
              </Button>
            )}
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="border-none shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-green-600 bg-green-50">
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm border border-gray-200">
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Все события
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center gap-2">
              <Ticket className="w-4 h-4" />
              Мои билеты
            </TabsTrigger>
            <TabsTrigger value="merchandise" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Магазин
            </TabsTrigger>
            <TabsTrigger value="streaming" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Трансляции
            </TabsTrigger>
          </TabsList>

          {/* Tab: Все события */}
          <TabsContent value="events" className="space-y-6">
            {/* Filters */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Поиск событий, организаторов..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Type filter */}
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Все типы</option>
                    <option value="exhibition">Выставки</option>
                    <option value="auction">Аукционы</option>
                    <option value="workshop">Мастер-классы</option>
                    <option value="conference">Конференции</option>
                    <option value="fair">Ярмарки</option>
                    <option value="online">Онлайн</option>
                  </select>

                  {/* View mode */}
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Events Grid/List */}
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
            }>
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="border-none shadow-lg overflow-hidden h-full">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      {event.featured && (
                        <Badge className="absolute top-3 right-3 bg-yellow-500 text-white border-none">
                          <Star className="w-3 h-3 mr-1" />
                          Избранное
                        </Badge>
                      )}
                      <Badge className="absolute top-3 left-3 bg-white/90 text-gray-900 border-none">
                        {event.type === 'exhibition' && 'Выставка'}
                        {event.type === 'auction' && 'Аукцион'}
                        {event.type === 'workshop' && 'Мастер-класс'}
                        {event.type === 'conference' && 'Конференция'}
                        {event.type === 'fair' && 'Ярмарка'}
                        {event.type === 'online' && 'Онлайн'}
                      </Badge>
                    </div>

                    <CardContent className="p-6 flex flex-col h-full">
                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {event.title}
                      </h3>

                      {/* Organizer */}
                      <p className="text-sm text-gray-600 mb-3">{event.organizer}</p>

                      {/* Info */}
                      <div className="space-y-2 mb-4 flex-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                          {new Date(event.date).toLocaleDateString('ru-RU')}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2 text-green-600" />
                          {event.time}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-red-600" />
                          {event.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-2 text-purple-600" />
                          {event.attendees} участников
                        </div>
                      </div>

                      {/* Tickets availability */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Билеты:</span>
                          <span className="font-semibold text-gray-900">
                            {event.availableTickets} / {event.totalTickets}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
                            style={{
                              width: `${((event.totalTickets - event.availableTickets) / event.totalTickets) * 100}%`
                            }}
                          />
                        </div>
                      </div>

                      {/* Price and Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          {event.ticketPrice === 0 ? (
                            <span className="text-2xl font-bold text-green-600">Бесплатно</span>
                          ) : (
                            <span className="text-2xl font-bold text-gray-900">
                              {event.ticketPrice.toLocaleString()} ₽
                            </span>
                          )}
                          {event.hasStreaming && (
                            <div className="flex items-center text-xs text-purple-600 mt-1">
                              <Video className="w-3 h-3 mr-1" />
                              Онлайн {event.streamPrice}₽
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {event.hasStreaming && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleWatchStream(event)}
                            >
                              <Video className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            onClick={() => handleBuyTicket(event, 'physical')}
                            disabled={event.availableTickets === 0}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                          >
                            <Ticket className="w-4 h-4 mr-2" />
                            Купить
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Tab: Мои билеты */}
          <TabsContent value="tickets" className="space-y-6">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="w-6 h-6 text-blue-600" />
                  Мои билеты ({myTickets.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myTickets.map((ticket, index) => (
                    <motion.div
                      key={ticket.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {ticket.eventTitle}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(ticket.purchaseDate).toLocaleDateString('ru-RU')}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {ticket.price.toLocaleString()} ₽
                            </span>
                            <Badge
                              variant={ticket.status === 'active' ? 'default' : 'secondary'}
                            >
                              {ticket.status === 'active' && 'Активен'}
                              {ticket.status === 'used' && 'Использован'}
                              {ticket.status === 'expired' && 'Истёк'}
                              {ticket.status === 'cancelled' && 'Отменён'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {/* QR код */}
                          <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-xs text-gray-500">QR</span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {myTickets.length === 0 && (
                    <div className="text-center py-12">
                      <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">У вас пока нет билетов</p>
                      <Button className="mt-4" onClick={() => document.querySelector('[value="events"]')?.click()}>
                        Выбрать событие
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Магазин */}
          <TabsContent value="merchandise" className="space-y-6">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-purple-600" />
                  Мерчендайз и сувениры
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.flatMap(e => e.merchandise).map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -5 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all"
                    >
                      <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                      <Badge variant="secondary" className="mb-2">
                        {item.category === 'catalog' && 'Каталог'}
                        {item.category === 'poster' && 'Постер'}
                        {item.category === 'print' && 'Принт'}
                        {item.category === 'souvenir' && 'Сувенир'}
                        {item.category === 'clothing' && 'Одежда'}
                      </Badge>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xl font-bold text-gray-900">
                          {item.price.toLocaleString()} ₽
                        </span>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          <ShoppingBag className="w-4 h-4 mr-1" />
                          Купить
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Осталось: {item.stock} шт.
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Трансляции */}
          <TabsContent value="streaming" className="space-y-6">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-6 h-6 text-red-600" />
                  Онлайн-трансляции
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {events.filter(e => e.hasStreaming).map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="relative h-48 bg-gradient-to-br from-purple-500 to-pink-500">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover opacity-70"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button
                            size="lg"
                            className="rounded-full w-16 h-16 bg-white/90 hover:bg-white"
                            onClick={() => handleWatchStream(event)}
                          >
                            <Play className="w-8 h-8 text-red-600" />
                          </Button>
                        </div>
                        {event.streamPrice && (
                          <Badge className="absolute top-3 right-3 bg-red-600 text-white border-none">
                            {event.streamPrice} ₽
                          </Badge>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-2">{event.title}</h3>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            <div className="flex items-center gap-1 mb-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(event.date).toLocaleDateString('ru-RU')}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {event.time}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleWatchStream(event)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Смотреть
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Ticket Modal */}
        {showTicketModal && selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Покупка билета</h2>
                <button
                  onClick={() => setShowTicketModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{selectedEvent.title}</h3>
                  <p className="text-sm text-gray-600">{selectedEvent.organizer}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Тип билета:</span>
                    <span className="font-semibold text-gray-900">
                      {selectedTicketType === 'physical' ? 'Физический' : 'Онлайн'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Цена:</span>
                    <span className="font-semibold text-gray-900">
                      {selectedTicketType === 'physical'
                        ? selectedEvent.ticketPrice
                        : selectedEvent.streamPrice
                      } ₽
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    onClick={confirmPurchase}
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Оплатить
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Stream Modal */}
        {showStreamModal && selectedEvent && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black rounded-2xl max-w-4xl w-full"
            >
              <div className="relative aspect-video bg-gradient-to-br from-purple-900 to-pink-900 rounded-t-2xl flex items-center justify-center">
                <Play className="w-24 h-24 text-white/50" />
              </div>
              <div className="p-6 bg-white rounded-b-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h2>
                  <button
                    onClick={() => setShowStreamModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                <p className="text-gray-600 mb-4">{selectedEvent.description}</p>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">
                    <Users className="w-3 h-3 mr-1" />
                    {selectedEvent.attendees} зрителей
                  </Badge>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Чат
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Поделиться
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
