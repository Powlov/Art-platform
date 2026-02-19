import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  Target, 
  Award, 
  Globe, 
  TrendingUp,
  Heart,
  Shield,
  Sparkles,
  ChevronRight,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { label: 'Произведений искусства', value: '10,000+', icon: Award },
    { label: 'Активных пользователей', value: '5,000+', icon: Users },
    { label: 'Галерей-партнёров', value: '150+', icon: Building2 },
    { label: 'Стран присутствия', value: '45+', icon: Globe },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Страсть к искусству',
      description: 'Мы верим в силу искусства изменять жизни и вдохновлять людей'
    },
    {
      icon: Shield,
      title: 'Безопасность сделок',
      description: 'Гарантируем подлинность произведений и защиту интересов покупателей'
    },
    {
      icon: TrendingUp,
      title: 'Инвестиции в искусство',
      description: 'Помогаем коллекционерам находить перспективные произведения'
    },
    {
      icon: Sparkles,
      title: 'Инновации',
      description: 'Используем передовые технологии для удобства пользователей'
    }
  ];

  const team = [
    {
      name: 'Александра Иванова',
      role: 'CEO & Founder',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexandra',
      bio: 'Искусствовед, 15+ лет опыта в арт-рынке'
    },
    {
      name: 'Дмитрий Петров',
      role: 'CTO',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dmitry',
      bio: 'Эксперт в финтехе и блокчейн-технологиях'
    },
    {
      name: 'Елена Смирнова',
      role: 'Chief Curator',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
      bio: 'Куратор современного искусства, PhD'
    },
    {
      name: 'Михаил Соколов',
      role: 'Head of Operations',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mikhail',
      bio: 'Специалист по логистике арт-объектов'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative py-20 px-4 overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700"
      >
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              О платформе ART BANK
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Мы создаём будущее арт-рынка, объединяя коллекционеров, художников и галереи в единую экосистему
            </p>
            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center gap-2"
              >
                Начать работу
                <ChevronRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-lg font-semibold hover:bg-white/20 transition"
              >
                Связаться с нами
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mb-4">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Наша миссия
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Сделать искусство доступным каждому, создав безопасную и прозрачную платформу 
              для покупки, продажи и инвестирования в произведения искусства
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg mb-4">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Наша команда
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Профессионалы с опытом в искусстве, технологиях и финансах
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="text-center"
              >
                <div className="relative mb-4 mx-auto w-48 h-48">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-purple-600 font-semibold mb-2">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-white mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">
              Свяжитесь с нами
            </h2>
            <p className="text-xl text-white/90">
              Мы всегда рады ответить на ваши вопросы
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div
              variants={itemVariants}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center text-white"
            >
              <Mail className="w-8 h-8 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-white/90">info@artbank.market</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center text-white"
            >
              <Phone className="w-8 h-8 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Телефон</h3>
              <p className="text-white/90">+7 (495) 123-45-67</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center text-white"
            >
              <MapPin className="w-8 h-8 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Адрес</h3>
              <p className="text-white/90">Москва, ул. Арбат, 25</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
