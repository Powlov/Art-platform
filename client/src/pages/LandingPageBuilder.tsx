import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Eye, Save, Copy } from 'lucide-react';

// Types for Landing Page Builder
interface LandingPageBlock {
  id: string;
  type: 'banner' | 'shop' | 'calendar' | 'news' | 'stats' | 'gallery' | 'contact' | 'subscribe' | 'testimonials' | 'faq';
  title: string;
  content: Record<string, any>;
  order: number;
  visible: boolean;
}

interface LandingPageTemplate {
  id: string;
  name: string;
  description: string;
  blocks: LandingPageBlock[];
  thumbnail?: string;
}

interface LandingPageDesign {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  logoUrl?: string;
  favicon?: string;
}

const LANDING_PAGE_TEMPLATES: LandingPageTemplate[] = [
  {
    id: 'gallery-showcase',
    name: 'Галерея - Витрина',
    description: 'Профессиональная витрина для галереи с каталогом и контактами',
    blocks: [
      {
        id: 'banner-1',
        type: 'banner',
        title: 'Главный баннер',
        content: {
          title: 'Добро пожаловать в нашу галерею',
          subtitle: 'Современное искусство высочайшего качества',
          backgroundImage: '',
          ctaText: 'Исследовать',
        },
        order: 1,
        visible: true,
      },
      {
        id: 'shop-1',
        type: 'shop',
        title: 'Магазин произведений',
        content: {
          itemsPerRow: 3,
          filters: true,
          sortOptions: true,
        },
        order: 2,
        visible: true,
      },
      {
        id: 'gallery-1',
        type: 'gallery',
        title: 'Портфолио',
        content: {
          columns: 4,
          showArtistInfo: true,
        },
        order: 3,
        visible: true,
      },
      {
        id: 'contact-1',
        type: 'contact',
        title: 'Контактная информация',
        content: {
          email: '',
          phone: '',
          address: '',
          hours: '',
        },
        order: 4,
        visible: true,
      },
    ],
    thumbnail: '🖼️',
  },
  {
    id: 'artist-portfolio',
    name: 'Художник - Портфолио',
    description: 'Персональный портфолио художника с биографией и работами',
    blocks: [
      {
        id: 'banner-2',
        type: 'banner',
        title: 'Баннер художника',
        content: {
          title: 'Мои работы',
          subtitle: 'Исследуйте мое творчество',
          backgroundImage: '',
        },
        order: 1,
        visible: true,
      },
      {
        id: 'stats-1',
        type: 'stats',
        title: 'Статистика',
        content: {
          showExhibitions: true,
          showSales: true,
          showFollowers: true,
        },
        order: 2,
        visible: true,
      },
      {
        id: 'gallery-2',
        type: 'gallery',
        title: 'Мои работы',
        content: {
          columns: 3,
          showPrices: true,
        },
        order: 3,
        visible: true,
      },
      {
        id: 'news-1',
        type: 'news',
        title: 'Новости и обновления',
        content: {
          itemsPerPage: 5,
          showImages: true,
        },
        order: 4,
        visible: true,
      },
    ],
    thumbnail: '🎨',
  },
  {
    id: 'partner-event',
    name: 'Партнер - События',
    description: 'Страница для партнеров с календарем событий и новостями',
    blocks: [
      {
        id: 'banner-3',
        type: 'banner',
        title: 'Баннер события',
        content: {
          title: 'Наши события',
          subtitle: 'Присоединяйтесь к нам',
          backgroundImage: '',
        },
        order: 1,
        visible: true,
      },
      {
        id: 'calendar-1',
        type: 'calendar',
        title: 'Календарь событий',
        content: {
          showUpcoming: true,
          maxEvents: 10,
        },
        order: 2,
        visible: true,
      },
      {
        id: 'news-2',
        type: 'news',
        title: 'Последние новости',
        content: {
          itemsPerPage: 6,
          showImages: true,
        },
        order: 3,
        visible: true,
      },
      {
        id: 'subscribe-1',
        type: 'subscribe',
        title: 'Подписка на новости',
        content: {
          placeholder: 'Введите ваш email',
          buttonText: 'Подписаться',
        },
        order: 4,
        visible: true,
      },
    ],
    thumbnail: '📅',
  },
];

