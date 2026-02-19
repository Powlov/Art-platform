import React, { useState } from 'react';
import { Wallet, TrendingUp, DollarSign, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';

interface WalletWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletWidget({ isOpen, onClose }: WalletWidgetProps) {
  const [, setLocation] = useLocation();
  const [showBalance, setShowBalance] = useState(true);

  // Mock data - заменить на реальные данные из API
  const balance = 125450.50;
  const portfolioValue = 450000;
  const monthlyGrowth = 12.5;
  const pendingTransactions = 2;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const recentTransactions = [
    { id: '1', type: 'income', description: 'Продажа "Абстракция #5"', amount: 45000, date: 'Сегодня' },
    { id: '2', type: 'expense', description: 'Покупка "Пейзаж маслом"', amount: -22000, date: 'Вчера' },
    { id: '3', type: 'income', description: 'Продажа "Портрет"', amount: 18500, date: '2 дня назад' },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dropdown */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-2xl z-50"
          role="dialog"
          aria-label="Кошелек"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Wallet size={20} />
                <h3 className="font-bold">Мой Кошелек</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalance(!showBalance)}
                className="text-white hover:bg-white/20"
                aria-label={showBalance ? 'Скрыть баланс' : 'Показать баланс'}
              >
                {showBalance ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
            
            {/* Balance */}
            <div className="space-y-1">
              <p className="text-xs opacity-90">Доступный баланс</p>
              <p className="text-2xl font-bold">
                {showBalance ? formatCurrency(balance) : '• • • • •'}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="p-4 grid grid-cols-2 gap-3 border-b border-gray-200">
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={16} className="text-green-600" />
                <p className="text-xs text-gray-600">Портфель</p>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {showBalance ? formatCurrency(portfolioValue) : '• • •'}
              </p>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign size={16} className="text-blue-600" />
                <p className="text-xs text-gray-600">Рост за месяц</p>
              </div>
              <p className="text-lg font-bold text-blue-600">
                +{monthlyGrowth}%
              </p>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Последние транзакции</h4>
            <div className="space-y-2">
              {recentTransactions.map((transaction) => (
                <div 
                  key={transaction.id}
                  className="flex items-start justify-between p-2 hover:bg-gray-50 rounded-lg transition cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-gray-500">{transaction.date}</p>
                  </div>
                  <div className={`text-sm font-bold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : ''}
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending */}
          {pendingTransactions > 0 && (
            <div className="px-4 pb-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-sm text-orange-800">
                  {pendingTransactions} {pendingTransactions === 1 ? 'транзакция' : 'транзакции'} в обработке
                </p>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="p-3 border-t border-gray-200 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                setLocation('/wallet');
                onClose();
              }}
            >
              <Wallet size={14} className="mr-2" />
              Кошелек
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setLocation('/wallet?action=deposit');
                onClose();
              }}
            >
              <DollarSign size={14} className="mr-2" />
              Пополнить
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
