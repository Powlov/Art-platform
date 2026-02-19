import React, { useState, useEffect } from 'react';
import { Heart, DollarSign, TrendingUp, Gavel, ShoppingCart, Eye, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

interface CollectorStats {
  collectionSize: number;
  portfolioValue: number;
  activeAuctions: number;
  totalInvestment: number;
  valueGrowth: string;
  wishlistItems: number;
}

export default function CollectorDashboard() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<CollectorStats>({
    collectionSize: 0,
    portfolioValue: 0,
    activeAuctions: 0,
    totalInvestment: 0,
    valueGrowth: '+0%',
    wishlistItems: 0,
  });

  useEffect(() => {
    setTimeout(() => {
      setStats({
        collectionSize: 28,
        portfolioValue: 450000,
        activeAuctions: 5,
        totalInvestment: 385000,
        valueGrowth: '+16.9%',
        wishlistItems: 12,
      });
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <Heart size={48} className="text-blue-600" />
          </div>
          <p className="text-gray-600">Загрузка панели коллекционера...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">💎 Панель Коллекционера</h1>
            <p className="text-gray-600 mt-2">Управляйте своей коллекцией произведений искусства</p>
          </div>
          <Button 
            onClick={() => setLocation('/marketplace')}
            className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
            aria-label="Просмотреть каталог"
          >
            <ShoppingCart size={20} className="mr-2" />
            Просмотреть каталог
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        <StatCard
          icon={<Heart />}
          label="В коллекции"
          value={stats.collectionSize}
          color="text-blue-600"
          bgColor="bg-blue-100"
        />
        <StatCard
          icon={<DollarSign />}
          label="Стоимость портфеля"
          value={`₽${stats.portfolioValue.toLocaleString()}`}
          color="text-green-600"
          bgColor="bg-green-100"
        />
        <StatCard
          icon={<TrendingUp />}
          label="Прирост стоимости"
          value={stats.valueGrowth}
          color="text-emerald-600"
          bgColor="bg-emerald-100"
        />
        <StatCard
          icon={<Gavel />}
          label="Активные аукционы"
          value={stats.activeAuctions}
          color="text-purple-600"
          bgColor="bg-purple-100"
        />
        <StatCard
          icon={<DollarSign />}
          label="Общие инвестиции"
          value={`₽${stats.totalInvestment.toLocaleString()}`}
          color="text-orange-600"
          bgColor="bg-orange-100"
        />
        <StatCard
          icon={<Award />}
          label="В избранном"
          value={stats.wishlistItems}
          color="text-pink-600"
          bgColor="bg-pink-100"
        />
      </div>

      {/* Collections and Recommendations */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Моя коллекция</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="group cursor-pointer" onClick={() => setLocation('/collector/collection')}>
                  <div className="aspect-square bg-gradient-to-br from-blue-300 to-cyan-300 rounded-lg mb-2 group-hover:scale-105 transition-transform"></div>
                  <p className="text-sm font-medium text-slate-900 truncate">Произведение #{item}</p>
                  <p className="text-xs text-gray-600">₽{(15000 + item * 5000).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => setLocation('/collector/collection')}
            >
              Смотреть всю коллекцию
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Рекомендации для вас</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition cursor-pointer">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-300 to-pink-300 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">Рекомендация #{item}</p>
                    <p className="text-sm text-gray-600">Схожий стиль с вашей коллекцией</p>
                    <p className="font-bold text-blue-600 mt-1">₽{(18000 + item * 3000).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => setLocation('/marketplace')}
            >
              Смотреть больше
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Performance */}
      <div className="max-w-7xl mx-auto">
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardHeader>
            <CardTitle>📈 Динамика портфеля</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Лучшая инвестиция</p>
                <p className="text-xl font-bold text-green-600">+45%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Средний рост</p>
                <p className="text-xl font-bold text-blue-600">+16.9%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Всего сделок</p>
                <p className="text-xl font-bold text-purple-600">32</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Успешных продаж</p>
                <p className="text-xl font-bold text-orange-600">4</p>
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
