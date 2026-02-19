import React, { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  TrendingUp, 
  AlertCircle, 
  Activity,
  FileText,
  Settings,
  BarChart3,
  Shield
} from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { trpc } from '@/lib/trpc';
import { motion } from 'framer-motion';

const AdminDashboard: React.FC = () => {
  const { data: stats, isLoading } = trpc.stats.dashboard.useQuery({ timeRange: 'month' });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  const quickActions = [
    { icon: Users, label: 'Управление пользователями', href: '/admin/users', color: 'bg-blue-500' },
    { icon: FileText, label: 'Модерация контента', href: '/admin/moderation', color: 'bg-purple-500' },
    { icon: BarChart3, label: 'Статистика платформы', href: '/statistics', color: 'bg-green-500' },
    { icon: Settings, label: 'Настройки системы', href: '/admin/settings', color: 'bg-orange-500' },
  ];

  const recentActivity = [
    { action: 'Новый пользователь зарегистрирован', user: 'artist@artbank.com', time: '5 минут назад' },
    { action: 'Произведение добавлено на модерацию', user: 'Test Artist', time: '15 минут назад' },
    { action: 'Транзакция завершена', user: 'collector@artbank.com', time: '1 час назад' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Панель Администратора
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Добро пожаловать в систему управления ART BANK MARKET
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Всего пользователей</CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 8}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12% за месяц
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Активные сделки</CardTitle>
            <Activity className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTransactions || 0}</div>
            <p className="text-xs text-gray-600 mt-1">За последние 30 дней</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Произведений на платформе</CardTitle>
            <FileText className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalArtworks || 8}</div>
            <p className="text-xs text-gray-600 mt-1">Всего в каталоге</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Требуют внимания</CardTitle>
            <AlertCircle className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-gray-600 mt-1">Модерация</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">Быстрые действия</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{action.label}</h3>
                  <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto">
                    Перейти →
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Последняя активность</CardTitle>
            <CardDescription>Недавние события на платформе</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">{item.action}</p>
                    <p className="text-sm text-gray-600">{item.user}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
