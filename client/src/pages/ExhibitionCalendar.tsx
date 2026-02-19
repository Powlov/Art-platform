import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Users,
  Eye,
  Heart,
  Share2,
  Plus,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Grid3x3,
  List,
  Star,
  TrendingUp,
  Building,
  Palette
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'wouter';

interface Exhibition {
  id: number;
  title: string;
  gallery: string;
  location: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  artist: string;
  artistAvatar: string;
  category: string;
  attendees: number;
  featured: boolean;
  status: 'upcoming' | 'ongoing' | 'past';
  description: string;
}

export default function ExhibitionCalendar() {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const exhibitions: Exhibition[] = [
    {
      id: 1,
      title: "Современное искусство XXI века",
      gallery: "Третьяковская галерея",
      location: "Москва",
      startDate: "2026-01-15",
      endDate: "2026-02-28",
      imageUrl: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400",
      artist: "Анна Петрова",
      artistAvatar: "https://i.pravatar.cc/150?img=1",
      category: "Живопись",
      attendees: 2850,
      featured: true,
      status: 'ongoing',
      description: "Уникальная выставка современного искусства"
    },
    {
      id: 2,
      title: "Скульптуры и формы",
      gallery: "Эрмитаж",
      location: "Санкт-Петербург",
      startDate: "2026-01-20",
      endDate: "2026-03-15",
      imageUrl: "https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=400",
      artist: "Иван Козлов",
      artistAvatar: "https://i.pravatar.cc/150?img=12",
      category: "Скульптура",
      attendees: 1920,
      featured: true,
      status: 'ongoing',
      description: "Выставка классических и современных скульптур"
    },
    {
      id: 3,
      title: "Фотография как искусство",
      gallery: "МАММ",
      location: "Москва",
      startDate: "2026-02-01",
      endDate: "2026-03-31",
      imageUrl: "https://images.unsplash.com/photo-1518640165326-7f615e0e1f64?w=400",
      artist: "Ольга Смирнова",
      artistAvatar: "https://i.pravatar.cc/150?img=9",
      category: "Фотография",
      attendees: 1450,
      featured: false,
      status: 'upcoming',
      description: "Современная художественная фотография"
    },
    {
      id: 4,
      title: "Цифровые миры",
      gallery: "Garage Museum",
      location: "Москва",
      startDate: "2026-02-10",
      endDate: "2026-04-30",
      imageUrl: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=400",
      artist: "Алексей Новиков",
      artistAvatar: "https://i.pravatar.cc/150?img=33",
      category: "Цифровое",
      attendees: 3200,
      featured: true,
      status: 'upcoming',
      description: "NFT и цифровое искусство нового поколения"
    }
  ];

  const stats = {
    totalExhibitions: exhibitions.length,
    ongoing: exhibitions.filter(e => e.status === 'ongoing').length,
    upcoming: exhibitions.filter(e => e.status === 'upcoming').length,
    totalAttendees: exhibitions.reduce((sum, e) => sum + e.attendees, 0)
  };

  const filteredExhibitions = exhibitions.filter(exhibition => {
    const matchesSearch = exhibition.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exhibition.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || exhibition.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || exhibition.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', { 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('ru-RU').format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <CalendarIcon className="w-8 h-8 text-blue-600" />
              Календарь выставок
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Планируйте посещение художественных выставок
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              onClick={() => setViewMode('calendar')}
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Календарь
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4 mr-2" />
              Список
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Создать
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Всего выставок</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stats.totalExhibitions}
                  </h3>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Активные</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stats.ongoing}
                  </h3>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200 dark:border-amber-800">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Предстоящие</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stats.upcoming}
                  </h3>
                </div>
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                  <CalendarIcon className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-violet-200 dark:border-violet-800">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Посетители</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {formatNumber(stats.totalAttendees)}
                  </h3>
                </div>
                <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-full">
                  <Users className="w-6 h-6 text-violet-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Поиск выставок или художников..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Категория" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  <SelectItem value="Живопись">Живопись</SelectItem>
                  <SelectItem value="Скульптура">Скульптура</SelectItem>
                  <SelectItem value="Фотография">Фотография</SelectItem>
                  <SelectItem value="Цифровое">Цифровое</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="ongoing">Активные</SelectItem>
                  <SelectItem value="upcoming">Предстоящие</SelectItem>
                  <SelectItem value="past">Прошедшие</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {viewMode === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredExhibitions.map((exhibition, index) => (
              <motion.div
                key={exhibition.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={exhibition.imageUrl}
                      alt={exhibition.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {exhibition.featured && (
                      <Badge className="absolute top-4 right-4 bg-amber-600">
                        <Star className="w-3 h-3 mr-1" />
                        Избранная
                      </Badge>
                    )}
                    <Badge className={`absolute top-4 left-4 ${
                      exhibition.status === 'ongoing' ? 'bg-green-600' :
                      exhibition.status === 'upcoming' ? 'bg-blue-600' :
                      'bg-gray-600'
                    }`}>
                      {exhibition.status === 'ongoing' ? 'Идёт сейчас' :
                       exhibition.status === 'upcoming' ? 'Скоро' : 'Завершена'}
                    </Badge>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {exhibition.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {exhibition.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={exhibition.artistAvatar} alt={exhibition.artist} />
                        <AvatarFallback>{exhibition.artist[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{exhibition.artist}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{exhibition.category}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-start gap-2">
                        <Building className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Галерея</p>
                          <p className="text-sm font-medium">{exhibition.gallery}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Локация</p>
                          <p className="text-sm font-medium">{exhibition.location}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Даты</p>
                          <p className="text-sm font-medium">
                            {new Date(exhibition.startDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })} - 
                            {new Date(exhibition.endDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Users className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Посетители</p>
                          <p className="text-sm font-medium">{formatNumber(exhibition.attendees)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Link href={`/events/${exhibition.id}`} className="flex-1">
                        <Button className="w-full" variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Детали
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Январь 2026</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    Сегодня
                  </Button>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 p-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <div
                    key={day}
                    className="aspect-square p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  >
                    <div className="text-sm font-medium mb-1">{day}</div>
                    {day === 15 && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                    {day === 20 && <div className="w-2 h-2 bg-green-600 rounded-full"></div>}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 space-y-2">
                <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400">Выставки в этом месяце:</h4>
                {filteredExhibitions.slice(0, 3).map((exhibition) => (
                  <div key={exhibition.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${
                      exhibition.status === 'ongoing' ? 'bg-green-600' : 'bg-blue-600'
                    }`}></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{exhibition.title}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}
                      </p>
                    </div>
                    <Link href={`/events/${exhibition.id}`}>
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
