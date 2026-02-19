import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Award, FileCheck, Users, Calendar, CheckCircle, Clock,
  AlertCircle, TrendingUp, Eye, Star, Shield, FileText,
  Upload, Download, Search, Filter, BadgeCheck, Microscope,
  Sparkles, Target, BarChart3, DollarSign, Package,
  MessageSquare, Phone, Mail, MapPin, Plus, Edit, Trash2,
  ChevronRight, ChevronDown, Info, ExternalLink, Zap,
  XCircle, Loader, Image as ImageIcon, Camera, Scan
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '../_core/hooks/useAuth';

interface ExpertiseRequest {
  id: number;
  artworkId: number;
  artworkTitle: string;
  artworkImage: string;
  artist: string;
  expertType: 'authenticity' | 'valuation' | 'condition' | 'attribution' | 'full';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  expert: string;
  expertCompany: string;
  submitDate: string;
  completionDate?: string;
  estimatedPrice?: number;
  actualPrice?: number;
  reportUrl?: string;
  certificateUrl?: string;
  priority: 'standard' | 'urgent' | 'express';
  price: number;
}

interface Expert {
  id: number;
  name: string;
  company: string;
  specialization: string[];
  rating: number;
  completedExpertises: number;
  experience: number;
  avatar: string;
  certifications: string[];
  languages: string[];
  priceFrom: number;
  location: string;
  responseTime: string;
  featured: boolean;
}

interface Certificate {
  id: number;
  artworkId: number;
  artworkTitle: string;
  artist: string;
  certificateNumber: string;
  issueDate: string;
  expertName: string;
  expertCompany: string;
  authenticity: 'authentic' | 'questionable' | 'fake';
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  estimatedValue: number;
  validUntil: string;
  qrCode: string;
  blockchainHash?: string;
}

