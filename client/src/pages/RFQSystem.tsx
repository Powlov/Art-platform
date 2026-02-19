import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare, Send, Filter, Search, Clock, CheckCircle2,
  XCircle, AlertCircle, User, Building2, Palette, Tag,
  Calendar, DollarSign, FileText, Image, Plus, Edit, Trash2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

interface RFQRequest {
  id: string;
  title: string;
  description: string;
  category: 'artwork' | 'service' | 'exhibition' | 'collaboration';
  budget: { min: number; max: number };
  deadline: string;
  status: 'open' | 'quoted' | 'accepted' | 'closed';
  requester: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  quotes: number;
  createdAt: string;
  tags: string[];
}

interface Quote {
  id: string;
  rfqId: string;
  provider: {
    id: string;
    name: string;
    role: string;
    rating: number;
  };
  price: number;
  timeline: string;
  description: string;
  attachments: string[];
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export default function RFQSystem() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'browse' | 'my-requests' | 'my-quotes'>('browse');
  const [showCreateRFQ, setShowCreateRFQ] = useState(false);
  const [showQuoteDialog, setShowQuoteDialog] = useState(false);
  const [selectedRFQ, setSelectedRFQ] = useState<RFQRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // New RFQ Form State
  const [newRFQ, setNewRFQ] = useState({
    title: '',
    description: '',
    category: 'artwork' as const,
    budgetMin: '',
    budgetMax: '',
    deadline: '',
    tags: [] as string[],
  });

  // New Quote Form State
  const [newQuote, setNewQuote] = useState({
    price: '',
    timeline: '',
    description: '',
    attachments: [] as string[],
  });

  // Mock data - заменить на реальные API запросы
  const mockRFQs: RFQRequest[] = [
    {
      id: '1',
      title: 'Ищу современную абстрактную живопись для офиса',
      description: 'Необходимо 3-5 произведений в современном стиле для корпоративного офиса. Размер 120x80см.',
      category: 'artwork',
      budget: { min: 5000, max: 15000 },
      deadline: '2026-03-15',
      status: 'open',
      requester: {
        id: 'u1',
        name: 'Мария Петрова',
        role: 'Collector',
      },
      quotes: 8,
      createdAt: '2026-02-01',
      tags: ['современное искусство', 'абстракция', 'корпоративная коллекция'],
    },
    {
      id: '2',
      title: 'Организация выставки молодых художников',
      description: 'Требуется площадка и помощь в организации выставки для 15 художников. Срок - май 2026.',
      category: 'exhibition',
      budget: { min: 10000, max: 25000 },
      deadline: '2026-05-01',
      status: 'open',
      requester: {
        id: 'u2',
        name: 'Галерея "Современник"',
        role: 'Gallery',
      },
      quotes: 3,
      createdAt: '2026-02-05',
      tags: ['выставка', 'кураторство', 'молодые художники'],
    },
    {
      id: '3',
      title: 'Реставрация картины XIX века',
      description: 'Требуется профессиональная реставрация масляной живописи. Размер 80x60см, есть повреждения холста.',
      category: 'service',
      budget: { min: 3000, max: 8000 },
      deadline: '2026-04-01',
      status: 'quoted',
      requester: {
        id: 'u3',
        name: 'Андрей Смирнов',
        role: 'Collector',
      },
      quotes: 5,
      createdAt: '2026-02-08',
      tags: ['реставрация', 'живопись', 'XIX век'],
    },
  ];

  const categoryLabels = {
    artwork: 'Произведение искусства',
    service: 'Услуга',
    exhibition: 'Выставка/Мероприятие',
    collaboration: 'Сотрудничество',
  };

  const statusLabels = {
    open: 'Открыт',
    quoted: 'Есть предложения',
    accepted: 'Принято',
    closed: 'Закрыт',
  };

  const statusColors = {
    open: 'bg-green-100 text-green-800',
    quoted: 'bg-blue-100 text-blue-800',
    accepted: 'bg-purple-100 text-purple-800',
    closed: 'bg-gray-100 text-gray-800',
  };

  const handleCreateRFQ = () => {
    // Validation
    if (!newRFQ.title || !newRFQ.description || !newRFQ.budgetMin || !newRFQ.deadline) {
      toast.error('Заполните все обязательные поля');
      return;
    }

    // TODO: API call to create RFQ
    toast.success('Запрос успешно создан!');
    setShowCreateRFQ(false);
    setNewRFQ({
      title: '',
      description: '',
      category: 'artwork',
      budgetMin: '',
      budgetMax: '',
      deadline: '',
      tags: [],
    });
  };

  const handleSubmitQuote = () => {
    if (!newQuote.price || !newQuote.timeline || !newQuote.description) {
      toast.error('Заполните все обязательные поля');
      return;
    }

    // TODO: API call to submit quote
    toast.success('Предложение отправлено!');
    setShowQuoteDialog(false);
    setNewQuote({
      price: '',
      timeline: '',
      description: '',
      attachments: [],
    });
  };

