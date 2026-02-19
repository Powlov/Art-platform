import React, { useState, useEffect } from 'react';
import { Calendar, Users, Eye, Award, FileText, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

interface CuratorStats {
  activeExhibitions: number;
  upcomingEvents: number;
  totalVisitors: number;
  curatedArtworks: number;
  avgRating: number;
  collaborations: number;
}

export default function CuratorDashboard() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<CuratorStats>({
    activeExhibitions: 0,
    upcomingEvents: 0,
    totalVisitors: 0,
    curatedArtworks: 0,
    avgRating: 0,
    collaborations: 0,
  });

  useEffect(() => {
    setTimeout(() => {
      setStats({
        activeExhibitions: 5,
        upcomingEvents: 12,
        totalVisitors: 3200,
        curatedArtworks: 87,
        avgRating: 4.8,
        collaborations: 15,
      });
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <Award size={48} className="text-red-600" />
          </div>
          <p className="text-gray-600">Загрузка панели куратора...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">🎭 Панель Куратора</h1>
            <p className="text-gray-600 mt-2">Организуйте выставки и мероприятия</p>
          </div>
          <Button 
            onClick={() => setLocation('/curator/exhibitions/new')}
            className="bg-red-600 hover:bg-red-700 w-full md:w-auto"
          >
            <Calendar size={20} className="mr-2" />
            Создать выставку
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        <StatCard icon={<Calendar />} label="Активные выставки" value={stats.activeExhibitions} color="text-red-600" bgColor="bg-red-100" />
        <StatCard icon={<Users />} label="Предстоящие события" value={stats.upcomingEvents} color="text-purple-600" bgColor="bg-purple-100" />
        <StatCard icon={<Eye />} label="Всего посетителей" value={stats.totalVisitors.toLocaleString()} color="text-blue-600" bgColor="bg-blue-100" />
        <StatCard icon={<FileText />} label="Курируемые работы" value={stats.curatedArtworks} color="text-green-600" bgColor="bg-green-100" />
        <StatCard icon={<Award />} label="Средняя оценка" value={stats.avgRating.toFixed(1)} color="text-orange-600" bgColor="bg-orange-100" />
        <StatCard icon={<Users />} label="Сотрудничества" value={stats.collaborations} color="text-pink-600" bgColor="bg-pink-100" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader><CardTitle>Текущие выставки</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center gap-4 p-3 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 transition">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-300 to-pink-300 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">Выставка "{item === 1 ? 'Современное искусство' : item === 2 ? 'Классика XX века' : 'Новые горизонты'}"</p>
                    <p className="text-sm text-gray-600">15 произведений · 450 посетителей</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => setLocation('/curator/exhibitions')}>Все выставки</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Предстоящие мероприятия</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Открытие галереи', date: '15 января', attendees: 120 },
                { name: 'Мастер-класс', date: '18 января', attendees: 45 },
                { name: 'Аукцион', date: '22 января', attendees: 200 },
              ].map((event, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                  <Calendar size={20} className="text-red-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{event.name}</p>
                    <p className="text-xs text-gray-600">{event.date} · {event.attendees} участников</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => setLocation('/curator/events')}>Все мероприятия</Button>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-7xl mx-auto">
        <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
          <CardHeader><CardTitle>📊 Статистика за месяц</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Новых выставок</p>
                <p className="text-xl font-bold text-red-600">7</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Рост посещаемости</p>
                <p className="text-xl font-bold text-green-600">+32%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Новых партнеров</p>
                <p className="text-xl font-bold text-blue-600">4</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Положительных отзывов</p>
                <p className="text-xl font-bold text-purple-600">96%</p>
              </div>
            </div>
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
