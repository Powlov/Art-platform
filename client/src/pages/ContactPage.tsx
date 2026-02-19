import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Send,
  Clock,
  CheckCircle,
  User,
  FileText,
  AlertCircle
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = [
    { value: 'general', label: 'Общий вопрос' },
    { value: 'technical', label: 'Техническая проблема' },
    { value: 'billing', label: 'Вопрос по оплате' },
    { value: 'shipping', label: 'Доставка' },
    { value: 'artwork', label: 'Вопрос о произведении' },
    { value: 'account', label: 'Проблема с аккаунтом' },
    { value: 'partnership', label: 'Партнёрство' },
    { value: 'other', label: 'Другое' },
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'support@artbank.market',
      description: 'Ответим в течение 24 часов',
      color: 'blue'
    },
    {
      icon: Phone,
      title: 'Телефон',
      content: '+7 (495) 123-45-67',
      description: 'Пн-Пт: 9:00 - 18:00 МСК',
      color: 'green'
    },
    {
      icon: MapPin,
      title: 'Адрес',
      content: 'Москва, ул. Арбат, 25',
      description: 'Офис на 3 этаже',
      color: 'purple'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      content: 'Онлайн поддержка',
      description: 'Доступна 24/7',
      color: 'orange'
    },
  ];

  const faqs = [
    {
      question: 'Как быстро вы отвечаете?',
      answer: 'Мы стараемся отвечать на все запросы в течение 24 часов. Срочные вопросы обрабатываются приоритетно.'
    },
    {
      question: 'Можно ли позвонить в службу поддержки?',
      answer: 'Да, наша телефонная линия работает с понедельника по пятницу с 9:00 до 18:00 по московскому времени.'
    },
    {
      question: 'Есть ли поддержка на других языках?',
      answer: 'Да, мы предоставляем поддержку на русском, английском и китайском языках.'
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: '',
      });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Свяжитесь с нами
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Мы всегда рады помочь! Напишите нам, и мы ответим как можно скорее
          </p>
        </motion.div>

        {/* Contact Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl p-6 shadow-lg text-center"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-${info.color}-100 rounded-full mb-4`}>
                  <Icon className={`w-6 h-6 text-${info.color}-600`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {info.title}
                </h3>
                <p className="font-semibold text-gray-900 mb-1">
                  {info.content}
                </p>
                <p className="text-sm text-gray-500">
                  {info.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Отправить сообщение
              </h2>

              {isSubmitted ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Сообщение отправлено!
                  </h3>
                  <p className="text-gray-600">
                    Мы получили ваше сообщение и ответим в ближайшее время
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name & Email */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ваше имя *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Иван Иванов"
                          className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="ivan@example.com"
                          className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Категория *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Тема сообщения *
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="Кратко опишите ваш вопрос"
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Сообщение *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Опишите ваш вопрос подробно..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition resize-none"
                    />
                  </div>

                  {/* Info Note */}
                  <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      Обычно мы отвечаем в течение 24 часов. Для срочных вопросов используйте телефон или live chat.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Отправка...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Отправить сообщение
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Working Hours */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Часы работы
                </h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Понедельник - Пятница</span>
                  <span className="font-semibold text-gray-900">9:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Суббота</span>
                  <span className="font-semibold text-gray-900">10:00 - 16:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Воскресенье</span>
                  <span className="font-semibold text-gray-900">Выходной</span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className="text-xs text-gray-500">
                    * Email поддержка работает 24/7
                  </span>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Быстрые ответы
              </h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                      {faq.question}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-3">
                Следите за нами
              </h3>
              <p className="text-sm text-white/90 mb-4">
                Новости, советы и обновления платформы
              </p>
              <div className="flex gap-2">
                <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition flex items-center justify-center">
                  📘
                </button>
                <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition flex items-center justify-center">
                  🐦
                </button>
                <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition flex items-center justify-center">
                  📷
                </button>
                <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition flex items-center justify-center">
                  💼
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
