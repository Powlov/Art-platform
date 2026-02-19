import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ShoppingCart, Search, Filter, FileText } from 'lucide-react';
import Header from '@/components/Header';
import { trpc } from '@/lib/trpc';
import { LoadingState } from '@/components/LoadingState';
import { toast } from 'sonner';

interface Artwork {
  id: number;
  title: string;
  artist: string;
  artistId: number;
  price: number;
  image: string;
  category: string;
  medium: string;
  year: number;
  description: string;
  status: 'available' | 'sold' | 'auction' | 'unavailable';
}

const CATEGORIES = ['All', 'Живопись', 'Скульптура', 'Фотография', 'Графика', 'Абстракция'];
const MEDIUMS = ['All', 'Масло', 'Акрил', 'Акварель', 'Смешанная техника', 'Холст'];

export default function Marketplace() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMedium, setSelectedMedium] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [showFilters, setShowFilters] = useState(false);

  // Query artworks from API
  const { data: artworksData, isLoading, error } = trpc.artwork.list.useQuery(
    { limit: 100, offset: 0 },
    { refetchInterval: 30000 } // Refresh every 30 seconds
  );

  // Purchase mutation
  const purchaseMutation = trpc.artwork.purchase.useMutation({
    onSuccess: () => {
      toast.success('\u041f\u043e\u043a\u0443\u043f\u043a\u0430 \u0443\u0441\u043f\u0435\u0448\u043d\u043e \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u0430!');
      // Refresh artworks list
      window.location.reload();
    },
    onError: (error) => {
      toast.error(`\u041e\u0448\u0438\u0431\u043a\u0430 \u043f\u043e\u043a\u0443\u043f\u043a\u0438: ${error.message}`);
    }
  });

  // Transform API data
  useEffect(() => {
    if (artworksData) {
      const transformed: Artwork[] = artworksData
        .filter((a: any) => a.status === 'available')
        .map((a: any) => ({
          id: a.id,
          title: a.title,
          artist: 'Художник',
          artistId: a.artistId || 0,
          price: parseFloat(a.currentPrice || a.basePrice || '0'),
          image: a.imageUrl || 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800',
          category: a.genre || 'Живопись',
          medium: a.technique || 'Холст, масло',
          year: a.year || new Date().getFullYear(),
          description: a.description || 'Описание отсутствует',
          status: a.status,
        }));
      setArtworks(transformed);
    }
  }, [artworksData]);

  useEffect(() => {
    const saved = localStorage.getItem(`favorites_${user?.id}`);
    if (saved) {
      setFavorites(new Set(JSON.parse(saved)));
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(Array.from(favorites)));
    }
  }, [favorites, user?.id]);

  const filteredArtworks = artworks.filter((artwork) => {
    const matchesSearch =
      artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artwork.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || artwork.category === selectedCategory;
    const matchesMedium = selectedMedium === 'All' || artwork.medium === selectedMedium;
    const matchesCondition = true; // Remove condition filter
    const matchesPrice = artwork.price >= priceRange[0] && artwork.price <= priceRange[1];

    return matchesSearch && matchesCategory && matchesMedium && matchesCondition && matchesPrice;
  });

  const toggleFavorite = (id: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
      toast.success('Удалено из избранного');
    } else {
      newFavorites.add(id);
      toast.success('Добавлено в избранное');
    }
    setFavorites(newFavorites);
  };

  const handlePurchase = async (artwork: Artwork) => {
    if (!user) {
      toast.error('Войдите в систему для покупки');
      setLocation('/login');
      return;
    }

    const confirmed = window.confirm(
      `Подтвердите покупку:\n\n"${artwork.title}"\nЦена: ₽${artwork.price.toLocaleString()}\n\nПродолжить?`
    );

    if (!confirmed) return;

    try {
      await purchaseMutation.mutateAsync({
        artworkId: artwork.id,
        price: String(artwork.price)
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleViewDetails = (artworkId: number) => {
    setLocation(`/artwork-passport/${artworkId}`);
  };

  if (isLoading) {
    return <LoadingState fullScreen message="Загружаем произведения..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Ошибка загрузки данных</p>
          <Button onClick={() => window.location.reload()}>Обновить</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-4">Маркетплейс</h1>
          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Поиск по названию или художнику..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter size={20} />
              Фильтры
            </Button>
          </div>
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium mb-2">Категория</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Техника</label>
                <select
                  value={selectedMedium}
                  onChange={(e) => setSelectedMedium(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                >
                  {MEDIUMS.map((med) => (
                    <option key={med} value={med}>{med}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Цена: {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} ₽
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="10000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>
            </div>
          )}
          <p className="text-sm text-gray-600">Найдено произведений: {filteredArtworks.length}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredArtworks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredArtworks.map((artwork) => (
              <Card key={artwork.id} className="hover:shadow-lg transition-shadow">
                <div className="relative overflow-hidden bg-gray-200 h-64">
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                  <button
                    onClick={() => toggleFavorite(artwork.id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full hover:bg-gray-100"
                  >
                    <Heart
                      size={20}
                      className={favorites.has(artwork.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                    />
                  </button>
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-bold text-lg mb-1">{artwork.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{artwork.artist}</p>
                  <p className="text-xs text-gray-500 mb-3">
                    {artwork.medium} • {artwork.year}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-blue-600">
                      ₽{artwork.price.toLocaleString()}
                    </span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      {artwork.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{artwork.description}</p>
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 flex items-center justify-center gap-2"
                      onClick={() => handlePurchase(artwork)}
                    >
                      <ShoppingCart size={16} />
                      Купить
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleViewDetails(artwork.id)}
                    >
                      <FileText size={14} className="mr-1" />
                      Подробнее
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Произведений не найдено</p>
          </div>
        )}
      </div>
    </div>
  );
}
