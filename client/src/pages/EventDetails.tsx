import React, { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Users,
  Share2,
  Heart,
  ExternalLink,
  Download,
  Mail,
  Phone,
  Globe,
  Ticket,
  Building2,
  Award,
  Sparkles,
  BookmarkPlus,
  Navigation as NavigationIcon,
  QrCode,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import { LoadingState } from '@/components/LoadingState';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Event {
  id: number;
  title: string;
  type: 'exhibition' | 'fair' | 'auction' | 'conference' | 'workshop';
  description: string;
  startDate: string;
  endDate: string;
  venue: {
    name: string;
    address: string;
    city: string;
    country: string;
    coordinates: { lat: number; lng: number };
  };
  organizer: {
    name: string;
    email: string;
    phone: string;
    website: string;
  };
  images: string[];
  schedule: ScheduleItem[];
  participants: Participant[];
  artworks: EventArtwork[];
  tickets: TicketType[];
  isFeatured: boolean;
  capacity: number;
  registered: number;
}

interface ScheduleItem {
  id: number;
  date: string;
  time: string;
  title: string;
  description: string;
  speaker?: string;
  location: string;
  duration: number;
}

interface Participant {
  id: number;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  website?: string;
}

interface EventArtwork {
  id: number;
  title: string;
  artist: string;
  image: string;
  price: number;
  booth?: string;
}

interface TicketType {
  id: number;
  name: string;
  price: number;
  description: string;
  available: number;
  perks: string[];
}

const EventDetails: React.FC = () => {
  const [, params] = useRoute('/events/:id');
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<Event | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadEvent();
  }, [params?.id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockEvent: Event = {
        id: parseInt(params?.id || '1'),
        title: 'Международная Ярмарка Современного Искусства 2024',
        type: 'fair',
        description:
          'Крупнейшее событие в мире современного искусства. Более 200 галерей из 45 стран представят работы ведущих современных художников. Программа включает выставки, мастер-классы, конференции и нетворкинг-мероприятия.',
        startDate: '2024-12-01',
        endDate: '2024-12-05',
        venue: {
          name: 'Центральный Выставочный Комплекс',
          address: 'Кутузовский проспект, 58',
          city: 'Москва',
          country: 'Россия',
          coordinates: { lat: 55.7558, lng: 37.6173 },
        },
        organizer: {
          name: 'Art Bank Events',
          email: 'events@artbank.ru',
          phone: '+7 (495) 123-45-67',
          website: 'https://artbank.events',
        },
        images: [
          'https://images.unsplash.com/photo-1569021973826-11f0f9bdb0b3?w=1200&h=600&fit=crop',
          'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=1200&h=600&fit=crop',
        ],
        schedule: [
          {
            id: 1,
            date: '2024-12-01',
            time: '10:00',
            title: 'Церемония открытия',
            description: 'Торжественное открытие ярмарки с приветственными речами организаторов',
            speaker: 'Директор Art Bank',
            location: 'Главный зал',
            duration: 60,
          },
          {
            id: 2,
            date: '2024-12-01',
            time: '11:30',
            title: 'Экскурсия с куратором',
            description: 'Обзорная экскурсия по ключевым экспозициям ярмарки',
            speaker: 'Мария Иванова, куратор',
            location: 'Выставочные залы',
            duration: 90,
          },
          {
            id: 3,
            date: '2024-12-01',
            time: '14:00',
            title: 'Конференция: Будущее цифрового искусства',
            description: 'Панельная дискуссия с ведущими экспертами в области NFT и blockchain',
            location: 'Конференц-зал А',
            duration: 120,
          },
          {
            id: 4,
            date: '2024-12-02',
            time: '11:00',
            title: 'Мастер-класс: Современная живопись',
            description: 'Практический мастер-класс с известным художником',
            speaker: 'Анна Петрова',
            location: 'Мастерская',
            duration: 180,
          },
        ],
        participants: [
          {
            id: 1,
            name: 'Анна Петрова',
            role: 'Художница',
            bio: 'Известная современная художница, работающая в технике масляной живописи',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
            website: 'https://annapetro.art',
          },
          {
            id: 2,
            name: 'Дмитрий Соколов',
            role: 'Куратор',
            bio: 'Независимый куратор с 15-летним опытом работы в области современного искусства',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
          },
          {
            id: 3,
            name: 'Мария Иванова',
            role: 'Галерист',
            bio: 'Владелица галереи современного искусства, специализирующейся на молодых художниках',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
          },
        ],
        artworks: [
          {
            id: 1,
            title: 'Безмолвие Времени',
            artist: 'Анна Петрова',
            image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop',
            price: 850000,
            booth: 'A-12',
          },
          {
            id: 2,
            title: 'Городские Ритмы',
            artist: 'Иван Смирнов',
            image: 'https://images.unsplash.com/photo-1578926078151-9c8f7ed23024?w=400&h=400&fit=crop',
            price: 650000,
            booth: 'B-08',
          },
        ],
        tickets: [
          {
            id: 1,
            name: 'Стандартный билет',
            price: 2000,
            description: 'Доступ ко всем выставочным залам на один день',
            available: 450,
            perks: ['Вход в выставочные залы', 'Программка мероприятия'],
          },
          {
            id: 2,
            name: 'VIP билет',
            price: 5000,
            description: 'Полный доступ на весь период ярмарки + эксклюзивные мероприятия',
            available: 85,
            perks: [
              'Вход во все дни',
              'Доступ в VIP-зону',
              'Экскурсия с куратором',
              'Welcome drink',
              'Каталог ярмарки',
            ],
          },
        ],
        isFeatured: true,
        capacity: 5000,
        registered: 3847,
      };

      setEvent(mockEvent);
    } catch (error) {
      toast.error('Ошибка загрузки данных события');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Удалено из сохраненных' : 'Добавлено в сохраненные');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Ссылка скопирована в буфер обмена');
  };

  const handleRegister = (ticketId: number) => {
    toast.success('Перенаправление на страницу покупки билета...');
    // Implement ticket purchase flow
  };

  const getEventTypeText = (type: string) => {
    const types = {
      exhibition: 'Выставка',
      fair: 'Ярмарка',
      auction: 'Аукцион',
      conference: 'Конференция',
      workshop: 'Мастер-класс',
    };
    return types[type as keyof typeof types] || type;
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      exhibition: 'bg-blue-500',
      fair: 'bg-purple-500',
      auction: 'bg-red-500',
      conference: 'bg-green-500',
      workshop: 'bg-orange-500',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  // Group schedule by date
  const scheduleByDate =
    event?.schedule.reduce(
      (acc, item) => {
        const date = item.date;
        if (!acc[date]) acc[date] = [];
        acc[date].push(item);
        return acc;
      },
      {} as Record<string, ScheduleItem[]>,
    ) || {};

  const scheduleDates = Object.keys(scheduleByDate).sort();

  if (loading) {
    return <LoadingState message="Загрузка данных события..." />;
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Событие не найдено</h1>
            <Button onClick={() => navigate('/events')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Вернуться к событиям
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const daysUntilEvent = Math.ceil(
    (new Date(event.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-between"
        >
          <Button variant="ghost" onClick={() => navigate('/events')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к событиям
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleSave} className={isSaved ? 'text-blue-500' : ''}>
              <BookmarkPlus className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Hero Banner */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <Card className="overflow-hidden mb-8">
            <div className="relative h-96">
              <img
                src={event.images[0]}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className={`${getEventTypeColor(event.type)} text-white`}>
                    {getEventTypeText(event.type)}
                  </Badge>
                  {event.isFeatured && (
                    <Badge className="bg-yellow-500 text-white">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Избранное
                    </Badge>
                  )}
                  {daysUntilEvent > 0 && (
                    <Badge variant="outline" className="text-white border-white">
                      Через {daysUntilEvent} {daysUntilEvent === 1 ? 'день' : 'дней'}
                    </Badge>
                  )}
                </div>
                <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(event.startDate).toLocaleDateString('ru-RU')} -{' '}
                      {new Date(event.endDate).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {event.venue.name}, {event.venue.city}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>
                      {event.registered.toLocaleString()} / {event.capacity.toLocaleString()} участников
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Обзор</TabsTrigger>
                <TabsTrigger value="schedule">Программа</TabsTrigger>
                <TabsTrigger value="participants">Участники</TabsTrigger>
                <TabsTrigger value="artworks">Произведения</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>О событии</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {event.description}
                    </p>

                    <Separator />

                    <div>
                      <h3 className="font-semibold mb-4">Место проведения</h3>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-3">
                        <div className="flex items-start gap-3">
                          <Building2 className="w-5 h-5 text-gray-500 mt-0.5" />
                          <div>
                            <p className="font-semibold">{event.venue.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {event.venue.address}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {event.venue.city}, {event.venue.country}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setShowMap(true)}
                        >
                          <NavigationIcon className="w-4 h-4 mr-2" />
                          Показать на карте
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold mb-4">Организатор</h3>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-2">
                        <p className="font-semibold">{event.organizer.name}</p>
                        <div className="space-y-1 text-sm">
                          <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Mail className="w-4 h-4" />
                            {event.organizer.email}
                          </p>
                          <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Phone className="w-4 h-4" />
                            {event.organizer.phone}
                          </p>
                          <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Globe className="w-4 h-4" />
                            <a
                              href={event.organizer.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {event.organizer.website}
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Schedule Tab */}
              <TabsContent value="schedule">
                <Card>
                  <CardHeader>
                    <CardTitle>Программа мероприятия</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {scheduleDates.length > 1 && (
                      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        {scheduleDates.map((date, index) => (
                          <Button
                            key={date}
                            variant={selectedDay === index ? 'default' : 'outline'}
                            onClick={() => setSelectedDay(index)}
                            className="whitespace-nowrap"
                          >
                            {new Date(date).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </Button>
                        ))}
                      </div>
                    )}

                    <div className="space-y-4">
                      {scheduleByDate[scheduleDates[selectedDay]]?.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex flex-col items-center min-w-[80px]">
                              <Clock className="w-5 h-5 text-blue-500 mb-2" />
                              <span className="text-lg font-bold">{item.time}</span>
                              <span className="text-sm text-gray-500">{item.duration} мин</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {item.description}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {item.speaker && (
                                  <Badge variant="outline">
                                    <Users className="w-3 h-3 mr-1" />
                                    {item.speaker}
                                  </Badge>
                                )}
                                <Badge variant="outline">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {item.location}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Participants Tab */}
              <TabsContent value="participants">
                <Card>
                  <CardHeader>
                    <CardTitle>Участники</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {event.participants.map((participant, index) => (
                        <motion.div
                          key={participant.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                        >
                          <div className="flex items-start gap-4">
                            <img
                              src={participant.avatar}
                              alt={participant.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold">{participant.name}</h4>
                              <p className="text-sm text-gray-500 mb-2">{participant.role}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {participant.bio}
                              </p>
                              {participant.website && (
                                <a
                                  href={participant.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-500 hover:underline inline-flex items-center gap-1"
                                >
                                  <Globe className="w-3 h-3" />
                                  Сайт
                                </a>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Artworks Tab */}
              <TabsContent value="artworks">
                <Card>
                  <CardHeader>
                    <CardTitle>Представленные произведения</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {event.artworks.map((artwork, index) => (
                        <motion.div
                          key={artwork.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group cursor-pointer"
                          onClick={() => navigate(`/artwork-passport/${artwork.id}`)}
                        >
                          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative aspect-square overflow-hidden">
                              <img
                                src={artwork.image}
                                alt={artwork.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              {artwork.booth && (
                                <Badge className="absolute top-3 right-3 bg-black/70 text-white">
                                  Стенд {artwork.booth}
                                </Badge>
                              )}
                            </div>
                            <CardContent className="p-4">
                              <h4 className="font-semibold mb-1">{artwork.title}</h4>
                              <p className="text-sm text-gray-500 mb-2">{artwork.artist}</p>
                              <p className="text-lg font-bold text-blue-600">
                                {artwork.price.toLocaleString('ru-RU')} ₽
                              </p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tickets */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="w-5 h-5" />
                  Билеты
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-3"
                  >
                    <div>
                      <h4 className="font-semibold text-lg">{ticket.name}</h4>
                      <p className="text-2xl font-bold text-blue-600 mt-1">
                        {ticket.price.toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{ticket.description}</p>
                    <div className="space-y-1">
                      {ticket.perks.map((perk, index) => (
                        <p key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <Award className="w-3 h-3 text-green-500" />
                          {perk}
                        </p>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Доступно:</span>
                      <span className="font-semibold">{ticket.available} билетов</span>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleRegister(ticket.id)}
                      disabled={ticket.available === 0}
                    >
                      {ticket.available > 0 ? 'Купить билет' : 'Распродано'}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Статистика</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Users className="w-5 h-5" />
                    <span>Зарегистрировано</span>
                  </div>
                  <span className="font-bold">{event.registered.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Building2 className="w-5 h-5" />
                    <span>Галерей</span>
                  </div>
                  <span className="font-bold">200+</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Award className="w-5 h-5" />
                    <span>Произведений</span>
                  </div>
                  <span className="font-bold">5,000+</span>
                </div>
              </CardContent>
            </Card>

            {/* QR Code */}
            <Card>
              <CardHeader>
                <CardTitle>Быстрый доступ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center border-2 border-gray-200">
                    <QrCode className="w-32 h-32 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 text-center">
                    Отсканируйте для быстрого доступа к информации о событии
                  </p>
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Скачать QR-код
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Map Modal */}
      <Dialog open={showMap} onOpenChange={setShowMap}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Место проведения</DialogTitle>
            <DialogDescription>
              {event.venue.name} - {event.venue.address}
            </DialogDescription>
          </DialogHeader>
          <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Карта будет здесь</p>
              <p className="text-sm text-gray-400">
                Интеграция с Google Maps / Yandex Maps
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventDetails;
