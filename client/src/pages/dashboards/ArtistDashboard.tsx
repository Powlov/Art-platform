import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, BarChart3, Upload, Clock, Eye, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { toast } from 'sonner';

interface ArtistStats {
  totalSales: number;
  followers: number;
  revenue: number;
  views: number;
  activeArtworks: number;
  averagePrice: number;
}

export default function ArtistDashboard() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ArtistStats>({
    totalSales: 0,
    followers: 0,
    revenue: 0,
    views: 0,
    activeArtworks: 0,
    averagePrice: 0,
  });

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setStats({
        totalSales: 45,
        followers: 324,
        revenue: 125000,
        views: 12500,
        activeArtworks: 18,
        averagePrice: 15600,
      });
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <BarChart3 size={48} className="text-purple-600" />
          </div>
          <p className="text-gray-600">Загрузка панели художника...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">🎨 Панель Художника</h1>
            <p className="text-gray-600 mt-2">Управляйте своими произведениями и продажами</p>
          </div>
          <Button 
            onClick={() => setLocation('/artworks/new')}
            className="bg-purple-600 hover:bg-purple-700 w-full md:w-auto"
            aria-label="Загрузить новое произведение"
          >
            <Upload size={20} className="mr-2" />
            Загрузить произведение
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        <StatCard
          icon={<TrendingUp />}
          label="Продажи"
          value={stats.totalSales}
          color="text-purple-600"
          bgColor="bg-purple-100"
        />
        <StatCard
          icon={<Users />}
          label="Подписчики"
          value={stats.followers}
          color="text-blue-600"
          bgColor="bg-blue-100"
        />
        <StatCard
          icon={<DollarSign />}
          label="Доход"
          value={`₽${stats.revenue.toLocaleString()}`}
          color="text-green-600"
          bgColor="bg-green-100"
        />
        <StatCard
          icon={<Eye />}
          label="Просмотры"
          value={stats.views.toLocaleString()}
          color="text-orange-600"
          bgColor="bg-orange-100"
        />
        <StatCard
          icon={<BarChart3 />}
          label="Активные работы"
          value={stats.activeArtworks}
          color="text-pink-600"
          bgColor="bg-pink-100"
        />
        <StatCard
          icon={<DollarSign />}
          label="Средняя цена"
          value={`₽${stats.averagePrice.toLocaleString()}`}
          color="text-indigo-600"
          bgColor="bg-indigo-100"
        />
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Активные произведения</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-300 to-pink-300 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">Произведение #{item}</p>
                    <p className="text-sm text-gray-600">24 просмотра · 3 лайка</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-600">₽15,000</p>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => setLocation('/artist/artworks')}
            >
              Смотреть все
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Недавняя активность</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { icon: Heart, text: 'Новый лайк на "Абстракция #5"', time: '2ч назад' },
                { icon: Eye, text: '12 просмотров за последний час', time: '3ч назад' },
                { icon: DollarSign, text: 'Продажа "Пейзаж маслом" за ₽22,000', time: '5ч назад' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <activity.icon size={20} className="text-purple-600 flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900">{activity.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <div className="max-w-7xl mx-auto">
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-2 text-purple-900">💡 Совет дня</h3>
            <p className="text-slate-700">
              Добавьте подробное описание к своим произведениям, чтобы привлечь больше покупателей. 
              Расскажите историю создания и технику исполнения.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
}

function StatCard({ icon, label, value, color, bgColor }: StatCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-gray-600 text-sm font-medium mb-2">{label}</p>
            <p className="text-2xl md:text-3xl font-bold text-slate-900">{value}</p>
          </div>
          <div className={`${bgColor} ${color} p-3 rounded-lg`}>
            {React.cloneElement(icon as React.ReactElement, { size: 24 })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
