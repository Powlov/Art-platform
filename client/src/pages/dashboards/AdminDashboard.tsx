import React, { useState, useEffect } from 'react';
import { Users, DollarSign, TrendingUp, ShieldCheck, AlertCircle, Activity, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

interface AdminStats {
  totalUsers: number;
  activeAuctions: number;
  totalRevenue: number;
  platformGrowth: string;
  pendingVerifications: number;
  systemHealth: string;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeAuctions: 0,
    totalRevenue: 0,
    platformGrowth: '+0%',
    pendingVerifications: 0,
    systemHealth: 'Отлично',
  });

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalUsers: 2450,
        activeAuctions: 156,
        totalRevenue: 1250000,
        platformGrowth: '+25%',
        pendingVerifications: 8,
        systemHealth: 'Отлично',
      });
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <ShieldCheck size={48} className="text-slate-600" />
          </div>
          <p className="text-gray-600">Загрузка панели администратора...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">⚙️ Панель Администратора</h1>
            <p className="text-gray-600 mt-2">Управление платформой и мониторинг</p>
          </div>
          <Button 
            onClick={() => setLocation('/admin/settings')}
            className="bg-slate-700 hover:bg-slate-800 w-full md:w-auto"
          >
            <Settings size={20} className="mr-2" />
            Настройки
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        <StatCard icon={<Users />} label="Активные пользователи" value={stats.totalUsers.toLocaleString()} color="text-blue-600" bgColor="bg-blue-100" />
        <StatCard icon={<Activity />} label="Активные аукционы" value={stats.activeAuctions} color="text-purple-600" bgColor="bg-purple-100" />
        <StatCard icon={<DollarSign />} label="Общий оборот" value={`₽${stats.totalRevenue.toLocaleString()}`} color="text-green-600" bgColor="bg-green-100" />
        <StatCard icon={<TrendingUp />} label="Рост платформы" value={stats.platformGrowth} color="text-emerald-600" bgColor="bg-emerald-100" />
        <StatCard icon={<AlertCircle />} label="Ожидают проверки" value={stats.pendingVerifications} color="text-orange-600" bgColor="bg-orange-100" />
        <StatCard icon={<ShieldCheck />} label="Состояние системы" value={stats.systemHealth} color="text-green-600" bgColor="bg-green-100" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader><CardTitle>Недавняя активность</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { type: 'user', text: 'Новый пользователь зарегистрирован', time: '5 мин назад', color: 'text-blue-600' },
                { type: 'auction', text: 'Начался новый аукцион', time: '12 мин назад', color: 'text-purple-600' },
                { type: 'sale', text: 'Произведение продано за ₽45,000', time: '25 мин назад', color: 'text-green-600' },
                { type: 'report', text: 'Новая жалоба на контент', time: '1 час назад', color: 'text-orange-600' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 ${activity.color.replace('text', 'bg')} rounded-full mt-2 flex-shrink-0`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900">{activity.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Быстрые действия</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={() => setLocation('/admin/users')}>
                <Users size={18} className="mr-2" /> Управление пользователями
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setLocation('/admin/content')}>
                <ShieldCheck size={18} className="mr-2" /> Модерация контента
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setLocation('/admin/analytics')}>
                <TrendingUp size={18} className="mr-2" /> Аналитика платформы
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setLocation('/admin/settings')}>
                <Settings size={18} className="mr-2" /> Системные настройки
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {stats.pendingVerifications > 0 && (
        <div className="max-w-7xl mx-auto">
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-orange-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-orange-900 mb-1">Требуется внимание</h3>
                  <p className="text-sm text-orange-800">
                    {stats.pendingVerifications} {stats.pendingVerifications === 1 ? 'запрос ожидает' : 'запросов ожидают'} проверки
                  </p>
                </div>
                <Button size="sm" className="ml-auto" onClick={() => setLocation('/admin/verifications')}>
                  Проверить
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
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
