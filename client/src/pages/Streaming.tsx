import React, { useState, useEffect } from 'react';
import { Play, MessageSquare, Share2, Heart, Users, Clock } from 'lucide-react';

interface Stream {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  isLive: boolean;
  viewers: number;
  startTime: string;
  duration?: number;
  host: string;
  auctionId?: string;
}

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  likes: number;
}

export default function Streaming() {
  const [streams, setStreams] = useState<Stream[]>([
    {
      id: '1',
      title: 'Аукцион современного искусства - Сессия 1',
      description: 'Прямая трансляция аукциона с участием известных художников и коллекционеров',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
      isLive: true,
      viewers: 1245,
      startTime: '14:00',
      host: 'ART BANK MARKET',
      auctionId: 'auction-1'
    },
    {
      id: '2',
      title: 'Конференция: Будущее арт-рынка',
      description: 'Дискуссия экспертов о цифровизации и блокчейне в искусстве',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
      isLive: false,
      viewers: 0,
      startTime: '16:00',
      host: 'ART BANK ACADEMY',
    },
    {
      id: '3',
      title: 'Мастер-класс: Инвестирование в искусство',
      description: 'Как правильно собирать коллекцию и получать доход',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
      isLive: false,
      viewers: 0,
      startTime: '18:00',
      host: 'ART BANK ACADEMY',
    }
  ]);

  const [selectedStream, setSelectedStream] = useState<Stream | null>(streams[0]);
  const [comments, setComments] = useState<Comment[]>([
    { id: '1', author: 'Иван П.', text: 'Отличная трансляция!', timestamp: '14:05', likes: 12 },
    { id: '2', author: 'Мария К.', text: 'Интересные лоты на этот раз', timestamp: '14:08', likes: 8 },
  ]);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: String(comments.length + 1),
        author: 'Вы',
        text: newComment,
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        likes: 0
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Трансляции и Конференции</h1>

        {selectedStream && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Видеоплеер */}
            <div className="lg:col-span-2">
              <div className="bg-black rounded-lg overflow-hidden mb-4">
                <div className="relative pb-[56.25%]">
                  <img
                    src={selectedStream.thumbnail}
                    alt={selectedStream.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <button className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 transition">
                      <Play size={48} fill="white" />
                    </button>
                  </div>
                  {selectedStream.isLive && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      LIVE
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    <Users size={16} />
                    {selectedStream.viewers.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">{selectedStream.title}</h2>
                <p className="text-gray-300 mb-4">{selectedStream.description}</p>
                
                <div className="flex gap-4 mb-4">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition flex items-center justify-center gap-2">
                    <Heart size={20} /> Нравится
                  </button>
                  <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition flex items-center justify-center gap-2">
                    <Share2 size={20} /> Поделиться
                  </button>
                </div>

                <div className="text-sm text-gray-400">
                  <p>Ведущий: {selectedStream.host}</p>
                  <p>Начало: {selectedStream.startTime}</p>
                </div>
              </div>
            </div>

            {/* Чат */}
            <div className="bg-slate-800 rounded-lg p-4 flex flex-col h-96">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <MessageSquare size={20} /> Чат
              </h3>
              
              <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                {comments.map(comment => (
                  <div key={comment.id} className="text-sm bg-slate-700 rounded p-2">
                    <div className="flex justify-between text-gray-300">
                      <span className="font-semibold">{comment.author}</span>
                      <span className="text-xs text-gray-500">{comment.timestamp}</span>
                    </div>
                    <p className="text-white mt-1">{comment.text}</p>
                    <button className="text-xs text-gray-400 hover:text-gray-200 mt-1">
                      👍 {comment.likes}
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  placeholder="Ваш комментарий..."
                  className="flex-1 bg-slate-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddComment}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Список трансляций */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Доступные трансляции</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {streams.map(stream => (
              <div
                key={stream.id}
                onClick={() => setSelectedStream(stream)}
                className={`rounded-lg overflow-hidden cursor-pointer transition transform hover:scale-105 ${
                  selectedStream?.id === stream.id ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="relative pb-[56.25%] bg-black">
                  <img
                    src={stream.thumbnail}
                    alt={stream.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {stream.isLive && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                      LIVE
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                    <p className="text-white text-sm font-semibold">{stream.title}</p>
                    <div className="flex items-center gap-2 text-gray-300 text-xs mt-1">
                      <Clock size={14} />
                      {stream.startTime}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
