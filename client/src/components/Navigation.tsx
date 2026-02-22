import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Palette, Hammer, Users, ShoppingCart, Wallet,
  User, Settings, LogOut, Menu, X, Bell, Search,
  Shield, Upload, LayoutDashboard, FileText, TrendingUp,
  CreditCard, MessageSquare, Target, Briefcase, DollarSign, Globe,
  Lock, Truck, Calendar, BookOpen
} from 'lucide-react';
import NotificationCenter from './NotificationCenter';

interface NavigationProps {
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  } | null;
  onLogout?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ user, onLogout }) => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Публичные ссылки - адаптируются под роль пользователя
  const getPublicLinks = () => {
    const baseLinks = [
      { path: '/', label: 'Главная', icon: Home },
      { path: '/marketplace', label: 'Произведения', icon: Palette },
      { path: '/auctions', label: 'Аукционы', icon: Hammer },
      { path: '/events', label: 'Мероприятия', icon: Calendar },
      { path: '/statistics', label: 'Статистика рынка', icon: TrendingUp },
    ];
    
    // Добавляем "Художники" для всех, кроме коллекционера
    if (user?.role !== 'collector') {
      baseLinks.splice(4, 0, { path: '/artists', label: 'Художники', icon: Users });
    }
    
    return baseLinks;
  };

  const publicLinks = getPublicLinks();

  const userLinks = [
    { path: '/wallet', label: 'Кошелёк', icon: Wallet },
    { path: '/investments', label: 'Инвестиции', icon: TrendingUp },
    { path: '/blockchain-passport', label: 'Паспорта', icon: Shield },
    { path: '/knowledge-base', label: 'Обучение', icon: BookOpen },
    { path: '/rfq', label: 'Запросы RFQ', icon: MessageSquare },
    { path: '/crowdfunding', label: 'Краудфандинг', icon: Target },
    { path: '/art-credit', label: 'Арт-кредит', icon: CreditCard },
    { path: '/art-insurance', label: 'Страхование', icon: Shield },
    { path: '/logistics', label: 'Логистика', icon: Truck },
    { path: '/artist-storefront', label: 'Витрина', icon: Globe },
    { path: '/artworks/my', label: 'Мои работы', icon: FileText },
    { path: '/artworks/submit', label: 'Подать работу', icon: Upload },
  ];

  const adminLinks = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/moderation', label: 'Модерация', icon: Shield },
    { path: '/transaction-led-core', label: 'Ядро платформы', icon: Settings },
    { path: '/gallery-crm', label: 'CRM Галереи', icon: Briefcase },
    { path: '/private-sales', label: 'Приватные продажи', icon: Lock },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location === '/';
    return location.startsWith(path);
  };

  const NavLink = ({ path, label, icon: Icon, mobile = false }: any) => (
    <Link href={path}>
      <motion.a
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
          ${isActive(path)
            ? 'bg-purple-100 text-purple-700 font-semibold'
            : 'text-gray-700 hover:bg-gray-100'
          }
          ${mobile ? 'w-full justify-start' : ''}
        `}
        onClick={() => mobile && setMobileMenuOpen(false)}
      >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </motion.a>
    </Link>
  );

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <motion.a
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                ART BANK
              </span>
            </motion.a>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {publicLinks.map(link => (
              <NavLink key={link.path} {...link} />
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {/* Search */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <Search className="w-5 h-5" />
                </motion.button>

                {/* Notifications */}
                <NotificationCenter />

                {/* User Menu */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  </motion.button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2"
                      >
                        {/* User Links */}
                        <div className="px-2 py-2">
                          {userLinks.map(link => (
                            <NavLink key={link.path} {...link} mobile />
                          ))}
                        </div>

                        {/* Admin Links */}
                        {user.role === 'admin' && (
                          <>
                            <div className="border-t border-gray-100 my-2"></div>
                            <div className="px-2 py-2">
                              <p className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase">Admin</p>
                              {adminLinks.map(link => (
                                <NavLink key={link.path} {...link} mobile />
                              ))}
                            </div>
                          </>
                        )}

                        {/* Bottom Section */}
                        <div className="border-t border-gray-100 mt-2 pt-2 px-2">
                          <Link href="/profile">
                            <a className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                              <Settings className="w-5 h-5" />
                              <span>Настройки</span>
                            </a>
                          </Link>
                          <button
                            onClick={() => {
                              setUserMenuOpen(false);
                              onLogout?.();
                            }}
                            className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <LogOut className="w-5 h-5" />
                            <span>Выйти</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                  >
                    Войти
                  </motion.a>
                </Link>
                <Link href="/register">
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium shadow-lg"
                  >
                    Регистрация
                  </motion.a>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100"
          >
            <div className="px-4 py-4 space-y-2">
              {/* Public Links */}
              {publicLinks.map(link => (
                <NavLink key={link.path} {...link} mobile />
              ))}

              {user && (
                <>
                  <div className="border-t border-gray-100 my-2"></div>
                  {userLinks.map(link => (
                    <NavLink key={link.path} {...link} mobile />
                  ))}

                  {user.role === 'admin' && (
                    <>
                      <div className="border-t border-gray-100 my-2"></div>
                      <p className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase">Admin</p>
                      {adminLinks.map(link => (
                        <NavLink key={link.path} {...link} mobile />
                      ))}
                    </>
                  )}

                  <div className="border-t border-gray-100 my-2"></div>
                  <Link href="/profile">
                    <a className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg w-full">
                      <Settings className="w-5 h-5" />
                      <span>Настройки</span>
                    </a>
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout?.();
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Выйти</span>
                  </button>
                </>
              )}

              {!user && (
                <>
                  <div className="border-t border-gray-100 my-2"></div>
                  <Link href="/login">
                    <a className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium text-center">
                      Войти
                    </a>
                  </Link>
                  <Link href="/register">
                    <a className="block px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium text-center">
                      Регистрация
                    </a>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {(userMenuOpen || mobileMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setUserMenuOpen(false);
            setMobileMenuOpen(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navigation;
