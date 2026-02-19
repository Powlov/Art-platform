import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Calendar,
  TrendingUp, 
  DollarSign,
  Package,
  ShoppingCart,
  Eye,
  Heart,
  Award
} from 'lucide-react';
import Header from '@/components/Header';
import { LoadingState } from '@/components/LoadingState';
import { trpc } from '@/lib/trpc';

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Query user transactions
  const { data: transactions, isLoading: transactionsLoading } = trpc.transaction.list.useQuery(
    { userId: user?.id || 0, limit: 50 },
    { enabled: !!user }
  );

  // Query user wishlist
  const { data: wishlist, isLoading: wishlistLoading } = trpc.wishlist.list.useQuery(
    { userId: user?.id || 0 },
    { enabled: !!user }
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Пожалуйста, войдите в систему</p>
        </div>
      </div>
    );
  }

  if (transactionsLoading || wishlistLoading) {
    return <LoadingState fullScreen message="Загружаем профиль..." />;
  }

  // Calculate statistics
  const totalPurchases = transactions?.filter(t => t.buyerId === user.id && t.type === 'sale').length || 0;
  const totalSales = transactions?.filter(t => t.sellerId === user.id && t.type === 'sale').length || 0;
  const totalSpent = transactions
    ?.filter(t => t.buyerId === user.id && t.type === 'sale')
    .reduce((sum, t) => sum + parseFloat(String(t.amount)), 0) || 0;
  const totalEarned = transactions
    ?.filter(t => t.sellerId === user.id && t.type === 'sale')
    .reduce((sum, t) => sum + parseFloat(String(t.amount)), 0) || 0;
  const wishlistCount = wishlist?.length || 0;

  const getRoleName = (role: string) => {
    const roles: Record<string, string> = {
      admin: 'Администратор',
      artist: 'Художник',
      collector: 'Коллекционер',
      gallery: 'Галерея',
      curator: 'Куратор',
      partner: 'Партнёр',
      consultant: 'Консультант',
      user: 'Пользователь',
    };
    return roles[role] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-red-500',
      artist: 'bg-purple-500',
      collector: 'bg-blue-500',
      gallery: 'bg-green-500',
      curator: 'bg-yellow-500',
      partner: 'bg-orange-500',
      consultant: 'bg-pink-500',
      user: 'bg-gray-500',
    };
    return colors[role] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto p-6">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                {user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{user.name || user.username}</h1>
                  <Badge className={`${getRoleBadgeColor(user.role)} text-white`}>
                    {getRoleName(user.role)}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-1">
                    <User size={16} />
                    @{user.username}
                  </span>
                  {user.email && (
                    <span className="flex items-center gap-1">
                      <Mail size={16} />
                      {user.email}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar size={16} />
                    Участник с {new Date(user.createdAt || Date.now()).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                {user.bio && (
                  <p className="text-gray-700">{user.bio}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Покупки</p>
                  <p className="text-2xl font-bold">{totalPurchases}</p>
                </div>
                <ShoppingCart className="text-blue-500" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Продажи</p>
                  <p className="text-2xl font-bold">{totalSales}</p>
                </div>
                <Package className="text-green-500" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Потрачено</p>
                  <p className="text-2xl font-bold">₽{totalSpent.toLocaleString()}</p>
                </div>
                <DollarSign className="text-red-500" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Заработано</p>
                  <p className="text-2xl font-bold">₽{totalEarned.toLocaleString()}</p>
                </div>
                <TrendingUp className="text-purple-500" size={32} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="transactions">Транзакции</TabsTrigger>
            <TabsTrigger value="wishlist">Избранное</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Финансовая статистика</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <span className="font-medium">Чистая прибыль</span>
                    <span className="text-2xl font-bold text-green-600">
                      ₽{(totalEarned - totalSpent).toLocaleString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Средняя покупка</p>
                      <p className="text-xl font-bold">
                        ₽{totalPurchases > 0 ? (totalSpent / totalPurchases).toLocaleString() : 0}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Средняя продажа</p>
                      <p className="text-xl font-bold">
                        ₽{totalSales > 0 ? (totalEarned / totalSales).toLocaleString() : 0}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="text-blue-600" size={20} />
                      <span className="font-medium">Избранное</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{wishlistCount} произведений</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>История транзакций</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions && transactions.length > 0 ? (
                  <div className="space-y-3">
                    {transactions.slice(0, 10).map((t: any) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div>
                          <p className="font-medium">
                            {t.type === 'sale' && t.buyerId === user.id ? 'Покупка' : 'Продажа'} #
                            {t.artworkId}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(t.createdAt).toLocaleDateString('ru-RU', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-lg font-bold ${
                              t.buyerId === user.id ? 'text-red-600' : 'text-green-600'
                            }`}
                          >
                            {t.buyerId === user.id ? '-' : '+'}₽{parseFloat(String(t.amount)).toLocaleString()}
                          </p>
                          <Badge variant={t.status === 'completed' ? 'default' : 'secondary'}>
                            {t.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">Транзакции отсутствуют</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wishlist" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Избранные произведения</CardTitle>
              </CardHeader>
              <CardContent>
                {wishlist && wishlist.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wishlist.map((item: any) => (
                      <div
                        key={item.id}
                        className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <p className="font-medium mb-1">Произведение #{item.artworkId}</p>
                        <p className="text-sm text-gray-600">
                          Добавлено {new Date(item.createdAt).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">Избранное пусто</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
