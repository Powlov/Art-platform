import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  DollarSign,
  Calendar,
  Palette,
  User,
  MapPin,
  Tag,
  Grid,
  List,
  ArrowUpDown,
  X,
  Star,
  Heart,
  Eye,
  Zap,
  Brain,
  Target,
  Image as ImageIcon,
  Maximize2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation } from 'wouter';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import { LoadingState } from '@/components/LoadingState';

interface Artwork {
  id: string;
  title: string;
  artist: string;
  category: string;
  year: number;
  price: number;
  imageUrl: string;
  dimensions: string;
  medium: string;
  location: string;
  views: number;
  favorites: number;
  rating: number;
  tags: string[];
  availability: 'available' | 'sold' | 'reserved';
  aiScore: number;
}

interface SearchFilters {
  query: string;
  category: string[];
  priceRange: [number, number];
  yearRange: [number, number];
  medium: string[];
  location: string[];
  availability: string[];
  sortBy: 'relevance' | 'price_asc' | 'price_desc' | 'date_new' | 'date_old' | 'popular' | 'ai_score';
}

const EnhancedSearch: React.FC = () => {
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [aiSearchEnabled, setAiSearchEnabled] = useState(false);
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: [],
    priceRange: [0, 10000000],
    yearRange: [1900, 2024],
    medium: [],
    location: [],
    availability: [],
    sortBy: 'relevance',
  });

  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([]);

  useEffect(() => {
    setTimeout(() => {
      const mockArtworks = generateMockArtworks(50);
      setArtworks(mockArtworks);
      setFilteredArtworks(mockArtworks);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, artworks, aiSearchEnabled]);

  const generateMockArtworks = useCallback((count: number): Artwork[] => {
    const categories = ['Живопись', 'Скульптура', 'Фотография', 'Графика', 'NFT'];
    const mediums = ['Масло', 'Акрил', 'Акварель', 'Бронза', 'Мрамор', 'Digital'];
    const locations = ['Москва', 'Санкт-Петербург', 'Казань', 'Екатеринбург', 'Новосибирск'];
    const artists = ['Анна Петрова', 'Михаил Иванов', 'Елена Смирнова', 'Дмитрий Козлов', 'Ольга Новикова'];
    const titles = ['Композиция', 'Пейзаж', 'Портрет', 'Абстракция', 'Натюрморт', 'Ночной город'];
    const availabilities: Artwork['availability'][] = ['available', 'sold', 'reserved'];

    return Array.from({ length: count }, (_, i) => ({
      id: `artwork-${i}`,
      title: `${titles[Math.floor(Math.random() * titles.length)]} №${i + 1}`,
      artist: artists[Math.floor(Math.random() * artists.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      year: 1950 + Math.floor(Math.random() * 74),
      price: Math.floor(Math.random() * 5000000) + 100000,
      imageUrl: `/artworks/placeholder-${i % 10}.jpg`,
      dimensions: `${50 + Math.floor(Math.random() * 150)}x${50 + Math.floor(Math.random() * 150)} см`,
      medium: mediums[Math.floor(Math.random() * mediums.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      views: Math.floor(Math.random() * 5000),
      favorites: Math.floor(Math.random() * 500),
      rating: 3.5 + Math.random() * 1.5,
      tags: ['современное', 'абстракция', 'коллекционное'].slice(0, Math.floor(Math.random() * 3) + 1),
      availability: availabilities[Math.floor(Math.random() * availabilities.length)],
      aiScore: Math.floor(Math.random() * 40) + 60,
    }));
  }, []);

  const applyFilters = () => {
    let filtered = [...artworks];

    // Text search
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(art =>
        art.title.toLowerCase().includes(query) ||
        art.artist.toLowerCase().includes(query) ||
        art.category.toLowerCase().includes(query) ||
        art.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (filters.category.length > 0) {
      filtered = filtered.filter(art => filters.category.includes(art.category));
    }

    // Price range
    filtered = filtered.filter(art =>
      art.price >= filters.priceRange[0] && art.price <= filters.priceRange[1]
    );

    // Year range
    filtered = filtered.filter(art =>
      art.year >= filters.yearRange[0] && art.year <= filters.yearRange[1]
    );

    // Medium filter
    if (filters.medium.length > 0) {
      filtered = filtered.filter(art => filters.medium.includes(art.medium));
    }

    // Location filter
    if (filters.location.length > 0) {
      filtered = filtered.filter(art => filters.location.includes(art.location));
    }

    // Availability filter
    if (filters.availability.length > 0) {
      filtered = filtered.filter(art => filters.availability.includes(art.availability));
    }

    // AI search enhancement
    if (aiSearchEnabled && filters.query) {
      filtered.sort((a, b) => b.aiScore - a.aiScore);
    } else {
      // Sorting
      switch (filters.sortBy) {
        case 'price_asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'date_new':
          filtered.sort((a, b) => b.year - a.year);
          break;
        case 'date_old':
          filtered.sort((a, b) => a.year - b.year);
          break;
        case 'popular':
          filtered.sort((a, b) => b.views - a.views);
          break;
        case 'ai_score':
          filtered.sort((a, b) => b.aiScore - a.aiScore);
          break;
        default:
          // relevance - keep current order
          break;
      }
    }

    setFilteredArtworks(filtered);
  };

  const toggleArrayFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => {
      const currentArray = prev[key] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(v => v !== value)
        : [...currentArray, value];
      return { ...prev, [key]: newArray };
    });
  };

  const resetFilters = () => {
    setFilters({
      query: '',
      category: [],
      priceRange: [0, 10000000],
      yearRange: [1900, 2024],
      medium: [],
      location: [],
      availability: [],
      sortBy: 'relevance',
    });
    setAiSearchEnabled(false);
  };

  const activeFiltersCount = 
    filters.category.length +
    filters.medium.length +
    filters.location.length +
    filters.availability.length +
    (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 10000000 ? 1 : 0) +
    (filters.yearRange[0] !== 1900 || filters.yearRange[1] !== 2024 ? 1 : 0);

  if (loading) {
    return <LoadingState fullScreen message="Загрузка поиска..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Search className="w-8 h-8 text-primary" />
            Расширенный поиск
            {aiSearchEnabled && (
              <Badge variant="outline" className="gap-1">
                <Brain className="w-3 h-3" />
                AI-поиск
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground">
            Найдите идеальное произведение искусства с помощью AI и продвинутых фильтров
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Поиск по названию, художнику, категории или тегам..."
                    value={filters.query}
                    onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                    className="pl-10 pr-20 h-12 text-base"
                  />
                  {filters.query && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setFilters(prev => ({ ...prev, query: '' }))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <Button
                  variant={aiSearchEnabled ? 'default' : 'outline'}
                  className="gap-2 h-12"
                  onClick={() => setAiSearchEnabled(!aiSearchEnabled)}
                >
                  <Sparkles className="w-5 h-5" />
                  AI-поиск
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 h-12"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  Фильтры
                  {activeFiltersCount > 0 && (
                    <Badge className="ml-1">{activeFiltersCount}</Badge>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-80 flex-shrink-0"
              >
                <Card className="sticky top-24">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Фильтры
                      </CardTitle>
                      {activeFiltersCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={resetFilters}>
                          Сбросить
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {/* Category */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Категория</label>
                      <div className="space-y-2">
                        {['Живопись', 'Скульптура', 'Фотография', 'Графика', 'NFT'].map(cat => (
                          <label key={cat} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.category.includes(cat)}
                              onChange={() => toggleArrayFilter('category', cat)}
                              className="rounded"
                            />
                            <span className="text-sm">{cat}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Ценовой диапазон: ₽{(filters.priceRange[0] / 1000).toFixed(0)}K - ₽{(filters.priceRange[1] / 1000).toFixed(0)}K
                      </label>
                      <Slider
                        min={0}
                        max={10000000}
                        step={100000}
                        value={filters.priceRange}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
                        className="mt-2"
                      />
                    </div>

                    {/* Year Range */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Год создания: {filters.yearRange[0]} - {filters.yearRange[1]}
                      </label>
                      <Slider
                        min={1900}
                        max={2024}
                        step={1}
                        value={filters.yearRange}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, yearRange: value as [number, number] }))}
                        className="mt-2"
                      />
                    </div>

                    {/* Medium */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Техника</label>
                      <div className="space-y-2">
                        {['Масло', 'Акрил', 'Акварель', 'Бронза', 'Мрамор', 'Digital'].map(med => (
                          <label key={med} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.medium.includes(med)}
                              onChange={() => toggleArrayFilter('medium', med)}
                              className="rounded"
                            />
                            <span className="text-sm">{med}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Локация</label>
                      <div className="space-y-2">
                        {['Москва', 'Санкт-Петербург', 'Казань', 'Екатеринбург'].map(loc => (
                          <label key={loc} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.location.includes(loc)}
                              onChange={() => toggleArrayFilter('location', loc)}
                              className="rounded"
                            />
                            <span className="text-sm">{loc}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Availability */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Доступность</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.availability.includes('available')}
                            onChange={() => toggleArrayFilter('availability', 'available')}
                            className="rounded"
                          />
                          <span className="text-sm">Доступно</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.availability.includes('reserved')}
                            onChange={() => toggleArrayFilter('availability', 'reserved')}
                            className="rounded"
                          />
                          <span className="text-sm">Зарезервировано</span>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  Найдено: <span className="font-semibold text-foreground">{filteredArtworks.length}</span> произведений
                </p>
                {aiSearchEnabled && filters.query && (
                  <Badge variant="outline" className="gap-1">
                    <Target className="w-3 h-3" />
                    AI-ранжирование активно
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as SearchFilters['sortBy'] }))}
                  className="px-3 py-2 border rounded-md text-sm bg-background"
                  disabled={aiSearchEnabled}
                >
                  <option value="relevance">По релевантности</option>
                  <option value="price_asc">Цена: по возрастанию</option>
                  <option value="price_desc">Цена: по убыванию</option>
                  <option value="date_new">Сначала новые</option>
                  <option value="date_old">Сначала старые</option>
                  <option value="popular">По популярности</option>
                  <option value="ai_score">AI рейтинг</option>
                </select>

                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results Grid/List */}
            {filteredArtworks.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
                <AnimatePresence mode="popLayout">
                  {filteredArtworks.map((artwork, index) => (
                    <motion.div
                      key={artwork.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.02 }}
                      layout
                    >
                      <Card 
                        className="hover:border-primary transition-colors cursor-pointer overflow-hidden"
                        onClick={() => navigate(`/artwork-passport/${artwork.id}`)}
                      >
                        <div className={viewMode === 'grid' ? '' : 'flex gap-4'}>
                          {/* Image */}
                          <div className={`bg-muted flex items-center justify-center relative group ${
                            viewMode === 'grid' ? 'aspect-square' : 'w-48 h-48 flex-shrink-0'
                          }`}>
                            <Palette className="w-16 h-16 text-muted-foreground opacity-20" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <Maximize2 className="w-8 h-8 text-white" />
                            </div>
                            {aiSearchEnabled && (
                              <Badge className="absolute top-2 right-2 gap-1">
                                <Zap className="w-3 h-3" />
                                {artwork.aiScore}%
                              </Badge>
                            )}
                          </div>

                          {/* Info */}
                          <CardContent className={viewMode === 'grid' ? 'pt-4' : 'flex-1 py-4'}>
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold truncate">{artwork.title}</h3>
                                <p className="text-sm text-muted-foreground truncate">{artwork.artist}</p>
                              </div>
                              <Badge variant={artwork.availability === 'available' ? 'default' : 'secondary'}>
                                {artwork.availability === 'available' ? 'Доступно' :
                                 artwork.availability === 'reserved' ? 'Зарезерв.' : 'Продано'}
                              </Badge>
                            </div>

                            <div className="text-sm text-muted-foreground mb-3 space-y-1">
                              <p>{artwork.category} • {artwork.year}</p>
                              <p>{artwork.medium} • {artwork.dimensions}</p>
                              <p className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {artwork.location}
                              </p>
                            </div>

                            <div className="flex items-center justify-between mb-3">
                              <p className="text-lg font-bold">₽{(artwork.price / 1000).toFixed(0)}K</p>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Eye className="w-4 h-4" />
                                  {artwork.views}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Heart className="w-4 h-4" />
                                  {artwork.favorites}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {artwork.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Ничего не найдено. Попробуйте изменить параметры поиска.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EnhancedSearch;
