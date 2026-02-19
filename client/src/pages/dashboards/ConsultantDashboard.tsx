import React, { useState, useEffect } from 'react';
import { Users, DollarSign, TrendingUp, FileCheck, Calendar, PhoneCall } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

interface ConsultantStats {
  activeClients: number;
  totalRevenue: number;
  completedConsultations: number;
  scheduledAppointments: number;
  avgRating: number;
  portfoliosManaged: number;
}

export default function ConsultantDashboard() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ConsultantStats>({
    activeClients: 0,
    totalRevenue: 0,
    completedConsultations: 0,
    scheduledAppointments: 0,
    avgRating: 0,
    portfoliosManaged: 0,
  });

  useEffect(() => {
    setTimeout(() => {
      setStats({
        activeClients: 34,
        totalRevenue: 285000,
        completedConsultations: 127,
        scheduledAppointments: 8,
        avgRating: 4.9,
        portfoliosManaged: 42,
      });
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <FileCheck size={48} className="text-green-600" />
          </div>
          <p className="text-gray-600">Загрузка панели консультанта...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">💼 Панель Консультанта</h1>
            <p className="text-gray-600 mt-2">Консультируйте клиентов по инвестициям в искусство</p>
          </div>
          <Button 
            onClick={() => setLocation('/consultant/appointments/new')}
            className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
          >
            <Calendar size={20} className="mr-2" />
            Назначить встречу
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        <StatCard icon={<Users />} label="Активные клиенты" value={stats.activeClients} color="text-green-600" bgColor="bg-green-100" />
        <StatCard icon={<DollarSign />} label="Общий доход" value={`₽${stats.totalRevenue.toLocaleString()}`} color="text-emerald-600" bgColor="bg-emerald-100" />
        <StatCard icon={<FileCheck />} label="Завершенных консультаций" value={stats.completedConsultations} color="text-blue-600" bgColor="bg-blue-100" />
        <StatCard icon={<Calendar />} label="Запланировано встреч" value={stats.scheduledAppointments} color="text-purple-600" bgColor="bg-purple-100" />
        <StatCard icon={<TrendingUp />} label="Средняя оценка" value={stats.avgRating.toFixed(1)} color="text-orange-600" bgColor="bg-orange-100" />
        <StatCard icon={<FileCheck />} label="Портфелей под управлением" value={stats.portfoliosManaged} color="text-teal-600" bgColor="bg-teal-100" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader><CardTitle>Предстоящие консультации</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Иван Петров', time: 'Сегодня, 14:00', topic: 'Инвестиции в современное искусство' },
                { name: 'Мария Сидорова', time: 'Завтра, 10:30', topic: 'Оценка коллекции' },
                { name: 'Дмитрий Козлов', time: 'Завтра, 15:00', topic: 'Стратегия покупки' },
              ].map((appointment, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition">
                  <PhoneCall size={20} className="text-green-600 flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900">{appointment.name}</p>
                    <p className="text-sm text-gray-600">{appointment.time}</p>
                    <p className="text-xs text-gray-500 mt-1">{appointment.topic}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => setLocation('/consultant/appointments')}>Все встречи</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Мои клиенты</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-300 to-teal-300 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">Клиент #{item}</p>
                    <p className="text-xs text-gray-600">Портфель: ₽{(250000 + item * 50000).toLocaleString()}</p>
                  </div>
                  <TrendingUp size={16} className="text-green-600" />
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => setLocation('/consultant/clients')}>Все клиенты</Button>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-7xl mx-auto">
        <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
          <CardHeader><CardTitle>📈 Статистика эффективности</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Доходность клиентов</p>
                <p className="text-xl font-bold text-green-600">+18.5%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Успешных сделок</p>
                <p className="text-xl font-bold text-blue-600">94%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Повторных обращений</p>
                <p className="text-xl font-bold text-purple-600">87%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Рекомендаций</p>
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
