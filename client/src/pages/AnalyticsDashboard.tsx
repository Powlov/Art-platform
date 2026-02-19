import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, DollarSign, Package, Users, ShoppingCart,
  Eye, Heart, Award, BarChart3, PieChart, Calendar,
  Download, RefreshCw, Filter, ArrowUpRight, ArrowDownRight,
  Activity, Target, Zap, Crown
} from 'lucide-react';
import { trpc } from '../lib/trpc';
import { useAuth } from '../_core/hooks/useAuth';

export default function AnalyticsDashboard() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  
  // Fetch analytics data
  const { data: stats } = trpc.stats.getDashboard.useQuery();
  const { data: artworks = [] } = trpc.artwork.list.useQuery({ limit: 1000 });

  // Calculate analytics
  const totalArtworks = artworks.length;
  const availableArtworks = artworks.filter((a: any) => a.status === 'available').length;
  const soldArtworks = artworks.filter((a: any) => a.status === 'sold').length;
  const inAuctionArtworks = artworks.filter((a: any) => a.status === 'auction').length;
  
  const totalValue = artworks.reduce((sum: number, a: any) => sum + (a.currentPrice || a.basePrice || 0), 0);
  const soldValue = artworks.filter((a: any) => a.status === 'sold')
    .reduce((sum: number, a: any) => sum + (a.currentPrice || a.basePrice || 0), 0);
  const avgPrice = totalArtworks > 0 ? totalValue / totalArtworks : 0;
  
  const conversionRate = totalArtworks > 0 ? (soldArtworks / totalArtworks) * 100 : 0;

  // Mock data for charts
  const salesByMonth = [
    { month: 'Jan', sales: 45000, count: 12 },
    { month: 'Feb', sales: 52000, count: 15 },
    { month: 'Mar', sales: 48000, count: 13 },
    { month: 'Apr', sales: 61000, count: 18 },
    { month: 'May', sales: 55000, count: 16 },
    { month: 'Jun', sales: 67000, count: 20 },
  ];

  const topGenres = [
    { name: 'Abstract', count: 45, revenue: 125000 },
    { name: 'Landscape', count: 38, revenue: 98000 },
    { name: 'Portrait', count: 32, revenue: 87000 },
    { name: 'Modern', count: 28, revenue: 76000 },
    { name: 'Contemporary', count: 25, revenue: 65000 },
  ];

  const topArtists = [
    { name: 'Alexandra Petrova', artworks: 15, sales: 8, revenue: 245000 },
    { name: 'Ivan Volkov', artworks: 12, sales: 7, revenue: 198000 },
    { name: 'Maria Sokolova', artworks: 10, sales: 6, revenue: 167000 },
    { name: 'Dmitry Ivanov', artworks: 8, sales: 5, revenue: 143000 },
    { name: 'Elena Popova', artworks: 7, sales: 4, revenue: 112000 },
  ];

  const MetricCard = ({ icon: Icon, title, value, change, trend, color }: any) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <div className="flex items-center gap-1">
            {trend === 'up' ? (
              <ArrowUpRight className="w-4 h-4 text-green-500" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm font-semibold ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {change}%
            </span>
          </div>
        )}
      </div>
      <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </motion.div>
  );

  const exportData = () => {
    const data = {
      summary: {
        totalArtworks,
        soldArtworks,
        totalValue,
        soldValue,
        avgPrice,
        conversionRate
      },
      salesByMonth,
      topGenres,
      topArtists,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${Date.now()}.json`;
    a.click();
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Track your performance and insights</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Refresh
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportData}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                Export
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={Package}
            title="Total Artworks"
            value={totalArtworks}
            change={12}
            trend="up"
            color="from-blue-500 to-blue-600"
          />
          <MetricCard
            icon={DollarSign}
            title="Total Value"
            value={`$${Math.round(totalValue).toLocaleString()}`}
            change={8}
            trend="up"
            color="from-green-500 to-emerald-600"
          />
          <MetricCard
            icon={ShoppingCart}
            title="Sold Artworks"
            value={soldArtworks}
            change={15}
            trend="up"
            color="from-purple-500 to-purple-600"
          />
          <MetricCard
            icon={TrendingUp}
            title="Conversion Rate"
            value={`${Math.round(conversionRate)}%`}
            change={5}
            trend="up"
            color="from-orange-500 to-orange-600"
          />
        </div>

        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Sales Overview</h2>
              <p className="text-gray-500 mt-1">Monthly sales performance</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
          <div className="space-y-4">
            {salesByMonth.map((month, index) => (
              <div key={month.month} className="flex items-center gap-4">
                <div className="w-16 text-sm font-medium text-gray-600">{month.month}</div>
                <div className="flex-1">
                  <div className="relative h-10 bg-gray-100 rounded-lg overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(month.sales / 70000) * 100}%` }}
                      transition={{ delay: index * 0.1 }}
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg"
                    />
                    <div className="absolute inset-0 flex items-center px-4">
                      <span className="text-sm font-semibold text-gray-700">
                        ${(month.sales / 1000).toFixed(0)}k
                      </span>
                      <span className="ml-auto text-xs text-gray-500">
                        {month.count} sold
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Genres & Artists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Genres */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Top Genres</h2>
            </div>
            <div className="space-y-4">
              {topGenres.map((genre, index) => (
                <div key={genre.name} className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{genre.name}</p>
                    <p className="text-sm text-gray-500">{genre.count} artworks</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${(genre.revenue / 1000).toFixed(0)}k</p>
                    <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden mt-1">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(genre.count / 50) * 100}%` }}
                        transition={{ delay: index * 0.1 }}
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Artists */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Crown className="w-6 h-6 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-900">Top Artists</h2>
            </div>
            <div className="space-y-4">
              {topArtists.map((artist, index) => (
                <div key={artist.name} className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${
                    index === 0 ? 'bg-yellow-100 text-yellow-600' :
                    index === 1 ? 'bg-gray-100 text-gray-600' :
                    index === 2 ? 'bg-orange-100 text-orange-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{artist.name}</p>
                    <p className="text-sm text-gray-500">
                      {artist.artworks} artworks • {artist.sales} sold
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${(artist.revenue / 1000).toFixed(0)}k</p>
                    <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                      <ArrowUpRight className="w-3 h-3" />
                      <span>{Math.round((artist.sales / artist.artworks) * 100)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Performance Metrics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Eye className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {artworks.reduce((sum: number, a: any) => sum + (a.views || 0), 0).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <ArrowUpRight className="w-4 h-4" />
                <span>+18% from last month</span>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Heart className="w-8 h-8 text-pink-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Likes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {artworks.reduce((sum: number, a: any) => sum + (a.likes || 0), 0).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <ArrowUpRight className="w-4 h-4" />
                <span>+22% from last month</span>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Target className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Avg. Price</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${Math.round(avgPrice).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <ArrowUpRight className="w-4 h-4" />
                <span>+12% from last month</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
