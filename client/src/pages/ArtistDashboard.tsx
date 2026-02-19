import React from 'react';
import { motion } from 'framer-motion';
import { trpc } from '../lib/trpc';
import { 
  TrendingUp, DollarSign, Package, Eye, Users, 
  Calendar, Award, Activity, ArrowUpRight, ArrowDownRight,
  Palette, ShoppingCart, Clock, CheckCircle
} from 'lucide-react';
import { useLocation } from 'wouter';

const ArtistDashboard: React.FC = () => {
  const [, navigate] = useLocation();

  // Fetch artist statistics (mock for now, will implement real API)
  const stats = {
    totalArtworks: 24,
    approvedArtworks: 18,
    pendingArtworks: 4,
    rejectedArtworks: 2,
    totalViews: 15420,
    totalSales: 8,
    totalRevenue: 45600, // in cents
    avgPrice: 5700, // in cents
    monthlyGrowth: 12.5,
    weeklyViews: 842,
    conversionRate: 5.2,
  };

  const recentSales = [
    { id: 1, title: 'Sunset Over Mountains', price: 15000, buyer: 'John Doe', date: '2026-01-25' },
    { id: 2, title: 'Abstract Dreams', price: 8500, buyer: 'Jane Smith', date: '2026-01-24' },
    { id: 3, title: 'Urban Reflections', price: 12000, buyer: 'Mike Johnson', date: '2026-01-22' },
  ];

  const topArtworks = [
    { id: 1, title: 'Sunset Over Mountains', views: 2341, likes: 156, status: 'sold' },
    { id: 2, title: 'Abstract Dreams', views: 1823, likes: 142, status: 'sold' },
    { id: 3, title: 'Cosmic Journey', views: 1654, likes: 128, status: 'available' },
    { id: 4, title: 'Ocean Waves', views: 1432, likes: 98, status: 'available' },
  ];

  const StatCard = ({ icon: Icon, label, value, change, color, subtitle }: any) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <div className={`flex items-center space-x-1 text-sm font-semibold ${
            change > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {change > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8 px-4">
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
                Панель художника
              </h1>
              <p className="text-gray-600">
                Добро пожаловать! Вот обзор вашей деятельности на платформе.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/artworks/submit')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
            >
              <Palette className="w-5 h-5" />
              <span>Добавить работу</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Package}
            label="Всего произведений"
            value={stats.totalArtworks}
            color="from-purple-500 to-purple-600"
            subtitle={`${stats.approvedArtworks} одобрено, ${stats.pendingArtworks} на модерации`}
          />
          <StatCard
            icon={Eye}
            label="Просмотры"
            value={stats.totalViews.toLocaleString()}
            change={stats.monthlyGrowth}
            color="from-blue-500 to-blue-600"
            subtitle={`${stats.weeklyViews} за неделю`}
          />
          <StatCard
            icon={ShoppingCart}
            label="Продажи"
            value={stats.totalSales}
            color="from-green-500 to-green-600"
            subtitle={`${stats.conversionRate}% конверсия`}
          />
          <StatCard
            icon={DollarSign}
            label="Доход"
            value={`$${(stats.totalRevenue / 100).toLocaleString()}`}
            change={15.3}
            color="from-orange-500 to-orange-600"
            subtitle={`Средняя цена $${(stats.avgPrice / 100).toLocaleString()}`}
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Sales */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <span>Последние продажи</span>
                </h2>
                <button
                  onClick={() => navigate('/transactions')}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Все транзакции →
                </button>
              </div>

              <div className="space-y-4">
                {recentSales.map((sale, index) => (
                  <motion.div
                    key={sale.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/artwork/${sale.id}`)}
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{sale.title}</h3>
                      <p className="text-sm text-gray-600">Покупатель: {sale.buyer}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">
                        ${(sale.price / 100).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">{sale.date}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Activity className="w-6 h-6 text-purple-600" />
                <span>Быстрые действия</span>
              </h2>

              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/artworks/my')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium text-left flex items-center justify-between hover:shadow-lg transition-shadow"
                >
                  <span className="flex items-center space-x-2">
                    <Package className="w-5 h-5" />
                    <span>Мои произведения</span>
                  </span>
                  <span className="text-sm bg-white/20 px-2 py-1 rounded">{stats.totalArtworks}</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/wallet')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium text-left flex items-center justify-between hover:shadow-lg transition-shadow"
                >
                  <span className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5" />
                    <span>Кошелёк</span>
                  </span>
                  <span className="text-sm bg-white/20 px-2 py-1 rounded">
                    ${(stats.totalRevenue / 100).toLocaleString()}
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/artworks/submit')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium text-left flex items-center justify-between hover:shadow-lg transition-shadow"
                >
                  <span className="flex items-center space-x-2">
                    <Palette className="w-5 h-5" />
                    <span>Новая работа</span>
                  </span>
                  <ArrowUpRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>

            {/* Status Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Award className="w-6 h-6 text-yellow-600" />
                <span>Статусы работ</span>
              </h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-700">Одобрено</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">{stats.approvedArtworks}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-gray-700">На модерации</span>
                  </div>
                  <span className="text-lg font-bold text-yellow-600">{stats.pendingArtworks}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-gray-700">Требует доработки</span>
                  </div>
                  <span className="text-lg font-bold text-red-600">{stats.rejectedArtworks}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Top Artworks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <span>Топ произведений</span>
            </h2>
            <button
              onClick={() => navigate('/artworks/my')}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              Все работы →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topArtworks.map((artwork, index) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.03 }}
                className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/artwork/${artwork.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    artwork.status === 'sold' 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {artwork.status === 'sold' ? 'Продано' : 'Доступно'}
                  </span>
                  <span className="text-xs text-gray-500">#{index + 1}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">
                  {artwork.title}
                </h3>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{artwork.views}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{artwork.likes}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ArtistDashboard;
