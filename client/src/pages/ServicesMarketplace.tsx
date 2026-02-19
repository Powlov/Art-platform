import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Store, Shield, Truck, Award, Search, Filter, Star,
  CheckCircle, Clock, DollarSign, MapPin, Phone, Mail,
  ExternalLink, MessageSquare, ChevronRight, TrendingUp,
  Package, Users, Calendar, Zap, Target, BarChart3,
  FileText, Download, Settings, Plus, Heart, Eye,
  Sparkles, Globe, Lock, BadgeCheck, AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '../_core/hooks/useAuth';

interface ServiceProvider {
  id: number;
  name: string;
  category: 'insurance' | 'logistics' | 'expertise' | 'restoration' | 'legal' | 'marketing';
  description: string;
  logo: string;
  rating: number;
  reviews: number;
  completedOrders: number;
  responseTime: string;
  priceFrom: number;
  services: string[];
  certifications: string[];
  location: string;
  featured: boolean;
  verified: boolean;
  availability: 'available' | 'busy' | 'unavailable';
}

interface ServiceOrder {
  id: number;
  providerId: number;
  providerName: string;
  service: string;
  orderDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  price: number;
  description: string;
}

export default function ServicesMarketplace() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Mock service providers
  const providers: ServiceProvider[] = [
    {
      id: 1,
      name: 'Ингосстрах Арт',
      category: 'insurance',
      description: 'Комплексное страхование произведений искусства и коллекций',
      logo: '',
      rating: 4.9,
      reviews: 342,
      completedOrders: 1250,
      responseTime: '1 час',
      priceFrom: 25000,
      services: ['Страхование коллекций', 'Транспортное страхование', 'Выставочное страхование', 'Страхование на время реставрации'],
      certifications: ['ВСС', 'Российский Союз Страховщиков', 'ISO 9001'],
      location: 'Москва',
      featured: true,
      verified: true,
      availability: 'available'
    },
    {
      id: 2,
      name: 'Art Logistics Pro',
      category: 'logistics',
      description: 'Международные перевозки произведений искусства с полным сопровождением',
      logo: '',
      rating: 4.8,
      reviews: 287,
      completedOrders: 980,
      responseTime: '2 часа',
      priceFrom: 15000,
      services: ['Международная доставка', 'Таможенное оформление', 'Упаковка', 'Климат-контроль'],
      certifications: ['IATA', 'FIATA', 'ISO 9001'],
      location: 'Москва, Санкт-Петербург',
      featured: true,
      verified: true,
      availability: 'available'
    },
    {
      id: 3,
      name: 'Центр Экспертизы "АртКонсалт"',
      category: 'expertise',
      description: 'Профессиональная экспертиза и оценка произведений искусства',
      logo: '',
      rating: 5.0,
      reviews: 456,
      completedOrders: 1890,
      responseTime: '3 часа',
      priceFrom: 12000,
      services: ['Аутентификация', 'Оценка стоимости', 'Техническая экспертиза', 'Атрибуция'],
      certifications: ['RICS', 'Союз экспертов России', 'ISO/IEC 17024'],
      location: 'Москва',
      featured: true,
      verified: true,
      availability: 'available'
    },
    {
      id: 4,
      name: 'Мастерская "АртРеставрация"',
      category: 'restoration',
      description: 'Реставрация живописи, графики и предметов искусства',
      logo: '',
      rating: 4.9,
      reviews: 198,
      completedOrders: 567,
      responseTime: '24 часа',
      priceFrom: 20000,
      services: ['Реставрация живописи', 'Реставрация графики', 'Консервация', 'Превентивная реставрация'],
      certifications: ['Союз реставраторов', 'Министерство культуры РФ'],
      location: 'Санкт-Петербург',
      featured: false,
      verified: true,
      availability: 'busy'
    },
    {
      id: 5,
      name: 'Юридическое бюро "Арт&Право"',
      category: 'legal',
      description: 'Юридическое сопровождение сделок с произведениями искусства',
      logo: '',
      rating: 4.7,
      reviews: 234,
      completedOrders: 789,
      responseTime: '4 часа',
      priceFrom: 30000,
      services: ['Проверка юридической чистоты', 'Сопровождение сделок', 'Разрешение споров', 'Контракты'],
      certifications: ['Адвокатская палата', 'АЮР'],
      location: 'Москва',
      featured: false,
      verified: true,
      availability: 'available'
    },
    {
      id: 6,
      name: 'Digital Art Marketing',
      category: 'marketing',
      description: 'Маркетинг и продвижение галерей и художников',
      logo: '',
      rating: 4.6,
      reviews: 145,
      completedOrders: 432,
      responseTime: '6 часов',
      priceFrom: 25000,
      services: ['SMM', 'Контекстная реклама', 'PR', 'Брендинг'],
      certifications: ['Яндекс.Директ', 'Google Ads'],
      location: 'Москва, удалённо',
      featured: false,
      verified: true,
      availability: 'available'
    }
  ];

  // Mock orders
  const myOrders: ServiceOrder[] = [
    {
      id: 1,
      providerId: 1,
      providerName: 'Ингосстрах Арт',
      service: 'Страхование коллекции',
      orderDate: '2026-02-10',
      status: 'in_progress',
      price: 45000,
      description: 'Страхование коллекции из 15 произведений на сумму 5,000,000 ₽'
    },
    {
      id: 2,
      providerId: 3,
      providerName: 'Центр Экспертизы "АртКонсалт"',
      service: 'Оценка стоимости',
      orderDate: '2026-01-28',
      status: 'completed',
      price: 18000,
      description: 'Оценка 3 произведений для страхования'
    }
  ];

  // Statistics
  const stats = [
    {
      label: 'Провайдеров услуг',
      value: providers.length,
      icon: Store,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      label: 'Активных заказов',
      value: myOrders.filter(o => o.status === 'in_progress').length,
      icon: Clock,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      label: 'Завершённых',
      value: myOrders.filter(o => o.status === 'completed').length,
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Сэкономлено',
      value: '127,500',
      suffix: '₽',
      icon: DollarSign,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  // Categories
  const categories = [
    { id: 'all', label: 'Все услуги', icon: Store },
    { id: 'insurance', label: 'Страхование', icon: Shield },
    { id: 'logistics', label: 'Логистика', icon: Truck },
    { id: 'expertise', label: 'Экспертиза', icon: BadgeCheck },
    { id: 'restoration', label: 'Реставрация', icon: Sparkles },
    { id: 'legal', label: 'Юридические', icon: FileText },
    { id: 'marketing', label: 'Маркетинг', icon: TrendingUp }
  ];

  // Filter providers
  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || provider.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: 'Ожидание', className: 'bg-gray-100 text-gray-700' },
      in_progress: { label: 'В работе', className: 'bg-blue-100 text-blue-700' },
      completed: { label: 'Завершено', className: 'bg-green-100 text-green-700' },
      cancelled: { label: 'Отменено', className: 'bg-red-100 text-red-700' }
    };
    const variant = variants[status] || variants.pending;
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const getAvailabilityBadge = (availability: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      available: { label: 'Доступен', className: 'bg-green-100 text-green-700' },
      busy: { label: 'Занят', className: 'bg-yellow-100 text-yellow-700' },
      unavailable: { label: 'Недоступен', className: 'bg-red-100 text-red-700' }
    };
    const variant = variants[availability] || variants.unavailable;
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      insurance: Shield,
      logistics: Truck,
      expertise: BadgeCheck,
      restoration: Sparkles,
      legal: FileText,
      marketing: TrendingUp
    };
    return icons[category] || Store;
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            <Store className="inline-block w-10 h-10 mr-3 text-blue-600" />
            Маркетплейс услуг
          </h1>
          <p className="text-gray-600">
            Все необходимые услуги для работы с произведениями искусства в одном месте
          </p>
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
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value} {stat.suffix && <span className="text-lg">{stat.suffix}</span>}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="marketplace" className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm border border-gray-200">
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <Store className="w-4 h-4" />
              Маркетплейс
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Мои заказы ({myOrders.length})
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Избранное
            </TabsTrigger>
          </TabsList>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace" className="space-y-6">
            {/* Filters */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Поиск услуг, провайдеров..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => {
                    const Icon = cat.icon;
                    return (
                      <Button
                        key={cat.id}
                        variant={selectedCategory === cat.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(cat.id)}
                        className="flex items-center gap-2"
                      >
                        <Icon className="w-4 h-4" />
                        {cat.label}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Providers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProviders.map((provider, index) => {
                const CategoryIcon = getCategoryIcon(provider.category);
                return (
                  <motion.div
                    key={provider.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-none shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-full">
                      {provider.featured && (
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-1 text-center">
                          <span className="text-xs font-semibold text-white flex items-center justify-center gap-1">
                            <Star className="w-3 h-3" />
                            Рекомендованный провайдер
                          </span>
                        </div>
                      )}
                      
                      <CardContent className="p-6">
                        {/* Header */}
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                            <CategoryIcon className="w-8 h-8" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold text-gray-900">{provider.name}</h3>
                              {provider.verified && (
                                <BadgeCheck className="w-5 h-5 text-blue-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                              <span className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                {provider.rating}
                              </span>
                              <span>({provider.reviews} отзывов)</span>
                              <span className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                {provider.completedOrders}
                              </span>
                            </div>
                            {getAvailabilityBadge(provider.availability)}
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-600 mb-4">{provider.description}</p>

                        {/* Services */}
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-2">Услуги:</p>
                          <div className="flex flex-wrap gap-2">
                            {provider.services.slice(0, 3).map((service, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                            {provider.services.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{provider.services.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                          <div>
                            <p className="text-gray-500 text-xs mb-1">Ответ в течение</p>
                            <p className="text-gray-900 font-semibold flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {provider.responseTime}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs mb-1">Локация</p>
                            <p className="text-gray-900 font-semibold flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {provider.location}
                            </p>
                          </div>
                        </div>

                        {/* Price and Action */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">От</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {provider.priceFrom.toLocaleString()} ₽
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedProvider(provider)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                              onClick={() => {
                                setSelectedProvider(provider);
                                setShowOrderModal(true);
                              }}
                              disabled={provider.availability === 'unavailable'}
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Заказать
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {filteredProviders.length === 0 && (
              <Card className="border-none shadow-lg">
                <CardContent className="p-12 text-center">
                  <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Провайдеры не найдены</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="space-y-4">
              {myOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-none shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{order.service}</h3>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{order.providerName}</p>
                          <p className="text-sm text-gray-500">{order.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900 mb-1">
                            {order.price.toLocaleString()} ₽
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.orderDate).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Написать
                        </Button>
                        {order.status === 'completed' && (
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Документы
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {myOrders.length === 0 && (
                <Card className="border-none shadow-lg">
                  <CardContent className="p-12 text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">У вас пока нет заказов</p>
                    <Button onClick={() => document.querySelector('[value="marketplace"]')?.click()}>
                      Перейти к услугам
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <Card className="border-none shadow-lg">
              <CardContent className="p-12 text-center">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Нет избранных провайдеров</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Order Modal (simplified) */}
        {showOrderModal && selectedProvider && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Заказать услугу</h2>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{selectedProvider.name}</h3>
                  <p className="text-sm text-gray-600">{selectedProvider.description}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Выберите услугу
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    {selectedProvider.services.map((service, idx) => (
                      <option key={idx}>{service}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Описание запроса
                  </label>
                  <textarea
                    placeholder="Опишите ваш запрос..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    onClick={() => {
                      console.log('Creating order');
                      setShowOrderModal(false);
                    }}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Отправить запрос
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
