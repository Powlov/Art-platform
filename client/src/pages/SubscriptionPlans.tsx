import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Crown, Check, X, Star, Zap, Shield, Users, Image as ImageIcon,
  TrendingUp, DollarSign, Package, Award, Sparkles, Target,
  BarChart3, Calendar, Clock, MessageSquare, Phone, Mail,
  CreditCard, ChevronRight, Info, AlertCircle, CheckCircle,
  ArrowRight, Plus, Minus, Settings, Download, ExternalLink,
  Gift, Tag, Percent, Briefcase, Globe, Lock, Unlock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '../_core/hooks/useAuth';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  popular?: boolean;
  features: {
    artworks: number | 'unlimited';
    artists: number | 'unlimited';
    exhibitions: number | 'unlimited';
    storage: string;
    commission: number;
    prioritySupport: boolean;
    analytics: boolean;
    customDomain: boolean;
    apiAccess: boolean;
    whiteLabel: boolean;
    dedicatedManager: boolean;
    marketingTools: boolean;
    advancedCRM: boolean;
    aiRecommendations: boolean;
  };
  description: string;
  color: string;
}

interface Subscription {
  id: number;
  planId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  autoRenew: boolean;
  nextBillingDate?: string;
  totalSpent: number;
}

interface Invoice {
  id: number;
  date: string;
  amount: number;
  plan: string;
  status: 'paid' | 'pending' | 'failed';
  downloadUrl: string;
}

