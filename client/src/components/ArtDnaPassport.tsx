import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  QrCode, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  FileText, 
  ExternalLink,
  Download,
  RefreshCw,
  TrendingUp,
  Award,
  Eye,
  History
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

interface ArtPassport {
  id: string;
  artworkId: string;
  artworkTitle: string;
  artist: string;
  year: number;
  nftTokenId: string;
  blockchainAddress: string;
  qrCode: string;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  valueIncrease: number; // 15-20%
  createdAt: string;
  lastUpdated: string;
  provenance: ProvenanceRecord[];
  expertVerifications: ExpertVerification[];
  marketData: MarketData;
}

interface ProvenanceRecord {
  id: string;
  date: string;
  event: string;
  owner: string;
  location: string;
  verified: boolean;
}

interface ExpertVerification {
  id: string;
  expertName: string;
  organization: string;
  date: string;
  verificationHash: string;
  status: 'approved' | 'pending' | 'rejected';
}

interface MarketData {
  currentValue: number;
  valueWithPassport: number;
  valueIncrease: number;
  lastValuation: string;
  priceHistory: Array<{ date: string; value: number }>;
}

export default function ArtDnaPassport() {
  const [passports, setPassports] = useState<ArtPassport[]>([]);
  const [selectedPassport, setSelectedPassport] = useState<ArtPassport | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock data for demonstration
  useEffect(() => {
    const mockPassports: ArtPassport[] = [
      {
        id: 'passport-001',
        artworkId: 'artwork-123',
        artworkTitle: 'Композиция № 8',
        artist: 'Василий Кандинский',
        year: 1923,
        nftTokenId: '0x1234...5678',
        blockchainAddress: '0xabcd...ef12',
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        verificationStatus: 'verified',
        valueIncrease: 18.5,
        createdAt: '2026-02-15T10:00:00Z',
        lastUpdated: '2026-03-05T14:30:00Z',
        provenance: [
          { id: 'prov-1', date: '2026-02-15', event: 'Первоначальная регистрация', owner: 'Галерея "Эрмитаж"', location: 'Санкт-Петербург', verified: true },
          { id: 'prov-2', date: '2026-02-20', event: 'Экспертиза', owner: 'Эксперт И.П. Петров', location: 'Москва', verified: true },
          { id: 'prov-3', date: '2026-03-01', event: 'Переход собственности', owner: 'Коллекционер А.И. Смирнов', location: 'Москва', verified: true }
        ],
        expertVerifications: [
          { id: 'exp-1', expertName: 'И.П. Петров', organization: 'Институт искусствознания РАН', date: '2026-02-20', verificationHash: '0xabc...123', status: 'approved' },
          { id: 'exp-2', expertName: 'М.С. Иванова', organization: 'Третьяковская галерея', date: '2026-02-25', verificationHash: '0xdef...456', status: 'approved' }
        ],
        marketData: {
          currentValue: 15000000,
          valueWithPassport: 17775000,
          valueIncrease: 18.5,
          lastValuation: '2026-03-05',
          priceHistory: [
            { date: '2026-02-15', value: 15000000 },
            { date: '2026-02-20', value: 15750000 },
            { date: '2026-03-01', value: 16500000 },
            { date: '2026-03-05', value: 17775000 }
          ]
        }
      },
      {
        id: 'passport-002',
        artworkId: 'artwork-124',
        artworkTitle: 'Черный квадрат',
        artist: 'Казимир Малевич',
        year: 1915,
        nftTokenId: '0x2345...6789',
        blockchainAddress: '0xbcde...f123',
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        verificationStatus: 'verified',
        valueIncrease: 20.0,
        createdAt: '2026-02-10T09:00:00Z',
        lastUpdated: '2026-03-04T16:00:00Z',
        provenance: [
          { id: 'prov-4', date: '2026-02-10', event: 'Первоначальная регистрация', owner: 'Русский музей', location: 'Санкт-Петербург', verified: true },
          { id: 'prov-5', date: '2026-02-18', event: 'Экспертиза', owner: 'Эксперт К.Л. Васильев', location: 'Санкт-Петербург', verified: true }
        ],
        expertVerifications: [
          { id: 'exp-3', expertName: 'К.Л. Васильев', organization: 'Русский музей', date: '2026-02-18', verificationHash: '0xghi...789', status: 'approved' }
        ],
        marketData: {
          currentValue: 25000000,
          valueWithPassport: 30000000,
          valueIncrease: 20.0,
          lastValuation: '2026-03-04',
          priceHistory: [
            { date: '2026-02-10', value: 25000000 },
            { date: '2026-02-18', value: 26500000 },
            { date: '2026-02-25', value: 28000000 },
            { date: '2026-03-04', value: 30000000 }
          ]
        }
      },
      {
        id: 'passport-003',
        artworkId: 'artwork-125',
        artworkTitle: 'Девочка на шаре',
        artist: 'Пабло Пикассо',
        year: 1905,
        nftTokenId: '0x3456...7890',
        blockchainAddress: '0xcdef...2345',
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        verificationStatus: 'pending',
        valueIncrease: 0,
        createdAt: '2026-03-03T11:00:00Z',
        lastUpdated: '2026-03-05T10:00:00Z',
        provenance: [
          { id: 'prov-6', date: '2026-03-03', event: 'Первоначальная регистрация', owner: 'ГМИИ им. Пушкина', location: 'Москва', verified: false }
        ],
        expertVerifications: [
          { id: 'exp-4', expertName: 'Е.А. Сидорова', organization: 'ГМИИ им. Пушкина', date: '2026-03-05', verificationHash: '0xjkl...012', status: 'pending' }
        ],
        marketData: {
          currentValue: 45000000,
          valueWithPassport: 45000000,
          valueIncrease: 0,
          lastValuation: '2026-03-03',
          priceHistory: [
            { date: '2026-03-03', value: 45000000 }
          ]
        }
      }
    ];
    setPassports(mockPassports);
    setSelectedPassport(mockPassports[0]);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800 border-green-300"><CheckCircle className="w-3 h-3 mr-1" />Верифицирован</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300"><Clock className="w-3 h-3 mr-1" />В обработке</Badge>;
      case 'unverified':
        return <Badge className="bg-red-100 text-red-800 border-red-300"><AlertTriangle className="w-3 h-3 mr-1" />Не верифицирован</Badge>;
      default:
        return null;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleGeneratePassport = () => {
    setLoading(true);
    setTimeout(() => {
      toast({
        title: "✅ Паспорт создан",
        description: "Art-DNA паспорт успешно сгенерирован и записан в blockchain"
      });
      setLoading(false);
    }, 2000);
  };

  const handleDownloadQR = (passport: ArtPassport) => {
    toast({
      title: "📥 QR-код загружен",
      description: `QR-код для "${passport.artworkTitle}" сохранён`
    });
  };

  const handleVerifyPassport = (passportId: string) => {
    setLoading(true);
    setTimeout(() => {
      toast({
        title: "🔍 Верификация запущена",
        description: "Паспорт отправлен на экспертную проверку"
      });
      setLoading(false);
    }, 1500);
  };

  const filteredPassports = passports.filter(p => {
    const matchesSearch = p.artworkTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || p.verificationStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" />
            Art-DNA Digital Passport
          </h2>
          <p className="text-gray-500 mt-1">Цифровые паспорта произведений искусства с blockchain верификацией</p>
        </div>
        <Button onClick={handleGeneratePassport} disabled={loading}>
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Генерация...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Создать паспорт
            </>
          )}
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Всего паспортов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{passports.length}</div>
            <p className="text-xs text-gray-500 mt-1">+2 за последний месяц</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Верифицировано</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {passports.filter(p => p.verificationStatus === 'verified').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {Math.round((passports.filter(p => p.verificationStatus === 'verified').length / passports.length) * 100)}% от общего числа
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Средний прирост стоимости</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 flex items-center gap-1">
              <TrendingUp className="w-5 h-5" />
              {(passports.reduce((sum, p) => sum + p.valueIncrease, 0) / passports.length).toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500 mt-1">15-20% целевой диапазон</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Общий прирост</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(
                passports.reduce((sum, p) => sum + (p.marketData.valueWithPassport - p.marketData.currentValue), 0)
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">За счёт Art-DNA</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Поиск по названию или художнику..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
              >
                Все
              </Button>
              <Button
                variant={filterStatus === 'verified' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('verified')}
              >
                Верифицированные
              </Button>
              <Button
                variant={filterStatus === 'pending' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('pending')}
              >
                В обработке
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Passport List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Список паспортов</h3>
          <AnimatePresence>
            {filteredPassports.map((passport) => (
              <motion.div
                key={passport.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedPassport?.id === passport.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedPassport(passport)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">{passport.artworkTitle}</CardTitle>
                        <CardDescription className="text-sm">
                          {passport.artist}, {passport.year}
                        </CardDescription>
                      </div>
                      {getStatusBadge(passport.verificationStatus)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Прирост стоимости:</span>
                      <span className="font-semibold text-green-600">
                        {passport.valueIncrease > 0 ? `+${passport.valueIncrease}%` : 'Ожидается'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Обновлено:</span>
                      <span className="text-gray-700">{formatDate(passport.lastUpdated)}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Passport Details */}
        {selectedPassport && (
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{selectedPassport.artworkTitle}</CardTitle>
                    <CardDescription className="text-base mt-1">
                      {selectedPassport.artist}, {selectedPassport.year}
                    </CardDescription>
                  </div>
                  {getStatusBadge(selectedPassport.verificationStatus)}
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">
                      <Eye className="w-4 h-4 mr-1" />
                      Обзор
                    </TabsTrigger>
                    <TabsTrigger value="provenance">
                      <History className="w-4 h-4 mr-1" />
                      Провенанс
                    </TabsTrigger>
                    <TabsTrigger value="verification">
                      <Award className="w-4 h-4 mr-1" />
                      Экспертиза
                    </TabsTrigger>
                    <TabsTrigger value="blockchain">
                      <Shield className="w-4 h-4 mr-1" />
                      Blockchain
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6 mt-6">
                    {/* QR Code and NFT Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
                        <QrCode className="w-32 h-32 text-gray-400 mb-4" />
                        <p className="text-sm text-gray-500 mb-2">QR-код для верификации</p>
                        <Button variant="outline" size="sm" onClick={() => handleDownloadQR(selectedPassport)}>
                          <Download className="w-4 h-4 mr-1" />
                          Скачать QR
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">NFT Token ID</label>
                          <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1">{selectedPassport.nftTokenId}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Blockchain Address</label>
                          <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1">{selectedPassport.blockchainAddress}</p>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Просмотреть в Polygonscan
                        </Button>
                      </div>
                    </div>

                    {/* Market Data */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold">Оценка и прирост стоимости</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Текущая стоимость</p>
                          <p className="text-xl font-bold text-gray-900">
                            {formatCurrency(selectedPassport.marketData.currentValue)}
                          </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">С Art-DNA паспортом</p>
                          <p className="text-xl font-bold text-green-600">
                            {formatCurrency(selectedPassport.marketData.valueWithPassport)}
                          </p>
                        </div>
                        <div className="bg-emerald-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Прирост стоимости</p>
                          <p className="text-xl font-bold text-emerald-600 flex items-center gap-1">
                            <TrendingUp className="w-5 h-5" />
                            +{selectedPassport.marketData.valueIncrease.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="provenance" className="space-y-4 mt-6">
                    <h4 className="text-lg font-semibold">История владения</h4>
                    <div className="space-y-3">
                      {selectedPassport.provenance.map((record) => (
                        <div key={record.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            record.verified ? 'bg-green-100' : 'bg-gray-200'
                          }`}>
                            {record.verified ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <Clock className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h5 className="font-semibold text-gray-900">{record.event}</h5>
                                <p className="text-sm text-gray-600 mt-1">{record.owner}</p>
                                <p className="text-xs text-gray-500 mt-1">{record.location} • {formatDate(record.date)}</p>
                              </div>
                              {record.verified && (
                                <Badge className="bg-green-100 text-green-800 border-green-300">
                                  Верифицирован
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="verification" className="space-y-4 mt-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold">Экспертные заключения</h4>
                      <Button 
                        size="sm" 
                        onClick={() => handleVerifyPassport(selectedPassport.id)}
                        disabled={loading}
                      >
                        <Award className="w-4 h-4 mr-1" />
                        Запросить экспертизу
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {selectedPassport.expertVerifications.map((verification) => (
                        <div key={verification.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h5 className="font-semibold text-gray-900">{verification.expertName}</h5>
                              <p className="text-sm text-gray-600">{verification.organization}</p>
                            </div>
                            <Badge className={
                              verification.status === 'approved' ? 'bg-green-100 text-green-800 border-green-300' :
                              verification.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                              'bg-red-100 text-red-800 border-red-300'
                            }>
                              {verification.status === 'approved' ? 'Одобрено' :
                               verification.status === 'pending' ? 'В обработке' : 'Отклонено'}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500 space-y-1">
                            <p>Дата: {formatDate(verification.date)}</p>
                            <p className="font-mono">Hash: {verification.verificationHash}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="blockchain" className="space-y-4 mt-6">
                    <h4 className="text-lg font-semibold">Blockchain информация</h4>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-5 h-5 text-blue-600" />
                          <h5 className="font-semibold text-gray-900">Polygon Blockchain</h5>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Данный Art-DNA паспорт записан в блокчейн Polygon (Layer 2) для обеспечения 
                          неизменности и прозрачности данных о произведении искусства.
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Сеть:</span>
                            <span className="font-medium">Polygon Mainnet</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Token Standard:</span>
                            <span className="font-medium">ERC-721 (NFT)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Contract Address:</span>
                            <span className="font-mono text-xs">{selectedPassport.blockchainAddress}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Token ID:</span>
                            <span className="font-mono text-xs">{selectedPassport.nftTokenId}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <h5 className="font-semibold text-gray-900">Преимущества blockchain</h5>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span>Неизменность записей — данные нельзя подделать</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span>Прозрачность — вся история доступна для проверки</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span>Децентрализация — никто не контролирует данные единолично</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span>Низкие комиссии — Polygon значительно дешевле Ethereum</span>
                          </li>
                        </ul>
                      </div>

                      <Button variant="outline" className="w-full">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Просмотреть транзакции в Polygonscan
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
