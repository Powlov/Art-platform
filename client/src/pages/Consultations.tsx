import React, { useState } from 'react';
import { Calendar, Clock, User, Star, MessageSquare, CheckCircle } from 'lucide-react';

interface Consultant {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  avatar: string;
  bio: string;
  availability: string[];
}

interface Booking {
  id: string;
  consultantId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed';
  notes: string;
}

export default function Consultations() {
  const [consultants] = useState<Consultant[]>([
    {
      id: '1',
      name: 'Александр Петров',
      specialty: 'Инвестирование в искусство',
      rating: 4.9,
      reviews: 127,
      hourlyRate: 5000,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      bio: 'Эксперт с 15-летним опытом в инвестировании в современное искусство',
      availability: ['Пн 14:00-18:00', 'Ср 10:00-14:00', 'Пт 15:00-19:00']
    },
    {
      id: '2',
      name: 'Мария Сидорова',
      specialty: 'Оценка произведений',
      rating: 4.8,
      reviews: 94,
      hourlyRate: 4500,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      bio: 'Сертифицированный оценщик произведений искусства',
      availability: ['Вт 11:00-15:00', 'Чт 14:00-18:00', 'Сб 10:00-14:00']
    },
    {
      id: '3',
      name: 'Иван Соколов',
      specialty: 'Управление коллекцией',
      rating: 4.7,
      reviews: 82,
      hourlyRate: 4000,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      bio: 'Специалист по организации и управлению коллекциями',
      availability: ['Пн 10:00-14:00', 'Ср 15:00-19:00', 'Пт 10:00-14:00']
    }
  ]);

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      consultantId: '1',
      date: '2025-11-20',
      time: '14:00',
      status: 'confirmed',
      notes: 'Консультация по инвестированию в современное искусство'
    }
  ]);

  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [bookingForm, setBookingForm] = useState({ date: '', time: '', notes: '' });

  const handleBooking = () => {
    if (selectedConsultant && bookingForm.date && bookingForm.time) {
      const newBooking: Booking = {
        id: String(bookings.length + 1),
        consultantId: selectedConsultant.id,
        date: bookingForm.date,
        time: bookingForm.time,
        status: 'pending',
        notes: bookingForm.notes
      };
      setBookings([...bookings, newBooking]);
      setBookingForm({ date: '', time: '', notes: '' });
      setSelectedConsultant(null);
      alert('Консультация забронирована! Ожидайте подтверждения.');
    }
  };

  const getConsultantName = (id: string) => {
    return consultants.find(c => c.id === id)?.name || 'Неизвестный консультант';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Консультации</h1>
        <p className="text-gray-600 mb-8">Получите профессиональную консультацию от экспертов в области искусства</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Список консультантов */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Наши консультанты</h2>
            <div className="space-y-4">
              {consultants.map(consultant => (
                <div
                  key={consultant.id}
                  className={`bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition cursor-pointer ${
                    selectedConsultant?.id === consultant.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedConsultant(consultant)}
                >
                  <div className="flex gap-4">
                    <img
                      src={consultant.avatar}
                      alt={consultant.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900">{consultant.name}</h3>
                      <p className="text-blue-600 font-semibold">{consultant.specialty}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < Math.floor(consultant.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">{consultant.rating} ({consultant.reviews} отзывов)</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{consultant.bio}</p>
                      <p className="text-lg font-bold text-slate-900 mt-2">{consultant.hourlyRate.toLocaleString()} ₽/час</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Форма бронирования */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Бронирование</h2>
            {selectedConsultant ? (
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="mb-6 pb-6 border-b">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{selectedConsultant.name}</h3>
                  <p className="text-blue-600">{selectedConsultant.specialty}</p>
                  <p className="text-lg font-bold text-slate-900 mt-2">{selectedConsultant.hourlyRate.toLocaleString()} ₽</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Дата</label>
                    <input
                      type="date"
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Время</label>
                    <select
                      value={bookingForm.time}
                      onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Выберите время</option>
                      {selectedConsultant.availability.map((slot, idx) => (
                        <option key={idx} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Заметки</label>
                    <textarea
                      value={bookingForm.notes}
                      onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                      placeholder="Опишите вашу задачу..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
                    />
                  </div>

                  <button
                    onClick={handleBooking}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition"
                  >
                    Забронировать
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg p-6 text-center text-gray-600">
                Выберите консультанта для бронирования
              </div>
            )}

            {/* История бронирований */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Мои консультации</h3>
              <div className="space-y-3">
                {bookings.map(booking => (
                  <div key={booking.id} className="bg-white rounded-lg p-4 shadow-md">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{getConsultantName(booking.consultantId)}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <Calendar size={14} />
                          {booking.date} {booking.time}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status === 'confirmed' ? 'Подтверждено' :
                         booking.status === 'completed' ? 'Завершено' : 'Ожидание'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