  const filteredRFQs = mockRFQs.filter((rfq) => {
    const matchesStatus = filterStatus === 'all' || rfq.status === filterStatus;
    const matchesSearch = rfq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rfq.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Система запросов RFQ
              </h1>
              <p className="text-gray-600">
                Request For Quote - найдите нужные произведения, услуги или партнёров
              </p>
            </div>
            <Button onClick={() => setShowCreateRFQ(true)} size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Создать запрос
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Поиск запросов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="open">Открытые</SelectItem>
                <SelectItem value="quoted">С предложениями</SelectItem>
                <SelectItem value="accepted">Принятые</SelectItem>
                <SelectItem value="closed">Закрытые</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="browse">
              <Search className="w-4 h-4 mr-2" />
              Обзор запросов
            </TabsTrigger>
            <TabsTrigger value="my-requests">
              <FileText className="w-4 h-4 mr-2" />
              Мои запросы ({mockRFQs.filter(r => r.requester.id === user?.id).length})
            </TabsTrigger>
            <TabsTrigger value="my-quotes">
              <MessageSquare className="w-4 h-4 mr-2" />
              Мои предложения (0)
            </TabsTrigger>
          </TabsList>

          {/* Browse Tab */}
          <TabsContent value="browse" className="space-y-4">
            {filteredRFQs.map((rfq, index) => (
              <motion.div
                key={rfq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={statusColors[rfq.status]}>
                            {statusLabels[rfq.status]}
                          </Badge>
                          <Badge variant="outline">{categoryLabels[rfq.category]}</Badge>
                        </div>
                        <CardTitle className="text-xl mb-2">{rfq.title}</CardTitle>
                        <CardDescription>{rfq.description}</CardDescription>
                      </div>
                      <Button
                        onClick={() => {
                          setSelectedRFQ(rfq);
                          setShowQuoteDialog(true);
                        }}
                        variant="default"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Ответить
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        ${rfq.budget.min.toLocaleString()} - ${rfq.budget.max.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        до {new Date(rfq.deadline).toLocaleDateString('ru-RU')}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MessageSquare className="w-4 h-4" />
                        {rfq.quotes} предложений
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        {rfq.requester.name}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {rfq.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* My Requests Tab */}
          <TabsContent value="my-requests">
            <Card>
              <CardHeader>
                <CardTitle>Мои запросы</CardTitle>
                <CardDescription>Запросы, которые вы создали</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-center py-8">
                  У вас пока нет созданных запросов
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Quotes Tab */}
          <TabsContent value="my-quotes">
            <Card>
              <CardHeader>
                <CardTitle>Мои предложения</CardTitle>
                <CardDescription>Предложения, которые вы отправили</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-center py-8">
                  У вас пока нет отправленных предложений
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create RFQ Dialog */}
      <Dialog open={showCreateRFQ} onOpenChange={setShowCreateRFQ}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Создать новый запрос RFQ</DialogTitle>
            <DialogDescription>
              Опишите, что вам нужно, и получите предложения от специалистов
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Заголовок запроса *</Label>
              <Input
                id="title"
                placeholder="Краткое описание того, что вам нужно"
                value={newRFQ.title}
                onChange={(e) => setNewRFQ({ ...newRFQ, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="category">Категория *</Label>
              <Select
                value={newRFQ.category}
                onValueChange={(value: any) => setNewRFQ({ ...newRFQ, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="artwork">Произведение искусства</SelectItem>
                  <SelectItem value="service">Услуга</SelectItem>
                  <SelectItem value="exhibition">Выставка/Мероприятие</SelectItem>
                  <SelectItem value="collaboration">Сотрудничество</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Подробное описание *</Label>
              <Textarea
                id="description"
                placeholder="Опишите детально, что вам нужно..."
                rows={5}
                value={newRFQ.description}
                onChange={(e) => setNewRFQ({ ...newRFQ, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budgetMin">Минимальный бюджет ($) *</Label>
                <Input
                  id="budgetMin"
                  type="number"
                  placeholder="1000"
                  value={newRFQ.budgetMin}
                  onChange={(e) => setNewRFQ({ ...newRFQ, budgetMin: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="budgetMax">Максимальный бюджет ($)</Label>
                <Input
                  id="budgetMax"
                  type="number"
                  placeholder="5000"
                  value={newRFQ.budgetMax}
                  onChange={(e) => setNewRFQ({ ...newRFQ, budgetMax: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="deadline">Крайний срок *</Label>
              <Input
                id="deadline"
                type="date"
                value={newRFQ.deadline}
                onChange={(e) => setNewRFQ({ ...newRFQ, deadline: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateRFQ(false)}>
              Отмена
            </Button>
            <Button onClick={handleCreateRFQ}>
              Создать запрос
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit Quote Dialog */}
      <Dialog open={showQuoteDialog} onOpenChange={setShowQuoteDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Отправить предложение</DialogTitle>
            <DialogDescription>
              Запрос: {selectedRFQ?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="price">Ваша цена ($) *</Label>
              <Input
                id="price"
                type="number"
                placeholder="3000"
                value={newQuote.price}
                onChange={(e) => setNewQuote({ ...newQuote, price: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="timeline">Сроки выполнения *</Label>
              <Input
                id="timeline"
                placeholder="2 недели"
                value={newQuote.timeline}
                onChange={(e) => setNewQuote({ ...newQuote, timeline: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="quoteDescription">Описание вашего предложения *</Label>
              <Textarea
                id="quoteDescription"
                placeholder="Опишите, как вы планируете выполнить запрос..."
                rows={5}
                value={newQuote.description}
                onChange={(e) => setNewQuote({ ...newQuote, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowQuoteDialog(false)}>
              Отмена
            </Button>
            <Button onClick={handleSubmitQuote}>
              <Send className="w-4 h-4 mr-2" />
              Отправить предложение
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
