import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Upload, Users, BarChart3, Settings, LogOut } from 'lucide-react';
import { toast } from 'sonner';

type UserRole = 'user' | 'artist' | 'collector' | 'gallery' | 'partner' | 'curator' | 'consultant' | 'admin';

interface RoleConfig {
  title: string;
  description: string;
  icon: string;
  color: string;
  features: Array<{
    title: string;
    description: string;
    icon: React.ReactNode;
    action: string;
  }>;
}

const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  artist: {
    title: 'Художник',
    description: 'Управляйте своими произведениями и продажами',
    icon: '🎨',
    color: 'from-purple-500 to-pink-500',
    features: [
      {
        title: 'Загрузить произведение',
        description: 'Добавьте новое произведение в каталог',
        icon: <Upload size={24} />,
        action: '/artworks/new',
      },
      {
        title: 'Мои произведения',
        description: 'Управляйте своей коллекцией',
        icon: <ShoppingCart size={24} />,
        action: '/artist/artworks',
      },
      {
        title: 'Статистика продаж',
        description: 'Просмотрите аналитику продаж',
        icon: <BarChart3 size={24} />,
        action: '/artist/statistics',
      },
      {
        title: 'Профиль художника',
        description: 'Отредактируйте информацию профиля',
        icon: <Settings size={24} />,
        action: '/artist/profile',
      },
    ],
  },
  collector: {
    title: 'Коллекционер',
    description: 'Покупайте и управляйте своей коллекцией',
    icon: '💎',
    color: 'from-blue-500 to-cyan-500',
    features: [
      {
        title: 'Просмотреть каталог',
        description: 'Найдите произведения для покупки',
        icon: <ShoppingCart size={24} />,
        action: '/marketplace',
      },
      {
        title: 'Моя коллекция',
        description: 'Управляйте приобретенными произведениями',
        icon: <Users size={24} />,
        action: '/collector/collection',
      },
      {
        title: 'Портфель',
        description: 'Просмотрите стоимость вашей коллекции',
        icon: <BarChart3 size={24} />,
        action: '/collector/portfolio',
      },
      {
        title: 'Мои покупки',
        description: 'История приобретений',
        icon: <Settings size={24} />,
        action: '/collector/purchases',
      },
    ],
  },
  gallery: {
    title: 'Галерея',
    description: 'Управляйте галереей и выставками',
    icon: '🏛️',
    color: 'from-amber-500 to-orange-500',
    features: [
      {
        title: 'Управление галереей',
        description: 'Настройки и информация галереи',
        icon: <Settings size={24} />,
        action: '/gallery/settings',
      },
      {
        title: 'Выставки',
        description: 'Создавайте и управляйте выставками',
        icon: <Upload size={24} />,
        action: '/gallery/exhibitions',
      },
      {
        title: 'Художники',
        description: 'Управляйте сотрудничеством с художниками',
        icon: <Users size={24} />,
        action: '/gallery/artists',
      },
      {
        title: 'Аналитика',
        description: 'Статистика продаж и посещений',
        icon: <BarChart3 size={24} />,
        action: '/gallery/analytics',
      },
    ],
  },
  curator: {
    title: 'Куратор',
    description: 'Организуйте выставки и мероприятия',
    icon: '🎭',
    color: 'from-red-500 to-pink-500',
    features: [
      {
        title: 'Создать выставку',
        description: 'Организуйте новую выставку',
        icon: <Upload size={24} />,
        action: '/curator/exhibitions/new',
      },
      {
        title: 'Мои выставки',
        description: 'Управляйте выставками',
        icon: <ShoppingCart size={24} />,
        action: '/curator/exhibitions',
      },
      {
        title: 'Мероприятия',
        description: 'Планируйте мероприятия',
        icon: <Users size={24} />,
        action: '/curator/events',
      },
      {
        title: 'Статистика',
        description: 'Просмотрите посещаемость',
        icon: <BarChart3 size={24} />,
        action: '/curator/analytics',
      },
    ],
  },
  consultant: {
    title: 'Консультант',
    description: 'Консультируйте клиентов',
    icon: '💼',
    color: 'from-green-500 to-teal-500',
    features: [
      {
        title: 'Мои клиенты',
        description: 'Управляйте списком клиентов',
        icon: <Users size={24} />,
        action: '/consultant/clients',
      },
      {
        title: 'Консультации',
        description: 'Расписание консультаций',
        icon: <ShoppingCart size={24} />,
        action: '/consultant/appointments',
      },
      {
        title: 'Оценки',
        description: 'Создавайте оценки произведений',
        icon: <Upload size={24} />,
        action: '/consultant/valuations',
      },
      {
        title: 'Портфель',
        description: 'Аналитика портфелей клиентов',
        icon: <BarChart3 size={24} />,
        action: '/consultant/portfolios',
      },
    ],
  },
  partner: {
    title: 'Партнер',
    description: 'Партнерские услуги',
    icon: '🤝',
    color: 'from-indigo-500 to-purple-500',
    features: [
      {
        title: 'Партнерские программы',
        description: 'Управляйте программами',
        icon: <ShoppingCart size={24} />,
        action: '/partner/programs',
      },
      {
        title: 'Комиссии',
        description: 'Просмотрите комиссии и платежи',
        icon: <BarChart3 size={24} />,
        action: '/partner/commissions',
      },
      {
        title: 'Отчеты',
        description: 'Детальные отчеты о деятельности',
        icon: <Upload size={24} />,
        action: '/partner/reports',
      },
      {
        title: 'Контакты',
        description: 'Управляйте контактами',
        icon: <Users size={24} />,
        action: '/partner/contacts',
      },
    ],
  },
  admin: {
    title: 'Администратор',
    description: 'Управляйте платформой',
    icon: '⚙️',
    color: 'from-gray-600 to-gray-800',
    features: [
      {
        title: 'Пользователи',
        description: 'Управляйте пользователями',
        icon: <Users size={24} />,
        action: '/admin/users',
      },
      {
        title: 'Контент',
        description: 'Модерация контента',
        icon: <ShoppingCart size={24} />,
        action: '/admin/content',
      },
      {
        title: 'Аналитика',
        description: 'Статистика платформы',
        icon: <BarChart3 size={24} />,
        action: '/admin/analytics',
      },
      {
        title: 'Настройки',
        description: 'Системные настройки',
        icon: <Settings size={24} />,
        action: '/admin/settings',
      },
    ],
  },
  user: {
    title: 'Гость',
    description: 'Просматривайте каталог',
    icon: '👤',
    color: 'from-gray-400 to-gray-500',
    features: [
      {
        title: 'Каталог',
        description: 'Просмотрите произведения',
        icon: <ShoppingCart size={24} />,
        action: '/marketplace',
      },
      {
        title: 'Аукционы',
        description: 'Участвуйте в аукционах',
        icon: <Users size={24} />,
        action: '/auctions',
      },
      {
        title: 'Избранное',
        description: 'Ваши избранные произведения',
        icon: <Upload size={24} />,
        action: '/wishlist',
      },
      {
        title: 'Профиль',
        description: 'Управляйте профилем',
        icon: <Settings size={24} />,
        action: '/profile',
      },
    ],
  },
};

