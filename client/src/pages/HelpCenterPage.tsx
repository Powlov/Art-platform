import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import {
  Search,
  BookOpen,
  HelpCircle,
  MessageCircle,
  FileText,
  Video,
  Users,
  ShoppingBag,
  CreditCard,
  Shield,
  Package,
  Settings,
  TrendingUp,
  Award,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  articleCount: number;
  color: string;
  articles: HelpArticle[];
}

interface HelpArticle {
  id: string;
  title: string;
  description: string;
  views: number;
  helpful: number;
}

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories: HelpCategory[] = [
    {
      id: 'getting-started',
      title: 'Начало работы',
      description: 'Первые шаги на платформе',
      icon: BookOpen,
      articleCount: 12,
      color: 'blue',
      articles: [
        {
          id: '1',
          title: 'Создание аккаунта и выбор роли',
          description: 'Пошаговое руководство по регистрации',
          views: 5240,
          helpful: 487
        },
        {
          id: '2',
          title: 'Настройка профиля и верификация',
          description: 'Как заполнить профиль и пройти верификацию',
          views: 3892,
          helpful: 356
        },
        {
          id: '3',
          title: 'Навигация по платформе',
          description: 'Обзор основных разделов и функций',
          views: 4156,
          helpful: 421
        },
      ]
    },
    {
      id: 'buying',
      title: 'Покупка произведений',
      description: 'Как покупать искусство безопасно',
      icon: ShoppingBag,
      articleCount: 15,
      color: 'green',
      articles: [
        {
          id: '4',
          title: 'Поиск и выбор произведений',
          description: 'Используйте фильтры и advanced search',
          views: 6832,
          helpful: 624
        },
        {
          id: '5',
          title: 'Проверка подлинности',
          description: 'Как читать цифровой паспорт',
          views: 5421,
          helpful: 512
        },
        {
          id: '6',
          title: 'Процесс покупки',
          description: 'От выбора до получения произведения',
          views: 7123,
          helpful: 689
        },
      ]
    },
    {
      id: 'selling',
      title: 'Продажа произведений',
      description: 'Руководство для художников и галерей',
      icon: TrendingUp,
      articleCount: 18,
      color: 'orange',
      articles: [
        {
          id: '7',
          title: 'Загрузка произведений',
          description: 'Требования к фото и описанию',
          views: 4532,
          helpful: 432
        },
        {
          id: '8',
          title: 'Ценообразование',
          description: 'Как установить правильную цену',
          views: 3891,
          helpful: 367
        },
        {
          id: '9',
          title: 'Модерация и одобрение',
          description: 'Процесс проверки произведений',
          views: 4211,
          helpful: 398
        },
      ]
    },
    {
      id: 'payments',
      title: 'Оплата и Кошелёк',
      description: 'Финансовые операции на платформе',
      icon: CreditCard,
      articleCount: 10,
      color: 'pink',
      articles: [
        {
          id: '10',
          title: 'Пополнение кошелька',
          description: 'Все способы пополнения баланса',
          views: 8934,
          helpful: 821
        },
        {
          id: '11',
          title: 'Вывод средств',
          description: 'Как и когда выводить деньги',
          views: 7245,
          helpful: 698
        },
        {
          id: '12',
          title: 'История транзакций',
          description: 'Отслеживание платежей и выплат',
          views: 5632,
          helpful: 534
        },
      ]
    },
    {
      id: 'auctions',
      title: 'Аукционы',
      description: 'Участие в live и онлайн аукционах',
      icon: Award,
      articleCount: 8,
      color: 'purple',
      articles: [
        {
          id: '13',
          title: 'Как участвовать в аукционах',
          description: 'Руководство по live bidding',
          views: 6421,
          helpful: 589
        },
        {
          id: '14',
          title: 'Автоматические ставки',
          description: 'Настройка auto-bid системы',
          views: 4892,
          helpful: 456
        },
        {
          id: '15',
          title: 'Правила аукционов',
          description: 'Условия и ограничения',
          views: 3745,
          helpful: 342
        },
      ]
    },
    {
      id: 'security',
      title: 'Безопасность',
      description: 'Защита аккаунта и данных',
      icon: Shield,
      articleCount: 7,
      color: 'red',
      articles: [
        {
          id: '16',
          title: 'Двухфакторная аутентификация',
          description: 'Настройка 2FA для защиты',
          views: 4567,
          helpful: 423
        },
        {
          id: '17',
          title: 'Безопасность платежей',
          description: 'Как мы защищаем ваши деньги',
          views: 5234,
          helpful: 498
        },
        {
          id: '18',
          title: 'Что делать при взломе',
          description: 'Действия в случае компрометации',
          views: 2891,
          helpful: 267
        },
      ]
    },
    {
      id: 'shipping',
      title: 'Доставка',
      description: 'Логистика и получение произведений',
      icon: Package,
      articleCount: 6,
      color: 'indigo',
      articles: [
        {
          id: '19',
          title: 'Способы доставки',
          description: 'Курьер, почта, самовывоз',
          views: 5678,
          helpful: 521
        },
        {
          id: '20',
          title: 'Отслеживание посылок',
          description: 'Как узнать где ваше произведение',
          views: 4321,
          helpful: 401
        },
        {
          id: '21',
          title: 'Страхование при доставке',
          description: 'Защита от повреждений',
          views: 3456,
          helpful: 312
        },
      ]
    },
    {
      id: 'account',
      title: 'Управление аккаунтом',
      description: 'Настройки и персонализация',
      icon: Settings,
      articleCount: 9,
      color: 'teal',
      articles: [
        {
          id: '22',
          title: 'Изменение роли пользователя',
          description: 'Как стать художником или галереей',
          views: 3892,
          helpful: 356
        },
        {
          id: '23',
          title: 'Настройка уведомлений',
          description: 'Управление email и push уведомлениями',
          views: 4567,
          helpful: 421
        },
        {
          id: '24',
          title: 'Приватность и видимость',
          description: 'Контроль над вашими данными',
          views: 3234,
          helpful: 298
        },
      ]
    },
  ];

  const popularArticles = [
    { title: 'Как купить первое произведение искусства', views: 12453, icon: ShoppingBag },
    { title: 'Загрузка произведений: полное руководство', views: 10892, icon: TrendingUp },
    { title: 'Настройка двухфакторной аутентификации', views: 9234, icon: Shield },
    { title: 'Участие в live аукционах', views: 8756, icon: Award },
    { title: 'Как вывести средства на банковский счёт', views: 8234, icon: CreditCard },
  ];

  const filteredCategories = searchQuery
    ? categories.filter(cat =>
        cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.articles.some(article =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : categories;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Центр помощи ART BANK
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Найдите руководства, статьи и ответы на все ваши вопросы
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="relative max-w-3xl mx-auto">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск статей и руководств..."
              className="w-full pl-14 pr-5 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none transition shadow-lg"
            />
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <Link href="/faq">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white rounded-xl p-6 shadow-lg cursor-pointer border-2 border-transparent hover:border-blue-500 transition"
            >
              <HelpCircle className="w-10 h-10 text-blue-500 mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                FAQ
              </h3>
              <p className="text-gray-600 mb-3">
                Часто задаваемые вопросы с быстрыми ответами
              </p>
              <span className="text-blue-500 font-semibold flex items-center gap-1">
                Открыть FAQ <ChevronRight className="w-4 h-4" />
              </span>
            </motion.div>
          </Link>

          <Link href="/contact">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white rounded-xl p-6 shadow-lg cursor-pointer border-2 border-transparent hover:border-green-500 transition"
            >
              <MessageCircle className="w-10 h-10 text-green-500 mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Связаться с нами
              </h3>
              <p className="text-gray-600 mb-3">
                Задайте вопрос нашей команде поддержки
              </p>
              <span className="text-green-500 font-semibold flex items-center gap-1">
                Написать нам <ChevronRight className="w-4 h-4" />
              </span>
            </motion.div>
          </Link>

          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white rounded-xl p-6 shadow-lg cursor-pointer border-2 border-transparent hover:border-purple-500 transition"
          >
            <Video className="w-10 h-10 text-purple-500 mb-3" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Видео-уроки
            </h3>
            <p className="text-gray-600 mb-3">
              Смотрите обучающие видео и вебинары
            </p>
            <span className="text-purple-500 font-semibold flex items-center gap-1">
              Смотреть <ExternalLink className="w-4 h-4" />
            </span>
          </motion.div>
        </motion.div>

        {/* Popular Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Популярные статьи
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {popularArticles.map((article, index) => {
              const Icon = article.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-lg p-4 shadow-md cursor-pointer hover:shadow-lg transition"
                >
                  <Icon className="w-8 h-8 text-blue-500 mb-2" />
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                    {article.title}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {article.views.toLocaleString()} просмотров
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Категории помощи
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCategories.map((category) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl p-6 shadow-lg cursor-pointer border-2 border-transparent hover:border-blue-500 transition"
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-${category.color}-100 rounded-lg mb-4`}>
                    <Icon className={`w-6 h-6 text-${category.color}-600`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {category.articleCount} статей
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>

                  {/* Articles Preview */}
                  {selectedCategory === category.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-gray-200 space-y-3"
                    >
                      {category.articles.map((article) => (
                        <div key={article.id} className="hover:bg-gray-50 p-2 rounded cursor-pointer">
                          <h4 className="font-semibold text-gray-900 text-sm mb-1">
                            {article.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {article.views.toLocaleString()} просмотров
                          </p>
                        </div>
                      ))}
                      <button className="text-sm text-blue-600 font-semibold hover:text-blue-700">
                        Показать все →
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-8 text-center text-white"
        >
          <h3 className="text-2xl font-bold mb-3">
            Нужна дополнительная помощь?
          </h3>
          <p className="text-lg mb-6 text-white/90 max-w-2xl mx-auto">
            Наша команда поддержки готова ответить на все ваши вопросы 24/7
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
              >
                Связаться с поддержкой
              </motion.button>
            </Link>
            <Link href="/messenger">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-lg font-semibold hover:bg-white/20 transition"
              >
                Открыть чат
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
