import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Eye, TrendingUp, Tag, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

interface GuestStats {
  viewedArtworks: number;
  wishlistCount: number;
  auctionsWatching: number;
  recommendedCount: number;
}

export default function GuestDashboard() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<GuestStats>({
    viewedArtworks: 0,
    wishlistCount: 0,
    auctionsWatching: 0,
    recommendedCount: 0,
  });

  useEffect(() => {
    setTimeout(() => {
      setStats({
        viewedArtworks: 47,
        wishlistCount: 12,
        auctionsWatching: 5,
        recommendedCount: 23,
      });
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <Eye size={48} className="text-gray-600" />
          </div>
          <p className="text-gray-600">Загрузка панели...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">👤 Панель Пользователя</h1>
            <p className="text-gray-600 mt-2">Исследуйте мир искусства</p>
          </div>
          <Button 
            onClick={() => setLocation('/marketplace')}
            className="bg-slate-700 hover:bg-slate-800 w-full md:w-auto"
          >
            <ShoppingCart size={20} className="mr-2" />
            Смотреть каталог
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <StatCard icon={<Eye />} label="Просмотрено" value={stats.viewedArtworks} color="text-blue-600" bgColor="bg-blue-100" />
        <StatCard icon={<Heart />} label="В избранном" value={stats.wishlistCount} color="text-pink-600" bgColor="bg-pink-100" />
        <StatCard icon={<Tag />} label="Отслеживаемые аукционы" value={stats.auctionsWatching} color="text-purple-600" bgColor="bg-purple-100" />
        <StatCard icon={<Star />} label="Рекомендации" value={stats.recommendedCount} color="text-orange-600" bgColor="bg-orange-100" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader><CardTitle>Недавно просмотренные</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="group cursor-pointer" onClick={() => setLocation('/marketplace')}>
                  <div className="aspect-square bg-gradient-to-br from-gray-300 to-slate-300 rounded-lg mb-2 group-hover:scale-105 transition-transform"></div>
                  <p className="text-sm font-medium text-slate-900 truncate">Произведение #{item}</p>
                  <p className="text-xs text-gray-600">₽{(15000 + item * 3000).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => setLocation('/marketplace')}>Смотреть больше</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Избранное</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-pink-50 transition cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-300 to-purple-300 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">Избранное #{item}</p>
                    <p className="text-xs text-gray-600">Добавлено 2 дня назад</p>
                  </div>
                  <Heart size={20} className="text-pink-600 fill-pink-600" />
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => setLocation('/wishlist')}>Смотреть всё избранное</Button>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-7xl mx-auto">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader><CardTitle>✨ Станьте частью сообщества</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-slate-700">
                Зарегистрируйтесь, чтобы получить доступ к расширенным функциям:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">✓</div>
                  <div>
                    <p className="font-semibold text-sm">Участие в аукционах</p>
                    <p className="text-xs text-gray-600">Делайте ставки на понравившиеся произведения</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">✓</div>
                  <div>
                    <p className="font-semibold text-sm">Персональные рекомендации</p>
                    <p className="text-xs text-gray-600">ИИ подберет произведения по вашему вкусу</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">✓</div>
                  <div>
                    <p className="font-semibold text-sm">Доступ к закрытым мероприятиям</p>
                    <p className="text-xs text-gray-600">Участвуйте в эксклюзивных выставках</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">✓</div>
                  <div>
                    <p className="font-semibold text-sm">Общение с художниками</p>
                    <p className="text-xs text-gray-600">Задавайте вопросы напрямую авторам</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button className="flex-1" onClick={() => setLocation('/register')}>
                  Зарегистрироваться
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setLocation('/login')}>
                  Войти
                </Button>
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
