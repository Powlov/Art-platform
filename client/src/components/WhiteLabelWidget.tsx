import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Monitor, 
  Smartphone, 
  Code, 
  Eye, 
  Copy, 
  CheckCircle,
  Settings,
  Palette,
  Globe,
  Lock,
  Zap,
  Download,
  ExternalLink,
  RefreshCw,
  Shield,
  Layers
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

interface WidgetConfig {
  id: string;
  name: string;
  type: 'iframe' | 'webcomponent' | 'api';
  embedCode: string;
  previewUrl: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    logo: string;
    fontFamily: string;
  };
  features: string[];
  dimensions: {
    width: string;
    height: string;
    responsive: boolean;
  };
  security: {
    sso: boolean;
    apiKey: string;
    domain: string;
  };
}

interface IntegrationEndpoint {
  name: string;
  method: string;
  endpoint: string;
  description: string;
  request: string;
  response: string;
}

export default function WhiteLabelWidget() {
  const [selectedWidget, setSelectedWidget] = useState<string>('loan-calculator');
  const [copiedCode, setCopiedCode] = useState<string>('');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [ssoEnabled, setSsoEnabled] = useState(false);

  const widgetConfigs: Record<string, WidgetConfig> = {
    'loan-calculator': {
      id: 'loan-calculator',
      name: 'Кредитный калькулятор',
      type: 'iframe',
      embedCode: `<iframe 
  src="https://artbank.pages.dev/widgets/loan-calculator?partner=sberbank&theme=light"
  width="100%"
  height="600"
  frameborder="0"
  allow="payment"
  sandbox="allow-scripts allow-same-origin allow-forms"
></iframe>`,
      previewUrl: '/widgets/loan-calculator',
      theme: {
        primaryColor: '#21A038',
        secondaryColor: '#0E5A1F',
        logo: '/logos/sberbank.svg',
        fontFamily: 'SBSansInterface, Arial, sans-serif'
      },
      features: ['LTV расчёт', 'Выбор банка', 'Сравнение условий', 'Онлайн-заявка'],
      dimensions: {
        width: '100%',
        height: '600px',
        responsive: true
      },
      security: {
        sso: true,
        apiKey: 'sk_live_51234567890abcdef',
        domain: 'www.sberbank.ru'
      }
    },
    'art-catalog': {
      id: 'art-catalog',
      name: 'Каталог искусства',
      type: 'iframe',
      embedCode: `<iframe 
  src="https://artbank.pages.dev/widgets/art-catalog?partner=vtb&theme=light"
  width="100%"
  height="800"
  frameborder="0"
  allow="fullscreen"
  sandbox="allow-scripts allow-same-origin"
></iframe>`,
      previewUrl: '/widgets/art-catalog',
      theme: {
        primaryColor: '#002882',
        secondaryColor: '#0047BB',
        logo: '/logos/vtb.svg',
        fontFamily: 'VTB Group, Arial, sans-serif'
      },
      features: ['Поиск арта', 'Фильтры', 'Детальный просмотр', 'Art-DNA паспорт'],
      dimensions: {
        width: '100%',
        height: '800px',
        responsive: true
      },
      security: {
        sso: true,
        apiKey: 'sk_live_vtb_987654321',
        domain: 'www.vtb.ru'
      }
    },
    'price-monitor': {
      id: 'price-monitor',
      name: 'Мониторинг цен',
      type: 'webcomponent',
      embedCode: `<script src="https://artbank.pages.dev/widgets/price-monitor.js"></script>
<art-price-monitor
  partner="alfabank"
  theme="light"
  api-key="sk_live_alfa_abc123"
></art-price-monitor>`,
      previewUrl: '/widgets/price-monitor',
      theme: {
        primaryColor: '#EF3124',
        secondaryColor: '#CC2A1F',
        logo: '/logos/alfabank.svg',
        fontFamily: 'Graphik LC, Arial, sans-serif'
      },
      features: ['AI Price Corridor', 'Anomaly alerts', 'Market indices', 'Real-time'],
      dimensions: {
        width: '100%',
        height: '500px',
        responsive: true
      },
      security: {
        sso: false,
        apiKey: 'sk_live_alfa_abc123',
        domain: 'alfabank.ru'
      }
    },
    'portfolio-dashboard': {
      id: 'portfolio-dashboard',
      name: 'Портфель активов',
      type: 'iframe',
      embedCode: `<iframe 
  src="https://artbank.pages.dev/widgets/portfolio?partner=tinkoff&theme=dark"
  width="100%"
  height="700"
  frameborder="0"
  allow="payment clipboard-write"
  sandbox="allow-scripts allow-same-origin allow-forms"
></iframe>`,
      previewUrl: '/widgets/portfolio',
      theme: {
        primaryColor: '#FFDD2D',
        secondaryColor: '#333333',
        logo: '/logos/tinkoff.svg',
        fontFamily: 'Tinkoff Sans, Arial, sans-serif'
      },
      features: ['Список займов', 'Risk metrics', 'LTV monitoring', 'Экспорт'],
      dimensions: {
        width: '100%',
        height: '700px',
        responsive: true
      },
      security: {
        sso: true,
        apiKey: 'sk_live_tinkoff_xyz789',
        domain: 'www.tinkoff.ru'
      }
    }
  };

  const integrationEndpoints: IntegrationEndpoint[] = [
    {
      name: 'Create Loan Application',
      method: 'POST',
      endpoint: '/api/v1/loans/applications',
      description: 'Создать новую заявку на кредит',
      request: `{
  "artworkId": "artwork-123",
  "amount": 15000000,
  "term": 36,
  "bankId": "sberbank",
  "applicant": {
    "name": "Иван Иванов",
    "email": "ivan@example.com",
    "phone": "+7 900 123 45 67"
  }
}`,
      response: `{
  "success": true,
  "applicationId": "app-789",
  "status": "pending",
  "ltv": 65.5,
  "interestRate": 10.5,
  "monthlyPayment": 486000
}`
    },
    {
      name: 'Get Artwork Valuation',
      method: 'GET',
      endpoint: '/api/v1/artworks/{id}/valuation',
      description: 'Получить ML-оценку стоимости произведения',
      request: `GET /api/v1/artworks/artwork-123/valuation`,
      response: `{
  "artworkId": "artwork-123",
  "currentValue": 25000000,
  "mlPrediction": 26500000,
  "confidence": 94.5,
  "priceCorridorMin": 23000000,
  "priceCorridorMax": 28000000,
  "anomalyScore": 8.2,
  "lastUpdated": "2026-03-05T14:30:00Z"
}`
    },
    {
      name: 'Verify Art-DNA Passport',
      method: 'POST',
      endpoint: '/api/v1/artdna/verify',
      description: 'Верифицировать NFT-паспорт произведения',
      request: `{
  "artworkId": "artwork-123",
  "nftTokenId": "0x1234...5678",
  "blockchainAddress": "0xabcd...ef12"
}`,
      response: `{
  "verified": true,
  "passportId": "passport-001",
  "verificationStatus": "verified",
  "provenanceRecords": 3,
  "expertVerifications": 2,
  "valueIncrease": 18.5,
  "blockchainConfirmed": true
}`
    },
    {
      name: 'SSO Authentication',
      method: 'POST',
      endpoint: '/api/v1/auth/sso',
      description: 'Single Sign-On для банковских пользователей',
      request: `{
  "provider": "sberbank",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "redirectUrl": "https://online.sberbank.ru/dashboard"
}`,
      response: `{
  "success": true,
  "sessionToken": "sess_abc123...",
  "user": {
    "id": "user-456",
    "email": "client@sberbank.ru",
    "role": "bank_client"
  },
  "expiresAt": "2026-03-06T14:30:00Z"
}`
    }
  ];

  const currentWidget = widgetConfigs[selectedWidget];

  const handleCopyCode = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(type);
    toast({
      title: "✅ Код скопирован",
      description: `${type} код успешно скопирован в буфер обмена`
    });
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const handleDownloadSDK = () => {
    toast({
      title: "📥 SDK загружается",
      description: "JavaScript SDK для интеграции будет загружен"
    });
  };

  const getPreviewDimensions = () => {
    switch (previewMode) {
      case 'desktop':
        return { width: '100%', height: '600px', maxWidth: '1200px' };
      case 'tablet':
        return { width: '768px', height: '600px', maxWidth: '768px' };
      case 'mobile':
        return { width: '375px', height: '600px', maxWidth: '375px' };
      default:
        return { width: '100%', height: '600px', maxWidth: '1200px' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Layers className="w-8 h-8 text-purple-600" />
            White-Label Integration
          </h2>
          <p className="text-gray-500 mt-1">Встраивание виджетов в банковские терминалы и CRM</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownloadSDK}>
            <Download className="w-4 h-4 mr-2" />
            SDK
          </Button>
          <Button variant="outline">
            <ExternalLink className="w-4 h-4 mr-2" />
            Документация
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Активные виджеты</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-gray-500 mt-1">готовы к использованию</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">API Endpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">15+</div>
            <p className="text-xs text-gray-500 mt-1">RESTful API</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">SSO Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Ready
            </div>
            <p className="text-xs text-gray-500 mt-1">Безопасная аутентификация</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">99.9%</div>
            <p className="text-xs text-gray-500 mt-1">за последние 30 дней</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="widgets" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="widgets">
            <Monitor className="w-4 h-4 mr-2" />
            Виджеты
          </TabsTrigger>
          <TabsTrigger value="api">
            <Code className="w-4 h-4 mr-2" />
            API
          </TabsTrigger>
          <TabsTrigger value="sso">
            <Lock className="w-4 h-4 mr-2" />
            SSO
          </TabsTrigger>
          <TabsTrigger value="customization">
            <Palette className="w-4 h-4 mr-2" />
            Брендинг
          </TabsTrigger>
        </TabsList>

        <TabsContent value="widgets" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Widget List */}
            <div className="lg:col-span-1 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Доступные виджеты</h3>
              {Object.values(widgetConfigs).map((widget) => (
                <Card
                  key={widget.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedWidget === widget.id ? 'ring-2 ring-purple-500' : ''
                  }`}
                  onClick={() => setSelectedWidget(widget.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">{widget.name}</CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {widget.type === 'iframe' ? 'iFrame' : 
                           widget.type === 'webcomponent' ? 'Web Component' : 'API'}
                        </CardDescription>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                        {widget.features.length} функций
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {widget.features.slice(0, 2).map((feature, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {widget.features.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{widget.features.length - 2}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Widget Configuration */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">{currentWidget.name}</CardTitle>
                      <CardDescription className="mt-1">
                        Тип: {currentWidget.type === 'iframe' ? 'iFrame Embed' : 
                              currentWidget.type === 'webcomponent' ? 'Web Component' : 'API Integration'}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={previewMode === 'desktop' ? 'default' : 'outline'}
                        onClick={() => setPreviewMode('desktop')}
                      >
                        <Monitor className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={previewMode === 'tablet' ? 'default' : 'outline'}
                        onClick={() => setPreviewMode('tablet')}
                      >
                        <Monitor className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={previewMode === 'mobile' ? 'default' : 'outline'}
                        onClick={() => setPreviewMode('mobile')}
                      >
                        <Smartphone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Preview */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Предварительный просмотр
                    </h4>
                    <div className="bg-gray-100 rounded-lg p-4 flex justify-center">
                      <div 
                        className="bg-white rounded-lg shadow-lg overflow-hidden"
                        style={getPreviewDimensions()}
                      >
                        <div className="h-full flex items-center justify-center text-gray-400">
                          <div className="text-center space-y-2">
                            <Monitor className="w-16 h-16 mx-auto" />
                            <p className="text-sm">Предпросмотр виджета</p>
                            <p className="text-xs">{currentWidget.dimensions.width} × {currentWidget.dimensions.height}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Embed Code */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        Код для встраивания
                      </h4>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCopyCode(currentWidget.embedCode, 'Embed')}
                      >
                        {copiedCode === 'Embed' ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                            Скопировано
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            Копировать
                          </>
                        )}
                      </Button>
                    </div>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
                      <code>{currentWidget.embedCode}</code>
                    </pre>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Функции виджета</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {currentWidget.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h5 className="font-semibold text-blue-900 mb-2">Настройки безопасности</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-blue-700">SSO Integration:</span>
                            <Badge className={currentWidget.security.sso ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {currentWidget.security.sso ? 'Enabled' : 'Disabled'}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">API Key:</span>
                            <code className="text-xs bg-blue-100 px-2 py-1 rounded">
                              {currentWidget.security.apiKey}
                            </code>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">Allowed Domain:</span>
                            <span className="font-mono text-xs">{currentWidget.security.domain}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>REST API Endpoints</CardTitle>
              <CardDescription>Документация по интеграции через REST API</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-semibold text-gray-900 mb-2">Base URL</h5>
                  <code className="text-sm bg-gray-900 text-gray-100 px-3 py-2 rounded block">
                    https://api.artbank.pages.dev/v1
                  </code>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h5 className="font-semibold text-blue-900 mb-2">Authentication</h5>
                  <p className="text-sm text-blue-700 mb-2">
                    Все запросы требуют API ключ в заголовке:
                  </p>
                  <code className="text-sm bg-blue-100 px-3 py-2 rounded block">
                    Authorization: Bearer YOUR_API_KEY
                  </code>
                </div>

                {integrationEndpoints.map((endpoint, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{endpoint.name}</CardTitle>
                          <CardDescription className="text-sm mt-1">
                            {endpoint.description}
                          </CardDescription>
                        </div>
                        <Badge className={
                          endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                          endpoint.method === 'POST' ? 'bg-green-100 text-green-800' :
                          endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {endpoint.method}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Endpoint:</p>
                        <code className="text-sm bg-gray-900 text-gray-100 px-3 py-2 rounded block">
                          {endpoint.endpoint}
                        </code>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Request:</p>
                          <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto">
                            <code>{endpoint.request}</code>
                          </pre>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Response:</p>
                          <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto">
                            <code>{endpoint.response}</code>
                          </pre>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCopyCode(endpoint.request + '\n\n' + endpoint.response, endpoint.name)}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Копировать пример
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sso" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Single Sign-On (SSO) Integration
              </CardTitle>
              <CardDescription>
                Безопасная аутентификация для банковских пользователей
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* SSO Status */}
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-green-600" />
                  <div>
                    <h5 className="font-semibold text-green-900">SSO Status</h5>
                    <p className="text-sm text-green-700">Активирован для всех банков-партнёров</p>
                  </div>
                </div>
                <Badge className="bg-green-600 text-white">Active</Badge>
              </div>

              {/* Supported Providers */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Поддерживаемые провайдеры</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['Сбербанк ID', 'ВТБ SSO', 'Альфа-ID', 'Tinkoff ID'].map((provider, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-gray-900">{provider}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SSO Flow */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">SSO Authentication Flow</h4>
                <div className="space-y-3">
                  {[
                    { step: 1, title: 'User clicks "Login via Bank"', desc: 'Пользователь выбирает свой банк' },
                    { step: 2, title: 'Redirect to Bank SSO', desc: 'Перенаправление на страницу аутентификации банка' },
                    { step: 3, title: 'Bank Authentication', desc: 'Пользователь входит через банковский аккаунт' },
                    { step: 4, title: 'Token Exchange', desc: 'Обмен токена SSO на session token ArtBank' },
                    { step: 5, title: 'Access Granted', desc: 'Пользователь получает доступ к платформе' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0 font-semibold">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900">{item.title}</h5>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Configuration Example */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Пример конфигурации</h4>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
                  <code>{`{
  "sso": {
    "enabled": true,
    "provider": "sberbank",
    "clientId": "artbank_client_id",
    "redirectUri": "https://artbank.pages.dev/auth/callback",
    "scopes": ["profile", "email", "banking"],
    "tokenEndpoint": "https://sso.sberbank.ru/oauth2/token",
    "userInfoEndpoint": "https://sso.sberbank.ru/oauth2/userinfo"
  }
}`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Брендинг и персонализация
              </CardTitle>
              <CardDescription>
                Настройте виджеты под стиль вашего банка
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Brand Examples */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Примеры брендинга банков</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'Сбербанк', primary: '#21A038', secondary: '#0E5A1F', logo: '🏦' },
                    { name: 'ВТБ', primary: '#002882', secondary: '#0047BB', logo: '🏦' },
                    { name: 'Альфа-Банк', primary: '#EF3124', secondary: '#CC2A1F', logo: '🏦' },
                    { name: 'Тинькофф', primary: '#FFDD2D', secondary: '#333333', logo: '🏦' }
                  ].map((bank, i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{bank.logo}</span>
                        <h5 className="font-semibold text-gray-900">{bank.name}</h5>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: bank.primary }}
                          ></div>
                          <span className="text-sm text-gray-600">Primary: {bank.primary}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: bank.secondary }}
                          ></div>
                          <span className="text-sm text-gray-600">Secondary: {bank.secondary}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customization Options */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Доступные опции персонализации</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { icon: <Palette />, title: 'Цветовая схема', desc: 'Primary, Secondary, Accent' },
                    { icon: <Globe />, title: 'Логотип', desc: 'SVG/PNG, до 200KB' },
                    { icon: <Monitor />, title: 'Шрифты', desc: 'Google Fonts или custom' },
                    { icon: <Zap />, title: 'Анимации', desc: 'Smooth, Fast, None' },
                    { icon: <Globe />, title: 'Язык', desc: 'RU, EN, Multi-lang' },
                    { icon: <Settings />, title: 'Layout', desc: 'Compact, Standard, Wide' }
                  ].map((option, i) => (
                    <div key={i} className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-2">
                        {option.icon}
                      </div>
                      <h5 className="font-semibold text-gray-900 text-sm">{option.title}</h5>
                      <p className="text-xs text-gray-600 mt-1">{option.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Theme Configuration */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Пример конфигурации темы</h4>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
                  <code>{`{
  "theme": {
    "primaryColor": "#21A038",
    "secondaryColor": "#0E5A1F",
    "accentColor": "#FFB800",
    "logo": "https://cdn.sberbank.ru/logo.svg",
    "fontFamily": "SBSansInterface, Arial, sans-serif",
    "borderRadius": "8px",
    "animations": "smooth",
    "locale": "ru-RU"
  },
  "branding": {
    "bankName": "Сбербанк",
    "tagline": "Всегда рядом",
    "supportUrl": "https://www.sberbank.ru/support",
    "privacyUrl": "https://www.sberbank.ru/privacy"
  }
}`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
