import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Key,
  RefreshCw,
  Copy,
  Check,
  Eye,
  EyeOff,
  Webhook,
  Settings,
  Shield,
  Zap,
  AlertCircle,
  Activity,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ApiIntegrationSettingsProps {
  bankPartner?: any;
}

export default function ApiIntegrationSettings({ bankPartner }: ApiIntegrationSettingsProps) {
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState(bankPartner?.webhookUrl || 'https://api.sberbank.ru/webhooks/artbank');
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);

  // Mock data
  const apiKey = bankPartner?.apiKey || 'sberbank_9x8y7z6w5v4u3t2s1r0q';
  const apiVersion = 'v2.1';
  const rateLimits = {
    requestsPerMinute: 1000,
    requestsPerHour: 50000,
    burstLimit: 100,
  };

  const webhookEvents = [
    { name: 'loan.created', enabled: true, description: 'Новый займ создан' },
    { name: 'loan.approved', enabled: true, description: 'Займ одобрен' },
    { name: 'loan.rejected', enabled: false, description: 'Займ отклонён' },
    { name: 'ltv.threshold_exceeded', enabled: true, description: 'Превышен порог LTV' },
    { name: 'valuation.updated', enabled: true, description: 'Обновлена оценка' },
    { name: 'margin_call.triggered', enabled: true, description: 'Margin Call сработал' },
  ];

  const recentApiCalls = [
    { method: 'POST', endpoint: '/api/loans/create', status: 200, duration: 145, time: '2 мин назад' },
    { method: 'GET', endpoint: '/api/loans/list', status: 200, duration: 89, time: '5 мин назад' },
    { method: 'POST', endpoint: '/api/valuations/trigger', status: 200, duration: 234, time: '12 мин назад' },
    { method: 'GET', endpoint: '/api/artworks/search', status: 200, duration: 67, time: '18 мин назад' },
    { method: 'PATCH', endpoint: '/api/loans/LN-2801/status', status: 200, duration: 112, time: '23 мин назад' },
  ];

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast.success('API ключ скопирован');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerateApiKey = async () => {
    setIsRegenerating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success('API ключ успешно перегенерирован');
    setIsRegenerating(false);
  };

  const handleTestWebhook = async () => {
    setIsTestingWebhook(true);
    // Simulate webhook test
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success('Тестовый webhook отправлен успешно');
    setIsTestingWebhook(false);
  };

  const handleSaveWebhookUrl = () => {
    toast.success('Webhook URL сохранён');
  };

  return (
    <div className="space-y-6">
      {/* API Key Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Key className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">API Ключ</CardTitle>
                <CardDescription>Используйте этот ключ для авторизации API запросов</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Активен
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                readOnly
                className="font-mono text-sm"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyApiKey}
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="destructive"
              onClick={handleRegenerateApiKey}
              disabled={isRegenerating}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
              Перегенерировать ключ
            </Button>
            <span className="text-sm text-gray-500">
              Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
            </span>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Важно!</p>
              <p>После перегенерации старый ключ перестанет работать. Обновите ключ во всех интеграциях.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Webhook Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Webhook className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Webhook URL</CardTitle>
              <CardDescription>Получайте уведомления о событиях в реальном времени</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook Endpoint</Label>
            <div className="flex items-center gap-2">
              <Input
                id="webhook-url"
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://api.your-bank.com/webhooks/artbank"
                className="font-mono text-sm"
              />
              <Button onClick={handleSaveWebhookUrl}>Сохранить</Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>События для подписки</Label>
            <div className="grid grid-cols-2 gap-3">
              {webhookEvents.map((event) => (
                <div
                  key={event.name}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{event.name}</p>
                    <p className="text-xs text-gray-500">{event.description}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={event.enabled}
                    className="rounded"
                    onChange={() => {}}
                  />
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleTestWebhook}
            disabled={isTestingWebhook}
          >
            <Zap className={`w-4 h-4 mr-2 ${isTestingWebhook ? 'animate-pulse' : ''}`} />
            {isTestingWebhook ? 'Отправка...' : 'Отправить тестовый webhook'}
          </Button>
        </CardContent>
      </Card>

      {/* Rate Limits */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Shield className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Лимиты запросов</CardTitle>
              <CardDescription>Текущие ограничения для вашего API ключа</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{rateLimits.requestsPerMinute.toLocaleString()}</div>
              <div className="text-sm text-gray-500 mt-1">Запросов в минуту</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{rateLimits.requestsPerHour.toLocaleString()}</div>
              <div className="text-sm text-gray-500 mt-1">Запросов в час</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{rateLimits.burstLimit}</div>
              <div className="text-sm text-gray-500 mt-1">Burst лимит</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent API Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Последние API запросы</CardTitle>
                <CardDescription>История последних вызовов API</CardDescription>
              </div>
            </div>
            <Badge variant="outline">API v{apiVersion}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentApiCalls.map((call, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <Badge
                    variant={call.method === 'POST' ? 'default' : call.method === 'GET' ? 'secondary' : 'outline'}
                    className="w-16 justify-center"
                  >
                    {call.method}
                  </Badge>
                  <span className="text-sm font-mono text-gray-700">{call.endpoint}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={call.status === 200 ? 'default' : 'destructive'} className="w-12 justify-center bg-green-100 text-green-700 border-green-200">
                    {call.status}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {call.duration}ms
                  </div>
                  <span className="text-sm text-gray-500 w-24 text-right">{call.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Documentation Link */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Документация API</p>
                <p className="text-sm text-blue-700">Полное руководство по интеграции с ART BANK API</p>
              </div>
            </div>
            <Button variant="outline">
              Открыть документацию
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