const BLOCK_COMPONENTS: Record<string, { icon: string; label: string; description: string }> = {
  banner: { icon: '🖼️', label: 'Баннер', description: 'Главное изображение с текстом' },
  shop: { icon: '🛍️', label: 'Магазин', description: 'Витрина произведений' },
  calendar: { icon: '📅', label: 'Календарь', description: 'Расписание событий' },
  news: { icon: '📰', label: 'Новости', description: 'Блог и новостная лента' },
  stats: { icon: '📊', label: 'Статистика', description: 'Информационная панель' },
  gallery: { icon: '🎨', label: 'Галерея', description: 'Портфолио произведений' },
  contact: { icon: '📞', label: 'Контакты', description: 'Информация о контактах' },
  subscribe: { icon: '✉️', label: 'Подписка', description: 'Форма подписки на новости' },
  testimonials: { icon: '⭐', label: 'Отзывы', description: 'Отзывы клиентов' },
  faq: { icon: '❓', label: 'FAQ', description: 'Часто задаваемые вопросы' },
};

export default function LandingPageBuilder() {
  const [blocks, setBlocks] = useState<LandingPageBlock[]>([]);
  const [design, setDesign] = useState<LandingPageDesign>({
    primaryColor: '#1f2937',
    secondaryColor: '#3b82f6',
    fontFamily: 'Inter, sans-serif',
  });
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Load template
  const loadTemplate = useCallback((templateId: string) => {
    const template = LANDING_PAGE_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setBlocks(template.blocks);
      setSelectedTemplate(templateId);
    }
  }, []);

  // Add new block
  const addBlock = useCallback((blockType: LandingPageBlock['type']) => {
    const newBlock: LandingPageBlock = {
      id: `block-${Date.now()}`,
      type: blockType,
      title: BLOCK_COMPONENTS[blockType].label,
      content: {},
      order: blocks.length + 1,
      visible: true,
    };
    setBlocks([...blocks, newBlock]);
  }, [blocks]);

  // Remove block
  const removeBlock = useCallback((blockId: string) => {
    setBlocks(blocks.filter(b => b.id !== blockId));
  }, [blocks]);

  // Reorder blocks
  const reorderBlocks = useCallback((fromIndex: number, toIndex: number) => {
    const newBlocks = [...blocks];
    const [removed] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, removed);
    setBlocks(newBlocks.map((b, i) => ({ ...b, order: i + 1 })));
  }, [blocks]);

  // Toggle block visibility
  const toggleBlockVisibility = useCallback((blockId: string) => {
    setBlocks(blocks.map(b => 
      b.id === blockId ? { ...b, visible: !b.visible } : b
    ));
  }, [blocks]);

  // Update block content
  const updateBlockContent = useCallback((blockId: string, content: Record<string, any>) => {
    setBlocks(blocks.map(b =>
      b.id === blockId ? { ...b, content } : b
    ));
  }, [blocks]);

  // Save landing page
  const saveLandingPage = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/landing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocks,
          design,
          template: selectedTemplate,
        }),
      });
      if (response.ok) {
        alert('Лендинг успешно сохранен!');
      }
    } catch (error) {
      console.error('Error saving landing page:', error);
      alert('Ошибка при сохранении лендинга');
    }
  }, [blocks, design, selectedTemplate]);

  // Duplicate block
  const duplicateBlock = useCallback((blockId: string) => {
    const blockToDuplicate = blocks.find(b => b.id === blockId);
    if (blockToDuplicate) {
      const newBlock = {
        ...blockToDuplicate,
        id: `block-${Date.now()}`,
      };
      setBlocks([...blocks, newBlock]);
    }
  }, [blocks]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Конструктор Лендингов</h1>
            <p className="text-sm text-muted-foreground">Создавайте красивые страницы без кода</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={previewMode ? 'default' : 'outline'}
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {previewMode ? 'Редактировать' : 'Предпросмотр'}
            </Button>
            <Button onClick={saveLandingPage}>
              <Save className="w-4 h-4 mr-2" />
              Сохранить
            </Button>
          </div>
        </div>
      </div>

      {previewMode ? (
        // Preview Mode
        <div className="container py-8">
          <Card>
            <CardHeader>
              <CardTitle>Предпросмотр лендинга</CardTitle>
              <CardDescription>Так будет выглядеть ваша страница</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                style={{
                  fontFamily: design.fontFamily,
                  backgroundColor: '#f9fafb',
                  padding: '2rem',
                  borderRadius: '0.5rem',
                }}
              >
                {blocks.filter(b => b.visible).map(block => (
                  <div key={block.id} className="mb-8 p-6 bg-white rounded-lg border border-border">
                    <h2 className="text-xl font-bold mb-4" style={{ color: design.primaryColor }}>
                      {block.title}
                    </h2>
                    <p className="text-muted-foreground">
                      Блок типа: {BLOCK_COMPONENTS[block.type].label}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Edit Mode
        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Templates & Components */}
            <div className="lg:col-span-1 space-y-6">
              {/* Templates */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Шаблоны</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {LANDING_PAGE_TEMPLATES.map(template => (
                    <Button
                      key={template.id}
                      variant={selectedTemplate === template.id ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => loadTemplate(template.id)}
                    >
                      <span className="mr-2">{template.thumbnail}</span>
                      <div className="text-left">
                        <div className="text-sm font-medium">{template.name}</div>
                        <div className="text-xs text-muted-foreground">{template.description}</div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Components */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Компоненты</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(BLOCK_COMPONENTS).map(([type, info]) => (
                    <Button
                      key={type}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => addBlock(type as LandingPageBlock['type'])}
                    >
                      <span className="mr-2">{info.icon}</span>
                      <div className="text-left">
                        <div className="text-sm font-medium">{info.label}</div>
                        <div className="text-xs text-muted-foreground">{info.description}</div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Design Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Дизайн</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Основной цвет</label>
                    <div className="flex gap-2 mt-2">
                      <input
                        type="color"
                        value={design.primaryColor}
                        onChange={(e) => setDesign({ ...design, primaryColor: e.target.value })}
                        className="w-12 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={design.primaryColor}
                        onChange={(e) => setDesign({ ...design, primaryColor: e.target.value })}
                        className="flex-1 px-3 py-2 rounded border border-border text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Вторичный цвет</label>
                    <div className="flex gap-2 mt-2">
                      <input
                        type="color"
                        value={design.secondaryColor}
                        onChange={(e) => setDesign({ ...design, secondaryColor: e.target.value })}
                        className="w-12 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={design.secondaryColor}
                        onChange={(e) => setDesign({ ...design, secondaryColor: e.target.value })}
                        className="flex-1 px-3 py-2 rounded border border-border text-sm"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Area - Blocks Editor */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Блоки страницы ({blocks.length})</CardTitle>
                  <CardDescription>Перетаскивайте блоки для изменения порядка</CardDescription>
                </CardHeader>
                <CardContent>
                  {blocks.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground mb-4">Нет блоков на странице</p>
                      <p className="text-sm text-muted-foreground">
                        Выберите шаблон или добавьте компоненты слева
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {blocks.map((block, index) => (
                        <div
                          key={block.id}
                          draggable
                          onDragStart={() => setDraggedBlockId(block.id)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => {
                            if (draggedBlockId && draggedBlockId !== block.id) {
                              const draggedIndex = blocks.findIndex(b => b.id === draggedBlockId);
                              reorderBlocks(draggedIndex, index);
                            }
                          }}
                          className={`p-4 border rounded-lg cursor-move transition ${
                            draggedBlockId === block.id
                              ? 'opacity-50 border-primary'
                              : 'border-border hover:border-primary'
                          } ${!block.visible ? 'opacity-50' : ''}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <span className="text-2xl">
                                {BLOCK_COMPONENTS[block.type].icon}
                              </span>
                              <div>
                                <p className="font-medium text-foreground">{block.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {BLOCK_COMPONENTS[block.type].label} • Позиция {block.order}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleBlockVisibility(block.id)}
                              >
                                {block.visible ? '👁️' : '🚫'}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => duplicateBlock(block.id)}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeBlock(block.id)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