export default function CertificationExpertise() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedExpertise, setSelectedExpertise] = useState<ExpertiseRequest | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedExpertType, setSelectedExpertType] = useState<string>('authenticity');

  // Mock data - Запросы на экспертизу
  const expertiseRequests: ExpertiseRequest[] = [
    {
      id: 1,
      artworkId: 101,
      artworkTitle: 'Абстрактная композиция №7',
      artworkImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&q=80',
      artist: 'Анна Петрова',
      expertType: 'authenticity',
      status: 'in_progress',
      expert: 'Михаил Соколов',
      expertCompany: 'Центр экспертизы искусства',
      submitDate: '2026-02-05',
      estimatedPrice: 85000,
      priority: 'standard',
      price: 15000
    },
    {
      id: 2,
      artworkId: 102,
      artworkTitle: 'Портрет дамы',
      artworkImage: 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=400&q=80',
      artist: 'Иван Сидоров',
      expertType: 'full',
      status: 'completed',
      expert: 'Елена Волкова',
      expertCompany: 'Искусствоведческий центр "Арт Эксперт"',
      submitDate: '2026-01-28',
      completionDate: '2026-02-08',
      actualPrice: 125000,
      reportUrl: '#',
      certificateUrl: '#',
      priority: 'urgent',
      price: 35000
    },
    {
      id: 3,
      artworkId: 103,
      artworkTitle: 'Городской пейзаж',
      artworkImage: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=400&q=80',
      artist: 'Петр Смирнов',
      expertType: 'valuation',
      status: 'pending',
      expert: 'Не назначен',
      expertCompany: 'В ожидании',
      submitDate: '2026-02-10',
      estimatedPrice: 45000,
      priority: 'standard',
      price: 8000
    },
    {
      id: 4,
      artworkId: 104,
      artworkTitle: 'Натюрморт с фруктами',
      artworkImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80',
      artist: 'Мария Козлова',
      expertType: 'condition',
      status: 'completed',
      expert: 'Дмитрий Лебедев',
      expertCompany: 'Реставрационная мастерская "Арт-Реставрация"',
      submitDate: '2026-01-20',
      completionDate: '2026-02-01',
      actualPrice: 28000,
      reportUrl: '#',
      certificateUrl: '#',
      priority: 'express',
      price: 12000
    }
  ];

  // Mock data - Эксперты
  const experts: Expert[] = [
    {
      id: 1,
      name: 'Михаил Соколов',
      company: 'Центр экспертизы искусства',
      specialization: ['Аутентификация', 'Атрибуция', 'Современное искусство'],
      rating: 4.9,
      completedExpertises: 340,
      experience: 15,
      avatar: '',
      certifications: ['RICS', 'Союз экспертов России', 'IADA'],
      languages: ['Русский', 'Английский', 'Французский'],
      priceFrom: 15000,
      location: 'Москва',
      responseTime: '24 часа',
      featured: true
    },
    {
      id: 2,
      name: 'Елена Волкова',
      company: 'Искусствоведческий центр "Арт Эксперт"',
      specialization: ['Оценка', 'Классическое искусство', 'XIX-XX век'],
      rating: 4.8,
      completedExpertises: 280,
      experience: 12,
      avatar: '',
      certifications: ['RICS', 'Российское общество оценщиков'],
      languages: ['Русский', 'Английский'],
      priceFrom: 20000,
      location: 'Санкт-Петербург',
      responseTime: '48 часов',
      featured: true
    },
    {
      id: 3,
      name: 'Дмитрий Лебедев',
      company: 'Реставрационная мастерская "Арт-Реставрация"',
      specialization: ['Техническая экспертиза', 'Реставрация', 'Состояние работ'],
      rating: 5.0,
      completedExpertises: 450,
      experience: 20,
      avatar: '',
      certifications: ['Союз реставраторов', 'ICOM-CC'],
      languages: ['Русский', 'Немецкий'],
      priceFrom: 10000,
      location: 'Москва',
      responseTime: '12 часов',
      featured: true
    },
    {
      id: 4,
      name: 'Анна Кузнецова',
      company: 'Независимая экспертиза "АртКонсалт"',
      specialization: ['Современное искусство', 'NFT', 'Цифровое искусство'],
      rating: 4.7,
      completedExpertises: 180,
      experience: 8,
      avatar: '',
      certifications: ['RICS', 'Blockchain Art Collective'],
      languages: ['Русский', 'Английский', 'Испанский'],
      priceFrom: 12000,
      location: 'Москва',
      responseTime: '36 часов',
      featured: false
    }
  ];

  // Mock data - Сертификаты
  const certificates: Certificate[] = [
    {
      id: 1,
      artworkId: 102,
      artworkTitle: 'Портрет дамы',
      artist: 'Иван Сидоров',
      certificateNumber: 'CERT-2026-0001',
      issueDate: '2026-02-08',
      expertName: 'Елена Волкова',
      expertCompany: 'Искусствоведческий центр "Арт Эксперт"',
      authenticity: 'authentic',
      condition: 'excellent',
      estimatedValue: 125000,
      validUntil: '2031-02-08',
      qrCode: 'QR_CERT_001',
      blockchainHash: '0x742d35Cc6634C0532925a3b8...9d3d4'
    },
    {
      id: 2,
      artworkId: 104,
      artworkTitle: 'Натюрморт с фруктами',
      artist: 'Мария Козлова',
      certificateNumber: 'CERT-2026-0002',
      issueDate: '2026-02-01',
      expertName: 'Дмитрий Лебедев',
      expertCompany: 'Реставрационная мастерская "Арт-Реставрация"',
      authenticity: 'authentic',
      condition: 'good',
      estimatedValue: 28000,
      validUntil: '2031-02-01',
      qrCode: 'QR_CERT_002'
    }
  ];

  // Статистика
  const stats = [
    {
      label: 'Всего экспертиз',
      value: expertiseRequests.length,
      icon: FileCheck,
      color: 'from-blue-500 to-indigo-500',
      change: '+8%'
    },
    {
      label: 'В процессе',
      value: expertiseRequests.filter(r => r.status === 'in_progress').length,
      icon: Clock,
      color: 'from-yellow-500 to-orange-500',
      change: '+3'
    },
    {
      label: 'Завершено',
      value: expertiseRequests.filter(r => r.status === 'completed').length,
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500',
      change: '+12'
    },
    {
      label: 'Сертификатов',
      value: certificates.length,
      icon: Award,
      color: 'from-purple-500 to-pink-500',
      change: '+2'
    }
  ];

  // Фильтрация запросов
  const filteredRequests = expertiseRequests.filter(req => {
    const matchesSearch = req.artworkTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         req.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         req.expert.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || req.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Функции
  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: 'Ожидание', className: 'bg-gray-100 text-gray-700' },
      in_progress: { label: 'В работе', className: 'bg-blue-100 text-blue-700' },
      completed: { label: 'Завершено', className: 'bg-green-100 text-green-700' },
      rejected: { label: 'Отклонено', className: 'bg-red-100 text-red-700' }
    };
    const variant = variants[status] || variants.pending;
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const getExpertTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      authenticity: 'Аутентификация',
      valuation: 'Оценка',
      condition: 'Состояние',
      attribution: 'Атрибуция',
      full: 'Полная экспертиза'
    };
    return types[type] || type;
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      standard: { label: 'Стандарт', className: 'bg-gray-100 text-gray-700' },
      urgent: { label: 'Срочно', className: 'bg-orange-100 text-orange-700' },
      express: { label: 'Экспресс', className: 'bg-red-100 text-red-700' }
    };
    const variant = variants[priority] || variants.standard;
    return <Badge className={variant.className}>{variant.label}</Badge>;
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
                <BadgeCheck className="inline-block w-10 h-10 mr-3 text-blue-600" />
                Экспертиза и сертификация
              </h1>
              <p className="text-gray-600">
                Профессиональная оценка, аутентификация и сертификация произведений искусства
              </p>
            </div>
            <Button
              onClick={() => setShowRequestModal(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Заказать экспертизу
            </Button>
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
        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm border border-gray-200">
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <FileCheck className="w-4 h-4" />
              Мои запросы
            </TabsTrigger>
            <TabsTrigger value="experts" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Эксперты
            </TabsTrigger>
            <TabsTrigger value="certificates" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Сертификаты
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              Информация
            </TabsTrigger>
          </TabsList>

          {/* Tab: Мои запросы */}
          <TabsContent value="requests" className="space-y-6">
            {/* Filters */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Поиск по названию, художнику, эксперту..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Status filter */}
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Все статусы</option>
                    <option value="pending">Ожидание</option>
                    <option value="in_progress">В работе</option>
                    <option value="completed">Завершено</option>
                    <option value="rejected">Отклонено</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Requests List */}
            <div className="space-y-4">
              {filteredRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-none shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Image */}
                        <div className="w-full lg:w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={request.artworkImage}
                            alt={request.artworkTitle}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">
                                {request.artworkTitle}
                              </h3>
                              <p className="text-gray-600 text-sm">{request.artist}</p>
                            </div>
                            <div className="flex gap-2">
                              {getStatusBadge(request.status)}
                              {getPriorityBadge(request.priority)}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Тип экспертизы</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {getExpertTypeLabel(request.expertType)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Эксперт</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {request.expert}
                              </p>
                              <p className="text-xs text-gray-500">{request.expertCompany}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Дата подачи</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {new Date(request.submitDate).toLocaleDateString('ru-RU')}
                              </p>
                            </div>
                            {request.estimatedPrice && (
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Оценка</p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {request.estimatedPrice.toLocaleString()} ₽
                                </p>
                              </div>
                            )}
                            {request.completionDate && (
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Завершено</p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {new Date(request.completionDate).toLocaleDateString('ru-RU')}
                                </p>
                              </div>
                            )}
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Стоимость</p>
                              <p className="text-sm font-semibold text-blue-600">
                                {request.price.toLocaleString()} ₽
                              </p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            {request.status === 'completed' && (
                              <>
                                {request.reportUrl && (
                                  <Button size="sm" variant="outline">
                                    <Download className="w-4 h-4 mr-2" />
                                    Отчёт
                                  </Button>
                                )}
                                {request.certificateUrl && (
                                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                    <Award className="w-4 h-4 mr-2" />
                                    Сертификат
                                  </Button>
                                )}
                              </>
                            )}
                            {request.status === 'in_progress' && (
                              <Button size="sm" variant="outline">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Связаться с экспертом
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedExpertise(request)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Подробнее
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {filteredRequests.length === 0 && (
                <Card className="border-none shadow-lg">
                  <CardContent className="p-12 text-center">
                    <FileCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Запросы на экспертизу не найдены</p>
                    <Button onClick={() => setShowRequestModal(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Создать запрос
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Tab: Эксперты */}
          <TabsContent value="experts" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {experts.map((expert, index) => (
                <motion.div
                  key={expert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-none shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    {expert.featured && (
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-1 text-center">
                        <span className="text-xs font-semibold text-white flex items-center justify-center gap-1">
                          <Star className="w-3 h-3" />
                          Рекомендованный эксперт
                        </span>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        {/* Avatar */}
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                          {expert.name.charAt(0)}
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{expert.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{expert.company}</p>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              {expert.rating}
                            </span>
                            <span className="flex items-center gap-1">
                              <FileCheck className="w-4 h-4" />
                              {expert.completedExpertises}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {expert.experience} лет
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Specialization */}
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2">Специализация:</p>
                        <div className="flex flex-wrap gap-2">
                          {expert.specialization.map((spec, idx) => (
                            <Badge key={idx} variant="secondary">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Certifications */}
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2">Сертификации:</p>
                        <div className="flex flex-wrap gap-2">
                          {expert.certifications.map((cert, idx) => (
                            <Badge key={idx} className="bg-green-100 text-green-700">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Локация</p>
                          <p className="text-gray-900 font-semibold flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {expert.location}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Ответ в течение</p>
                          <p className="text-gray-900 font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {expert.responseTime}
                          </p>
                        </div>
                      </div>

                      {/* Price and Action */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">От</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {expert.priceFrom.toLocaleString()} ₽
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Связаться
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Tab: Сертификаты */}
          <TabsContent value="certificates" className="space-y-6">
            <div className="space-y-4">
              {certificates.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-none shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3">
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                          <Award className="w-5 h-5" />
                          <span className="font-bold">Сертификат #{cert.certificateNumber}</span>
                        </div>
                        <Badge className="bg-white/20 text-white border-none">
                          Действителен до {new Date(cert.validUntil).toLocaleDateString('ru-RU')}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Info */}
                        <div className="lg:col-span-2 space-y-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {cert.artworkTitle}
                            </h3>
                            <p className="text-gray-600">{cert.artist}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Аутентичность</p>
                              <Badge
                                className={
                                  cert.authenticity === 'authentic'
                                    ? 'bg-green-100 text-green-700'
                                    : cert.authenticity === 'questionable'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                                }
                              >
                                {cert.authenticity === 'authentic' && 'Подтверждена'}
                                {cert.authenticity === 'questionable' && 'Сомнительна'}
                                {cert.authenticity === 'fake' && 'Подделка'}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Состояние</p>
                              <Badge variant="secondary">
                                {cert.condition === 'excellent' && 'Отличное'}
                                {cert.condition === 'good' && 'Хорошее'}
                                {cert.condition === 'fair' && 'Удовлетворительное'}
                                {cert.condition === 'poor' && 'Плохое'}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Оценочная стоимость</p>
                              <p className="text-lg font-bold text-gray-900">
                                {cert.estimatedValue.toLocaleString()} ₽
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Дата выдачи</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {new Date(cert.issueDate).toLocaleDateString('ru-RU')}
                              </p>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500 mb-1">Эксперт</p>
                            <p className="text-sm font-semibold text-gray-900">{cert.expertName}</p>
                            <p className="text-xs text-gray-500">{cert.expertCompany}</p>
                          </div>

                          {cert.blockchainHash && (
                            <div>
                              <p className="text-xs text-gray-500 mb-1">
                                Записано в блокчейн
                              </p>
                              <code className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                {cert.blockchainHash}
                              </code>
                            </div>
                          )}
                        </div>

                        {/* QR Code */}
                        <div className="flex flex-col items-center justify-center border-l border-gray-200 pl-6">
                          <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                            <Scan className="w-12 h-12 text-gray-400" />
                          </div>
                          <p className="text-xs text-gray-500 text-center mb-4">
                            Отсканируйте для проверки подлинности
                          </p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4 mr-2" />
                              PDF
                            </Button>
                            <Button size="sm" variant="outline">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Поделиться
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {certificates.length === 0 && (
                <Card className="border-none shadow-lg">
                  <CardContent className="p-12 text-center">
                    <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">У вас пока нет сертификатов</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Tab: Информация */}
          <TabsContent value="info" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Типы экспертиз */}
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Microscope className="w-5 h-5 text-blue-600" />
                    Типы экспертиз
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-1">Аутентификация</h4>
                    <p className="text-sm text-gray-600">
                      Подтверждение подлинности произведения, авторства художника
                    </p>
                    <p className="text-xs text-gray-500 mt-2">От 15,000 ₽ • 7-14 дней</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-1">Оценка стоимости</h4>
                    <p className="text-sm text-gray-600">
                      Определение рыночной стоимости для продажи или страхования
                    </p>
                    <p className="text-xs text-gray-500 mt-2">От 8,000 ₽ • 3-7 дней</p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-1">Техническая экспертиза</h4>
                    <p className="text-sm text-gray-600">
                      Оценка состояния, необходимость реставрации, материалы
                    </p>
                    <p className="text-xs text-gray-500 mt-2">От 10,000 ₽ • 5-10 дней</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-1">Полная экспертиза</h4>
                    <p className="text-sm text-gray-600">
                      Комплексное исследование: аутентичность, оценка, состояние, атрибуция
                    </p>
                    <p className="text-xs text-gray-500 mt-2">От 35,000 ₽ • 14-21 день</p>
                  </div>
                </CardContent>
              </Card>

              {/* Процесс */}
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-600" />
                    Как это работает
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Создание запроса</h4>
                        <p className="text-sm text-gray-600">
                          Заполните форму, загрузите фото произведения и документы
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Выбор эксперта</h4>
                        <p className="text-sm text-gray-600">
                          Система подберёт эксперта или выберите самостоятельно
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Проведение экспертизы</h4>
                        <p className="text-sm text-gray-600">
                          Эксперт проводит исследование и готовит отчёт
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold flex-shrink-0">
                        4
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Получение результатов</h4>
                        <p className="text-sm text-gray-600">
                          Отчёт, сертификат и запись в блокчейн для защиты
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Преимущества */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Почему выбирают нас
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Аккредитованные эксперты</h4>
                    <p className="text-sm text-gray-600">
                      Только сертифицированные специалисты с опытом от 8 лет
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-3">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Быстрое выполнение</h4>
                    <p className="text-sm text-gray-600">
                      Экспресс-экспертиза за 3 дня, стандарт - 7-14 дней
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-3">
                      <BadgeCheck className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Защита блокчейном</h4>
                    <p className="text-sm text-gray-600">
                      Все сертификаты записываются в блокчейн для защиты от подделок
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Request Modal (simplified placeholder) */}
        {showRequestModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Заказать экспертизу</h2>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Тип экспертизы
                  </label>
                  <select
                    value={selectedExpertType}
                    onChange={(e) => setSelectedExpertType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="authenticity">Аутентификация (от 15,000 ₽)</option>
                    <option value="valuation">Оценка стоимости (от 8,000 ₽)</option>
                    <option value="condition">Техническая экспертиза (от 10,000 ₽)</option>
                    <option value="attribution">Атрибуция (от 12,000 ₽)</option>
                    <option value="full">Полная экспертиза (от 35,000 ₽)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Произведение
                  </label>
                  <input
                    type="text"
                    placeholder="Название произведения"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Фотографии
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Загрузите фото произведения (минимум 3)
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Приоритет
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <Button variant="outline" className="justify-start">
                      Стандарт (7-14 дней)
                    </Button>
                    <Button variant="outline" className="justify-start">
                      Срочно (3-7 дней) +50%
                    </Button>
                    <Button variant="outline" className="justify-start">
                      Экспресс (1-3 дня) +100%
                    </Button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    onClick={() => {
                      console.log('Creating expertise request');
                      setShowRequestModal(false);
                    }}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Создать запрос
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
