import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layout, Type, Image as ImageIcon, Video, Grid, Palette, Eye,
  Save, Undo, Redo, Settings, Code, Download, Share2, Plus,
  Trash2, ChevronDown, ChevronUp, Copy, Move, Monitor, Smartphone,
  Tablet, Globe, Link as LinkIcon, Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useAuth } from '@/_core/hooks/useAuth';

interface Component {
  id: string;
  type: 'text' | 'image' | 'video' | 'gallery' | 'contact' | 'hero' | 'about';
  content: any;
  styles: any;
}

interface Page {
  id: string;
  name: string;
  path: string;
  components: Component[];
}

export default function WebsiteBuilder() {
  const { user } = useAuth();
  const [pages, setPages] = useState<Page[]>([
    {
      id: 'home',
      name: 'Главная',
      path: '/',
      components: []
    }
  ]);
  const [currentPageId, setCurrentPageId] = useState('home');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showComponentLibrary, setShowComponentLibrary] = useState(true);
  const [siteName, setSiteName] = useState(`${user?.name || 'Моя'} Галерея`);
  const [siteTheme, setSiteTheme] = useState({
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
    fontFamily: 'Inter, sans-serif',
    backgroundColor: '#ffffff'
  });

  const currentPage = pages.find(p => p.id === currentPageId);

  // Component templates
  const componentTemplates = [
    {
      id: 'hero',
      type: 'hero',
      name: 'Hero секция',
      icon: Layout,
      description: 'Большой заголовок с фоном',
      template: {
        type: 'hero',
        content: {
          title: 'Добро пожаловать',
          subtitle: 'Откройте для себя мир искусства',
          backgroundImage: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=1200',
          buttonText: 'Узнать больше',
          buttonLink: '#'
        },
        styles: {
          height: '500px',
          textAlign: 'center',
          padding: '4rem 2rem'
        }
      }
    },
    {
      id: 'text',
      type: 'text',
      name: 'Текстовый блок',
      icon: Type,
      description: 'Параграф или заголовок',
      template: {
        type: 'text',
        content: {
          text: 'Введите ваш текст здесь...',
          variant: 'p' // h1, h2, h3, p
        },
        styles: {
          fontSize: '16px',
          color: '#333333',
          padding: '1rem'
        }
      }
    },
    {
      id: 'image',
      type: 'image',
      name: 'Изображение',
      icon: ImageIcon,
      description: 'Одиночное изображение',
      template: {
        type: 'image',
        content: {
          src: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
          alt: 'Artwork',
          caption: 'Описание изображения'
        },
        styles: {
          width: '100%',
          maxWidth: '800px',
          margin: '0 auto',
          padding: '1rem'
        }
      }
    },
    {
      id: 'gallery',
      type: 'gallery',
      name: 'Галерея',
      icon: Grid,
      description: 'Сетка изображений',
      template: {
        type: 'gallery',
        content: {
          images: [
            { src: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400', alt: 'Art 1' },
            { src: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=400', alt: 'Art 2' },
            { src: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400', alt: 'Art 3' },
            { src: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400', alt: 'Art 4' }
          ],
          columns: 3
        },
        styles: {
          gap: '1rem',
          padding: '2rem'
        }
      }
    },
    {
      id: 'about',
      type: 'about',
      name: 'О нас',
      icon: Type,
      description: 'Секция о галерее',
      template: {
        type: 'about',
        content: {
          title: 'О нашей галерее',
          text: 'Мы представляем современное искусство и работы талантливых художников.',
          image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600'
        },
        styles: {
          display: 'flex',
          gap: '2rem',
          padding: '3rem 2rem'
        }
      }
    },
    {
      id: 'contact',
      type: 'contact',
      name: 'Контакты',
      icon: Menu,
      description: 'Контактная информация',
      template: {
        type: 'contact',
        content: {
          title: 'Свяжитесь с нами',
          email: 'gallery@example.com',
          phone: '+7 (123) 456-78-90',
          address: 'Москва, ул. Примерная, 123'
        },
        styles: {
          padding: '3rem 2rem',
          backgroundColor: '#f9fafb'
        }
      }
    }
  ];

  const addComponent = (template: any) => {
    const newComponent: Component = {
      id: `comp-${Date.now()}`,
      ...template.template
    };

    setPages(pages.map(page =>
      page.id === currentPageId
        ? { ...page, components: [...page.components, newComponent] }
        : page
    ));

    toast.success('Компонент добавлен!');
  };

  const removeComponent = (componentId: string) => {
    setPages(pages.map(page =>
      page.id === currentPageId
        ? { ...page, components: page.components.filter(c => c.id !== componentId) }
        : page
    ));
    setSelectedComponent(null);
    toast.success('Компонент удалён');
  };

  const moveComponent = (componentId: string, direction: 'up' | 'down') => {
    setPages(pages.map(page => {
      if (page.id !== currentPageId) return page;
      
      const index = page.components.findIndex(c => c.id === componentId);
      if (index === -1) return page;

      const newComponents = [...page.components];
      if (direction === 'up' && index > 0) {
        [newComponents[index - 1], newComponents[index]] = [newComponents[index], newComponents[index - 1]];
      } else if (direction === 'down' && index < newComponents.length - 1) {
        [newComponents[index], newComponents[index + 1]] = [newComponents[index + 1], newComponents[index]];
      }

      return { ...page, components: newComponents };
    }));
  };

  const duplicateComponent = (componentId: string) => {
    const component = currentPage?.components.find(c => c.id === componentId);
    if (!component) return;

    const newComponent = {
      ...component,
      id: `comp-${Date.now()}`
    };

    setPages(pages.map(page =>
      page.id === currentPageId
        ? { ...page, components: [...page.components, newComponent] }
        : page
    ));

    toast.success('Компонент скопирован');
  };

  const addPage = () => {
    const newPage: Page = {
      id: `page-${Date.now()}`,
      name: 'Новая страница',
      path: `/page-${Date.now()}`,
      components: []
    };
    setPages([...pages, newPage]);
    setCurrentPageId(newPage.id);
    toast.success('Страница создана');
  };

  const saveSite = () => {
    // В production сохранять в БД
    localStorage.setItem('website-builder-data', JSON.stringify({
      siteName,
      theme: siteTheme,
      pages
    }));
    toast.success('Сайт сохранён!');
  };

  const publishSite = () => {
    // В production деплоить на реальный домен
    const domain = `${siteName.toLowerCase().replace(/\s+/g, '-')}.artbank.market`;
    toast.success(`Сайт опубликован на ${domain}`);
  };

  const renderComponent = (component: Component) => {
    const isSelected = selectedComponent === component.id;

    const componentStyle = {
      ...component.styles,
      border: isSelected ? '2px solid #6366f1' : 'none',
      position: 'relative' as const,
      cursor: 'pointer'
    };

    const componentContent = (() => {
      switch (component.type) {
        case 'hero':
          return (
            <div
              style={{
                ...componentStyle,
                backgroundImage: `url(${component.content.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                position: 'relative'
              }}
            >
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.5)'
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '1rem' }}>
                  {component.content.title}
                </h1>
                <p style={{ fontSize: '24px', marginBottom: '2rem' }}>
                  {component.content.subtitle}
                </p>
                <button style={{
                  padding: '1rem 2rem',
                  backgroundColor: siteTheme.primaryColor,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '18px',
                  cursor: 'pointer'
                }}>
                  {component.content.buttonText}
                </button>
              </div>
            </div>
          );

        case 'text':
          const Tag = component.content.variant;
          return (
            <div style={componentStyle}>
              <Tag>{component.content.text}</Tag>
            </div>
          );

        case 'image':
          return (
            <div style={componentStyle}>
              <img
                src={component.content.src}
                alt={component.content.alt}
                style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
              />
              {component.content.caption && (
                <p style={{ textAlign: 'center', marginTop: '0.5rem', color: '#666' }}>
                  {component.content.caption}
                </p>
              )}
            </div>
          );

        case 'gallery':
          return (
            <div style={{
              ...componentStyle,
              display: 'grid',
              gridTemplateColumns: `repeat(${component.content.columns}, 1fr)`,
              gap: component.styles.gap
            }}>
              {component.content.images.map((img: any, idx: number) => (
                <img
                  key={idx}
                  src={img.src}
                  alt={img.alt}
                  style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px' }}
                />
              ))}
            </div>
          );

        case 'about':
          return (
            <div style={{ ...componentStyle, display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <img
                src={component.content.image}
                alt="About"
                style={{ width: '50%', borderRadius: '8px' }}
              />
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '32px', marginBottom: '1rem' }}>{component.content.title}</h2>
                <p style={{ fontSize: '18px', lineHeight: '1.6' }}>{component.content.text}</p>
              </div>
            </div>
          );

        case 'contact':
          return (
            <div style={componentStyle}>
              <h2 style={{ fontSize: '32px', marginBottom: '2rem', textAlign: 'center' }}>
                {component.content.title}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px', margin: '0 auto' }}>
                <p><strong>Email:</strong> {component.content.email}</p>
                <p><strong>Телефон:</strong> {component.content.phone}</p>
                <p><strong>Адрес:</strong> {component.content.address}</p>
              </div>
            </div>
          );

        default:
          return <div style={componentStyle}>Unknown component type</div>;
      }
    })();

    return (
      <div
        key={component.id}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedComponent(component.id);
        }}
        style={{ position: 'relative' }}
      >
        {componentContent}
        
        {isSelected && (
          <div className="absolute top-2 right-2 flex gap-2 bg-white rounded-lg shadow-lg p-2 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                moveComponent(component.id, 'up');
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                moveComponent(component.id, 'down');
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                duplicateComponent(component.id);
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeComponent(component.id);
              }}
              className="p-1 hover:bg-red-100 text-red-600 rounded"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  };

  const previewWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900">Website Builder</h1>
            <Input
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-64"
              placeholder="Название сайта"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Preview Mode */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`p-2 rounded ${previewMode === 'desktop' ? 'bg-white shadow' : ''}`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewMode('tablet')}
                className={`p-2 rounded ${previewMode === 'tablet' ? 'bg-white shadow' : ''}`}
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`p-2 rounded ${previewMode === 'mobile' ? 'bg-white shadow' : ''}`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            {/* Actions */}
            <Button onClick={saveSite} variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Сохранить
            </Button>
            <Button onClick={publishSite} size="sm">
              <Globe className="w-4 h-4 mr-2" />
              Опубликовать
            </Button>
          </div>
        </div>

        {/* Page Tabs */}
        <div className="px-4 pb-2 flex items-center gap-2">
          {pages.map(page => (
            <button
              key={page.id}
              onClick={() => setCurrentPageId(page.id)}
              className={`px-4 py-2 rounded-t-lg transition-colors ${
                currentPageId === page.id
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {page.name}
            </button>
          ))}
          <button
            onClick={addPage}
            className="px-3 py-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-140px)]">
        {/* Component Library */}
        {showComponentLibrary && (
          <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Компоненты</h2>
              
              <div className="space-y-2">
                {componentTemplates.map(template => (
                  <motion.div
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => addComponent(template)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <template.icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm text-gray-900">
                            {template.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {template.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Canvas */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto bg-white shadow-2xl rounded-lg overflow-hidden"
            style={{
              width: previewWidths[previewMode],
              minHeight: '100%',
              transition: 'width 0.3s ease'
            }}
            onClick={() => setSelectedComponent(null)}
          >
            {currentPage && currentPage.components.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                <Layout className="w-16 h-16 mb-4" />
                <p className="text-lg font-medium">Страница пуста</p>
                <p className="text-sm">Добавьте компоненты из библиотеки слева</p>
              </div>
            ) : (
              <div>
                {currentPage?.components.map(component => renderComponent(component))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Settings Panel */}
        {selectedComponent && (
          <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Настройки</h2>
              <p className="text-sm text-gray-500">
                Выбран компонент: {selectedComponent}
              </p>
              {/* Здесь можно добавить детальные настройки компонента */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
