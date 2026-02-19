import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, TrendingUp, Target, Calendar, DollarSign, Heart,
  Share2, Clock, CheckCircle2, AlertCircle, Award, Sparkles,
  ImageIcon, Info, Plus, Eye, MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/_core/hooks/useAuth';
import { toast } from 'sonner';

interface CrowdfundingCampaign {
  id: string;
  title: string;
  description: string;
  artworkImage: string;
  artist: string;
  targetAmount: number;
  currentAmount: number;
  backers: number;
  daysLeft: number;
  status: 'active' | 'funded' | 'ended';
  category: string;
  perks: Array<{
    amount: number;
    title: string;
    description: string;
    available: number;
  }>;
  updates: number;
  creator: {
    name: string;
    avatar?: string;
  };
  createdAt: string;
}

export default function Crowdfunding() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'explore' | 'my-campaigns' | 'my-investments'>('explore');
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [showBackDialog, setShowBackDialog] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<CrowdfundingCampaign | null>(null);
  const [backAmount, setBackAmount] = useState('');
  const [selectedPerk, setSelectedPerk] = useState<number | null>(null);

  // Mock data
  const mockCampaigns: CrowdfundingCampaign[] = [
    {
      id: '1',
      title: 'Совместная покупка "Закат над морем"',
      description: 'Уникальное произведение современного художника Ивана Петрова. Масло, холст, 120x80см.',
      artworkImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
      artist: 'Иван Петров',
      targetAmount: 25000,
      currentAmount: 18500,
      backers: 12,
      daysLeft: 15,
      status: 'active',
      category: 'Живопись',
      perks: [
        { amount: 1000, title: '4% доли', description: 'Доля в произведении + цифровой сертификат', available: 10 },
        { amount: 2500, title: '10% доли', description: 'Доля + сертификат + встреча с художником', available: 5 },
        { amount: 5000, title: '20% доли', description: 'Доля + сертификат + встреча + эксклюзивный принт', available: 3 },
      ],
      updates: 3,
      creator: {
        name: 'Галерея "Современник"',
      },
      createdAt: '2026-01-25',
    },
    {
      id: '2',
      title: 'Коллективная покупка скульптуры "Движение"',
      description: 'Бронзовая скульптура молодого талантливого скульптора. Ограниченная серия.',
      artworkImage: 'https://images.unsplash.com/photo-1578926314433-e2789279f4aa?w=800',
      artist: 'Мария Смирнова',
      targetAmount: 15000,
      currentAmount: 14200,
      backers: 8,
      daysLeft: 5,
      status: 'active',
      category: 'Скульптура',
      perks: [
        { amount: 1500, title: '10% доли', description: 'Доля + сертификат подлинности', available: 8 },
        { amount: 3000, title: '20% доли', description: 'Доля + сертификат + авторская копия', available: 3 },
      ],
      updates: 5,
      creator: {
        name: 'Арт-клуб "Инвестор"',
      },
      createdAt: '2026-02-01',
    },
    {
      id: '3',
      title: 'Совместное приобретение работы "Абстракция №5"',
      description: 'Известный современный художник. Работа участвовала в международных выставках.',
      artworkImage: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800',
      artist: 'Алексей Козлов',
      targetAmount: 50000,
      currentAmount: 50000,
      backers: 25,
      daysLeft: 0,
      status: 'funded',
      category: 'Живопись',
      perks: [
        { amount: 2000, title: '4% доли', description: 'Доля + сертификат', available: 0 },
        { amount: 5000, title: '10% доли', description: 'Доля + сертификат + встреча', available: 0 },
      ],
      updates: 8,
      creator: {
        name: 'ART Investment Club',
      },
      createdAt: '2026-01-15',
    },
  ];

  const getProgressPercentage = (campaign: CrowdfundingCampaign) => {
    return Math.min((campaign.currentAmount / campaign.targetAmount) * 100, 100);
  };

  const handleBackCampaign = () => {
    if (!backAmount || parseFloat(backAmount) < 100) {
      toast.error('Минимальная сумма инвестиции - $100');
      return;
    }

    // TODO: API call to back campaign
    toast.success('Инвестиция успешно оформлена!');
    setShowBackDialog(false);
    setBackAmount('');
    setSelectedPerk(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Users className="w-10 h-10 text-purple-600" />
                Краудфандинг произведений искусства
              </h1>
              <p className="text-gray-600">
                Совместные инвестиции в искусство - покупайте доли в ценных произведениях
              </p>
            </div>
            <Button onClick={() => setShowCreateCampaign(true)} size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Создать кампанию
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Активных кампаний</p>
                    <p className="text-2xl font-bold">{mockCampaigns.filter(c => c.status === 'active').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Собрано средств</p>
                    <p className="text-2xl font-bold">
                      ${mockCampaigns.reduce((sum, c) => sum + c.currentAmount, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Всего инвесторов</p>
                    <p className="text-2xl font-bold">
                      {mockCampaigns.reduce((sum, c) => sum + c.backers, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Завершённых</p>
                    <p className="text-2xl font-bold">{mockCampaigns.filter(c => c.status === 'funded').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="explore">
              <Sparkles className="w-4 h-4 mr-2" />
              Обзор кампаний
            </TabsTrigger>
            <TabsTrigger value="my-campaigns">
              <Target className="w-4 h-4 mr-2" />
              Мои кампании (0)
            </TabsTrigger>
            <TabsTrigger value="my-investments">
              <Award className="w-4 h-4 mr-2" />
              Мои инвестиции (0)
            </TabsTrigger>
          </TabsList>

          {/* Explore Tab */}
          <TabsContent value="explore" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockCampaigns.map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-xl transition-all overflow-hidden">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={campaign.artworkImage}
                        alt={campaign.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge
                          className={
                            campaign.status === 'active'
                              ? 'bg-green-500'
                              : campaign.status === 'funded'
                              ? 'bg-purple-500'
                              : 'bg-gray-500'
                          }
                        >
                          {campaign.status === 'active' && 'Активна'}
                          {campaign.status === 'funded' && 'Профинансирована'}
                          {campaign.status === 'ended' && 'Завершена'}
                        </Badge>
                      </div>
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                          {campaign.category}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader>
                      <CardTitle className="text-xl">{campaign.title}</CardTitle>
                      <CardDescription>
                        Художник: <span className="font-semibold">{campaign.artist}</span>
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {campaign.description}
                      </p>

                      {/* Progress */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl font-bold text-gray-900">
                            ${campaign.currentAmount.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500">
                            из ${campaign.targetAmount.toLocaleString()}
                          </span>
                        </div>
                        <Progress value={getProgressPercentage(campaign)} className="h-2" />
                        <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {campaign.backers} инвесторов
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {campaign.daysLeft > 0 ? `${campaign.daysLeft} дней` : 'Завершена'}
                          </span>
                        </div>
                      </div>

                      {/* Perks Preview */}
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-700">Варианты инвестиций:</p>
                        {campaign.perks.slice(0, 2).map((perk, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                          >
                            <span className="text-sm font-medium">{perk.title}</span>
                            <span className="text-sm font-bold text-purple-600">
                              ${perk.amount.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          className="flex-1"
                          onClick={() => {
                            setSelectedCampaign(campaign);
                            setShowBackDialog(true);
                          }}
                          disabled={campaign.status !== 'active'}
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Инвестировать
                        </Button>
                        <Button variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* My Campaigns Tab */}
          <TabsContent value="my-campaigns">
            <Card>
              <CardHeader>
                <CardTitle>Мои кампании</CardTitle>
                <CardDescription>Кампании, которые вы создали</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">У вас пока нет созданных кампаний</p>
                  <Button onClick={() => setShowCreateCampaign(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Создать первую кампанию
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Investments Tab */}
          <TabsContent value="my-investments">
            <Card>
              <CardHeader>
                <CardTitle>Мои инвестиции</CardTitle>
                <CardDescription>Кампании, в которые вы инвестировали</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">У вас пока нет инвестиций</p>
                  <Button onClick={() => setActiveTab('explore')}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Исследовать кампании
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Back Campaign Dialog */}
      <Dialog open={showBackDialog} onOpenChange={setShowBackDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Инвестировать в кампанию</DialogTitle>
            <DialogDescription>
              {selectedCampaign?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Campaign Info */}
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Прогресс кампании</span>
                <span className="font-bold">
                  {selectedCampaign && getProgressPercentage(selectedCampaign).toFixed(0)}%
                </span>
              </div>
              <Progress
                value={selectedCampaign ? getProgressPercentage(selectedCampaign) : 0}
                className="mb-2"
              />
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>${selectedCampaign?.currentAmount.toLocaleString()} собрано</span>
                <span>{selectedCampaign?.daysLeft} дней осталось</span>
              </div>
            </div>

            {/* Perks Selection */}
            <div>
              <Label className="mb-3 block">Выберите вариант инвестиции</Label>
              <div className="space-y-3">
                {selectedCampaign?.perks.map((perk, index) => (
                  <div
                    key={index}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPerk === index
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-200'
                    } ${perk.available === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => {
                      if (perk.available > 0) {
                        setSelectedPerk(index);
                        setBackAmount(perk.amount.toString());
                      }
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-lg">{perk.title}</p>
                        <p className="text-sm text-gray-600">{perk.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-purple-600">
                          ${perk.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {perk.available > 0
                            ? `${perk.available} доступно`
                            : 'Распродано'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div>
              <Label htmlFor="backAmount">Или укажите свою сумму (мин. $100)</Label>
              <Input
                id="backAmount"
                type="number"
                placeholder="1000"
                value={backAmount}
                onChange={(e) => {
                  setBackAmount(e.target.value);
                  setSelectedPerk(null);
                }}
              />
            </div>

            {/* Info */}
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900">
                Вы получите долю в произведении пропорционально вашей инвестиции. Права собственности
                будут оформлены юридически после завершения кампании.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBackDialog(false)}>
              Отмена
            </Button>
            <Button onClick={handleBackCampaign}>
              <Heart className="w-4 h-4 mr-2" />
              Инвестировать ${backAmount ? parseFloat(backAmount).toLocaleString() : '0'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Campaign Dialog */}
      <Dialog open={showCreateCampaign} onOpenChange={setShowCreateCampaign}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Создать кампанию краудфандинга</DialogTitle>
            <DialogDescription>
              Привлеките инвесторов для совместной покупки произведения искусства
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-8">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Форма создания кампании будет доступна в следующей версии</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateCampaign(false)}>
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
