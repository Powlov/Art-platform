import React, { useState } from 'react';
import { Edit3, Eye, Save, Plus, Trash2, Copy } from 'lucide-react';

interface LandingPage {
  id: string;
  name: string;
  title: string;
  description: string;
  heroImage: string;
  sections: Section[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  published: boolean;
  url: string;
}

interface Section {
  id: string;
  type: 'hero' | 'gallery' | 'text' | 'cta' | 'testimonials';
  title: string;
  content: string;
  items?: string[];
}

export default function LandingBuilder() {
  const [landings, setLandings] = useState<LandingPage[]>([
    {
      id: '1',
      name: 'Моя галерея',
      title: 'Галерея современного искусства',
      description: 'Добро пожаловать в мою галерею',
      heroImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=400&fit=crop',
      sections: [
        {
          id: '1',
          type: 'hero',
          title: 'Добро пожаловать',
          content: 'Исследуйте нашу коллекцию современного искусства'
        },
        {
          id: '2',
          type: 'gallery',
          title: 'Избранные произведения',
          content: '',
          items: ['Картина 1', 'Картина 2', 'Картина 3']
        }
      ],
      colors: {
        primary: '#0066cc',
        secondary: '#f0f0f0',
        accent: '#ff6600'
      },
      published: true,
      url: 'https://artbank.market/gallery/my-gallery'
    }
  ]);

  const [selectedLanding, setSelectedLanding] = useState<LandingPage | null>(landings[0]);
  const [editMode, setEditMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const handleAddSection = () => {
    if (selectedLanding) {
      const newSection: Section = {
        id: String(selectedLanding.sections.length + 1),
        type: 'text',
        title: 'Новый раздел',
        content: 'Содержимое раздела'
      };
      const updated = {
        ...selectedLanding,
        sections: [...selectedLanding.sections, newSection]
      };
      setSelectedLanding(updated);
      setLandings(landings.map(l => l.id === updated.id ? updated : l));
    }
  };

  const handleDeleteSection = (sectionId: string) => {
    if (selectedLanding) {
      const updated = {
        ...selectedLanding,
        sections: selectedLanding.sections.filter(s => s.id !== sectionId)
      };
      setSelectedLanding(updated);
      setLandings(landings.map(l => l.id === updated.id ? updated : l));
    }
  };

  const handleCreateLanding = () => {
    const newLanding: LandingPage = {
      id: String(landings.length + 1),
      name: 'Новый лендинг',
      title: 'Заголовок',
      description: 'Описание',
      heroImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=400&fit=crop',
      sections: [],
      colors: { primary: '#0066cc', secondary: '#f0f0f0', accent: '#ff6600' },
      published: false,
      url: ''
    };
    setLandings([...landings, newLanding]);
    setSelectedLanding(newLanding);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Конструктор лендингов</h1>
            <p className="text-gray-600 mt-2">Создавайте персональные лендинги для своих мероприятий</p>
          </div>
          <button
            onClick={handleCreateLanding}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center gap-2"
          >
            <Plus size={20} /> Создать лендинг
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Список лендингов */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Мои лендинги</h2>
            <div className="space-y-2">
              {landings.map(landing => (
                <button
                  key={landing.id}
                  onClick={() => setSelectedLanding(landing)}
                  className={`w-full text-left p-4 rounded-lg transition ${
                    selectedLanding?.id === landing.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-900 hover:bg-gray-50'
                  }`}
                >
                  <p className="font-semibold">{landing.name}</p>
                  <p className="text-xs mt-1 opacity-75">
                    {landing.published ? '✓ Опубликован' : '○ Черновик'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Редактор */}
          {selectedLanding && (
            <div className="lg:col-span-3">
              {!previewMode ? (
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Редактирование: {selectedLanding.name}</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPreviewMode(true)}
                        className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition flex items-center gap-2"
                      >
                        <Eye size={18} /> Предпросмотр
                      </button>
                      <button
                        onClick={() => setEditMode(!editMode)}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition flex items-center gap-2"
                      >
                        <Edit3 size={18} /> {editMode ? 'Готово' : 'Редактировать'}
                      </button>
                    </div>
                  </div>

                  {editMode && (
                    <div className="space-y-6 mb-6 pb-6 border-b">
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">Название лендинга</label>
                        <input
                          type="text"
                          value={selectedLanding.name}
                          onChange={(e) => setSelectedLanding({ ...selectedLanding, name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">Заголовок</label>
                        <input
                          type="text"
                          value={selectedLanding.title}
                          onChange={(e) => setSelectedLanding({ ...selectedLanding, title: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">Описание</label>
                        <textarea
                          value={selectedLanding.description}
                          onChange={(e) => setSelectedLanding({ ...selectedLanding, description: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-900 mb-2">Основной цвет</label>
                          <input
                            type="color"
                            value={selectedLanding.colors.primary}
                            onChange={(e) => setSelectedLanding({
                              ...selectedLanding,
                              colors: { ...selectedLanding.colors, primary: e.target.value }
                            })}
                            className="w-full h-10 rounded-lg cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-900 mb-2">Вторичный цвет</label>
                          <input
                            type="color"
                            value={selectedLanding.colors.secondary}
                            onChange={(e) => setSelectedLanding({
                              ...selectedLanding,
                              colors: { ...selectedLanding.colors, secondary: e.target.value }
                            })}
                            className="w-full h-10 rounded-lg cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-900 mb-2">Акцентный цвет</label>
                          <input
                            type="color"
                            value={selectedLanding.colors.accent}
                            onChange={(e) => setSelectedLanding({
                              ...selectedLanding,
                              colors: { ...selectedLanding.colors, accent: e.target.value }
                            })}
                            className="w-full h-10 rounded-lg cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <h3 className="text-lg font-bold text-slate-900 mb-4">Разделы</h3>
                  <div className="space-y-3 mb-6">
                    {selectedLanding.sections.map(section => (
                      <div key={section.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-slate-900">{section.title}</p>
                          <p className="text-sm text-gray-600">{section.type}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteSection(section.id)}
                          className="text-red-600 hover:text-red-700 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleAddSection}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-slate-900 font-bold py-2 rounded-lg transition flex items-center justify-center gap-2 mb-6"
                  >
                    <Plus size={18} /> Добавить раздел
                  </button>

                  <div className="flex gap-4">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition flex items-center justify-center gap-2">
                      <Save size={18} /> Сохранить
                    </button>
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition">
                      Опубликовать
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div
                    className="p-12 text-white text-center"
                    style={{ backgroundColor: selectedLanding.colors.primary }}
                  >
                    <h1 className="text-4xl font-bold mb-4">{selectedLanding.title}</h1>
                    <p className="text-lg opacity-90">{selectedLanding.description}</p>
                  </div>
                  <div className="p-8">
                    {selectedLanding.sections.map(section => (
                      <div key={section.id} className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">{section.title}</h2>
                        <p className="text-gray-600">{section.content}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setPreviewMode(false)}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 transition"
                  >
                    Вернуться к редактированию
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
