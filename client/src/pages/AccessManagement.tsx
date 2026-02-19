import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Info } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import AccessControlPanel from '@/components/AccessControlPanel';
import { Card, CardContent } from '@/components/ui/card';

const AccessManagement: React.FC = () => {
  // Get user role from localStorage or context
  const userRole = (localStorage.getItem('userRole') as 'collector' | 'consultant') || 'collector';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <Header />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Shield className="w-8 h-8" />
            Управление доступом
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {userRole === 'collector'
              ? 'Управляйте доступом консультантов к вашей коллекции'
              : 'Ваши права доступа к коллекциям клиентов'}
          </p>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <Info className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Как работает система доступа?
                  </h3>
                  <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
                    {userRole === 'collector' ? (
                      <>
                        <p>
                          • Отправьте приглашение консультанту по email с указанием конкретных прав
                          доступа
                        </p>
                        <p>• Консультант получит уведомление и должен будет подтвердить доступ</p>
                        <p>
                          • Вы можете в любой момент изменить права доступа или полностью отозвать их
                        </p>
                        <p>
                          • Все действия консультанта в вашей коллекции логируются для вашей
                          безопасности
                        </p>
                      </>
                    ) : (
                      <>
                        <p>
                          • После получения приглашения от коллекционера подтвердите доступ в
                          уведомлениях
                        </p>
                        <p>
                          • Вы получите доступ к коллекции согласно правам, предоставленным
                          коллекционером
                        </p>
                        <p>
                          • Соблюдайте конфиденциальность информации о коллекции и финансовых данных
                        </p>
                        <p>
                          • Коллекционер может в любой момент изменить ваши права или отозвать доступ
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Access Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AccessControlPanel userRole={userRole} />
        </motion.div>
      </div>
    </div>
  );
};

export default AccessManagement;
