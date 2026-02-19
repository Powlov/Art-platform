import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, X, ChevronDown, ChevronUp, DollarSign,
  Calendar, Palette, User, MapPin, Grid3x3, List,
  SlidersHorizontal, BookmarkPlus, Trash2, Star,
  TrendingUp, Award, Package
} from 'lucide-react';
import { trpc } from '../lib/trpc';
import { Link } from 'wouter';
import { useAuth } from '../_core/hooks/useAuth';

interface SearchFilters {
  query: string;
  minPrice: number;
  maxPrice: number;
  genres: string[];
  artists: string[];
  yearFrom: number;
  yearTo: number;
  medium: string[];
  status: string[];
  sortBy: 'price-asc' | 'price-desc' | 'date-desc' | 'date-asc' | 'popular';
}

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
  medium?: string;
  views?: number;
  likes?: number;
}

export default function AdvancedSearch() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    minPrice: 0,
    maxPrice: 1000000,
    genres: [],
    artists: [],
    yearFrom: 1900,
    yearTo: new Date().getFullYear(),
    medium: [],
    status: ['available'],
    sortBy: 'date-desc'
  });

  // Fetch artworks with filters
  const { data: artworks = [], isLoading } = trpc.artwork.list.useQuery({
    limit: 100,
    offset: 0
  });

  // Filter artworks based on criteria
  const filteredArtworks = artworks.filter((artwork: Artwork) => {
    // Text search
    if (filters.query) {
      const searchLower = filters.query.toLowerCase();
      const matchesQuery = 
        artwork.title.toLowerCase().includes(searchLower) ||
        artwork.artistName?.toLowerCase().includes(searchLower) ||
        artwork.genre?.toLowerCase().includes(searchLower);
      if (!matchesQuery) return false;
    }

    // Price range
    const price = artwork.currentPrice || artwork.basePrice;
    if (price < filters.minPrice || price > filters.maxPrice) return false;

    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(artwork.status)) return false;

    // Genre filter
    if (filters.genres.length > 0 && artwork.genre && !filters.genres.includes(artwork.genre)) return false;

    // Year filter
    if (artwork.year) {
      if (artwork.year < filters.yearFrom || artwork.year > filters.yearTo) return false;
    }

    // Medium filter
    if (filters.medium.length > 0 && artwork.medium && !filters.medium.includes(artwork.medium)) return false;

    return true;
  });

  // Sort artworks
  const sortedArtworks = [...filteredArtworks].sort((a, b) => {
    const priceA = a.currentPrice || a.basePrice;
    const priceB = b.currentPrice || b.basePrice;

    switch (filters.sortBy) {
      case 'price-asc':
        return priceA - priceB;
      case 'price-desc':
        return priceB - priceA;
      case 'date-desc':
        return b.id - a.id; // Assuming higher ID = newer
      case 'date-asc':
        return a.id - b.id;
      case 'popular':
        return (b.views || 0) - (a.views || 0);
      default:
        return 0;
    }
  });

  const genres = ['Abstract', 'Landscape', 'Portrait', 'Still Life', 'Modern', 'Contemporary', 'Impressionism'];
  const mediums = ['Oil Paint', 'Acrylic', 'Watercolor', 'Digital', 'Mixed Media', 'Sculpture'];
  const statuses = [
    { value: 'available', label: 'Available' },
    { value: 'sold', label: 'Sold' },
    { value: 'auction', label: 'In Auction' }
  ];

  const saveSearch = () => {
    const searchName = prompt('Name this search:');
    if (searchName) {
      const newSearch = {
        id: Date.now(),
        name: searchName,
        filters: { ...filters },
        date: new Date(),
        resultsCount: sortedArtworks.length
      };
      setSavedSearches([...savedSearches, newSearch]);
      localStorage.setItem('savedSearches', JSON.stringify([...savedSearches, newSearch]));
    }
  };

  const loadSavedSearch = (search: any) => {
    setFilters(search.filters);
  };

  const deleteSavedSearch = (id: number) => {
    const updated = savedSearches.filter(s => s.id !== id);
    setSavedSearches(updated);
    localStorage.setItem('savedSearches', JSON.stringify(updated));
  };

  const resetFilters = () => {
    setFilters({
      query: '',
      minPrice: 0,
      maxPrice: 1000000,
      genres: [],
      artists: [],
      yearFrom: 1900,
      yearTo: new Date().getFullYear(),
      medium: [],
      status: ['available'],
      sortBy: 'date-desc'
    });
  };

  useEffect(() => {
    // Load saved searches from localStorage
    const saved = localStorage.getItem('savedSearches');
    if (saved) {
      setSavedSearches(JSON.parse(saved));
    }
  }, []);

  const toggleGenre = (genre: string) => {
    setFilters(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const toggleMedium = (medium: string) => {
    setFilters(prev => ({
      ...prev,
      medium: prev.medium.includes(medium)
        ? prev.medium.filter(m => m !== medium)
        : [...prev.medium, medium]
    }));
  };

  const toggleStatus = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Advanced Search
              </h1>
              <p className="text-gray-600 mt-2">
                Find the perfect artwork with powerful filters
              </p>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={saveSearch}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition-colors"
              >
                <BookmarkPlus className="w-5 h-5" />
                Save Search
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold shadow hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </motion.button>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Found <span className="font-bold text-blue-600">{sortedArtworks.length}</span> artworks
            </p>
            <div className="flex items-center gap-2">
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popular">Most Popular</option>
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
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="lg:col-span-1"
              >
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                    <button
                      onClick={resetFilters}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Reset All
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Search Query */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Search className="w-4 h-4 inline mr-2" />
                        Search
                      </label>
                      <input
                        type="text"
                        placeholder="Title, artist, genre..."
                        value={filters.query}
                        onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <DollarSign className="w-4 h-4 inline mr-2" />
                        Price Range
                      </label>
                      <div className="space-y-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={filters.minPrice}
                          onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={filters.maxPrice}
                          onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Year Range */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Year
                      </label>
                      <div className="space-y-2">
                        <input
                          type="number"
                          placeholder="From"
                          value={filters.yearFrom}
                          onChange={(e) => setFilters({ ...filters, yearFrom: Number(e.target.value) })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="number"
                          placeholder="To"
                          value={filters.yearTo}
                          onChange={(e) => setFilters({ ...filters, yearTo: Number(e.target.value) })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Genre */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Palette className="w-4 h-4 inline mr-2" />
                        Genre
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {genres.map(genre => (
                          <button
                            key={genre}
                            onClick={() => toggleGenre(genre)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                              filters.genres.includes(genre)
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {genre}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Medium */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Award className="w-4 h-4 inline mr-2" />
                        Medium
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {mediums.map(medium => (
                          <button
                            key={medium}
                            onClick={() => toggleMedium(medium)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                              filters.medium.includes(medium)
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {medium}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Package className="w-4 h-4 inline mr-2" />
                        Status
                      </label>
                      <div className="space-y-2">
                        {statuses.map(status => (
                          <label key={status.value} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={filters.status.includes(status.value)}
                              onChange={() => toggleStatus(status.value)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{status.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Saved Searches */}
                  {savedSearches.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        Saved Searches ({savedSearches.length})
                      </h3>
                      <div className="space-y-2">
                        {savedSearches.map(search => (
                          <div
                            key={search.id}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <button
                              onClick={() => loadSavedSearch(search)}
                              className="flex-1 text-left text-sm font-medium text-gray-700"
                            >
                              {search.name}
                              <span className="block text-xs text-gray-500">
                                {search.resultsCount} results
                              </span>
                            </button>
                            <button
                              onClick={() => deleteSavedSearch(search.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : sortedArtworks.length === 0 ? (
              <div className="text-center py-20">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No artworks found</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedArtworks.map((artwork: Artwork) => (
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
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-800">
                          {artwork.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1 truncate">
                        {artwork.title}
                      </h3>
                      <p className="text-gray-500 text-sm mb-2">{artwork.artistName}</p>
                      {artwork.genre && (
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full mb-2">
                          {artwork.genre}
                        </span>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <div>
                          <p className="text-sm text-gray-500">Price</p>
                          <p className="text-xl font-bold text-gray-900">
                            ${(artwork.currentPrice || artwork.basePrice).toLocaleString()}
                          </p>
                        </div>
                        <Link href={`/artwork-passport/${artwork.id}`}>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                          >
                            View
                          </motion.button>
                        </Link>
                      </div>
                    </div>
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
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={artwork.imageUrl || 'https://via.placeholder.com/100'}
                        alt={artwork.title}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">{artwork.title}</h3>
                        <p className="text-gray-500 text-sm">{artwork.artistName}</p>
                        {artwork.genre && (
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full mt-1">
                            {artwork.genre}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                          {artwork.status}
                        </span>
                        <p className="text-xl font-bold text-gray-900 mt-2">
                          ${(artwork.currentPrice || artwork.basePrice).toLocaleString()}
                        </p>
                      </div>
                      <Link href={`/artwork-passport/${artwork.id}`}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                          View Details
                        </motion.button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
