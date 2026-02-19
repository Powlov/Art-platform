import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Gavel, Heart, Clock, AlertCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import RoleBasedDashboard from '@/components/RoleBasedDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { dashboardAPI, auctionsAPI } from '@/services/api';

interface DashboardStats {
  totalSales: number;
  totalViews: number;
  activeAuctions: number;
  followers: number;
  revenue: number;
  portfolioValue: number;
}

interface AuctionItem {
  id: string;
  title: string;
  currentBid: number;
  timeLeft: string;
  image: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const userRole = (localStorage.getItem('userRole') || 'user') as any;
  
  // If user has a specific role, show role-based dashboard
  if (userRole && userRole !== 'user') {
    return <RoleBasedDashboard userRole={userRole} />;
  }
  
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalViews: 0,
    activeAuctions: 0,
    followers: 0,
    revenue: 0,
    portfolioValue: 0,
  });
  const [activeAuctions, setActiveAuctions] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch stats with fallback to mock data
        const statsData = await dashboardAPI.getStats(user?.id || 'guest');
        setStats({
          totalSales: statsData?.totalTransactions || 45,
          totalViews: 12500,
          activeAuctions: statsData?.activeAuctions || 8,
          followers: 324,
          revenue: statsData?.totalVolume || 125000,
          portfolioValue: statsData?.portfolioValue || 450000,
        });

        // Fetch active auctions with fallback to mock data
        const auctionsData = await dashboardAPI.getActiveAuctions(3);
        if (Array.isArray(auctionsData) && auctionsData.length > 0) {
          setActiveAuctions(auctionsData.map((auction: any) => ({
            id: auction.id || Math.random().toString(),
            title: auction.title || 'Произведение искусства',
            currentBid: auction.currentPrice || auction.currentBid || 15000,
            timeLeft: '2ч 30м',
            image: auction.image || 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=300&fit=crop'
          })));
        } else {
          // Fallback mock data
          setActiveAuctions([
            {
              id: '1',
              title: 'Абстрактная композиция',
              currentBid: 15000,
              timeLeft: '2ч 30м',
              image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=300&fit=crop'
            },
            {
              id: '2',
              title: 'Портрет в стиле модерн',
              currentBid: 8500,
              timeLeft: '5ч 15м',
              image: 'https://images.unsplash.com/photo-1578926078328-123456789012?w=300&h=300&fit=crop'
            },
            {
              id: '3',
              title: 'Пейзаж маслом',
              currentBid: 22000,
              timeLeft: '1ч 45м',
              image: 'https://images.unsplash.com/photo-1578926000000-000000000000?w=300&h=300&fit=crop'
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set default mock data on error
        setStats({
          totalSales: 45,
          totalViews: 12500,
          activeAuctions: 8,
          followers: 324,
          revenue: 125000,
          portfolioValue: 450000,
        });
        setActiveAuctions([
          {
            id: '1',
            title: 'Абстрактная композиция',
            currentBid: 15000,
            timeLeft: '2ч 30м',
            image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=300&fit=crop'
          },
          {
            id: '2',
            title: 'Портрет в стиле модерн',
            currentBid: 8500,
            timeLeft: '5ч 15м',
            image: 'https://images.unsplash.com/photo-1578926078328-123456789012?w=300&h=300&fit=crop'
          },
          {
            id: '3',
            title: 'Пейзаж маслом',
            currentBid: 22000,
            timeLeft: '1ч 45м',
            image: 'https://images.unsplash.com/photo-1578926000000-000000000000?w=300&h=300&fit=crop'
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  const getRoleSpecificContent = () => {
    const role = user?.role?.toLowerCase() || 'guest';
    
    switch (role) {
      case 'artist':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={TrendingUp} label="Продажи" value={stats.totalSales} />
              <StatCard icon={Users} label="Подписчики" value={stats.followers} />
              <StatCard icon={DollarSign} label="Доход" value={`₽${stats.revenue.toLocaleString()}`} />
              <StatCard icon={BarChart3} label="Просмотры" value={stats.totalViews} />
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Активные аукционы</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeAuctions.map(auction => (
                  <div key={auction.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                    <img src={auction.image} alt={auction.title} className="w-full h-40 object-cover" />
                    <div className="p-4">
                      <p className="font-semibold text-slate-900">{auction.title}</p>
                      <p className="text-lg font-bold text-blue-600 mt-2">₽{auction.currentBid.toLocaleString()}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-2">
                        <Clock size={16} /> {auction.timeLeft}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'collector':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Heart} label="В коллекции" value={stats.totalSales} />
              <StatCard icon={DollarSign} label="Стоимость портфеля" value={`₽${stats.portfolioValue.toLocaleString()}`} />
              <StatCard icon={Gavel} label="Активные аукционы" value={stats.activeAuctions} />
              <StatCard icon={TrendingUp} label="Прирост стоимости" value="+12.5%" />
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Рекомендуемые произведения</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeAuctions.map(auction => (
                  <div key={auction.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer">
                    <img src={auction.image} alt={auction.title} className="w-full h-40 object-cover" />
                    <div className="p-4">
                      <p className="font-semibold text-slate-900">{auction.title}</p>
                      <p className="text-lg font-bold text-green-600 mt-2">₽{auction.currentBid.toLocaleString()}</p>
                      <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">
                        Сделать ставку
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'gallery':
      case 'partner':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Users} label="Члены клуба" value={stats.followers} />
              <StatCard icon={DollarSign} label="Доход от членства" value={`₽${stats.revenue.toLocaleString()}`} />
              <StatCard icon={Gavel} label="Активные аукционы" value={stats.activeAuctions} />
              <StatCard icon={TrendingUp} label="Рост членства" value="+18%" />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3 mb-6">
              <AlertCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="font-semibold text-blue-900">Совет</p>
                <p className="text-sm text-blue-800">Используйте конструктор лендингов для привлечения новых членов клуба</p>
              </div>
            </div>
          </div>
        );

      case 'admin':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Users} label="Активные пользователи" value={2450} />
              <StatCard icon={Gavel} label="Всего аукционов" value={156} />
              <StatCard icon={DollarSign} label="Общий оборот" value={`₽${(stats.revenue * 10).toLocaleString()}`} />
              <StatCard icon={TrendingUp} label="Рост платформы" value="+25%" />
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Система мониторинга</h2>
              <p className="text-gray-600">Перейдите в раздел Администрирование для полного контроля платформы</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={BarChart3} label="Активные аукционы" value={stats.activeAuctions} />
              <StatCard icon={Users} label="Художников" value={1250} />
              <StatCard icon={Heart} label="Произведений" value={5430} />
              <StatCard icon={DollarSign} label="Общий оборот" value={`₽${(stats.revenue * 5).toLocaleString()}`} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Добро пожаловать, {user?.name || 'Гость'}!</h1>
          <p className="text-gray-600 mt-2 capitalize">Роль: {user?.role || 'guest'}</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <BarChart3 size={32} className="text-blue-600" />
            </div>
            <p className="text-gray-600 mt-4">Загрузка данных...</p>
          </div>
        ) : (
          getRoleSpecificContent()
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">{value}</p>
        </div>
        <Icon className="text-blue-600 opacity-20" size={40} />
      </div>
    </div>
  );
}