export default function SubscriptionPlans() {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  // Тарифные планы
  const plans: SubscriptionPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: billingCycle === 'monthly' ? 9900 : 99000,
      billingPeriod: billingCycle,
      description: 'Идеально для начинающих галерей и художников',
      color: 'from-gray-500 to-slate-500',
      features: {
        artworks: 50,
        artists: 5,
        exhibitions: 2,
        storage: '10 GB',
        commission: 10,
        prioritySupport: false,
        analytics: false,
        customDomain: false,
        apiAccess: false,
        whiteLabel: false,
        dedicatedManager: false,
        marketingTools: false,
        advancedCRM: false,
        aiRecommendations: false
      }
    },
    {
      id: 'professional',
      name: 'Professional',
      price: billingCycle === 'monthly' ? 29900 : 299000,
      billingPeriod: billingCycle,
      popular: true,
      description: 'Для активных галерей с растущей коллекцией',
      color: 'from-blue-500 to-indigo-500',
      features: {
        artworks: 200,
        artists: 20,
        exhibitions: 10,
        storage: '50 GB',
        commission: 7,
        prioritySupport: true,
        analytics: true,
        customDomain: true,
        apiAccess: false,
        whiteLabel: false,
        dedicatedManager: false,
        marketingTools: true,
        advancedCRM: true,
        aiRecommendations: true
      }
    },
    {
      id: 'business',
      name: 'Business',
      price: billingCycle === 'monthly' ? 59900 : 599000,
      billingPeriod: billingCycle,
      description: 'Полный функционал для крупных галерей',
      color: 'from-purple-500 to-pink-500',
      features: {
        artworks: 1000,
        artists: 100,
        exhibitions: 'unlimited',
        storage: '200 GB',
        commission: 5,
        prioritySupport: true,
        analytics: true,
        customDomain: true,
        apiAccess: true,
        whiteLabel: true,
        dedicatedManager: false,
        marketingTools: true,
        advancedCRM: true,
        aiRecommendations: true
      }
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: billingCycle === 'monthly' ? 149900 : 1499000,
      billingPeriod: billingCycle,
      description: 'Индивидуальное решение для крупнейших игроков рынка',
      color: 'from-orange-500 to-red-500',
      features: {
        artworks: 'unlimited',
        artists: 'unlimited',
        exhibitions: 'unlimited',
        storage: 'Unlimited',
        commission: 3,
        prioritySupport: true,
        analytics: true,
        customDomain: true,
        apiAccess: true,
        whiteLabel: true,
        dedicatedManager: true,
        marketingTools: true,
        advancedCRM: true,
        aiRecommendations: true
      }
    }
  ];

  // Mock текущая подписка
  const currentSubscription: Subscription = {
    id: 1,
    planId: 'professional',
    startDate: '2026-01-15',
    endDate: '2026-02-15',
    status: 'active',
    autoRenew: true,
    nextBillingDate: '2026-02-15',
    totalSpent: 89700
  };

  // Mock инвойсы
  const invoices: Invoice[] = [
    {
      id: 1,
      date: '2026-02-01',
      amount: 29900,
      plan: 'Professional',
      status: 'paid',
      downloadUrl: '#'
    },
    {
      id: 2,
      date: '2026-01-01',
      amount: 29900,
      plan: 'Professional',
      status: 'paid',
      downloadUrl: '#'
    },
    {
      id: 3,
      date: '2025-12-01',
      amount: 29900,
      plan: 'Professional',
      status: 'paid',
      downloadUrl: '#'
    }
  ];

  // Статистика
  const stats = [
    {
      label: 'Текущий план',
      value: plans.find(p => p.id === currentSubscription.planId)?.name || 'N/A',
      icon: Crown,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      label: 'До следующего платежа',
      value: currentSubscription.nextBillingDate 
        ? Math.ceil((new Date(currentSubscription.nextBillingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : 0,
      suffix: 'дней',
      icon: Calendar,
      color: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Потрачено всего',
      value: currentSubscription.totalSpent.toLocaleString(),
      suffix: '₽',
      icon: DollarSign,
      color: 'from-purple-500 to-pink-500'
    },
    {
      label: 'Статус подписки',
      value: currentSubscription.status === 'active' ? 'Активна' : 'Неактивна',
      icon: CheckCircle,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const getFeatureValue = (value: number | string) => {
    if (value === 'unlimited') return 'Безлимит';
    return value;
  };

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowCheckout(true);
  };

  const handleCancelSubscription = () => {
    console.log('Отмена подписки');
    // TODO: API call
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            <Crown className="inline-block w-10 h-10 mr-3 text-yellow-500" />
            Тарифные планы
          </h1>
          <p className="text-gray-600 mb-6">
            Выберите план, который подходит вашей галерее
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-white rounded-full p-2 shadow-lg">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Ежемесячно
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Ежегодно
              <Badge className="bg-green-500 text-white text-xs">-17%</Badge>
            </button>
          </div>
        </motion.div>

        {/* Current Subscription Stats */}
        {user?.role === 'gallery' && currentSubscription.status === 'active' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-none shadow-lg">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value} {stat.suffix && <span className="text-lg">{stat.suffix}</span>}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-none px-4 py-1">
                    <Star className="w-3 h-3 mr-1 inline" />
                    Популярный
                  </Badge>
                </div>
              )}
              
              <Card className={`border-none shadow-lg overflow-hidden h-full ${
                plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}>
                {/* Header */}
                <div className={`p-6 bg-gradient-to-r ${plan.color} text-white`}>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-2">
                    <span className="text-4xl font-bold">
                      {plan.price.toLocaleString()}
                    </span>
                    <span className="text-xl ml-2">₽</span>
                  </div>
                  <p className="text-white/80 text-sm">
                    {billingCycle === 'monthly' ? 'в месяц' : 'в год'}
                  </p>
                </div>

                <CardContent className="p-6">
                  <p className="text-sm text-gray-600 mb-6">{plan.description}</p>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>
                        <strong>{getFeatureValue(plan.features.artworks)}</strong> произведений
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>
                        <strong>{getFeatureValue(plan.features.artists)}</strong> художников
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>
                        <strong>{getFeatureValue(plan.features.exhibitions)}</strong> выставок
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>
                        <strong>{plan.features.storage}</strong> хранилище
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>
                        Комиссия <strong>{plan.features.commission}%</strong>
                      </span>
                    </div>

                    {plan.features.prioritySupport && (
                      <div className="flex items-center text-sm">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>Приоритетная поддержка</span>
                      </div>
                    )}
                    {plan.features.analytics && (
                      <div className="flex items-center text-sm">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>Расширенная аналитика</span>
                      </div>
                    )}
                    {plan.features.customDomain && (
                      <div className="flex items-center text-sm">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>Свой домен</span>
                      </div>
                    )}
                    {plan.features.apiAccess && (
                      <div className="flex items-center text-sm">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>API доступ</span>
                      </div>
                    )}
                    {plan.features.whiteLabel && (
                      <div className="flex items-center text-sm">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>White-label</span>
                      </div>
                    )}
                    {plan.features.dedicatedManager && (
                      <div className="flex items-center text-sm">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>Персональный менеджер</span>
                      </div>
                    )}
                    {plan.features.marketingTools && (
                      <div className="flex items-center text-sm">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>Маркетинговые инструменты</span>
                      </div>
                    )}
                    {plan.features.advancedCRM && (
                      <div className="flex items-center text-sm">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>Продвинутая CRM</span>
                      </div>
                    )}
                    {plan.features.aiRecommendations && (
                      <div className="flex items-center text-sm">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>AI рекомендации</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                        : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                    onClick={() => handleSelectPlan(plan)}
                    disabled={currentSubscription.planId === plan.id}
                  >
                    {currentSubscription.planId === plan.id ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Текущий план
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Выбрать план
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Content */}
        <Tabs defaultValue="features" className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm border border-gray-200">
            <TabsTrigger value="features" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Сравнение функций
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              История платежей
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              FAQ
            </TabsTrigger>
          </TabsList>

          {/* Features Comparison */}
          <TabsContent value="features">
            <Card className="border-none shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Функция
                        </th>
                        {plans.map(plan => (
                          <th key={plan.id} className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                            {plan.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">Произведения</td>
                        {plans.map(plan => (
                          <td key={plan.id} className="px-6 py-4 text-center text-sm text-gray-600">
                            {getFeatureValue(plan.features.artworks)}
                          </td>
                        ))}
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">Художники</td>
                        {plans.map(plan => (
                          <td key={plan.id} className="px-6 py-4 text-center text-sm text-gray-600">
                            {getFeatureValue(plan.features.artists)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">Выставки</td>
                        {plans.map(plan => (
                          <td key={plan.id} className="px-6 py-4 text-center text-sm text-gray-600">
                            {getFeatureValue(plan.features.exhibitions)}
                          </td>
                        ))}
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">Хранилище</td>
                        {plans.map(plan => (
                          <td key={plan.id} className="px-6 py-4 text-center text-sm text-gray-600">
                            {plan.features.storage}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">Комиссия</td>
                        {plans.map(plan => (
                          <td key={plan.id} className="px-6 py-4 text-center text-sm text-gray-600">
                            {plan.features.commission}%
                          </td>
                        ))}
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">Приоритетная поддержка</td>
                        {plans.map(plan => (
                          <td key={plan.id} className="px-6 py-4 text-center">
                            {plan.features.prioritySupport ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-gray-300 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">Расширенная аналитика</td>
                        {plans.map(plan => (
                          <td key={plan.id} className="px-6 py-4 text-center">
                            {plan.features.analytics ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-gray-300 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">Свой домен</td>
                        {plans.map(plan => (
                          <td key={plan.id} className="px-6 py-4 text-center">
                            {plan.features.customDomain ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-gray-300 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">API доступ</td>
                        {plans.map(plan => (
                          <td key={plan.id} className="px-6 py-4 text-center">
                            {plan.features.apiAccess ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-gray-300 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">White-label</td>
                        {plans.map(plan => (
                          <td key={plan.id} className="px-6 py-4 text-center">
                            {plan.features.whiteLabel ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-gray-300 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">Персональный менеджер</td>
                        {plans.map(plan => (
                          <td key={plan.id} className="px-6 py-4 text-center">
                            {plan.features.dedicatedManager ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-gray-300 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing History */}
          <TabsContent value="billing">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    История платежей
                  </span>
                  {currentSubscription.autoRenew && (
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Автопродление включено
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {invoices.map((invoice, index) => (
                    <motion.div
                      key={invoice.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          invoice.status === 'paid'
                            ? 'bg-green-100'
                            : invoice.status === 'pending'
                            ? 'bg-yellow-100'
                            : 'bg-red-100'
                        }`}>
                          {invoice.status === 'paid' && <CheckCircle className="w-6 h-6 text-green-600" />}
                          {invoice.status === 'pending' && <Clock className="w-6 h-6 text-yellow-600" />}
                          {invoice.status === 'failed' && <X className="w-6 h-6 text-red-600" />}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{invoice.plan}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(invoice.date).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            {invoice.amount.toLocaleString()} ₽
                          </p>
                          <Badge
                            variant={invoice.status === 'paid' ? 'default' : 'secondary'}
                          >
                            {invoice.status === 'paid' && 'Оплачено'}
                            {invoice.status === 'pending' && 'Ожидание'}
                            {invoice.status === 'failed' && 'Ошибка'}
                          </Badge>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => console.log('Изменить способ оплаты')}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Изменить способ оплаты
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                    onClick={handleCancelSubscription}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Отменить подписку
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ */}
          <TabsContent value="faq">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-purple-600" />
                  Часто задаваемые вопросы
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Могу ли я изменить план в любое время?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Да, вы можете повысить или понизить свой план в любое время. При повышении изменения вступают в силу немедленно, при понижении — со следующего расчётного периода.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Что происходит при отмене подписки?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Вы сохраняете доступ ко всем функциям до конца оплаченного периода. После этого ваш аккаунт переходит в режим только для чтения.
                  </p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Какие способы оплаты вы принимаете?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Мы принимаем банковские карты (Visa, Mastercard, МИР), банковские переводы и электронные кошельки (ЮMoney, QIWI).
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Есть ли скидки для некоммерческих организаций?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Да, мы предоставляем скидку 30% для некоммерческих организаций и музеев. Свяжитесь с нашим менеджером для оформления.
                  </p>
                </div>
                <div className="border-l-4 border-pink-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Можно ли попробовать платформу бесплатно?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Да, мы предоставляем 14-дневный пробный период для плана Professional без необходимости указывать платёжные данные.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Checkout Modal (simplified) */}
        {showCheckout && selectedPlan && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Оформление подписки</h2>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {/* Plan Summary */}
                <div className={`p-4 rounded-lg bg-gradient-to-r ${selectedPlan.color} text-white`}>
                  <h3 className="text-xl font-bold mb-2">{selectedPlan.name}</h3>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">
                      {selectedPlan.price.toLocaleString()}
                    </span>
                    <span className="text-lg ml-2">₽</span>
                    <span className="text-sm ml-2 opacity-80">
                      / {billingCycle === 'monthly' ? 'месяц' : 'год'}
                    </span>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Способ оплаты
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Банковская карта</option>
                    <option>ЮMoney</option>
                    <option>QIWI</option>
                    <option>Банковский перевод</option>
                  </select>
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Подписка {selectedPlan.name}</span>
                    <span>{selectedPlan.price.toLocaleString()} ₽</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <div className="flex justify-between text-sm text-green-600 mb-2">
                      <span>Скидка за годовую оплату</span>
                      <span>-{(selectedPlan.price * 0.17).toLocaleString()} ₽</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Итого</span>
                    <span>{selectedPlan.price.toLocaleString()} ₽</span>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  onClick={() => {
                    console.log('Processing payment');
                    setShowCheckout(false);
                  }}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Оплатить
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Нажимая "Оплатить", вы соглашаетесь с условиями подписки и политикой возврата
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
