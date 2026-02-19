import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Upload,
  Scan,
  Brain,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Image as ImageIcon,
  FileText,
  TrendingUp,
  Award,
  Search,
  Eye,
  Zap,
  Database,
} from "lucide-react";

type AuthStatus = "authentic" | "suspicious" | "fake" | "pending";

interface AuthenticationResult {
  id: string;
  artworkTitle: string;
  artist: string;
  status: AuthStatus;
  confidence: number;
  analysisDate: string;
  aiScore: number;
  blockchainVerified: boolean;
  imageAnalysis: {
    brushstrokes: number;
    colorPalette: string[];
    style: string;
    technique: string;
  };
  provenance: {
    verified: boolean;
    records: number;
    lastOwner: string;
  };
  marketData: {
    estimatedValue: string;
    similarWorks: number;
    priceRange: string;
  };
}

// Mock data
const mockResults: AuthenticationResult[] = [
  {
    id: "AUTH-2026-001",
    artworkTitle: "Закат над морем",
    artist: "Иван Айвазовский",
    status: "authentic",
    confidence: 97.8,
    analysisDate: "2026-01-01",
    aiScore: 98.5,
    blockchainVerified: true,
    imageAnalysis: {
      brushstrokes: 5420,
      colorPalette: ["#1a4d7a", "#f4a261", "#e76f51", "#264653"],
      style: "Романтизм",
      technique: "Масло на холсте",
    },
    provenance: {
      verified: true,
      records: 8,
      lastOwner: "Третьяковская галерея",
    },
    marketData: {
      estimatedValue: "₽45,000,000",
      similarWorks: 12,
      priceRange: "₽38M - ₽52M",
    },
  },
  {
    id: "AUTH-2026-002",
    artworkTitle: "Портрет неизвестной",
    artist: "Василий Тропинин",
    status: "suspicious",
    confidence: 68.3,
    analysisDate: "2025-12-30",
    aiScore: 72.1,
    blockchainVerified: false,
    imageAnalysis: {
      brushstrokes: 3210,
      colorPalette: ["#8b5a3c", "#d4a574", "#2c1810"],
      style: "Классицизм",
      technique: "Масло на холсте",
    },
    provenance: {
      verified: false,
      records: 2,
      lastOwner: "Частная коллекция",
    },
    marketData: {
      estimatedValue: "₽2,800,000",
      similarWorks: 5,
      priceRange: "₽1.5M - ₽4M",
    },
  },
];

const authenticationSteps = [
  {
    icon: Upload,
    title: "Загрузка",
    description: "Загрузите изображение произведения",
  },
  {
    icon: Scan,
    title: "Сканирование",
    description: "AI анализирует детали изображения",
  },
  {
    icon: Brain,
    title: "AI Анализ",
    description: "Глубокое обучение проверяет подлинность",
  },
  {
    icon: Shield,
    title: "Результат",
    description: "Получите детальный отчёт",
  },
];

const recentChecks = [
  {
    id: 1,
    title: "Звёздная ночь",
    artist: "Винсент Ван Гог",
    status: "authentic" as AuthStatus,
    confidence: 99.2,
    date: "2026-01-01",
  },
  {
    id: 2,
    title: "Девочка с персиками",
    artist: "Валентин Серов",
    status: "authentic" as AuthStatus,
    confidence: 96.8,
    date: "2025-12-31",
  },
  {
    id: 3,
    title: "Неизвестный автор",
    artist: "—",
    status: "fake" as AuthStatus,
    confidence: 12.4,
    date: "2025-12-30",
  },
];

