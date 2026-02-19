import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gavel, Clock, Eye, TrendingUp, FileText, Play } from 'lucide-react';
import { LoadingState } from '@/components/LoadingState';
import { trpc } from '@/lib/trpc';

interface Auction {
  id: number;
  artworkId: number;
  artworkTitle: string;
  artworkImage: string;
  artistName: string;
  startPrice: number;
  currentBid: number;
  minIncrement: number;
  highestBidder: {
    id: number;
    name: string;
    avatar: string;
  } | null;
  startTime: Date;
  endTime: Date;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  bidsCount: number;
  watchers: number;
  isHot: boolean;
}

function AuctionTimer({ endTime }: { endTime: Date }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = new Date(endTime).getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft('Завершён');
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setIsUrgent(diff < 60 * 60 * 1000); // Last hour
      
      if (hours > 0) {
        setTimeLeft(`${hours}ч ${minutes}м`);
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}м ${seconds}с`);
      } else {
        setTimeLeft(`${seconds}с`);
      }
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <span className={`font-mono font-bold ${isUrgent ? 'text-red-600' : 'text-gray-700'}`}>
      {timeLeft}
    </span>
  );
}

export default function Auctions() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming' | 'completed'>('all');

  // Query auctions using tRPC
  const { data: auctionsData, isLoading, error: queryError, refetch } = trpc.auction.getActiveAuctions.useQuery(
    { limit: 50 },
    { refetchInterval: 10000 } // Refresh every 10 seconds
  );

  // Transform API data to component format
  useEffect(() => {
    if (auctionsData) {
      const transformedAuctions: Auction[] = auctionsData.map((auction: any) => {
        const now = Date.now();
        const endTime = new Date(auction.endTime).getTime();
        const timeLeft = endTime - now;
        const isHot = timeLeft > 0 && timeLeft < 60 * 60 * 1000 && auction.bidsCount > 10;
        
        return {
          id: auction.id,
          artworkId: auction.artworkId,
          artworkTitle: auction.artworkTitle || 'Без названия',
          artworkImage: auction.artworkImage || 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800',
          artistName: auction.artistName || 'Неизвестный художник',
          startPrice: auction.startPrice || 0,
          currentBid: auction.currentBid || auction.startPrice || 0,
          minIncrement: 10000, // Default increment
          highestBidder: auction.highestBidder ? {
            id: auction.highestBidder.id,
            name: auction.highestBidder.name || auction.highestBidder.username || `User_${auction.highestBidder.id}`,
            avatar: auction.highestBidder.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${auction.highestBidder.id}`,
          } : null,
          startTime: new Date(auction.startTime),
          endTime: new Date(auction.endTime),
          status: auction.status,
          bidsCount: auction.bidsCount,
          watchers: Math.floor(Math.random() * 200) + 50, // Mock watchers for now
          isHot,
        };
      });
      
      // Apply filter
      let filtered = transformedAuctions;
      if (filter === 'live') {
        filtered = transformedAuctions.filter(a => a.status === 'active');
      } else if (filter === 'upcoming') {
        filtered = transformedAuctions.filter(a => a.status === 'pending');
      } else if (filter === 'completed') {
        filtered = transformedAuctions.filter(a => a.status === 'completed');
      }
      
      setAuctions(filtered);
      setLoading(false);
    }
  }, [auctionsData, filter]);

  useEffect(() => {
    if (queryError) {
      setError('Не удалось загрузить аукционы. Попробуйте позже.');
      setLoading(false);
    }
  }, [queryError]);

  const handleJoinAuction = (auctionId: number) => {
    // Перенаправляем на Live Auction Room с ID аукциона
    setLocation(`/auction/live/${auctionId}`);
  };

  const handleViewPassport = (artworkId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLocation(`/artwork-passport/${artworkId}`);
  };

  if (loading) {
    return <LoadingState fullScreen message="Загружаем аукционы..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <Gavel size={40} className="text-blue-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Аукционы</h1>
              <p className="text-gray-600">Участвуйте в торгах и выигрывайте уникальные произведения</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mt-6">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              size="sm"
            >
              Все ({auctions.length})
            </Button>
            <Button
              variant={filter === 'live' ? 'default' : 'outline'}
              onClick={() => setFilter('live')}
              size="sm"
              className="relative"
            >
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
              Идут сейчас
            </Button>
            <Button
              variant={filter === 'upcoming' ? 'default' : 'outline'}
              onClick={() => setFilter('upcoming')}
              size="sm"
            >
              Скоро начнутся
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              onClick={() => setFilter('completed')}
              size="sm"
            >
              Завершённые
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
            <Button onClick={() => refetch()} variant="outline" size="sm" className="mt-2">
              Попробовать снова
            </Button>
          </div>
        )}

        {auctions.length === 0 ? (
          <div className="text-center py-16">
            <Gavel size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Нет активных аукционов
            </h3>
            <p className="text-gray-500">Следите за обновлениями - скоро появятся новые лоты!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.map((auction) => {
              const isLive = auction.status === 'active';
              const isUpcoming = auction.status === 'pending';
              const isEndingSoon = isLive && new Date(auction.endTime).getTime() - Date.now() < 60 * 60 * 1000;

              return (
                <Card
                  key={auction.id}
                  className={`hover:shadow-xl transition-all duration-300 cursor-pointer group ${
                    isEndingSoon ? 'ring-2 ring-red-500 ring-offset-2' : ''
                  } ${isLive ? 'border-blue-500 border-2' : ''}`}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden h-56">
                    <img
                      src={auction.artworkImage}
                      alt={auction.artworkTitle}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {isLive && (
                        <Badge className="bg-red-500 text-white">
                          <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
                          LIVE
                        </Badge>
                      )}
                      {isUpcoming && (
                        <Badge variant="secondary">
                          Скоро
                        </Badge>
                      )}
                      {auction.isHot && (
                        <Badge className="bg-orange-500 text-white">
                          <TrendingUp size={14} className="mr-1" />
                          HOT
                        </Badge>
                      )}
                    </div>

                    {/* Watchers */}
                    <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <Eye size={12} />
                      {auction.watchers}
                    </div>
                  </div>

                  <CardContent className="pt-4">
                    {/* Title & Artist */}
                    <h3 className="font-bold text-lg mb-1 line-clamp-1">{auction.artworkTitle}</h3>
                    <p className="text-sm text-gray-600 mb-3">{auction.artistName}</p>

                    {/* Current Bid */}
                    <div className="bg-blue-50 rounded-lg p-3 mb-3">
                      <p className="text-xs text-gray-600 mb-1">
                        {auction.bidsCount === 0 ? 'Стартовая цена' : 'Текущая ставка'}
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        ₽{auction.currentBid.toLocaleString()}
                      </p>
                      {auction.highestBidder && (
                        <p className="text-xs text-gray-600 mt-1">
                          Лидирует: {auction.highestBidder.name}
                        </p>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm mb-4 pb-4 border-b">
                      <span className="text-gray-600">Ставок: {auction.bidsCount}</span>
                      <div className="flex items-center gap-1">
                        <Clock size={14} className={isEndingSoon ? 'text-red-600' : 'text-gray-600'} />
                        <AuctionTimer endTime={auction.endTime} />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <Button
                        className="w-full"
                        onClick={() => handleJoinAuction(auction.id)}
                        disabled={!isLive && !isUpcoming}
                      >
                        {isLive && (
                          <>
                            <Play size={16} className="mr-2" />
                            Войти в аукцион
                          </>
                        )}
                        {isUpcoming && 'Следить за аукционом'}
                        {auction.status === 'completed' && 'Аукцион завершён'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={(e) => handleViewPassport(auction.artworkId, e)}
                      >
                        <FileText size={14} className="mr-2" />
                        Паспорт произведения
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
