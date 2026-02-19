import React, { useState } from 'react';
import { Users, Settings, Plus, Heart, Share2, Lock, Unlock, TrendingUp } from 'lucide-react';

interface Club {
  id: string;
  name: string;
  description: string;
  logo: string;
  members: number;
  tiers: ClubTier[];
  owner: string;
  createdAt: string;
}

interface ClubTier {
  id: string;
  name: string;
  price: number;
  benefits: string[];
  members: number;
}

export default function Clubs() {
  const [clubs, setClubs] = useState<Club[]>([
    {
      id: '1',
      name: 'Галерея Современного Искусства',
      description: 'Эксклюзивный клуб для коллекционеров и инвесторов',
      logo: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=100&h=100&fit=crop',
      members: 342,
      owner: 'Иван Петров',
      createdAt: '2024-01-15',
      tiers: [
        {
          id: '1',
          name: 'Bronze',
          price: 5000,
          benefits: ['Доступ к выставкам', 'Скидка 10%', 'Еженедельный дайджест'],
          members: 150
        },
        {
          id: '2',
          name: 'Silver',
          price: 15000,
          benefits: ['Все преимущества Bronze', 'Скидка 20%', 'Приоритетный доступ', 'Консультации'],
          members: 120
        },
        {
          id: '3',
          name: 'Gold',
          price: 50000,
          benefits: ['Все преимущества Silver', 'Скидка 30%', 'VIP события', 'Персональный менеджер'],
          members: 72
        }
      ]
    },
    {
      id: '2',
      name: 'Инвестиционный Клуб Искусства',
      description: 'Для серьёзных инвесторов в современное искусство',
      logo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=100&h=100&fit=crop',
      members: 218,
      owner: 'Мария Сидорова',
      createdAt: '2024-02-20',
      tiers: [
        {
          id: '1',
          name: 'Member',
          price: 10000,
          benefits: ['Доступ к инвестициям', 'Аналитика рынка', 'Еженедельные вебинары'],
          members: 150
        },
        {
          id: '2',
          name: 'Premium',
          price: 30000,
          benefits: ['Все преимущества Member', 'Синдикация лотов', 'Приватные события'],
          members: 68
        }
      ]
    }
  ]);

  const [selectedClub, setSelectedClub] = useState<Club | null>(clubs[0]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newClub, setNewClub] = useState({ name: '', description: '' });

  const handleCreateClub = () => {
    if (newClub.name && newClub.description) {
      const club: Club = {
        id: String(clubs.length + 1),
        name: newClub.name,
        description: newClub.description,
        logo: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=100&h=100&fit=crop',
        members: 1,
        owner: 'Вы',
        createdAt: new Date().toISOString().split('T')[0],
        tiers: [
          {
            id: '1',
            name: 'Member',
            price: 5000,
            benefits: ['Доступ к контенту', 'Участие в событиях'],
            members: 1
          }
        ]
      };
      setClubs([...clubs, club]);
      setNewClub({ name: '', description: '' });
      setShowCreateForm(false);
      setSelectedClub(club);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Клубы</h1>
            <p className="text-gray-600 mt-2">Создавайте и управляйте своими эксклюзивными клубами</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center gap-2"
          >
            <Plus size={20} /> Создать клуб
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-white rounded-lg p-6 shadow-md mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Создание нового клуба</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Название клуба</label>
                <input
                  type="text"
                  value={newClub.name}
                  onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
                  placeholder="Введите название..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Описание</label>
                <textarea
                  value={newClub.description}
                  onChange={(e) => setNewClub({ ...newClub, description: e.target.value })}
                  placeholder="Опишите вашего клуба..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleCreateClub}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition"
                >
                  Создать
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-slate-900 font-bold py-2 rounded-lg transition"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Список клубов */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Доступные клубы</h2>
            <div className="space-y-4">
              {clubs.map(club => (
                <div
                  key={club.id}
                  onClick={() => setSelectedClub(club)}
                  className={`bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition cursor-pointer ${
                    selectedClub?.id === club.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="flex gap-4">
                    <img
                      src={club.logo}
                      alt={club.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900">{club.name}</h3>
                      <p className="text-gray-600">{club.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Users size={16} /> {club.members} членов
                        </span>
                        <span>Создан: {club.createdAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Детали клуба */}
          {selectedClub && (
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="mb-6">
                <img
                  src={selectedClub.logo}
                  alt={selectedClub.name}
                  className="w-full h-40 rounded-lg object-cover mb-4"
                />
                <h2 className="text-2xl font-bold text-slate-900">{selectedClub.name}</h2>
                <p className="text-gray-600 mt-2">{selectedClub.description}</p>
                <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
                  <Users size={16} />
                  {selectedClub.members} членов
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-4">Уровни членства</h3>
              <div className="space-y-3">
                {selectedClub.tiers.map(tier => (
                  <div key={tier.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-900">{tier.name}</h4>
                      <span className="text-lg font-bold text-blue-600">{tier.price.toLocaleString()} ₽</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{tier.members} членов</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {tier.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">✓</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition mt-6">
                Присоединиться к клубу
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
