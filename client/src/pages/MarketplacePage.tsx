import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Filter, Grid3x3, List, TrendingUp, Star,
  Heart, Eye, DollarSign, Calendar, Award, Zap,
  ChevronDown, X, SlidersHorizontal
} from 'lucide-react';
import { trpc } from '../lib/trpc';
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
  year?: number;
  views?: number;
  likes?: number;
}

export default function MarketplacePage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch artworks
  const { data: artworks = [], isLoading } = trpc.artwork.list.useQuery({ limit: 100 });

  // Filter artworks
  const filteredArtworks = artworks.filter((artwork: Artwork) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        artwork.title.toLowerCase().includes(query) ||
        artwork.artistName?.toLowerCase().includes(query) ||
        artwork.genre?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Price filter
    const price = artwork.currentPrice || artwork.basePrice;
    if (price < priceRange[0] || price > priceRange[1]) return false;

    // Genre filter
    if (selectedGenres.length > 0) {
      if (!artwork.genre || !selectedGenres.includes(artwork.genre)) return false;
    }

    // Status filter (only available)
    if (artwork.status !== 'available') return false;

    return true;
  });

  // Sort artworks
  const sortedArtworks = [...filteredArtworks].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.currentPrice || a.basePrice) - (b.currentPrice || b.basePrice);
      case 'price-high':
        return (b.currentPrice || b.basePrice) - (a.currentPrice || a.basePrice);
      case 'newest':
        return b.id - a.id;
      case 'popular':
        return (b.views || 0) - (a.views || 0);
      case 'trending':
        return (b.likes || 0) - (a.likes || 0);
      default:
        return 0;
    }
  });

  const genres = ['Abstract', 'Landscape', 'Portrait', 'Still Life', 'Modern', 'Contemporary'];

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setPriceRange([0, 100000]);
    setSelectedGenres([]);
    setSortBy('popular');
  };

  const activeFiltersCount = 
    (searchQuery ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 100000 ? 1 : 0) +
    selectedGenres.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Marketplace
          </h1>
          <p className="text-gray-600 text-lg">Discover and collect unique artworks</p>
        </motion.div>

        {/* Search & Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search artworks, artists, styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="popular">Most Popular</option>
              <option value="trending">Trending</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            {/* Filters Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${
                showFilters
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 bg-white text-purple-600 rounded-full text-xs font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* View Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600'}`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-600 hover:text-red-700 font-semibold"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Price Range: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Genres */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Genres ({selectedGenres.length} selected)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {genres.map(genre => (
                      <button
                        key={genre}
                        onClick={() => toggleGenre(genre)}
                        className={`px-4 py-2 rounded-full font-medium transition-colors ${
                          selectedGenres.includes(genre)
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Showing <span className="font-bold text-purple-600">{sortedArtworks.length}</span> artworks
          </p>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''}
            </button>
          )}
        </div>

        {/* Artworks Grid/List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : sortedArtworks.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No artworks found</p>
            <p className="text-gray-400 mb-4">Try adjusting your filters</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedArtworks.map((artwork: Artwork, index: number) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
              >
                <Link href={`/artwork-passport/${artwork.id}`}>
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={artwork.imageUrl || 'https://via.placeholder.com/400'}
                      alt={artwork.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                        <span className="flex items-center gap-1 text-sm">
                          <Eye className="w-4 h-4" />
                          {artwork.views || 0}
                        </span>
                        <span className="flex items-center gap-1 text-sm">
                          <Heart className="w-4 h-4" />
                          {artwork.likes || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">
                      {artwork.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-2">{artwork.artistName}</p>
                    {artwork.genre && (
                      <span className="inline-block px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full mb-3">
                        {artwork.genre}
                      </span>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Price</p>
                        <p className="text-xl font-bold text-gray-900">
                          ${(artwork.currentPrice || artwork.basePrice).toLocaleString()}
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                        View
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedArtworks.map((artwork: Artwork) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow"
              >
                <Link href={`/artwork-passport/${artwork.id}`}>
                  <div className="flex items-center gap-4">
                    <img
                      src={artwork.imageUrl || 'https://via.placeholder.com/100'}
                      alt={artwork.title}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{artwork.title}</h3>
                      <p className="text-gray-500 text-sm mb-2">{artwork.artistName}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {artwork.genre && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full">
                            {artwork.genre}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {artwork.views || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {artwork.likes || 0}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        ${(artwork.currentPrice || artwork.basePrice).toLocaleString()}
                      </p>
                      <button className="mt-2 px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
