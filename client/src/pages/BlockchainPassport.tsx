import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  CheckCircle,
  AlertCircle,
  QrCode,
  Download,
  Upload,
  Search,
  FileText,
  History,
  Lock,
  Unlock,
  Share2,
  Eye,
  Calendar,
  User,
  MapPin,
  DollarSign,
  Hash,
  Link as LinkIcon,
  Clock,
  Award,
  TrendingUp,
  AlertTriangle,
  Info,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLocation } from 'wouter';

interface ArtworkPassport {
  id: number;
  artworkId: number;
  artworkTitle: string;
  artist: string;
  artworkImage: string;
  blockchainHash: string;
  issueDate: string;
  status: 'verified' | 'pending' | 'rejected';
  network: 'Ethereum' | 'Polygon' | 'Solana';
  transactionHash: string;
  certificateUrl: string;
  qrCode: string;
  provenance: ProvenanceRecord[];
  authenticity: {
    verified: boolean;
    expert: string;
    date: string;
    report: string;
  };
}

interface ProvenanceRecord {
  id: number;
  type: 'creation' | 'sale' | 'exhibition' | 'restoration' | 'verification';
  date: string;
  location: string;
  from?: string;
  to?: string;
  price?: number;
  details: string;
  verified: boolean;
}

interface VerificationRequest {
  artworkId: number;
  title: string;
  artist: string;
  year: number;
  technique: string;
  dimensions: string;
  description: string;
  images: string[];
  provenanceDocuments: string[];
}

