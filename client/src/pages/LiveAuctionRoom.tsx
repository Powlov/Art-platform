import React, { useState, useEffect, useRef } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/lib/trpc';
import { LoadingState } from '@/components/LoadingState';
import { 
  Gavel, 
  Clock, 
  Users, 
  TrendingUp, 
  AlertCircle,
  Video,
  Mic,
  MessageSquare,
  Heart,
  Share2,
  Eye,
  Zap,
  Trophy,
  ChevronUp,
  DollarSign,
  Timer,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Bid {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  timestamp: Date;
  isAutomatic?: boolean;
}

interface AuctionItem {
  id: string;
  title: string;
  artist: string;
  artistAvatar: string;
  image: string;
  description: string;
  startingPrice: number;
  currentBid: number;
  minIncrement: number;
  estimatedValue: string;
  category: string;
  year: number;
  medium: string;
  dimensions: string;
  provenance: string;
  condition: string;
  endTime: Date;
  status: 'upcoming' | 'live' | 'sold' | 'passed';
  totalBids: number;
  watchers: number;
  isHot: boolean;
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
  bidCount: number;
  isActive: boolean;
}

const MOCK_AUCTION: AuctionItem = {
  id: 'live-1',
  title: 'Абстрактная композиция "Городские огни"',
  artist: 'Александра Петрова',
  artistAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=artist1',
  image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800',
  description: 'Уникальная абстрактная композиция, созданная в 2023 году. Работа отражает динамику современного мегаполиса через призму эмоционального восприятия.',
  startingPrice: 250000,
  currentBid: 485000,
  minIncrement: 10000,
  estimatedValue: '₽500,000 - ₽700,000',
  category: 'Живопись',
  year: 2023,
  medium: 'Холст, масло',
  dimensions: '120 x 90 см',
  provenance: 'Галерея "Современное искусство", Москва',
  condition: 'Отличное',
  endTime: new Date(Date.now() + 15 * 60 * 1000), // 15 минут
  status: 'live',
  totalBids: 28,
  watchers: 156,
  isHot: true
};

const MOCK_BIDS: Bid[] = [
  { id: '1', userId: 'u1', userName: 'Collector_42', amount: 485000, timestamp: new Date(Date.now() - 30000) },
  { id: '2', userId: 'u2', userName: 'ArtLover_99', amount: 475000, timestamp: new Date(Date.now() - 120000) },
  { id: '3', userId: 'u3', userName: 'InvestorPro', amount: 465000, timestamp: new Date(Date.now() - 180000), isAutomatic: true },
];

const MOCK_PARTICIPANTS: Participant[] = [
  { id: 'u1', name: 'Collector_42', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', bidCount: 8, isActive: true },
  { id: 'u2', name: 'ArtLover_99', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', bidCount: 5, isActive: true },
  { id: 'u3', name: 'InvestorPro', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3', bidCount: 12, isActive: false },
  { id: 'u4', name: 'GalleryMaster', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4', bidCount: 3, isActive: true },
];

function LiveAuctionTimer({ endTime }: { endTime: Date }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = endTime.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft({ hours, minutes, seconds });
      setIsUrgent(diff < 5 * 60 * 1000); // Last 5 minutes
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div className={`flex items-center gap-2 font-mono text-2xl font-bold ${isUrgent ? 'text-red-600 animate-pulse' : 'text-blue-600'}`}>
      <Timer className={isUrgent ? 'animate-spin' : ''} />
      {timeLeft.hours > 0 && <span>{String(timeLeft.hours).padStart(2, '0')}:</span>}
      <span>{String(timeLeft.minutes).padStart(2, '0')}:</span>
      <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
    </div>
  );
}

function BidHistoryItem({ bid, isHighest }: { bid: Bid; isHighest: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center justify-between p-3 rounded-lg ${
        isHighest ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-50'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${isHighest ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
        <div>
          <p className="font-semibold text-sm flex items-center gap-2">
            {bid.userName}
            {isHighest && <Trophy size={14} className="text-yellow-500" />}
            {bid.isAutomatic && <Zap size={14} className="text-blue-500" title="Автоматическая ставка" />}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(bid.timestamp).toLocaleTimeString('ru-RU')}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-bold ${isHighest ? 'text-blue-600 text-lg' : 'text-gray-700'}`}>
          ₽{bid.amount.toLocaleString()}
        </p>
      </div>
    </motion.div>
  );
}

function QuickBidButton({ amount, onClick, isSelected }: { amount: number; onClick: () => void; isSelected: boolean }) {
  return (
    <Button
      variant={isSelected ? 'default' : 'outline'}
      size="sm"
      onClick={onClick}
      className={`flex-1 ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
    >
      +₽{(amount / 1000).toFixed(0)}K
    </Button>
  );
}

export default function LiveAuctionRoom() {
  const { user } = useAuth();
  const [, params] = useRoute('/auction/live/:id');
  const [, setLocation] = useLocation();
  const auctionId = params?.id ? parseInt(params.id) : null;
  
  // Query auction data from API
  const { data: auctionData, isLoading, error: queryError } = trpc.auction.getAuction.useQuery(
    { auctionId: auctionId || 0 },
    { 
      enabled: !!auctionId,
      refetchInterval: 5000 // Refresh every 5 seconds
    }
  );
  
  const { data: bidHistoryData } = trpc.auction.getBidHistory.useQuery(
    { auctionId: auctionId || 0, limit: 50, offset: 0 },
    { 
      enabled: !!auctionId,
      refetchInterval: 3000 // Refresh every 3 seconds
    }
  );
  
  const { data: participantsData } = trpc.auction.getParticipants.useQuery(
    { auctionId: auctionId || 0 },
    { enabled: !!auctionId }
  );
  
  const placeBidMutation = trpc.auction.placeBid.useMutation({
    onSuccess: () => {
      setCustomBid('');
      setSelectedQuickBid(null);
    },
    onError: (error) => {
      alert(`Ошибка: ${error.message}`);
    }
  });
  
  const [auction, setAuction] = useState<AuctionItem | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [customBid, setCustomBid] = useState('');
  const [selectedQuickBid, setSelectedQuickBid] = useState<number | null>(null);
  const [isAutoBidEnabled, setIsAutoBidEnabled] = useState(false);
  const [maxAutoBid, setMaxAutoBid] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ id: string; user: string; text: string; timestamp: Date }>>([]);
  const bidsContainerRef = useRef<HTMLDivElement>(null);

  // Transform API data to component format
  useEffect(() => {
    if (auctionData) {
      const transformedAuction: AuctionItem = {
        id: String(auctionData.id),
        title: auctionData.artwork.title,
        artist: auctionData.artwork.artistName || 'Неизвестный художник',
        artistAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=artist${auctionData.artwork.artistId}`,
        image: auctionData.artwork.imageUrl || 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800',
        description: auctionData.artwork.description || 'Описание отсутствует',
        startingPrice: parseFloat(auctionData.startPrice),
        currentBid: auctionData.currentBid ? parseFloat(auctionData.currentBid) : parseFloat(auctionData.startPrice),
        minIncrement: 10000,
        estimatedValue: `₽${parseFloat(auctionData.startPrice).toLocaleString()} - ₽${(parseFloat(auctionData.startPrice) * 1.5).toLocaleString()}`,
        category: auctionData.artwork.genre || 'Живопись',
        year: auctionData.artwork.year || new Date().getFullYear(),
        medium: auctionData.artwork.technique || 'Холст, масло',
        dimensions: auctionData.artwork.dimensions || '–',
        provenance: 'Галерея "Современное искусство"',
        condition: 'Отличное',
        endTime: new Date(auctionData.endTime),
        status: auctionData.status === 'active' ? 'live' : auctionData.status === 'completed' ? 'sold' : 'upcoming',
        totalBids: auctionData.bidsCount,
        watchers: Math.floor(Math.random() * 200) + 50,
        isHot: auctionData.bidsCount > 10 && new Date(auctionData.endTime).getTime() - Date.now() < 60 * 60 * 1000
      };
      setAuction(transformedAuction);
    }
  }, [auctionData]);

  useEffect(() => {
    if (bidHistoryData) {
      const transformedBids: Bid[] = bidHistoryData.map((bid: any) => ({
        id: String(bid.id),
        userId: String(bid.bidder.id),
        userName: bid.bidder.name || bid.bidder.username || `User_${bid.bidder.id}`,
        amount: parseFloat(bid.amount),
        timestamp: new Date(bid.timestamp),
        isAutomatic: false
      }));
      setBids(transformedBids);
    }
  }, [bidHistoryData]);

  useEffect(() => {
    if (participantsData) {
      const transformedParticipants: Participant[] = participantsData.map((p: any) => ({
        id: String(p.bidder.id),
        name: p.bidder.name || p.bidder.username || `User_${p.bidder.id}`,
        avatar: p.bidder.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.bidder.id}`,
        bidCount: p.bidCount,
        isActive: true
      }));
      setParticipants(transformedParticipants);
    }
  }, [participantsData]);

  if (isLoading || !auction) {
    return <LoadingState fullScreen message="Загружаем аукцион..." />;
  }

  if (queryError || !auctionId) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-center mb-2">Аукцион не найден</h2>
            <p className="text-gray-600 text-center mb-4">
              {queryError?.message || 'Не удалось загрузить данные аукциона'}
            </p>
            <Button onClick={() => setLocation('/auctions')} className="w-full">
              Вернуться к списку аукционов
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentBid = auction.currentBid;
  const minNextBid = currentBid + auction.minIncrement;
  const quickBidAmounts = [
    auction.minIncrement,
    auction.minIncrement * 2,
    auction.minIncrement * 5,
    auction.minIncrement * 10,
  ];

  // Auto-scroll to latest bid
  useEffect(() => {
    if (bidsContainerRef.current) {
      bidsContainerRef.current.scrollTop = 0;
    }
  }, [bids]);

  const handlePlaceBid = async (amount: number) => {
    if (!user) {
      alert('Войдите в систему для участия в аукционе');
      return;
    }

    if (amount < minNextBid) {
      alert(`Минимальная ставка: ₽${minNextBid.toLocaleString()}`);
      return;
    }

    try {
      await placeBidMutation.mutateAsync({
        auctionId: auctionId!,
        amount: String(amount)
      });
      
      // Show success message
      alert('Ставка успешно размещена!');
    } catch (error) {
      // Error is handled by mutation onError
    }
  };

  const handleQuickBid = (incrementAmount: number) => {
    const bidAmount = currentBid + incrementAmount;
    setSelectedQuickBid(incrementAmount);
    handlePlaceBid(bidAmount);
  };

  const handleCustomBid = () => {
    const amount = parseFloat(customBid);
    if (isNaN(amount)) {
      alert('Введите корректную сумму');
      return;
    }
    handlePlaceBid(amount);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim() || !user) return;
    
    const newMessage = {
      id: `msg-${Date.now()}`,
      user: user.name,
      text: chatMessage,
      timestamp: new Date(),
    };
    setMessages([...messages, newMessage]);
    setChatMessage('');
  };

  const highestBid = bids[0];
  const isUserWinning = highestBid?.userId === user?.id.toString();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-black/50 border-b border-white/10 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Gavel size={32} className="text-blue-500" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  Live Auction Room
                  <Badge variant="destructive" className="animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full mr-1" />
                    ПРЯМОЙ ЭФИР
                  </Badge>
                </h1>
                <p className="text-sm text-gray-400">Лот #{auction.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-white">
                <Users size={20} />
                <span className="font-semibold">{auction.watchers}</span>
                <Eye size={20} className="ml-2" />
              </div>
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                <Video size={16} className="mr-2" />
                Видео
              </Button>
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                <Mic size={16} className="mr-2" />
                Аудио
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Artwork Display */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <Card className="overflow-hidden bg-white/10 backdrop-blur border-white/20">
              <div className="relative">
                <img
                  src={auction.image}
                  alt={auction.title}
                  className="w-full h-[500px] object-cover"
                />
                {auction.isHot && (
                  <Badge className="absolute top-4 right-4 bg-red-500 text-white text-lg px-4 py-2">
                    <TrendingUp size={20} className="mr-2" />
                    HOT LOT
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 left-4 bg-black/50 hover:bg-black/70 text-white"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 left-16 bg-black/50 hover:bg-black/70 text-white"
                >
                  <Share2 size={20} />
                </Button>
              </div>

              <CardContent className="pt-6 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-2">{auction.title}</h2>
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={auction.artistAvatar}
                        alt={auction.artist}
                        className="w-10 h-10 rounded-full border-2 border-white"
                      />
                      <div>
                        <p className="font-semibold">{auction.artist}</p>
                        <p className="text-sm text-gray-400">{auction.year}</p>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {auction.category}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Техника</p>
                    <p className="font-semibold text-sm">{auction.medium}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Размеры</p>
                    <p className="font-semibold text-sm">{auction.dimensions}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Состояние</p>
                    <p className="font-semibold text-sm">{auction.condition}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Оценка</p>
                    <p className="font-semibold text-sm">{auction.estimatedValue}</p>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Описание</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{auction.description}</p>
                </div>

                <div className="mt-4 bg-white/5 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Провенанс</h3>
                  <p className="text-gray-300 text-sm">{auction.provenance}</p>
                </div>

                <div className="mt-4">
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                    onClick={() => setLocation(`/artwork-passport/${auctionData?.artworkId || auction.id}`)}
                  >
                    <FileText size={16} className="mr-2" />
                    Открыть паспорт произведения
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Participants */}
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users size={20} />
                  Участники ({participants.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="bg-white/5 rounded-lg p-3 text-center"
                    >
                      <div className="relative inline-block mb-2">
                        <img
                          src={participant.avatar}
                          alt={participant.name}
                          className="w-12 h-12 rounded-full"
                        />
                        {participant.isActive && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <p className="text-sm font-semibold text-white truncate">{participant.name}</p>
                      <p className="text-xs text-gray-400">{participant.bidCount} ставок</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Bidding Interface */}
          <div className="space-y-6">
            {/* Timer */}
            <Card className="bg-gradient-to-br from-blue-600 to-blue-800 border-0 text-white">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm opacity-90 mb-2">Осталось времени</p>
                  <LiveAuctionTimer endTime={auction.endTime} />
                </div>
              </CardContent>
            </Card>

            {/* Current Bid */}
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <DollarSign size={20} />
                    Текущая ставка
                  </span>
                  {isUserWinning && (
                    <Badge className="bg-green-500">
                      <Trophy size={14} className="mr-1" />
                      Лидируете!
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  key={currentBid}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center"
                >
                  <p className="text-5xl font-bold text-white mb-2">
                    ₽{currentBid.toLocaleString()}
                  </p>
                  {highestBid && (
                    <p className="text-sm text-gray-300">
                      Лидирует: <span className="font-semibold">{highestBid.userName}</span>
                    </p>
                  )}
                </motion.div>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-300">
                  <span>Стартовая: ₽{auction.startingPrice.toLocaleString()}</span>
                  <span>Ставок: {auction.totalBids}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Bid Buttons */}
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap size={20} />
                  Быстрая ставка
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {quickBidAmounts.map((amount) => (
                    <QuickBidButton
                      key={amount}
                      amount={amount}
                      onClick={() => handleQuickBid(amount)}
                      isSelected={selectedQuickBid === amount}
                    />
                  ))}
                </div>
                <div className="pt-3 border-t border-white/10">
                  <label className="text-sm text-gray-300 mb-2 block">
                    Своя ставка (мин. ₽{minNextBid.toLocaleString()})
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={customBid}
                      onChange={(e) => setCustomBid(e.target.value)}
                      placeholder={`${minNextBid}`}
                      className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white placeholder:text-gray-500"
                    />
                    <Button
                      onClick={handleCustomBid}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <ChevronUp size={16} className="mr-1" />
                      Ставка
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Auto Bid */}
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Zap size={20} />
                    Автоматическая ставка
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAutoBidEnabled}
                      onChange={(e) => setIsAutoBidEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </CardTitle>
              </CardHeader>
              {isAutoBidEnabled && (
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle size={16} className="text-blue-400 mt-0.5" />
                        <p className="text-xs text-gray-300">
                          Система будет автоматически повышать вашу ставку до указанной суммы
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">
                        Максимальная сумма
                      </label>
                      <input
                        type="number"
                        value={maxAutoBid}
                        onChange={(e) => setMaxAutoBid(e.target.value)}
                        placeholder="Например: 600000"
                        className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Bid History */}
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Clock size={20} />
                    История ставок
                  </span>
                  <Badge variant="secondary">{bids.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  ref={bidsContainerRef}
                  className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar"
                >
                  <AnimatePresence>
                    {bids.slice(0, 10).map((bid, index) => (
                      <BidHistoryItem
                        key={bid.id}
                        bid={bid}
                        isHighest={index === 0}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>

            {/* Chat Toggle */}
            <Button
              onClick={() => setShowChat(!showChat)}
              className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white"
              variant="outline"
            >
              <MessageSquare size={16} className="mr-2" />
              {showChat ? 'Скрыть чат' : 'Показать чат'}
              <Badge variant="secondary" className="ml-2">{messages.length}</Badge>
            </Button>

            {/* Chat */}
            {showChat && (
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MessageSquare size={20} />
                    Чат аукциона
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                      {messages.map((msg) => (
                        <div key={msg.id} className="bg-white/5 rounded-lg p-2">
                          <div className="flex items-start justify-between mb-1">
                            <p className="text-sm font-semibold text-white">{msg.user}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(msg.timestamp).toLocaleTimeString('ru-RU', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                          <p className="text-sm text-gray-300">{msg.text}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Введите сообщение..."
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white placeholder:text-gray-500 text-sm"
                      />
                      <Button
                        onClick={handleSendMessage}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Отправить
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}
