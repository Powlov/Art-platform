import React, { useState, useEffect } from 'react';
import { Users, DollarSign, TrendingUp, Building2, Calendar, Eye, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

interface GalleryStats {
  activeExhibitions: number;
  totalRevenue: number;
  artistsCount: number;
  visitorsCount: number;
  salesCount: number;
  upcomingEvents: number;
}

export default function GalleryDashboard() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<GalleryStats>({
    activeExhibitions: 0,
    totalRevenue: 0,
    artistsCount: 0,
    visitorsCount: 0,
    salesCount: 0,
    upcomingEvents: 0,
  });

  useEffect(() => {
    setTimeout(() => {
      setStats({
        activeExhibitions: 3,
        totalRevenue: 580000,
        artistsCount: 24,
        visitorsCount: 1250,
        salesCount: 45,
        upcomingEvents: 7,
      });
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <Building2 size={48} className="text-amber-600" />
          </div>
          <p className="text-gray-600">Загрузка панели галереи...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">🏛️ Панель Галереи</h1>
            <p className="text-gray-600 mt-2">Управляйте выставками и сотрудничеством</p>
          </div>
          <Button 
            onClick={() => setLocation('/gallery/exhibitions/new')}
            className="bg-amber-600 hover:bg-amber-700 w-full md:w-auto"
          >
            <Calendar size={20} className="mr-2" />
            Создать выставку
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        <StatCard icon={<Calendar />} label="Активные выставки" value={stats.activeExhibitions} color="text-amber-600" bgColor="bg-amber-100" />
        <StatCard icon={<DollarSign />} label="Общий доход" value={`₽${stats.totalRevenue.toLocaleString()}`} color="text-green-600" bgColor="bg-green-100" />
        <StatCard icon={<Users />} label="Художников" value={stats.artistsCount} color="text-blue-600" bgColor="bg-blue-100" />
        <StatCard icon={<Eye />} label="Посетителей" value={stats.visitorsCount.toLocaleString()} color="text-purple-600" bgColor="bg-purple-100" />
        <StatCard icon={<Award />} label="Продаж" value={stats.salesCount} color="text-pink-600" bgColor="bg-pink-100" />
        <StatCard icon={<Calendar />} label="Предстоящие события" value={stats.upcomingEvents} color="text-orange-600" bgColor="bg-orange-100" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader><CardTitle>Активные выставки</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center gap-4 p-3 bg-amber-50 rounded-lg cursor-pointer hover:bg-amber-100 transition">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-300 to-orange-300 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">Выставка #{item}</p>
                    <p className="text-sm text-gray-600">До 15 января · 8 произведений</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => setLocation('/gallery/exhibitions')}>Все выставки</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Наши художники</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition cursor-pointer">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">Художник #{item}</p>
                    <p className="text-xs text-gray-600">{5 + item} произведений</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => setLocation('/gallery/artists')}>Все художники</Button>
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
