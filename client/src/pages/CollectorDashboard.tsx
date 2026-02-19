import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, ShoppingBag, TrendingUp, DollarSign, Award,
  Eye, Star, Image as ImageIcon, Filter, Search,
  Grid3x3, List, Calendar, BarChart3, Package,
  ArrowUpRight, Crown, Sparkles, Target
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
  status: string;
  genre?: string;
}

export default function CollectorDashboard() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'collection' | 'wishlist'>('collection');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch wishlist
  const { data: wishlistItems = [] } = trpc.wishlist.getWishlist.useQuery();
  
  // Fetch purchased artworks (mock for now)
  const { data: purchasedArtworks = [] } = trpc.artwork.list.useQuery({ limit: 50 });

  // Calculate statistics
  const totalCollection = purchasedArtworks.length;
  const totalValue = purchasedArtworks.reduce((sum: number, a: any) => sum + (a.currentPrice || 0), 0);
  const totalWishlist = wishlistItems.length;
  const avgValue = totalCollection > 0 ? totalValue / totalCollection : 0;

  const activeItems = activeTab === 'collection' ? purchasedArtworks : wishlistItems;
  const filteredItems = activeItems.filter((item: any) => {
    const artwork = item.artwork || item;
    return artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           artwork.artistName?.toLowerCase().includes(searchQuery.toLowerCase());
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

  const StatCard = ({ icon: Icon, title, value, subtitle, color }: any) => (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Crown className="w-10 h-10 text-purple-600" />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Collector Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Manage your art collection and wishlist</p>
            </div>
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
            title="Total Collection"
            value={totalCollection}
            subtitle={`${totalCollection} artworks owned`}
            color="from-purple-500 to-purple-600"
          />
          <StatCard
            icon={DollarSign}
            title="Portfolio Value"
            value={`$${totalValue.toLocaleString()}`}
            subtitle={`Avg: $${Math.round(avgValue).toLocaleString()}`}
            color="from-green-500 to-emerald-600"
          />
          <StatCard
            icon={Heart}
            title="Wishlist"
            value={totalWishlist}
            subtitle={`${totalWishlist} artworks saved`}
            color="from-pink-500 to-rose-600"
          />
          <StatCard
            icon={TrendingUp}
            title="Portfolio Growth"
            value="+24%"
            subtitle="Last 30 days"
            color="from-blue-500 to-indigo-600"
          />
        </motion.div>

        {/* Collection Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Collection Insights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Most Valuable</p>
                <p className="text-lg font-bold text-gray-900">Abstract Collection</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Favorite Artist</p>
                <p className="text-lg font-bold text-gray-900">Vincent van Gogh</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-pink-100 to-pink-200">
                <Target className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Investment ROI</p>
                <p className="text-lg font-bold text-gray-900">+42%</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Collection/Wishlist Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          {/* Tabs */}
          <div className="flex items-center gap-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('collection')}
              className={`pb-3 px-4 font-semibold transition-colors relative ${
                activeTab === 'collection'
                  ? 'text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                My Collection ({totalCollection})
              </div>
              {activeTab === 'collection' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`pb-3 px-4 font-semibold transition-colors relative ${
                activeTab === 'wishlist'
                  ? 'text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Wishlist ({totalWishlist})
              </div>
              {activeTab === 'wishlist' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"
                />
              )}
            </button>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search artworks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-5 h-5" />
                Filter
              </button>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Artworks Grid/List */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">
                {activeTab === 'collection' ? 'No artworks in your collection' : 'Your wishlist is empty'}
              </p>
              <Link href="/marketplace">
                <button className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Explore Marketplace
                </button>
              </Link>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item: any) => {
                const artwork = item.artwork || item;
                return (
                  <motion.div
                    key={artwork.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="aspect-square relative group">
                      <img
                        src={artwork.imageUrl || 'https://via.placeholder.com/400'}
                        alt={artwork.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-3 left-3 right-3">
                          <Link href={`/artwork-passport/${artwork.id}`}>
                            <button className="w-full px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
                              View Details
                            </button>
                          </Link>
                        </div>
                      </div>
                      {activeTab === 'wishlist' && (
                        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors">
                          <Heart className="w-5 h-5 text-red-500 fill-current" />
                        </button>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1 truncate">{artwork.title}</h3>
                      <p className="text-gray-500 text-sm mb-2">{artwork.artistName || 'Unknown Artist'}</p>
                      {artwork.genre && (
                        <span className="inline-block px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">
                          {artwork.genre}
                        </span>
                      )}
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">
                              {activeTab === 'collection' ? 'Purchase Price' : 'Current Price'}
                            </p>
                            <p className="text-xl font-bold text-gray-900">
                              ${(artwork.currentPrice || artwork.basePrice || 0).toLocaleString()}
                            </p>
                          </div>
                          {activeTab === 'collection' && (
                            <div className="text-right">
                              <p className="text-sm text-green-600 font-semibold">+15%</p>
                              <p className="text-xs text-gray-500">Value increase</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item: any) => {
                const artwork = item.artwork || item;
                return (
                  <motion.div
                    key={artwork.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={artwork.imageUrl || 'https://via.placeholder.com/100'}
                      alt={artwork.title}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{artwork.title}</h3>
                      <p className="text-gray-500 text-sm mb-2">{artwork.artistName || 'Unknown Artist'}</p>
                      {artwork.genre && (
                        <span className="inline-block px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">
                          {artwork.genre}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        ${(artwork.currentPrice || artwork.basePrice || 0).toLocaleString()}
                      </p>
                      {activeTab === 'collection' && (
                        <p className="text-sm text-green-600 font-semibold">+15%</p>
                      )}
                    </div>
                    <Link href={`/artwork-passport/${artwork.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                      >
                        View
                      </motion.button>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
