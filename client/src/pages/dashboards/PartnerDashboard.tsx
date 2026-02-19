import React, { useState, useEffect } from 'react';
import { Users, DollarSign, TrendingUp, Handshake, FileText, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

interface PartnerStats {
  activePrograms: number;
  totalCommissions: number;
  referrals: number;
  conversionRate: string;
  monthlyGrowth: string;
  activePartners: number;
}

export default function PartnerDashboard() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PartnerStats>({
    activePrograms: 0,
    totalCommissions: 0,
    referrals: 0,
    conversionRate: '0%',
    monthlyGrowth: '+0%',
    activePartners: 0,
  });

  useEffect(() => {
    setTimeout(() => {
      setStats({
        activePrograms: 7,
        totalCommissions: 145000,
        referrals: 89,
        conversionRate: '24.5%',
        monthlyGrowth: '+18%',
        activePartners: 23,
      });
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <Handshake size={48} className="text-indigo-600" />
          </div>
          <p className="text-gray-600">Загрузка панели партнера...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">🤝 Панель Партнера</h1>
            <p className="text-gray-600 mt-2">Управляйте партнерскими программами</p>
          </div>
          <Button 
            onClick={() => setLocation('/partner/programs/new')}
            className="bg-indigo-600 hover:bg-indigo-700 w-full md:w-auto"
          >
            <FileText size={20} className="mr-2" />
            Создать программу
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        <StatCard icon={<Handshake />} label="Активные программы" value={stats.activePrograms} color="text-indigo-600" bgColor="bg-indigo-100" />
        <StatCard icon={<DollarSign />} label="Общие комиссии" value={`₽${stats.totalCommissions.toLocaleString()}`} color="text-green-600" bgColor="bg-green-100" />
        <StatCard icon={<Users />} label="Рефералы" value={stats.referrals} color="text-blue-600" bgColor="bg-blue-100" />
        <StatCard icon={<TrendingUp />} label="Конверсия" value={stats.conversionRate} color="text-purple-600" bgColor="bg-purple-100" />
        <StatCard icon={<BarChart3 />} label="Рост за месяц" value={stats.monthlyGrowth} color="text-emerald-600" bgColor="bg-emerald-100" />
        <StatCard icon={<Users />} label="Активные партнеры" value={stats.activePartners} color="text-pink-600" bgColor="bg-pink-100" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader><CardTitle>Партнерские программы</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Базовая программа', partners: 45, commission: '10%' },
                { name: 'Премиум программа', partners: 12, commission: '15%' },
                { name: 'VIP программа', partners: 5, commission: '20%' },
              ].map((program, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg cursor-pointer hover:bg-indigo-100 transition">
                  <div>
                    <p className="font-semibold text-slate-900">{program.name}</p>
                    <p className="text-sm text-gray-600">{program.partners} партнеров · Комиссия {program.commission}</p>
                  </div>
                  <TrendingUp size={20} className="text-indigo-600" />
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => setLocation('/partner/programs')}>Все программы</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Последние рефералы</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-300 to-purple-300 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">Реферал #{item}</p>
                    <p className="text-xs text-gray-600">3 дня назад · ₽{(5000 + item * 2000).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">+₽{(500 + item * 200).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">комиссия</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => setLocation('/partner/referrals')}>Все рефералы</Button>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-7xl mx-auto">
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardHeader><CardTitle>💰 Финансовая сводка</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Заработано в этом месяце</p>
                <p className="text-xl font-bold text-green-600">₽42,300</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Ожидается выплата</p>
                <p className="text-xl font-bold text-blue-600">₽18,500</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Новых партнеров</p>
                <p className="text-xl font-bold text-purple-600">7</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Активных сделок</p>
                <p className="text-xl font-bold text-orange-600">23</p>
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
