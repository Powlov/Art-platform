import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, TrendingUp, DollarSign, Users, Package, 
  Eye, Heart, ShoppingCart, Settings, Plus, Search,
  Filter, Grid3x3, List, Calendar, Award, Star,
  ArrowUpRight, ArrowDownRight, Activity, BarChart3,
  Image as ImageIcon, CheckCircle, Clock, XCircle
} from 'lucide-react';
import { trpc } from '../lib/trpc';
import { useAuth } from '../_core/hooks/useAuth';
import { Link } from 'wouter';

interface Artwork {
  id: number;
  title: string;
  artistName: string;
  imageUrl: string;
  basePrice: number;
  currentPrice: number;
  status: 'available' | 'sold' | 'auction' | 'unavailable';
  moderationStatus: 'pending' | 'approved' | 'rejected';
  views?: number;
  likes?: number;
  createdAt: number;
}

export default function GalleryDashboard() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch gallery artworks
  const { data: artworks = [] } = trpc.artwork.getMyArtworks.useQuery({
    status: filterStatus !== 'all' ? filterStatus : undefined
  });

  // Fetch gallery stats
  const { data: stats } = trpc.stats.getDashboard.useQuery();

  // Calculate gallery statistics
  const totalArtworks = artworks.length;
  const availableArtworks = artworks.filter(a => a.status === 'available').length;
  const soldArtworks = artworks.filter(a => a.status === 'sold').length;
  const pendingArtworks = artworks.filter(a => a.moderationStatus === 'pending').length;
  const totalValue = artworks.reduce((sum, a) => sum + (a.currentPrice || 0), 0);
  const soldValue = artworks.filter(a => a.status === 'sold')
    .reduce((sum, a) => sum + (a.currentPrice || 0), 0);

  // Filter artworks
  const filteredArtworks = artworks.filter((artwork: Artwork) => {
    const matchesSearch = artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         artwork.artistName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || artwork.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const StatCard = ({ icon: Icon, title, value, trend, color }: any) => (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              {trend > 0 ? (
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-br ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'auction': return 'bg-purple-100 text-purple-800';
      case 'unavailable': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getModerationIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
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
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Gallery Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Manage your gallery and track performance</p>
            </div>
            <Link href="/artworks/submit">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-shadow"
              >
                <Plus className="w-5 h-5" />
                Add Artwork
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Statistics Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            icon={Package}
            title="Total Artworks"
            value={totalArtworks}
            trend={12}
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            icon={DollarSign}
            title="Total Value"
            value={`$${totalValue.toLocaleString()}`}
            trend={8}
            color="from-green-500 to-emerald-600"
          />
          <StatCard
            icon={ShoppingCart}
            title="Sold Artworks"
            value={soldArtworks}
            trend={15}
            color="from-purple-500 to-purple-600"
          />
          <StatCard
            icon={Clock}
            title="Pending Review"
            value={pendingArtworks}
            trend={-5}
            color="from-orange-500 to-orange-600"
          />
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Performance Metrics</h2>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">Last 30 days</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {artworks.reduce((sum: number, a: Artwork) => sum + (a.views || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-red-100 to-red-200">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Likes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {artworks.reduce((sum: number, a: Artwork) => sum + (a.likes || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-green-100 to-green-200">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalArtworks > 0 ? Math.round((soldArtworks / totalArtworks) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Artworks Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search artworks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="auction">In Auction</option>
                <option value="unavailable">Unavailable</option>
              </select>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Artworks Grid/List */}
          {filteredArtworks.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No artworks found</p>
              <Link href="/artworks/submit">
                <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Add Your First Artwork
                </button>
              </Link>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArtworks.map((artwork: Artwork) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="aspect-square relative">
                    <img
                      src={artwork.imageUrl || 'https://via.placeholder.com/400'}
                      alt={artwork.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      {getModerationIcon(artwork.moderationStatus)}
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(artwork.status)}`}>
                        {artwork.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1 truncate">{artwork.title}</h3>
                    <p className="text-gray-500 text-sm mb-2">{artwork.artistName}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="text-xl font-bold text-gray-900">
                          ${(artwork.currentPrice || artwork.basePrice).toLocaleString()}
                        </p>
                      </div>
                      <Link href={`/artworks/edit/${artwork.id}`}>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                        >
                          <Settings className="w-5 h-5" />
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredArtworks.map((artwork: Artwork) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={artwork.imageUrl || 'https://via.placeholder.com/100'}
                    alt={artwork.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{artwork.title}</h3>
                      {getModerationIcon(artwork.moderationStatus)}
                    </div>
                    <p className="text-gray-500 text-sm">{artwork.artistName}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(artwork.status)}`}>
                      {artwork.status}
                    </span>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      ${(artwork.currentPrice || artwork.basePrice).toLocaleString()}
                    </p>
                  </div>
                  <Link href={`/artworks/edit/${artwork.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                    >
                      <Settings className="w-5 h-5" />
                    </motion.button>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