export default function BlockchainPassport() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPassport, setSelectedPassport] = useState<ArtworkPassport | null>(null);

  // Mock data
  const passports: ArtworkPassport[] = [
    {
      id: 1,
      artworkId: 101,
      artworkTitle: 'Абстракция №5',
      artist: 'Мария Петрова',
      artworkImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
      blockchainHash: '0x7f3b2c1a9e8d4f6b5c2a1d3e4f5b6c7d8e9f0a1b2c3d4e5f',
      issueDate: '2025-01-15',
      status: 'verified',
      network: 'Ethereum',
      transactionHash: '0xabc123def456...',
      certificateUrl: '/certificates/artwork-101.pdf',
      qrCode: '/qr/artwork-101.png',
      provenance: [
        {
          id: 1,
          type: 'creation',
          date: '2024-06-10',
          location: 'Москва, Россия',
          details: 'Создание произведения в студии художника',
          verified: true,
        },
        {
          id: 2,
          type: 'verification',
          date: '2024-07-15',
          location: 'Центр экспертизы АРТ Банк',
          details: 'Экспертиза подлинности, химический анализ материалов',
          verified: true,
        },
        {
          id: 3,
          type: 'sale',
          date: '2024-08-20',
          location: 'Галерея "Современное искусство"',
          from: 'Мария Петрова',
          to: 'Игорь Соколов',
          price: 150000,
          details: 'Первичная продажа через галерею',
          verified: true,
        },
        {
          id: 4,
          type: 'exhibition',
          date: '2024-09-10',
          location: 'Арт-Москва 2024',
          details: 'Участие в выставке современного искусства',
          verified: true,
        },
        {
          id: 5,
          type: 'sale',
          date: '2025-01-15',
          location: 'ART BANK Platform',
          from: 'Игорь Соколов',
          to: 'Текущий владелец',
          price: 195000,
          details: 'Вторичная продажа через платформу',
          verified: true,
        },
      ],
      authenticity: {
        verified: true,
        expert: 'Анна Волкова, искусствовед',
        date: '2024-07-15',
        report: 'Подлинность подтверждена. Химический анализ материалов соответствует заявленному периоду.',
      },
    },
    {
      id: 2,
      artworkId: 102,
      artworkTitle: 'Городской пейзаж',
      artist: 'Дмитрий Новиков',
      artworkImage: 'https://images.unsplash.com/photo-1577083552431-6e5fd01d3276?w=800',
      blockchainHash: '0x9f8e7d6c5b4a3210fedcba9876543210fedcba98',
      issueDate: '2024-11-20',
      status: 'verified',
      network: 'Polygon',
      transactionHash: '0xdef789ghi012...',
      certificateUrl: '/certificates/artwork-102.pdf',
      qrCode: '/qr/artwork-102.png',
      provenance: [
        {
          id: 1,
          type: 'creation',
          date: '2024-03-15',
          location: 'Санкт-Петербург, Россия',
          details: 'Создание в рамках городской серии',
          verified: true,
        },
        {
          id: 2,
          type: 'sale',
          date: '2024-11-20',
          location: 'ART BANK Platform',
          from: 'Дмитрий Новиков',
          to: 'Текущий владелец',
          price: 120000,
          details: 'Первичная продажа через платформу',
          verified: true,
        },
      ],
      authenticity: {
        verified: true,
        expert: 'Сергей Михайлов, эксперт',
        date: '2024-10-01',
        report: 'Произведение подлинное, авторство подтверждено.',
      },
    },
    {
      id: 3,
      artworkId: 103,
      artworkTitle: 'Абстрактная композиция',
      artist: 'Елена Кузнецова',
      artworkImage: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800',
      blockchainHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
      issueDate: '2025-02-01',
      status: 'pending',
      network: 'Ethereum',
      transactionHash: 'pending...',
      certificateUrl: '',
      qrCode: '',
      provenance: [
        {
          id: 1,
          type: 'creation',
          date: '2025-01-20',
          location: 'Москва, Россия',
          details: 'Создание произведения',
          verified: false,
        },
      ],
      authenticity: {
        verified: false,
        expert: '',
        date: '',
        report: 'Ожидает экспертизы',
      },
    },
  ];

  const stats = {
    totalPassports: 3,
    verified: 2,
    pending: 1,
    rejected: 0,
  };

  const handleViewPassport = (passport: ArtworkPassport) => {
    setSelectedPassport(passport);
    setShowVerifyDialog(true);
  };

  const handleCreatePassport = () => {
    setShowCreateDialog(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-500">Верифицирован</Badge>;
      case 'pending':
        return <Badge variant="secondary">На проверке</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Отклонён</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'creation':
        return <Award className="w-4 h-4 text-blue-500" />;
      case 'sale':
        return <DollarSign className="w-4 h-4 text-green-500" />;
      case 'exhibition':
        return <Eye className="w-4 h-4 text-purple-500" />;
      case 'restoration':
        return <FileText className="w-4 h-4 text-orange-500" />;
      case 'verification':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'creation':
        return 'Создание';
      case 'sale':
        return 'Продажа';
      case 'exhibition':
        return 'Выставка';
      case 'restoration':
        return 'Реставрация';
      case 'verification':
        return 'Верификация';
      default:
        return 'Событие';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <Navigation user={user} onLogout={logout} />

      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            Блокчейн-паспорта
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Цифровые паспорта произведений с неизменяемой историей владения
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="border-2 border-transparent hover:border-blue-500 transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Всего паспортов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.totalPassports}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-transparent hover:border-green-500 transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Верифицировано
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {stats.verified}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-transparent hover:border-yellow-500 transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                На проверке
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.pending}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-transparent hover:border-red-500 transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Отклонено
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                {stats.rejected}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="overview">Мои паспорта</TabsTrigger>
              <TabsTrigger value="search">Поиск</TabsTrigger>
              <TabsTrigger value="create">Создать паспорт</TabsTrigger>
            </TabsList>

            {/* My Passports Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Блокчейн-паспорта моих произведений
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {passports.length} произведений
                  </p>
                </div>
                <Button onClick={handleCreatePassport}>
                  <Upload className="w-4 h-4 mr-2" />
                  Создать паспорт
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {passports.map((passport) => (
                  <Card key={passport.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <img
                          src={passport.artworkImage}
                          alt={passport.artworkTitle}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {passport.artworkTitle}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {passport.artist}
                              </p>
                            </div>
                            {getStatusBadge(passport.status)}
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                Blockchain
                              </p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {passport.network}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                Дата выпуска
                              </p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {new Date(passport.issueDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                История
                              </p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {passport.provenance.length} записей
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                Hash
                              </p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {passport.blockchainHash.substring(0, 10)}...
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewPassport(passport)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Просмотр
                            </Button>
                            {passport.status === 'verified' && (
                              <>
                                <Button size="sm" variant="outline">
                                  <QrCode className="w-4 h-4 mr-2" />
                                  QR-код
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Download className="w-4 h-4 mr-2" />
                                  Сертификат
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Share2 className="w-4 h-4 mr-2" />
                                  Поделиться
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Search Tab */}
            <TabsContent value="search" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Поиск блокчейн-паспорта</CardTitle>
                  <CardDescription>
                    Введите blockchain hash, ID произведения или название для проверки подлинности
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Input
                      placeholder="0x7f3b2c1a9e8d... или ID произведения"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button>
                      <Search className="w-4 h-4 mr-2" />
                      Найти
                    </Button>
                  </div>

                  {searchQuery && (
                    <div className="mt-6 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Паспорт верифицирован
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Произведение подлинное, история владения подтверждена
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Произведение:
                          </span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            Абстракция №5
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Художник:
                          </span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            Мария Петрова
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Network:
                          </span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            Ethereum
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Последняя продажа:
                          </span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            15 января 2025
                          </span>
                        </div>
                      </div>

                      <Button className="w-full mt-4" variant="outline">
                        Посмотреть полную историю
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Public Verification Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Как проверить подлинность
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-blue-600">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Найдите QR-код на произведении
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Отсканируйте QR-код с обратной стороны или сертификата
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-blue-600">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Проверьте blockchain hash
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Введите hash в поиск и проверьте запись в блокчейне
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-blue-600">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Изучите историю владения
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Все сделки и события записаны и не могут быть изменены
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Create Passport Tab */}
            <TabsContent value="create" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Создать блокчейн-паспорт</CardTitle>
                  <CardDescription>
                    Зарегистрируйте произведение в блокчейне и получите цифровой паспорт
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="artwork">Выберите произведение</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите из каталога" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="101">Абстракция №5</SelectItem>
                          <SelectItem value="102">Городской пейзаж</SelectItem>
                          <SelectItem value="103">Морской бриз</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="network">Blockchain Network</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите сеть" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ethereum">Ethereum (надёжность)</SelectItem>
                          <SelectItem value="polygon">Polygon (низкая комиссия)</SelectItem>
                          <SelectItem value="solana">Solana (скорость)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="provenance">История владения</Label>
                      <Textarea
                        id="provenance"
                        placeholder="Опишите известную историю произведения..."
                        rows={4}
                      />
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Стоимость создания паспорта
                      </h4>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Регистрация в блокчейне:</span>
                          <span className="font-semibold">1,500 ₽</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Экспертиза (опционально):</span>
                          <span className="font-semibold">5,000 ₽</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>QR-код и сертификат:</span>
                          <span className="font-semibold">500 ₽</span>
                        </div>
                        <div className="border-t border-gray-300 dark:border-gray-600 my-2"></div>
                        <div className="flex justify-between font-bold">
                          <span>Итого:</span>
                          <span>7,000 ₽</span>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Создать паспорт
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle>Преимущества блокчейн-паспорта</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Защита от подделок
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Невозможно подделать или изменить запись
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <History className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Полная история
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Все сделки и события хранятся вечно
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Рост стоимости
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Паспорт повышает доверие и цену произведения
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Lock className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Залоговый инструмент
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Можно использовать для кредитования
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Passport Details Dialog */}
      <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Детали блокчейн-паспорта</DialogTitle>
            <DialogDescription>
              {selectedPassport?.artworkTitle} - {selectedPassport?.artist}
            </DialogDescription>
          </DialogHeader>

          {selectedPassport && (
            <div className="space-y-6">
              {/* Artwork Info */}
              <div className="flex gap-4">
                <img
                  src={selectedPassport.artworkImage}
                  alt={selectedPassport.artworkTitle}
                  className="w-48 h-48 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedPassport.artworkTitle}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {selectedPassport.artist}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">
                        <span className="font-medium">Blockchain:</span> {selectedPassport.network}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm break-all">
                        <span className="font-medium">Hash:</span> {selectedPassport.blockchainHash}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">
                        <span className="font-medium">Дата выпуска:</span>{' '}
                        {new Date(selectedPassport.issueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Authenticity */}
              {selectedPassport.authenticity.verified && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Подлинность подтверждена
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Эксперт: {selectedPassport.authenticity.expert}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Дата: {new Date(selectedPassport.authenticity.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedPassport.authenticity.report}
                  </p>
                </div>
              )}

              {/* Provenance History */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <History className="w-5 h-5" />
                  История владения
                </h4>

                <div className="space-y-4">
                  {selectedPassport.provenance.map((record) => (
                    <div key={record.id} className="flex gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                      <div className="flex-shrink-0">
                        {getTypeIcon(record.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-semibold text-gray-900 dark:text-white">
                            {getTypeLabel(record.type)}
                          </h5>
                          {record.verified && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {new Date(record.date).toLocaleDateString()} • {record.location}
                        </p>
                        {record.from && record.to && (
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                            {record.from} → {record.to}
                          </p>
                        )}
                        {record.price && (
                          <p className="text-sm font-semibold text-green-600 mb-1">
                            ₽{record.price.toLocaleString()}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {record.details}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVerifyDialog(false)}>
              Закрыть
            </Button>
            <Button>
              <ExternalLink className="w-4 h-4 mr-2" />
              Посмотреть в блокчейне
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
