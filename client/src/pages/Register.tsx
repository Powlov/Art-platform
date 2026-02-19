import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

type UserRole = 'user' | 'artist' | 'collector' | 'gallery' | 'partner' | 'curator' | 'consultant';

const ROLES: { value: UserRole; label: string; description: string }[] = [
  { value: 'user', label: 'Гость', description: 'Просмотр каталога и участие в аукционах' },
  { value: 'collector', label: 'Коллекционер', description: 'Покупка и продажа произведений искусства' },
  { value: 'artist', label: 'Художник', description: 'Выставка и продажа своих работ' },
  { value: 'gallery', label: 'Галерея', description: 'Управление галереей и выставками' },
  { value: 'curator', label: 'Куратор', description: 'Организация выставок и мероприятий' },
  { value: 'partner', label: 'Партнер', description: 'Партнерские услуги и сотрудничество' },
  { value: 'consultant', label: 'Консультант', description: 'Консультирование и оценка произведений' },
];

export default function Register() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<'role' | 'form'>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: (data) => {
      setSuccessMessage('Регистрация успешна! Перенаправление...');
      // Save role to localStorage
      if (selectedRole) {
        localStorage.setItem('userRole', selectedRole);
      }
      toast.success('Регистрация успешна!');
      setTimeout(() => {
        setLocation('/login');
      }, 2000);
    },
    onError: (error) => {
      setErrors({ submit: error.message || 'Ошибка регистрации' });
      toast.error(error.message || 'Ошибка регистрации');
    },
  });

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep('form');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно';
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Введите корректный email';
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !selectedRole) return;

    setIsLoading(true);
    try {
      const result = await registerMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: selectedRole,
      });
      // Store role for later use
      if (selectedRole) {
        localStorage.setItem('registeredRole', selectedRole);
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'role') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">ART BANK MARKET</h1>
            <p className="text-xl text-gray-300">Выберите вашу роль на платформе</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ROLES.map((role) => (
              <Card
                key={role.value}
                className="cursor-pointer hover:border-blue-500 transition-all"
                onClick={() => handleRoleSelect(role.value)}
              >
                <CardContent className="pt-6">
                  <h3 className="font-bold text-lg mb-2">{role.label}</h3>
                  <p className="text-sm text-gray-600 mb-4">{role.description}</p>
                  <Button className="w-full" variant="outline">
                    Выбрать
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const roleLabel = ROLES.find((r) => r.value === selectedRole)?.label;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Регистрация</CardTitle>
          <p className="text-center text-sm text-gray-600 mt-2">
            Роль: <span className="font-semibold text-blue-600">{roleLabel}</span>
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {successMessage && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded text-green-700">
                <CheckCircle size={16} />
                {successMessage}
              </div>
            )}

            {errors.submit && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded text-red-700">
                <AlertCircle size={16} />
                {errors.submit}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Имя</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2 border rounded ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ваше имя"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-3 py-2 border rounded ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="your@email.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Пароль</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full px-3 py-2 border rounded ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Минимум 6 символов"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Подтвердите пароль</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={`w-full px-3 py-2 border rounded ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Повторите пароль"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || registerMutation.isPending}
            >
              {isLoading || registerMutation.isPending ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>

            <div className="text-center text-sm">
              <p className="text-gray-600">
                Уже есть аккаунт?{' '}
                <a href="/login" className="text-blue-600 hover:underline">
                  Войти
                </a>
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setStep('role')}
            >
              Выбрать другую роль
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