export default function ArtworkAuthentication() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<AuthenticationResult | null>(null);

  const getStatusIcon = (status: AuthStatus) => {
    switch (status) {
      case "authentic":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "fake":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "suspicious":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: AuthStatus) => {
    const variants = {
      authentic: "default",
      fake: "destructive",
      suspicious: "secondary",
      pending: "outline",
    };

    const labels = {
      authentic: "Подлинник",
      fake: "Подделка",
      suspicious: "Требует проверки",
      pending: "Обработка",
    };

    return (
      <Badge variant={variants[status] as any}>{labels[status]}</Badge>
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setResult(null);
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setProgress(0);
    setCurrentStep(0);

    // Simulate analysis steps
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setResult(mockResults[0]);
          return 100;
        }
        if (newProgress >= 25 && currentStep === 0) setCurrentStep(1);
        if (newProgress >= 50 && currentStep === 1) setCurrentStep(2);
        if (newProgress >= 75 && currentStep === 2) setCurrentStep(3);
        return newProgress;
      });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              Проверка Подлинности
            </h1>
            <p className="text-muted-foreground mt-2">
              AI-powered аутентификация произведений искусства
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="lg">
              <Search className="mr-2 h-4 w-4" />
              История
            </Button>
            <Button variant="outline" size="lg">
              <Database className="mr-2 h-4 w-4" />
              База данных
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Проверено</p>
                <p className="text-2xl font-bold">1,284</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">AI Точность</p>
                <p className="text-2xl font-bold">98.7%</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Подозрительно</p>
                <p className="text-2xl font-bold">47</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500/10 rounded-lg">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Подделок</p>
                <p className="text-2xl font-bold">23</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Card */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Загрузка произведения</h3>

              {!selectedFile && !isAnalyzing && !result && (
                <div className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary transition-colors">
                  <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                    <Upload className="h-12 w-12 text-primary" />
                  </div>
                  <h4 className="text-lg font-medium mb-2">
                    Загрузите изображение произведения
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Поддерживаются форматы: JPG, PNG, TIFF (макс. 25 MB)
                  </p>
                  <label className="cursor-pointer">
                    <Button size="lg" asChild>
                      <span>
                        <ImageIcon className="mr-2 h-5 w-5" />
                        Выбрать файл
                      </span>
                    </Button>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
              )}

              {selectedFile && !isAnalyzing && !result && (
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <ImageIcon className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedFile(null)}
                      >
                        Изменить
                      </Button>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                      Что будет проверено:
                    </h4>
                    <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                      <li className="flex items-center gap-2">
                        <Scan className="h-4 w-4" />
                        Стиль и техника исполнения
                      </li>
                      <li className="flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        AI-анализ мазков и деталей
                      </li>
                      <li className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Сравнение с базой данных
                      </li>
                      <li className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Blockchain верификация
                      </li>
                    </ul>
                  </div>

                  <Button size="lg" className="w-full" onClick={handleAnalyze}>
                    <Zap className="mr-2 h-5 w-5" />
                    Начать анализ
                  </Button>
                </div>
              )}

              {isAnalyzing && (
                <div className="space-y-6">
                  <div className="text-center py-8">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4"
                    >
                      <Scan className="h-12 w-12 text-primary" />
                    </motion.div>
                    <h4 className="text-lg font-medium mb-2">
                      Анализ произведения...
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {authenticationSteps[currentStep].description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Прогресс</span>
                      <span className="font-medium">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {authenticationSteps.map((step, index) => {
                      const Icon = step.icon;
                      const isActive = index === currentStep;
                      const isCompleted = index < currentStep;

                      return (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            isActive
                              ? "border-primary bg-primary/5"
                              : isCompleted
                              ? "border-green-500 bg-green-500/5"
                              : "border-border"
                          }`}
                        >
                          <Icon
                            className={`h-5 w-5 mx-auto mb-2 ${
                              isActive
                                ? "text-primary"
                                : isCompleted
                                ? "text-green-500"
                                : "text-muted-foreground"
                            }`}
                          />
                          <p className="text-xs text-center">{step.title}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {result && (
                <div className="space-y-6">
                  {/* Result Header */}
                  <div className="text-center space-y-3">
                    <div className="flex items-center justify-center gap-3">
                      {getStatusIcon(result.status)}
                      <h3 className="text-2xl font-bold">
                        {result.status === "authentic"
                          ? "Произведение подлинное"
                          : result.status === "fake"
                          ? "Вероятная подделка"
                          : "Требуется экспертиза"}
                      </h3>
                    </div>
                    <p className="text-muted-foreground">
                      Анализ завершён {result.analysisDate}
                    </p>
                  </div>

                  {/* Confidence Score */}
                  <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
                    <div className="text-center space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Уверенность AI
                      </p>
                      <div className="text-6xl font-bold text-primary">
                        {result.confidence}%
                      </div>
                      <Progress value={result.confidence} className="h-2" />
                    </div>
                  </Card>

                  {/* Detailed Tabs */}
                  <Tabs defaultValue="analysis" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="analysis">
                        <Brain className="h-4 w-4 mr-2" />
                        Анализ
                      </TabsTrigger>
                      <TabsTrigger value="provenance">
                        <FileText className="h-4 w-4 mr-2" />
                        Происхождение
                      </TabsTrigger>
                      <TabsTrigger value="market">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Рынок
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="analysis" className="space-y-4 mt-4">
                      <Card className="p-4">
                        <h4 className="font-medium mb-3">Анализ изображения</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Мазки кисти:
                            </span>
                            <p className="font-medium">
                              {result.imageAnalysis.brushstrokes.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Стиль:</span>
                            <p className="font-medium">
                              {result.imageAnalysis.style}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Техника:
                            </span>
                            <p className="font-medium">
                              {result.imageAnalysis.technique}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              AI Score:
                            </span>
                            <p className="font-medium">{result.aiScore}%</p>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4">
                        <h4 className="font-medium mb-3">Цветовая палитра</h4>
                        <div className="flex gap-2">
                          {result.imageAnalysis.colorPalette.map((color, i) => (
                            <div
                              key={i}
                              className="flex-1 h-12 rounded-lg border-2 border-border"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </Card>

                      <Card className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">
                              Blockchain верификация
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Проверка в распределённом реестре
                            </p>
                          </div>
                          {result.blockchainVerified ? (
                            <Badge>
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Подтверждено
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              <XCircle className="mr-1 h-3 w-3" />
                              Не найдено
                            </Badge>
                          )}
                        </div>
                      </Card>
                    </TabsContent>

                    <TabsContent value="provenance" className="space-y-4 mt-4">
                      <Card className="p-4">
                        <h4 className="font-medium mb-3">История владения</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              Верифицированных записей:
                            </span>
                            <span className="font-medium">
                              {result.provenance.records}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              Последний владелец:
                            </span>
                            <span className="font-medium">
                              {result.provenance.lastOwner}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              Статус:
                            </span>
                            {result.provenance.verified ? (
                              <Badge>
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Верифицировано
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <AlertTriangle className="mr-1 h-3 w-3" />
                                Требует проверки
                              </Badge>
                            )}
                          </div>
                        </div>
                      </Card>
                    </TabsContent>

                    <TabsContent value="market" className="space-y-4 mt-4">
                      <Card className="p-4">
                        <h4 className="font-medium mb-3">Рыночная стоимость</h4>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Оценочная стоимость:
                            </p>
                            <p className="text-3xl font-bold text-primary">
                              {result.marketData.estimatedValue}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Ценовой диапазон:
                            </p>
                            <p className="font-medium">
                              {result.marketData.priceRange}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Похожих работ на рынке:
                            </p>
                            <p className="font-medium">
                              {result.marketData.similarWorks} произведений
                            </p>
                          </div>
                        </div>
                      </Card>
                    </TabsContent>
                  </Tabs>

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1">
                      <Eye className="mr-2 h-4 w-4" />
                      Полный отчёт
                    </Button>
                    <Button className="flex-1" onClick={() => {
                      setResult(null);
                      setSelectedFile(null);
                    }}>
                      <Upload className="mr-2 h-4 w-4" />
                      Новая проверка
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* How It Works */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Как это работает</h3>
              <div className="space-y-4">
                {authenticationSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg h-fit">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{step.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Recent Checks */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Недавние проверки</h3>
              <div className="space-y-3">
                {recentChecks.map((check) => (
                  <div
                    key={check.id}
                    className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(check.status)}
                      <p className="text-sm font-medium truncate">
                        {check.title}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {check.artist}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {check.confidence}% уверенность
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {check.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* AI Info */}
            <Card className="p-6 bg-primary/5 border-primary/20">
              <div className="flex items-start gap-3">
                <Brain className="h-6 w-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">AI Технология</h3>
                  <p className="text-sm text-muted-foreground">
                    Используем нейронные сети и машинное обучение для анализа
                    более 10,000 параметров произведения.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