interface RoleBasedDashboardProps {
  userRole: UserRole;
}

export default function RoleBasedDashboard({ userRole }: RoleBasedDashboardProps) {
  const [, setLocation] = useLocation();
  const config = ROLE_CONFIGS[userRole] || ROLE_CONFIGS.user;

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    setLocation('/login');
    toast.success('Вы вышли из аккаунта');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className={`bg-gradient-to-r ${config.color} text-white py-12 px-4`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-5xl mb-4">{config.icon}</div>
          <h1 className="text-4xl font-bold mb-2">{config.title}</h1>
          <p className="text-lg opacity-90">{config.description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {config.features.map((feature, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setLocation(feature.action)}
            >
              <CardContent className="pt-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Быстрая статистика</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">42</div>
                <p className="text-sm text-gray-600">Активных действий</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">$12,450</div>
                <p className="text-sm text-gray-600">Общая стоимость</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">156</div>
                <p className="text-sm text-gray-600">Всего операций</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">98%</div>
                <p className="text-sm text-gray-600">Успешных сделок</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            variant="default"
            size="lg"
            onClick={() => setLocation('/statistics')}
          >
            📊 Просмотреть статистику
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700"
          >
            <LogOut size={20} className="mr-2" />
            Выход
          </Button>
        </div>
      </div>
    </div>
  );
}
