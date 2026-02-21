import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Coins,
  Shield,
  Zap,
  TrendingUp,
  Users,
  Lock,
  Unlock,
  Globe,
  Award,
  CheckCircle,
  AlertCircle,
  Clock,
  DollarSign,
  BarChart3,
  Package,
  Eye,
  Share2,
  Download,
  Upload,
  Wallet,
  Link as LinkIcon,
  QrCode,
  FileText,
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
  Info,
  Target,
  Layers,
  Server,
  Database,
  Radio,
  Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';

interface Token {
  id: number;
  artworkId: number;
  title: string;
  artist: string;
  image: string;
  totalTokens: number;
  availableTokens: number;
  pricePerToken: number;
  minPurchase: number;
  blockchain: 'Ethereum' | 'Polygon' | 'Solana';
  status: 'active' | 'sold_out' | 'pending' | 'upcoming';
  roi: number;
  holders: number;
  createdAt: string;
  marketCap: number;
}

interface UserPortfolio {
  totalInvested: number;
  totalValue: number;
  totalROI: number;
  tokensOwned: number;
  artworksCount: number;
}

const TokenizationPlatform: React.FC = () => {
  const [activeTab, setActiveTab] = useState('marketplace');
  const [selectedBlockchain, setSelectedBlockchain] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [userPortfolio] = useState<UserPortfolio>({
    totalInvested: 2500000,
    totalValue: 3125000,
    totalROI: 25.0,
    tokensOwned: 1250,
    artworksCount: 8,
  });

  const tokens: Token[] = [
    {
      id: 1,
      artworkId: 101,
      title: 'Абстрактная композиция №7',
      artist: 'Василий Кандинский',
      image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=400',
      totalTokens: 10000,
      availableTokens: 2450,
      pricePerToken: 5000,
      minPurchase: 10,
      blockchain: 'Ethereum',
      status: 'active',
      roi: 18.5,
      holders: 347,
      createdAt: '2026-01-15',
      marketCap: 50000000,
    },
    {
      id: 2,
      artworkId: 102,
      title: 'Городской пейзаж',
      artist: 'Марк Шагал',
      image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=400',
      totalTokens: 5000,
      availableTokens: 0,
      pricePerToken: 12000,
      minPurchase: 5,
      blockchain: 'Polygon',
      status: 'sold_out',
      roi: 32.4,
      holders: 189,
      createdAt: '2026-01-10',
      marketCap: 60000000,
    },
    {
      id: 3,
      artworkId: 103,
      title: 'Натюрморт с фруктами',
      artist: 'Казимир Малевич',
      image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400',
      totalTokens: 8000,
      availableTokens: 5620,
      pricePerToken: 8000,
      minPurchase: 10,
      blockchain: 'Ethereum',
      status: 'active',
      roi: 12.8,
      holders: 234,
      createdAt: '2026-02-01',
      marketCap: 64000000,
    },
    {
      id: 4,
      artworkId: 104,
      title: 'Современная скульптура',
      artist: 'Анна Петрова',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400',
      totalTokens: 15000,
      availableTokens: 15000,
      pricePerToken: 3000,
      minPurchase: 20,
      blockchain: 'Solana',
      status: 'upcoming',
      roi: 0,
      holders: 0,
      createdAt: '2026-02-25',
      marketCap: 45000000,
    },
  ];

  const stats = [
    {
      label: 'Общая капитализация',
      value: '219М ₽',
      change: '+24.5%',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
    },
    {
      label: 'Токенизировано работ',
      value: '156',
      change: '+12',
      icon: Package,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Активных инвесторов',
      value: '12,450',
      change: '+1,234',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Средняя доходность',
      value: '21.3%',
      change: '+3.2%',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
    },
  ];

  const blockchains = [
    { id: 'all', label: 'Все сети', icon: Globe },
    { id: 'Ethereum', label: 'Ethereum', icon: Layers },
    { id: 'Polygon', label: 'Polygon', icon: Server },
    { id: 'Solana', label: 'Solana', icon: Zap },
  ];

  const benefits = [
    {
      icon: Coins,
      title: 'Фракционное владение',
      description: 'Инвестируйте с минимальной суммы от 50,000 ₽',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Shield,
      title: 'Блокчейн-безопасность',
      description: 'Права собственности защищены смарт-контрактами',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: TrendingUp,
      title: 'Ликвидность',
      description: 'Продавайте токены на вторичном рынке в любое время',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Award,
      title: 'Юридическая защита',
      description: 'Полное соответствие российскому законодательству',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const config = {
      active: { label: 'Доступно', class: 'bg-green-100 text-green-700' },
      sold_out: { label: 'Распродано', class: 'bg-red-100 text-red-700' },
      pending: { label: 'Ожидание', class: 'bg-yellow-100 text-yellow-700' },
      upcoming: { label: 'Скоро', class: 'bg-blue-100 text-blue-700' },
    };
    return config[status as keyof typeof config] || config.active;
  };

  const getBlockchainColor = (blockchain: string) => {
    const colors = {
      Ethereum: 'text-blue-600',
      Polygon: 'text-purple-600',
      Solana: 'text-green-600',
    };
    return colors[blockchain as keyof typeof colors] || 'text-gray-600';
  };

  const filteredTokens = tokens.filter(token => {
    const matchesBlockchain = selectedBlockchain === 'all' || token.blockchain === selectedBlockchain;
    const matchesSearch = token.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         token.artist.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBlockchain && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <Navigation user={{ id: 1, name: 'User', email: 'user@artbank.ru', role: 'user' }} />
      <Header
        title="Токенизация произведений"
        subtitle="Инвестируйте в искусство через блокчейн-токены"
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
                  <Coins className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Токенизация искусства</h2>
                  <p className="text-purple-100">Владейте долями произведений искусства через NFT-токены</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span>Блокчейн-защита</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Средняя доходность 21.3%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>12,450+ инвесторов</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  <span>Мгновенные транзакции</span>
                </div>
              </div>
            </div>
            <Badge className="bg-white/20 text-white border-0 text-lg px-4 py-2">
              <Activity className="w-4 h-4 mr-2" />
              Пилот
            </Badge>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
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
                    <Badge variant="outline" className="text-green-600">
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* User Portfolio */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Мой портфель токенов
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Инвестировано</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(userPortfolio.totalInvested)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Текущая стоимость</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(userPortfolio.totalValue)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Доходность (ROI)</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-green-600">+{userPortfolio.totalROI}%</p>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Токенов в портфеле</p>
                <p className="text-2xl font-bold text-gray-900">{userPortfolio.tokensOwned.toLocaleString('ru-RU')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Произведений</p>
                <p className="text-2xl font-bold text-gray-900">{userPortfolio.artworksCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="marketplace">
              <Package className="w-4 h-4 mr-2" />
              Маркетплейс
            </TabsTrigger>
            <TabsTrigger value="my-tokens">
              <Wallet className="w-4 h-4 mr-2" />
              Мои токены
            </TabsTrigger>
            <TabsTrigger value="benefits">
              <Award className="w-4 h-4 mr-2" />
              Преимущества
            </TabsTrigger>
            <TabsTrigger value="how-it-works">
              <Info className="w-4 h-4 mr-2" />
              Как это работает
            </TabsTrigger>
          </TabsList>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Eye className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Поиск токенов..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {blockchains.map((blockchain) => (
                      <Button
                        key={blockchain.id}
                        variant={selectedBlockchain === blockchain.id ? 'default' : 'outline'}
                        onClick={() => setSelectedBlockchain(blockchain.id)}
                        className={`flex items-center gap-2 whitespace-nowrap ${
                          selectedBlockchain === blockchain.id
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                            : ''
                        }`}
                      >
                        <blockchain.icon className="w-4 h-4" />
                        {blockchain.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tokens Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTokens.map((token, index) => {
                const statusBadge = getStatusBadge(token.status);
                const percentSold = ((token.totalTokens - token.availableTokens) / token.totalTokens) * 100;
                
                return (
                  <motion.div
                    key={token.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="group hover:shadow-xl transition-all h-full flex flex-col">
                      <div className="relative overflow-hidden">
                        <img
                          src={token.image}
                          alt={token.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                          <Badge className={statusBadge.class}>
                            {statusBadge.label}
                          </Badge>
                        </div>
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-white/90 text-gray-900 border-0">
                            <Coins className={`w-3 h-3 mr-1 ${getBlockchainColor(token.blockchain)}`} />
                            {token.blockchain}
                          </Badge>
                        </div>
                        {token.roi > 0 && (
                          <div className="absolute bottom-3 left-3">
                            <Badge className="bg-green-600 text-white border-0">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              +{token.roi}% ROI
                            </Badge>
                          </div>
                        )}
                      </div>

                      <CardContent className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                          {token.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">{token.artist}</p>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Цена токена</span>
                            <span className="font-semibold">{formatCurrency(token.pricePerToken)}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Мин. покупка</span>
                            <span className="font-semibold">{token.minPurchase} токенов</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Капитализация</span>
                            <span className="font-semibold">{formatCurrency(token.marketCap)}</span>
                          </div>
                        </div>

                        {token.status !== 'upcoming' && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-gray-600">Продано</span>
                              <span className="font-semibold text-purple-600">{percentSold.toFixed(1)}%</span>
                            </div>
                            <Progress value={percentSold} className="h-2" />
                            <p className="text-xs text-gray-500 mt-1">
                              {token.availableTokens.toLocaleString('ru-RU')} из {token.totalTokens.toLocaleString('ru-RU')} доступно
                            </p>
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 mt-auto">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {token.holders} владельцев
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(token.createdAt).toLocaleDateString('ru-RU')}
                          </div>
                        </div>

                        <Button
                          className={`w-full ${
                            token.status === 'active'
                              ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                              : token.status === 'upcoming'
                              ? 'bg-gray-400'
                              : 'bg-gray-300'
                          }`}
                          disabled={token.status !== 'active'}
                        >
                          {token.status === 'active' && (
                            <>
                              <Coins className="w-4 h-4 mr-2" />
                              Купить токены
                            </>
                          )}
                          {token.status === 'sold_out' && 'Распродано'}
                          {token.status === 'upcoming' && (
                            <>
                              <Clock className="w-4 h-4 mr-2" />
                              Скоро в продаже
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* My Tokens Tab */}
          <TabsContent value="my-tokens" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Мои токены (8 произведений)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Здесь будут отображаться ваши токены и детальная информация о каждой инвестиции
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Benefits Tab */}
          <TabsContent value="benefits" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Преимущества токенизации
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Инвестируйте в искусство с минимальными барьерами и максимальной безопасностью
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all">
                    <CardContent className="p-6">
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${benefit.color} text-white inline-block mb-4`}>
                        <benefit.icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* How It Works Tab */}
          <TabsContent value="how-it-works" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Как работает токенизация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    step: 1,
                    title: 'Выбор произведения',
                    description: 'Эксперты ART BANK отбирают произведения с потенциалом роста',
                    icon: Target,
                  },
                  {
                    step: 2,
                    title: 'Оценка и верификация',
                    description: 'Независимая экспертиза и определение справедливой стоимости',
                    icon: CheckCircle,
                  },
                  {
                    step: 3,
                    title: 'Создание токенов',
                    description: 'Выпуск NFT-токенов на блокчейне с защитой прав собственности',
                    icon: Coins,
                  },
                  {
                    step: 4,
                    title: 'Размещение на маркетплейсе',
                    description: 'Токены становятся доступны для покупки инвесторами',
                    icon: Package,
                  },
                  {
                    step: 5,
                    title: 'Торговля на вторичном рынке',
                    description: 'Продавайте токены другим инвесторам в любое время',
                    icon: TrendingUp,
                  },
                ].map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 text-white flex-shrink-0">
                      <step.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        Шаг {step.step}: {step.title}
                      </h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TokenizationPlatform;
