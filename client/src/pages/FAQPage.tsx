import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Search, 
  HelpCircle,
  Users,
  ShoppingBag,
  CreditCard,
  Shield,
  Package,
  MessageCircle,
  TrendingUp
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: 'Все вопросы', icon: HelpCircle, color: 'purple' },
    { id: 'general', label: 'Общие', icon: MessageCircle, color: 'blue' },
    { id: 'buying', label: 'Покупка', icon: ShoppingBag, color: 'green' },
    { id: 'selling', label: 'Продажа', icon: TrendingUp, color: 'orange' },
    { id: 'payment', label: 'Оплата', icon: CreditCard, color: 'pink' },
    { id: 'security', label: 'Безопасность', icon: Shield, color: 'red' },
    { id: 'shipping', label: 'Доставка', icon: Package, color: 'indigo' },
    { id: 'account', label: 'Аккаунт', icon: Users, color: 'teal' },
  ];

  const faqs: FAQItem[] = [
    // General
    {
      category: 'general',
      question: 'Что такое ART BANK Platform?',
      answer: 'ART BANK Platform — это комплексная онлайн-платформа для покупки, продажи и инвестирования в произведения искусства. Мы объединяем художников, галереи, коллекционеров и любителей искусства в единую экосистему с прозрачными процессами и гарантией подлинности.'
    },
    {
      category: 'general',
      question: 'Как начать работу на платформе?',
      answer: 'Создайте аккаунт, выбрав подходящую роль (коллекционер, художник, галерея и т.д.). После регистрации вы получите доступ к персонализированному дашборду с функциями, соответствующими вашей роли. Пройдите верификацию для доступа ко всем возможностям платформы.'
    },
    {
      category: 'general',
      question: 'Какие роли пользователей доступны?',
      answer: 'Платформа поддерживает 8 ролей: User (базовый пользователь), Collector (коллекционер), Artist (художник), Gallery (галерея), Curator (куратор), Consultant (консультант), Partner (партнёр) и Admin (администратор). Каждая роль имеет уникальный функционал и права доступа.'
    },
    // Buying
    {
      category: 'buying',
      question: 'Как купить произведение искусства?',
      answer: 'Найдите интересующее произведение через маркетплейс или поиск, изучите его цифровой паспорт с полной информацией, нажмите "Купить" и следуйте инструкциям оплаты. После подтверждения оплаты произведение будет добавлено в вашу коллекцию.'
    },
    {
      category: 'buying',
      question: 'Как проверить подлинность произведения?',
      answer: 'Каждое произведение на платформе имеет цифровой паспорт с историей происхождения (provenance), результатами AI-аутентификации (97.8% точность), сертификатами подлинности и blockchain записями. Вы можете просмотреть всю эту информацию перед покупкой.'
    },
    {
      category: 'buying',
      question: 'Можно ли вернуть купленное произведение?',
      answer: 'Да, у вас есть 14 дней на возврат произведения в исходном состоянии. Средства будут возвращены на ваш кошелёк в течение 7-10 рабочих дней после получения произведения обратно. Стоимость обратной доставки оплачивается покупателем, если произведение не имеет дефектов.'
    },
    {
      category: 'buying',
      question: 'Как участвовать в аукционах?',
      answer: 'Перейдите в раздел "Аукционы", выберите интересующий лот и нажмите "Присоединиться к аукциону". Вы можете делать ставки вручную или настроить систему автоматических ставок с максимальным лимитом. Live-аукционы проходят в реальном времени с видеотрансляцией.'
    },
    // Selling
    {
      category: 'selling',
      question: 'Как продать своё произведение?',
      answer: 'Художники и галереи могут загрузить произведения через форму подачи, указав все необходимые детали: название, описание, цену, изображения высокого качества. После модерации (обычно 24-48 часов) произведение появится в маркетплейсе.'
    },
    {
      category: 'selling',
      question: 'Какая комиссия платформы?',
      answer: 'Базовая комиссия составляет 10% от суммы продажи для художников и 8% для галерей. Для верифицированных пользователей с хорошей репутацией комиссия снижается до 7% и 5% соответственно. Первые 3 продажи для новых художников — без комиссии.'
    },
    {
      category: 'selling',
      question: 'Как работает модерация произведений?',
      answer: 'Все произведения проходят трёхэтапную проверку: 1) Автоматическая AI-проверка качества изображений и метаданных, 2) Ручная модерация экспертом (проверка описания, цены, соответствия правилам), 3) Финальное утверждение. Процесс занимает 24-48 часов.'
    },
    {
      category: 'selling',
      question: 'Могу ли я изменить цену после публикации?',
      answer: 'Да, вы можете изменить цену произведения в любое время через раздел "Мои произведения". Изменения вступают в силу немедленно. Частые изменения цены могут снизить доверие покупателей, поэтому рекомендуем устанавливать обоснованную цену сразу.'
    },
    // Payment
    {
      category: 'payment',
      question: 'Какие способы оплаты доступны?',
      answer: 'Мы принимаем: банковские карты (Visa, MasterCard, МИР), платежные системы (Stripe, Яндекс.Касса), банковские переводы, криптовалюты (Bitcoin, Ethereum). Все платежи защищены 3D Secure и SSL шифрованием.'
    },
    {
      category: 'payment',
      question: 'Как работает внутренний кошелёк?',
      answer: 'Ваш кошелёк на платформе позволяет хранить средства, быстро совершать покупки и получать выплаты от продаж. Вы можете пополнить кошелёк любым удобным способом и вывести средства на банковский счёт в течение 1-3 рабочих дней.'
    },
    {
      category: 'payment',
      question: 'Когда я получу деньги после продажи?',
      answer: 'Средства поступают на ваш кошелёк через 7 дней после подтверждения получения произведения покупателем или через 14 дней автоматически, если покупатель не заявил о проблемах. Это защищает обе стороны сделки.'
    },
    {
      category: 'payment',
      question: 'Безопасны ли платежи на платформе?',
      answer: 'Абсолютно. Мы используем сертифицированные платёжные процессоры (PCI DSS Level 1), SSL шифрование всех транзакций, 3D Secure аутентификацию и храним средства на защищённых счетах. Мы никогда не храним данные карт на наших серверах.'
    },
    // Security
    {
      category: 'security',
      question: 'Как защищён мой аккаунт?',
      answer: 'Ваш аккаунт защищён паролем с шифрованием, двухфакторной аутентификацией (2FA), мониторингом подозрительной активности и автоматическим выходом при неактивности. Вы также можете настроить уведомления о всех действиях в аккаунте.'
    },
    {
      category: 'security',
      question: 'Что делать, если забыл пароль?',
      answer: 'На странице входа нажмите "Забыли пароль?", введите ваш email. Мы отправим ссылку для сброса пароля, действительную 1 час. Перейдите по ссылке и создайте новый надёжный пароль (минимум 8 символов, цифры и буквы).'
    },
    {
      category: 'security',
      question: 'Как включить двухфакторную аутентификацию?',
      answer: 'Перейдите в Настройки → Безопасность → Двухфакторная аутентификация. Выберите способ: SMS, email или приложение-аутентификатор (Google Authenticator, Authy). Следуйте инструкциям для активации. Это значительно повысит безопасность аккаунта.'
    },
    // Shipping
    {
      category: 'shipping',
      question: 'Как осуществляется доставка произведений?',
      answer: 'Мы работаем со специализированными арт-логистическими компаниями, обеспечивающими профессиональную упаковку, страхование и отслеживание. Доставка внутри России — 5-14 дней, международная — 14-30 дней в зависимости от страны.'
    },
    {
      category: 'shipping',
      question: 'Кто оплачивает доставку?',
      answer: 'Стоимость доставки рассчитывается автоматически при оформлении заказа исходя из размера и веса произведения, расстояния и выбранного способа доставки. Обычно доставку оплачивает покупатель, но продавец может предложить бесплатную доставку.'
    },
    {
      category: 'shipping',
      question: 'Застрахованы ли произведения при доставке?',
      answer: 'Да, все произведения автоматически застрахованы на полную стоимость при транспортировке. В случае повреждения или утери вы получите полную компенсацию. Дополнительное страхование не требуется.'
    },
    // Account
    {
      category: 'account',
      question: 'Как изменить роль пользователя?',
      answer: 'Роль можно изменить в Настройках → Аккаунт → Тип аккаунта. Некоторые роли (художник, галерея) требуют верификации: загрузите необходимые документы (портфолио, регистрационные документы) и дождитесь одобрения (обычно 2-3 дня).'
    },
    {
      category: 'account',
      question: 'Как удалить аккаунт?',
      answer: 'Перейдите в Настройки → Аккаунт → Удаление аккаунта. Вам нужно будет подтвердить действие и указать причину. Обратите внимание: удаление аккаунта необратимо, все ваши данные будут удалены через 30 дней. Активные сделки должны быть завершены.'
    },
    {
      category: 'account',
      question: 'Можно ли иметь несколько аккаунтов?',
      answer: 'Нет, согласно правилам платформы у каждого пользователя должен быть только один аккаунт. Если вам нужны разные роли (например, художник и коллекционер), вы можете добавить дополнительные роли в одном аккаунте в Настройках.'
    },
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Часто задаваемые вопросы
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Найдите ответы на самые популярные вопросы о работе с платформой
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по вопросам..."
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition"
            />
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              
              return (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                    isActive
                      ? `bg-${category.color}-500 text-white shadow-lg`
                      : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">
                Вопросы не найдены. Попробуйте изменить запрос.
              </p>
            </div>
          ) : (
            filteredFAQs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition"
                >
                  <span className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-6 h-6 text-gray-500 flex-shrink-0" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-xl p-8 text-white"
        >
          <h3 className="text-2xl font-bold mb-2">
            Не нашли ответ на свой вопрос?
          </h3>
          <p className="text-lg mb-6 text-white/90">
            Свяжитесь с нашей службой поддержки, и мы с радостью вам поможем
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Связаться с поддержкой
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-lg font-semibold hover:bg-white/20 transition"
            >
              Перейти в Help Center
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
