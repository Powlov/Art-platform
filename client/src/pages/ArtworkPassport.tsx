import React, { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import {
  ArrowLeft,
  Heart,
  Share2,
  Download,
  QrCode,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  Building2,
  Shield,
  ShieldCheck,
  FileText,
  DollarSign,
  Calendar,
  MapPin,
  Award,
  Eye,
  MessageSquare,
  Wallet,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import { LoadingState } from '@/components/LoadingState';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Types
interface Artwork {
  id: number;
  title: string;
  artist: {
    id: number;
    name: string;
    nationality: string;
    bio: string;
  };
  year: number;
  medium: string;
  dimensions: string;
  edition: string;
  description: string;
  currentPrice: number;
  initialPrice: number;
  estimatedValue: number;
  gallery: {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  images: string[];
  blockchain: {
    verified: boolean;
    tokenId: string;
    network: string;
    contractAddress: string;
    ipfsHash: string;
  };
  provenance: ProvenanceEntry[];
  exhibitions: Exhibition[];
  condition: ConditionReport;
  financials: FinancialData;
  certificates: Certificate[];
}

interface ProvenanceEntry {
  id: number;
  date: string;
  type: 'acquisition' | 'sale' | 'exhibition' | 'transfer';
  owner?: string;
  location: string;
  price?: number;
  notes: string;
  verified: boolean;
}

interface Exhibition {
  id: number;
  name: string;
  venue: string;
  city: string;
  startDate: string;
  endDate: string;
  curator: string;
  type: 'solo' | 'group' | 'biennale' | 'fair';
}

interface ConditionReport {
  date: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  notes: string;
  photos: string[];
  inspector: string;
}

interface FinancialData {
  priceHistory: { date: string; price: number }[];
  roi: number;
  appreciation: number;
  marketComparison: number;
  liquidityScore: number;
  investmentGrade: 'A+' | 'A' | 'B+' | 'B' | 'C';
}

interface Certificate {
  id: number;
  type: 'authenticity' | 'appraisal' | 'condition' | 'export';
  issuer: string;
  date: string;
  fileUrl: string;
}

const ArtworkPassport: React.FC = () => {
  const [, params] = useRoute('/artwork-passport/:id');
  const [, navigate] = useLocation();
  const artworkId = params?.id ? parseInt(params.id) : null;
  
  // Query artwork data from API
  const { data: artworkData, isLoading, error } = trpc.artwork.getById.useQuery(
    { id: artworkId || 0 },
    { enabled: !!artworkId }
  );
  
  // Query passport data from API
  const { data: passportData } = trpc.passport.getByArtwork.useQuery(
    { artworkId: artworkId || 0 },
    { enabled: !!artworkId }
  );
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  // Transform API data to component format
  const artwork: Artwork | null = artworkData
    ? {
        id: artworkData.id,
        title: artworkData.title,
        artist: {
          id: artworkData.artistId || 0,
          name: 'Художник',
          nationality: 'Россия',
          bio: 'Информация о художнике',
        },
        year: artworkData.year || new Date().getFullYear(),
        medium: artworkData.technique || 'Холст, масло',
        dimensions: artworkData.dimensions || '–',
        edition: '1/1 (Оригинал)',
        description: artworkData.description || 'Описание отсутствует',
        currentPrice: parseFloat(artworkData.currentPrice || '0'),
        initialPrice: parseFloat(artworkData.basePrice || '0'),
        estimatedValue: parseFloat(artworkData.basePrice || '0') * 1.2,
        gallery: {
          id: artworkData.galleryId || 0,
          name: 'Галерея',
          address: 'Адрес галереи',
          phone: '+7 (000) 000-00-00',
          email: 'gallery@example.com',
        },
        images: artworkData.imageUrl ? [artworkData.imageUrl] : [],
        blockchain: passportData ? {
          verified: passportData.blockchainVerified || false,
          tokenId: passportData.tokenId || '–',
          network: passportData.blockchainNetwork || 'Ethereum',
          contractAddress: passportData.contractAddress || '–',
          ipfsHash: passportData.ipfsHash || '–',
        } : {
          verified: artworkData.blockchainVerified || false,
          tokenId: artworkData.blockchainHash || '–',
          network: 'Ethereum',
          contractAddress: artworkData.blockchainHash || '–',
          ipfsHash: artworkData.ipfsHash || '–',
        },
        provenance: [],
        exhibitions: [],
        condition: {
          date: new Date().toISOString().split('T')[0],
          condition: 'excellent',
          notes: 'Произведение в отличном состоянии',
          photos: [],
          inspector: 'Эксперт',
        },
        financials: {
          priceHistory: [{ date: '2024-01-01', price: parseFloat(artworkData.basePrice || '0') }],
          roi: 15.5,
          marketTrend: 'up',
          lastUpdate: new Date().toISOString().split('T')[0],
        },
        certificates: [],
      }
    : null;

  if (isLoading) {
    return <LoadingState fullScreen message="Загружаем паспорт произведения..." />;
  }

  if (error || !artwork || !artworkId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <AlertTriangle size={64} className="mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Произведение не найдено</h1>
          <p className="text-gray-600 mb-6">
            {error?.message || 'Не удалось загрузить данные произведения'}
          </p>
          <Button onClick={() => navigate('/marketplace')}>
            Вернуться к маркетплейсу
          </Button>
        </div>
      </div>
    );
  }

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Удалено из избранного' : 'Добавлено в избранное');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Ссылка скопирована в буфер обмена');
  };

  const handleDownloadQR = () => {
    if (!passportData || !passportData.qrCodeData) {
      toast.error('QR-код недоступен');
      return;
    }
    
    // Create download link
    const link = document.createElement('a');
    link.href = passportData.qrCodeData;
    link.download = `artwork-${artworkId}-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('QR-код загружен');
  };

  const getConditionColor = (condition: string) => {
    const colors = {
      excellent: 'text-green-500',
      good: 'text-blue-500',
      fair: 'text-yellow-500',
      poor: 'text-red-500',
    };
    return colors[condition as keyof typeof colors] || 'text-gray-500';
  };

  const getConditionText = (condition: string) => {
    const texts = {
      excellent: 'Отличное',
      good: 'Хорошее',
      fair: 'Удовлетворительное',
      poor: 'Плохое',
    };
    return texts[condition as keyof typeof texts] || condition;
  };

  const getGradeColor = (grade: string) => {
    const colors = {
      'A+': 'bg-green-500',
      A: 'bg-blue-500',
      'B+': 'bg-yellow-500',
      B: 'bg-orange-500',
      C: 'bg-red-500',
    };
    return colors[grade as keyof typeof colors] || 'bg-gray-500';
  };

  if (isLoading) {
    return <LoadingState message="Загрузка цифрового паспорта произведения..." />;
  }

  if (!artwork) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Произведение не найдено
            </h1>
            <Button onClick={() => navigate('/marketplace')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Вернуться к каталогу
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const priceChange = artwork.currentPrice - artwork.initialPrice;
  const priceChangePercent = ((priceChange / artwork.initialPrice) * 100).toFixed(1);
  const isPriceUp = priceChange >= 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-between"
        >
          <Button variant="ghost" onClick={() => navigate('/marketplace')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к каталогу
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleFavorite}
              className={isFavorite ? 'text-red-500' : ''}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
            </Button>
            <Dialog open={showQR} onOpenChange={setShowQR}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <QrCode className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>QR-код произведения</DialogTitle>
                  <DialogDescription>
                    Отсканируйте для быстрого доступа к цифровому паспорту
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4 py-4">
                  {passportData && passportData.qrCodeData ? (
                    <div className="w-64 h-64 bg-white rounded-lg flex items-center justify-center border-2 border-gray-200 p-2">
                      <img 
                        src={passportData.qrCodeData} 
                        alt="QR Code" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-64 h-64 bg-white rounded-lg flex items-center justify-center border-2 border-gray-200">
                      <QrCode className="w-48 h-48 text-gray-400" />
                    </div>
                  )}
                  <div className="text-sm text-gray-600 dark:text-gray-400 text-center space-y-1">
                    {passportData && (
                      <>
                        <p className="font-mono text-xs">
                          Certificate: {passportData.certificateId}
                        </p>
                        <p className="font-mono text-xs">
                          Token ID: {passportData.tokenId || artwork.blockchain.tokenId}
                        </p>
                        {passportData.blockchainVerified && (
                          <Badge className="bg-green-500 text-white mt-2">
                            <ShieldCheck className="w-3 h-3 mr-1" />
                            Blockchain Verified
                          </Badge>
                        )}
                      </>
                    )}
                    {!passportData && (
                      <p>Token ID: {artwork.blockchain.tokenId}</p>
                    )}
                  </div>
                  <Button onClick={handleDownloadQR} className="w-full" disabled={!passportData}>
                    <Download className="w-4 h-4 mr-2" />
                    Скачать QR-код
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {/* Main Image */}
                <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-800">
                  <img
                    src={artwork.images[selectedImage]}
                    alt={artwork.title}
                    className="w-full h-full object-contain"
                  />
                  {artwork.blockchain.verified && (
                    <Badge className="absolute top-4 right-4 bg-green-500">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Blockchain Verified
                    </Badge>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {artwork.images.length > 1 && (
                  <div className="flex gap-2 p-4 bg-white dark:bg-gray-800">
                    {artwork.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === index
                            ? 'border-blue-500 scale-105'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${artwork.title} - view ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <Eye className="w-5 h-5 mx-auto mb-2 text-gray-500" />
                  <p className="text-2xl font-bold">1,234</p>
                  <p className="text-sm text-gray-500">Просмотров</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Heart className="w-5 h-5 mx-auto mb-2 text-gray-500" />
                  <p className="text-2xl font-bold">89</p>
                  <p className="text-sm text-gray-500">В избранном</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Share2 className="w-5 h-5 mx-auto mb-2 text-gray-500" />
                  <p className="text-2xl font-bold">34</p>
                  <p className="text-sm text-gray-500">Поделились</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Right Column - Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Title & Basic Info */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {artwork.title}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    {artwork.artist.name}, {artwork.year}
                  </p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Техника</p>
                    <p className="font-medium">{artwork.medium}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Размер</p>
                    <p className="font-medium">{artwork.dimensions}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Тираж</p>
                    <p className="font-medium">{artwork.edition}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Состояние</p>
                    <p className={`font-medium ${getConditionColor(artwork.condition.condition)}`}>
                      {getConditionText(artwork.condition.condition)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price & Investment */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Текущая цена</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {artwork.currentPrice.toLocaleString('ru-RU')} ₽
                    </p>
                  </div>
                  <div
                    className={`flex items-center gap-1 ${
                      isPriceUp ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {isPriceUp ? (
                      <TrendingUp className="w-5 h-5" />
                    ) : (
                      <TrendingDown className="w-5 h-5" />
                    )}
                    <span className="text-lg font-semibold">
                      {isPriceUp ? '+' : ''}
                      {priceChangePercent}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Начальная цена</p>
                    <p className="font-semibold">{artwork.initialPrice.toLocaleString('ru-RU')} ₽</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Оценочная стоимость</p>
                    <p className="font-semibold">
                      {artwork.estimatedValue.toLocaleString('ru-RU')} ₽
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={`${getGradeColor(artwork.financials.investmentGrade)} text-white`}>
                    Инвестиционный рейтинг: {artwork.financials.investmentGrade}
                  </Badge>
                  <Badge variant="outline">
                    <Sparkles className="w-3 h-3 mr-1" />
                    ROI: +{artwork.financials.roi}%
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" size="lg">
                    <Wallet className="w-4 h-4 mr-2" />
                    Купить сейчас
                  </Button>
                  <Button variant="outline" className="flex-1" size="lg">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Сделать предложение
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Gallery Contact */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {artwork.gallery.name}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {artwork.gallery.address}
                      </p>
                      <p>{artwork.gallery.phone}</p>
                      <p>{artwork.gallery.email}</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Связаться с галереей
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Detailed Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="overview">Обзор</TabsTrigger>
              <TabsTrigger value="blockchain">Блокчейн</TabsTrigger>
              <TabsTrigger value="provenance">Provenance</TabsTrigger>
              <TabsTrigger value="financials">Финансы</TabsTrigger>
              <TabsTrigger value="exhibitions">Выставки</TabsTrigger>
              <TabsTrigger value="condition">Состояние</TabsTrigger>
              <TabsTrigger value="certificates">Сертификаты</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Описание произведения
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">О произведении</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {artwork.description}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-3">О художнике</h3>
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <Users className="w-8 h-8 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{artwork.artist.name}</h4>
                        <p className="text-sm text-gray-500 mb-2">{artwork.artist.nationality}</p>
                        <p className="text-gray-600 dark:text-gray-400">{artwork.artist.bio}</p>
                        <Button variant="link" className="px-0 mt-2">
                          Подробнее о художнике
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Blockchain Tab */}
            <TabsContent value="blockchain">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Blockchain Паспорт
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {artwork.blockchain.verified ? (
                    <>
                      <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                        <div>
                          <p className="font-semibold text-green-900 dark:text-green-100">
                            Произведение верифицировано
                          </p>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            Подлинность подтверждена в блокчейне
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                          <p className="text-sm text-gray-500 mb-2">Token ID</p>
                          <p className="font-mono text-sm break-all">{artwork.blockchain.tokenId}</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                          <p className="text-sm text-gray-500 mb-2">Сеть</p>
                          <p className="font-semibold">{artwork.blockchain.network}</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg md:col-span-2">
                          <p className="text-sm text-gray-500 mb-2">Contract Address</p>
                          <p className="font-mono text-sm break-all">
                            {artwork.blockchain.contractAddress}
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg md:col-span-2">
                          <p className="text-sm text-gray-500 mb-2">IPFS Hash</p>
                          <p className="font-mono text-sm break-all">{artwork.blockchain.ipfsHash}</p>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Посмотреть в Etherscan
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <AlertTriangle className="w-6 h-6 text-yellow-500" />
                      <div>
                        <p className="font-semibold text-yellow-900 dark:text-yellow-100">
                          Ожидает верификации
                        </p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          Процесс записи в блокчейн может занять до 24 часов
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Provenance Tab */}
            <TabsContent value="provenance">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    История владения (Provenance)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {artwork.provenance.map((entry, index) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative pl-8 pb-4 border-l-2 border-gray-200 dark:border-gray-700 last:border-l-0 last:pb-0"
                      >
                        <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-blue-500 border-2 border-white dark:border-gray-900" />

                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge
                                variant={
                                  entry.type === 'acquisition'
                                    ? 'default'
                                    : entry.type === 'sale'
                                      ? 'destructive'
                                      : 'secondary'
                                }
                              >
                                {entry.type === 'acquisition'
                                  ? 'Приобретение'
                                  : entry.type === 'sale'
                                    ? 'Продажа'
                                    : entry.type === 'exhibition'
                                      ? 'Выставка'
                                      : 'Передача'}
                              </Badge>
                              {entry.verified && (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              {new Date(entry.date).toLocaleDateString('ru-RU', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                          {entry.price && (
                            <p className="font-semibold whitespace-nowrap">
                              {entry.price.toLocaleString('ru-RU')} ₽
                            </p>
                          )}
                        </div>

                        {entry.owner && (
                          <p className="font-medium text-gray-900 dark:text-white mb-1">
                            {entry.owner}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <MapPin className="w-3 h-3 inline mr-1" />
                          {entry.location}
                        </p>
                        <p className="text-sm text-gray-500">{entry.notes}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Financials Tab */}
            <TabsContent value="financials">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Финансовые данные
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">ROI</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        +{artwork.financials.roi}%
                      </p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Прирост</p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        +{artwork.financials.appreciation}%
                      </p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ликвидность</p>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {artwork.financials.liquidityScore}/100
                      </p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">vs Рынок</p>
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {artwork.financials.marketComparison}%
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Price History */}
                  <div>
                    <h3 className="font-semibold mb-4">История цен</h3>
                    <div className="space-y-3">
                      {artwork.financials.priceHistory.map((entry, index) => {
                        const prevPrice =
                          index > 0 ? artwork.financials.priceHistory[index - 1].price : entry.price;
                        const change = entry.price - prevPrice;
                        const changePercent = prevPrice ? ((change / prevPrice) * 100).toFixed(1) : '0';
                        const isUp = change >= 0;

                        return (
                          <div
                            key={entry.date}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="font-medium">{entry.price.toLocaleString('ru-RU')} ₽</p>
                                <p className="text-sm text-gray-500">
                                  {new Date(entry.date).toLocaleDateString('ru-RU', {
                                    year: 'numeric',
                                    month: 'short',
                                  })}
                                </p>
                              </div>
                            </div>
                            {index > 0 && (
                              <div
                                className={`flex items-center gap-1 ${
                                  isUp ? 'text-green-500' : 'text-red-500'
                                }`}
                              >
                                {isUp ? (
                                  <TrendingUp className="w-4 h-4" />
                                ) : (
                                  <TrendingDown className="w-4 h-4" />
                                )}
                                <span className="text-sm font-medium">
                                  {isUp ? '+' : ''}
                                  {changePercent}%
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                          Инвестиционный потенциал
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Произведение показывает стабильный рост стоимости и имеет высокий
                          инвестиционный рейтинг {artwork.financials.investmentGrade}. Ликвидность выше
                          среднего ({artwork.financials.liquidityScore}/100).
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Exhibitions Tab */}
            <TabsContent value="exhibitions">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    История выставок
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {artwork.exhibitions.map((exhibition, index) => (
                      <motion.div
                        key={exhibition.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                              {exhibition.name}
                            </h3>
                            <Badge
                              variant={
                                exhibition.type === 'solo'
                                  ? 'default'
                                  : exhibition.type === 'biennale'
                                    ? 'destructive'
                                    : 'secondary'
                              }
                            >
                              {exhibition.type === 'solo'
                                ? 'Персональная'
                                : exhibition.type === 'group'
                                  ? 'Групповая'
                                  : exhibition.type === 'biennale'
                                    ? 'Биеннале'
                                    : 'Ярмарка'}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Building2 className="w-4 h-4" />
                            {exhibition.venue}
                          </p>
                          <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <MapPin className="w-4 h-4" />
                            {exhibition.city}
                          </p>
                          <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            {new Date(exhibition.startDate).toLocaleDateString('ru-RU')} -{' '}
                            {new Date(exhibition.endDate).toLocaleDateString('ru-RU')}
                          </p>
                          <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Users className="w-4 h-4" />
                            Куратор: {exhibition.curator}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Condition Tab */}
            <TabsContent value="condition">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Отчет о состоянии
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Общее состояние</p>
                      <p className={`text-xl font-bold ${getConditionColor(artwork.condition.condition)}`}>
                        {getConditionText(artwork.condition.condition)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">Дата осмотра</p>
                      <p className="font-medium">
                        {new Date(artwork.condition.date).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-3">Заключение эксперта</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                      {artwork.condition.notes}
                    </p>
                    <p className="text-sm text-gray-500">
                      Эксперт: {artwork.condition.inspector}
                    </p>
                  </div>

                  {artwork.condition.photos.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="font-semibold mb-3">Фотографии состояния</h3>
                        <div className="grid grid-cols-3 gap-3">
                          {artwork.condition.photos.map((photo, index) => (
                            <div
                              key={index}
                              className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg"
                            >
                              <img
                                src={photo}
                                alt={`Condition photo ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                          Рекомендации по уходу
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Произведение требует стандартных условий хранения: температура 18-22°C,
                          влажность 50-60%, защита от прямых солнечных лучей. Рекомендуется
                          профессиональная чистка раз в 2-3 года.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Certificates Tab */}
            <TabsContent value="certificates">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Сертификаты и документы
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {artwork.certificates.map((cert, index) => (
                      <motion.div
                        key={cert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-500" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white mb-1">
                              {cert.type === 'authenticity'
                                ? 'Сертификат подлинности'
                                : cert.type === 'appraisal'
                                  ? 'Оценочный акт'
                                  : cert.type === 'condition'
                                    ? 'Отчет о состоянии'
                                    : 'Экспортная лицензия'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {cert.issuer} • {new Date(cert.date).toLocaleDateString('ru-RU')}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-4">
                      Нужна дополнительная документация?
                    </p>
                    <Button variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Запросить документы
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default ArtworkPassport;
