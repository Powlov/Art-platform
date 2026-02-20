import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Smartphone,
  Download,
  Apple,
  Chrome,
  QrCode,
  Star,
  Users,
  Zap,
  Shield,
  Globe,
  Bell,
  Camera,
  CreditCard,
  TrendingUp,
  Heart,
  Share2,
  CheckCircle,
  ArrowRight,
  PlayCircle,
  MessageSquare,
  Wallet,
  Award,
  Sparkles,
  Lock,
  Eye,
  Clock,
  Package,
  BarChart3,
  Palette,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';

interface Feature {
  icon: any;
  title: string;
  description: string;
  color: string;
}

interface Screenshot {
  id: number;
  title: string;
  image: string;
  category: 'marketplace' | 'wallet' | 'profile' | 'auctions' | 'social';
}

const MobileApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('features');
  const [selectedPlatform, setSelectedPlatform] = useState<'ios' | 'android'>('ios');

  const features: Feature[] = [
    {
      icon: Palette,
      title: 'Каталог произведений',
      description: 'Полный доступ к маркетплейсу с 10,000+ произведениями искусства',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Camera,
      title: 'AR Preview',
      description: 'Просмотр произведений в дополненной реальности в вашем интерьере',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Wallet,
      title: 'Мобильный кошелёк',
      description: 'Управление балансом, переводы и оплата покупок',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Bell,
      title: 'Push-уведомления',
      description: 'Мгновенные уведомления о новых работах, аукционах и сделках',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: QrCode,
      title: 'QR-сканер',
      description: 'Сканирование QR-кодов произведений для просмотра паспортов',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: TrendingUp,
      title: 'Портфолио',
      description: 'Отслеживание стоимости коллекции и инвестиций в реальном времени',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: MessageSquare,
      title: 'Чат с продавцами',
      description: 'Прямая связь с галереями и художниками',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Shield,
      title: 'Биометрия',
      description: 'Вход по Face ID / Touch ID для максимальной безопасности',
      color: 'from-emerald-500 to-green-500',
    },
    {
      icon: BarChart3,
      title: 'Аналитика',
      description: 'Детальная статистика и графики динамики рынка',
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  const stats = [
    { label: 'Установок', value: '50K+', icon: Download, color: 'from-blue-500 to-cyan-500' },
    { label: 'Рейтинг', value: '4.8', icon: Star, color: 'from-yellow-500 to-orange-500' },
    { label: 'Активных пользователей', value: '25K+', icon: Users, color: 'from-purple-500 to-pink-500' },
    { label: 'Транзакций/день', value: '1,200+', icon: Zap, color: 'from-green-500 to-emerald-500' },
  ];

  const screenshots: Screenshot[] = [
    {
      id: 1,
      title: 'Главная',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400',
      category: 'marketplace',
    },
    {
      id: 2,
      title: 'Кошелёк',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400',
      category: 'wallet',
    },
    {
      id: 3,
      title: 'Профиль',
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400',
      category: 'profile',
    },
    {
      id: 4,
      title: 'Аукционы',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400',
      category: 'auctions',
    },
  ];

  const benefits = [
    { icon: CheckCircle, text: 'Бесплатная регистрация' },
    { icon: CheckCircle, text: 'Без комиссии за первые 3 покупки' },
    { icon: CheckCircle, text: 'Доступ ко всем функциям веб-платформы' },
    { icon: CheckCircle, text: 'Эксклюзивные мобильные предложения' },
    { icon: CheckCircle, text: 'Поддержка 24/7' },
    { icon: CheckCircle, text: 'Безопасные платежи' },
  ];

  const appStoreLinks = {
    ios: 'https://apps.apple.com/app/artbank',
    android: 'https://play.google.com/store/apps/artbank',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <Navigation user={{ id: 1, name: 'User', email: 'user@artbank.ru', role: 'user' }} />
      <Header
        title="ART BANK Mobile"
        subtitle="Мобильное приложение для коллекционеров, художников и галерей"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="text-purple-600 font-semibold">Скоро в App Store и Google Play</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Искусство в кармане
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Покупайте, продавайте и управляйте коллекцией произведений искусства
            прямо с вашего смартфона
          </p>

          {/* Platform Selection */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              size="lg"
              onClick={() => setSelectedPlatform('ios')}
              className={`flex items-center gap-2 ${
                selectedPlatform === 'ios'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              <Apple className="w-5 h-5" />
              iOS
            </Button>
            <Button
              size="lg"
              onClick={() => setSelectedPlatform('android')}
              className={`flex items-center gap-2 ${
                selectedPlatform === 'android'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              <Chrome className="w-5 h-5" />
              Android
            </Button>
          </div>

          {/* QR Code */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block"
          >
            <Card className="p-8 bg-white shadow-2xl">
              <div className="text-center mb-4">
                <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 mb-4">
                  Скоро
                </Badge>
                <div className="w-48 h-48 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center mx-auto">
                  <QrCode className="w-32 h-32 text-purple-600" />
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Отсканируйте QR-код для загрузки приложения
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {selectedPlatform === 'ios' ? 'App Store' : 'Google Play'}
                </p>
              </div>
              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
                size="lg"
              >
                <Download className="w-5 h-5 mr-2" />
                Скачать приложение
              </Button>
            </Card>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="features">
              <Sparkles className="w-4 h-4 mr-2" />
              Функции
            </TabsTrigger>
            <TabsTrigger value="screenshots">
              <Eye className="w-4 h-4 mr-2" />
              Скриншоты
            </TabsTrigger>
            <TabsTrigger value="benefits">
              <Award className="w-4 h-4 mr-2" />
              Преимущества
            </TabsTrigger>
          </TabsList>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Всё необходимое в одном приложении
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Управляйте коллекцией, участвуйте в аукционах, общайтесь с художниками
                и получайте аналитику рынка
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="group hover:shadow-xl transition-all h-full">
                    <CardContent className="p-6">
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${feature.color} text-white inline-block mb-4`}>
                        <feature.icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Screenshots Tab */}
          <TabsContent value="screenshots" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Удобный интерфейс
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Интуитивный дизайн, созданный для лучшего опыта использования
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {screenshots.map((screenshot, index) => (
                <motion.div
                  key={screenshot.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-lg">
                    <div className="aspect-[9/16] bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                      <Smartphone className="w-16 h-16 text-white opacity-50" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                      <p className="text-white font-semibold">{screenshot.title}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600"
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                Смотреть демо-видео
              </Button>
            </div>
          </TabsContent>

          {/* Benefits Tab */}
          <TabsContent value="benefits" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Почему стоит скачать ART BANK?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Присоединяйтесь к сообществу из 25,000+ пользователей
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="p-2 rounded-lg bg-green-100">
                    <benefit.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg text-gray-900">{benefit.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Card className="max-w-4xl mx-auto mt-8">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Системные требования
                    </h3>
                    <div className="space-y-3 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Apple className="w-5 h-5" />
                        <span>iOS 14.0 или выше</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Chrome className="w-5 h-5" />
                        <span>Android 8.0 или выше</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        <span>~150 МБ свободного места</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        <span>Интернет-соединение</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Безопасность
                    </h3>
                    <div className="space-y-3 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        <span>Сквозное шифрование</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Lock className="w-5 h-5 text-green-600" />
                        <span>Биометрическая аутентификация</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span>Двухфакторная аутентификация</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-green-600" />
                        <span>Сертификация PCI DSS</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-center text-white"
        >
          <h2 className="text-4xl font-bold mb-4">
            Готовы начать?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Скачайте приложение прямо сейчас и получите эксклюзивный бонус 10,000 ₽ на первую покупку
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              <Apple className="w-6 h-6 mr-2" />
              App Store
            </Button>
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              <Chrome className="w-6 h-6 mr-2" />
              Google Play
            </Button>
          </div>
          <p className="text-sm text-purple-200 mt-6">
            Доступно на iPhone, iPad и Android устройствах
          </p>
        </motion.div>

        {/* Newsletter */}
        <Card className="mt-12 max-w-3xl mx-auto">
          <CardContent className="p-8">
            <div className="text-center">
              <Bell className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Уведомить о запуске
              </h3>
              <p className="text-gray-600 mb-6">
                Оставьте email и мы сообщим, когда приложение будет доступно для загрузки
              </p>
              <div className="flex gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Ваш email"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                  Подписаться
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MobileApp;
