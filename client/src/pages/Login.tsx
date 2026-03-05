import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      toast.success('Вход успешен!');
      // Store user data in localStorage
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userRole', data.user.role || 'user');
      }
      
      // Redirect based on user role
      const role = data.user?.role || 'user';
      const roleRoutes: Record<string, string> = {
        admin: '/admin/dashboard',
        artist: '/artist/dashboard',
        collector: '/collector/dashboard',
        gallery: '/gallery/dashboard',
        partner: '/partner/dashboard',
        curator: '/curator/dashboard',
        consultant: '/consultant/dashboard',
        bank: '/bank-portal',
        user: '/user/dashboard',
        guest: '/guest/dashboard',
      };
      
      const redirectUrl = roleRoutes[role] || '/guest/dashboard';
      setTimeout(() => {
        setLocation(redirectUrl);
      }, 500);
    },
    onError: (error) => {
      setError(error.message || 'Ошибка входа');
      toast.error(error.message || 'Ошибка входа');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Заполните все поля');
      return;
    }

    setIsLoading(true);
    try {
      await loginMutation.mutateAsync({
        email,
        password,
      });
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">ART BANK MARKET</CardTitle>
            <p className="text-center text-sm text-gray-600 mt-2">Войдите в свой аккаунт</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded text-red-700"
                  role="alert"
                  aria-live="assertive"
                >
                  <AlertCircle size={16} />
                  {error}
                </motion.div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="test@example.com"
                  aria-label="Email адрес"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Пароль
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-10 border rounded border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    aria-label="Пароль"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1 transition-colors"
                    aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                    tabIndex={0}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || loginMutation.isPending}
                aria-label="Войти в аккаунт"
              >
                {isLoading || loginMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span> Вход...
                  </span>
                ) : (
                  'Войти'
                )}
              </Button>

              <div className="text-center text-sm">
                <p className="text-gray-600">
                  Нет аккаунта?{' '}
                  <button
                    type="button"
                    onClick={() => setLocation('/register')}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Зарегистрироваться
                  </button>
                </p>
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <p className="text-xs font-semibold text-gray-700 mb-2">Демо аккаунты для тестирования:</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div><strong>Admin:</strong> admin@artbank.com</div>
                  <div><strong>Пароль:</strong> admin123</div>
                  <div><strong>Artist:</strong> artist@artbank.com</div>
                  <div><strong>Пароль:</strong> artist123</div>
                  <div><strong>Collector:</strong> collector@artbank.com</div>
                  <div><strong>Пароль:</strong> collector123</div>
                  <div><strong>Gallery:</strong> gallery@artbank.com</div>
                  <div><strong>Пароль:</strong> gallery123</div>
                  <div><strong>Bank (Сбербанк):</strong> bank@sberbank.ru</div>
                  <div><strong>Пароль:</strong> bank123456</div>
                </div>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
