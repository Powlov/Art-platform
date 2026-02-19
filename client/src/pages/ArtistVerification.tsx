import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Upload,
  User,
  FileText,
  Image as ImageIcon,
  Award,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Camera,
  Shield,
  Star,
} from "lucide-react";

type VerificationStep = "personal" | "documents" | "portfolio" | "review";
type VerificationStatus = "pending" | "approved" | "rejected" | "in_review";

interface VerificationRequest {
  id: string;
  artistName: string;
  status: VerificationStatus;
  submitDate: string;
  step: VerificationStep;
  progress: number;
  documents: {
    id: boolean;
    certification: boolean;
    portfolio: boolean;
  };
}

// Mock data
const mockRequest: VerificationRequest = {
  id: "VER-2026-001",
  artistName: "Алексей Петров",
  status: "in_review",
  submitDate: "2026-01-01",
  step: "review",
  progress: 75,
  documents: {
    id: true,
    certification: true,
    portfolio: false,
  },
};

const verificationSteps = [
  {
    id: "personal" as VerificationStep,
    title: "Личная информация",
    icon: User,
    description: "Основные данные художника",
  },
  {
    id: "documents" as VerificationStep,
    title: "Документы",
    icon: FileText,
    description: "Удостоверение личности и сертификаты",
  },
  {
    id: "portfolio" as VerificationStep,
    title: "Портфолио",
    icon: ImageIcon,
    description: "Образцы работ и достижения",
  },
  {
    id: "review" as VerificationStep,
    title: "Проверка",
    icon: Award,
    description: "Финальная проверка данных",
  },
];

const recentVerifications = [
  {
    id: 1,
    name: "Мария Иванова",
    status: "approved" as VerificationStatus,
    date: "2026-01-01",
    specialization: "Живопись",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Игорь Соколов",
    status: "in_review" as VerificationStatus,
    date: "2025-12-30",
    specialization: "Скульптура",
    rating: 4.7,
  },
  {
    id: 3,
    name: "Елена Волкова",
    status: "approved" as VerificationStatus,
    date: "2025-12-28",
    specialization: "Фотография",
    rating: 4.8,
  },
  {
    id: 4,
    name: "Дмитрий Новиков",
    status: "rejected" as VerificationStatus,
    date: "2025-12-27",
    specialization: "Графика",
    rating: 0,
  },
];

export default function ArtistVerification() {
  const [currentStep, setCurrentStep] = useState<VerificationStep>("personal");
  const [formData, setFormData] = useState({
    fullName: "",
    artistName: "",
    email: "",
    phone: "",
    bio: "",
    specialization: "",
    experience: "",
    idDocument: null as File | null,
    certification: null as File | null,
    portfolioImages: [] as File[],
  });

  const stepIndex = verificationSteps.findIndex((s) => s.id === currentStep);
  const progress = ((stepIndex + 1) / verificationSteps.length) * 100;

  const getStatusIcon = (status: VerificationStatus) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "in_review":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: VerificationStatus) => {
    const variants = {
      approved: "default",
      rejected: "destructive",
      in_review: "secondary",
      pending: "outline",
    };

    const labels = {
      approved: "Подтверждён",
      rejected: "Отклонён",
      in_review: "На проверке",
      pending: "Ожидание",
    };

    return (
      <Badge variant={variants[status] as any}>{labels[status]}</Badge>
    );
  };

  const handleNext = () => {
    const currentIndex = verificationSteps.findIndex((s) => s.id === currentStep);
    if (currentIndex < verificationSteps.length - 1) {
      setCurrentStep(verificationSteps[currentIndex + 1].id);
    }
  };

  const handlePrev = () => {
    const currentIndex = verificationSteps.findIndex((s) => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(verificationSteps[currentIndex - 1].id);
    }
  };

  const handleFileUpload = (field: string, files: FileList | null) => {
    if (!files) return;
    if (field === "portfolioImages") {
      setFormData({ ...formData, [field]: Array.from(files) });
    } else {
      setFormData({ ...formData, [field]: files[0] });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              Верификация Художников
            </h1>
            <p className="text-muted-foreground mt-2">
              Подтвердите свой статус профессионального художника
            </p>
          </div>
          <Button variant="outline" size="lg">
            <AlertCircle className="mr-2 h-4 w-4" />
            Помощь
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Bar */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Прогресс верификации</h3>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(progress)}%
                  </span>
                </div>
                <Progress value={progress} className="h-2" />

                {/* Steps */}
                <div className="grid grid-cols-4 gap-2 mt-6">
                  {verificationSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = step.id === currentStep;
                    const isCompleted = index < stepIndex;

                    return (
                      <button
                        key={step.id}
                        onClick={() => setCurrentStep(step.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          isActive
                            ? "border-primary bg-primary/5"
                            : isCompleted
                            ? "border-green-500 bg-green-500/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Icon
                          className={`h-6 w-6 mx-auto mb-2 ${
                            isActive
                              ? "text-primary"
                              : isCompleted
                              ? "text-green-500"
                              : "text-muted-foreground"
                          }`}
                        />
                        <p className="text-xs font-medium text-center">
                          {step.title}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Form Content */}
            <Card className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {currentStep === "personal" && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          Личная информация
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Заполните основные данные о себе
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Полное имя *
                          </label>
                          <Input
                            placeholder="Иван Иванович Иванов"
                            value={formData.fullName}
                            onChange={(e) =>
                              setFormData({ ...formData, fullName: e.target.value })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Творческий псевдоним *
                          </label>
                          <Input
                            placeholder="Ivan Art"
                            value={formData.artistName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                artistName: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email *</label>
                          <Input
                            type="email"
                            placeholder="artist@example.com"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Телефон *</label>
                          <Input
                            placeholder="+7 (999) 123-45-67"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({ ...formData, phone: e.target.value })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Специализация *
                          </label>
                          <Input
                            placeholder="Живопись, Скульптура..."
                            value={formData.specialization}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                specialization: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Опыт работы (лет) *
                          </label>
                          <Input
                            type="number"
                            placeholder="5"
                            value={formData.experience}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                experience: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Биография *
                        </label>
                        <Textarea
                          placeholder="Расскажите о себе, своём творческом пути и достижениях..."
                          rows={5}
                          value={formData.bio}
                          onChange={(e) =>
                            setFormData({ ...formData, bio: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === "documents" && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Документы</h3>
                        <p className="text-sm text-muted-foreground">
                          Загрузите необходимые документы для верификации
                        </p>
                      </div>

                      <div className="space-y-4">
                        {/* ID Document */}
                        <div className="border-2 border-dashed rounded-lg p-6 hover:border-primary transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg">
                              <Camera className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">
                                Удостоверение личности *
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Паспорт или водительские права
                              </p>
                            </div>
                            <label className="cursor-pointer">
                              <Button variant="outline" asChild>
                                <span>
                                  <Upload className="mr-2 h-4 w-4" />
                                  Загрузить
                                </span>
                              </Button>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*,.pdf"
                                onChange={(e) =>
                                  handleFileUpload("idDocument", e.target.files)
                                }
                              />
                            </label>
                          </div>
                          {formData.idDocument && (
                            <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                              <CheckCircle2 className="h-4 w-4" />
                              Файл загружен: {formData.idDocument.name}
                            </div>
                          )}
                        </div>

                        {/* Certification */}
                        <div className="border-2 border-dashed rounded-lg p-6 hover:border-primary transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg">
                              <Award className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">
                                Сертификаты и награды
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Дипломы, сертификаты об образовании (опционально)
                              </p>
                            </div>
                            <label className="cursor-pointer">
                              <Button variant="outline" asChild>
                                <span>
                                  <Upload className="mr-2 h-4 w-4" />
                                  Загрузить
                                </span>
                              </Button>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*,.pdf"
                                multiple
                                onChange={(e) =>
                                  handleFileUpload("certification", e.target.files)
                                }
                              />
                            </label>
                          </div>
                          {formData.certification && (
                            <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                              <CheckCircle2 className="h-4 w-4" />
                              Файл загружен: {formData.certification.name}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex gap-3">
                          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-900 dark:text-blue-100">
                              Требования к документам
                            </h4>
                            <ul className="mt-2 space-y-1 text-sm text-blue-700 dark:text-blue-300">
                              <li>• Документы должны быть чёткими и читаемыми</li>
                              <li>• Форматы: JPG, PNG, PDF (макс. 10 MB)</li>
                              <li>
                                • Личные данные должны быть видны полностью
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === "portfolio" && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Портфолио</h3>
                        <p className="text-sm text-muted-foreground">
                          Загрузите 5-10 лучших работ
                        </p>
                      </div>

                      <div className="border-2 border-dashed rounded-lg p-8 hover:border-primary transition-colors">
                        <div className="text-center space-y-4">
                          <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto">
                            <ImageIcon className="h-8 w-8 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">
                              Загрузите образцы работ
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Перетащите файлы сюда или нажмите для выбора
                            </p>
                          </div>
                          <label className="cursor-pointer">
                            <Button variant="outline" size="lg" asChild>
                              <span>
                                <Upload className="mr-2 h-5 w-5" />
                                Выбрать файлы
                              </span>
                            </Button>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              multiple
                              onChange={(e) =>
                                handleFileUpload("portfolioImages", e.target.files)
                              }
                            />
                          </label>
                        </div>
                      </div>

                      {formData.portfolioImages.length > 0 && (
                        <div className="grid grid-cols-3 gap-4">
                          {formData.portfolioImages.map((file, index) => (
                            <div
                              key={index}
                              className="relative aspect-square rounded-lg border-2 border-green-500 bg-green-500/5 p-2"
                            >
                              <div className="absolute top-2 right-2 z-10">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              </div>
                              <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                              </div>
                              <p className="text-xs mt-2 truncate">{file.name}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                        <div className="flex gap-3">
                          <Star className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-amber-900 dark:text-amber-100">
                              Советы по портфолио
                            </h4>
                            <ul className="mt-2 space-y-1 text-sm text-amber-700 dark:text-amber-300">
                              <li>• Выбирайте работы разных стилей и техник</li>
                              <li>• Качество важнее количества</li>
                              <li>• Добавьте работы за последние 2-3 года</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === "review" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          Проверка данных
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Проверьте все данные перед отправкой
                        </p>
                      </div>

                      {/* Summary Cards */}
                      <div className="grid gap-4">
                        <Card className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <User className="h-5 w-5 text-primary" />
                            <h4 className="font-medium">Личная информация</h4>
                            <CheckCircle2 className="h-5 w-5 text-green-500 ml-auto" />
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Полное имя:
                              </span>
                              <span className="font-medium">
                                {formData.fullName || "Не указано"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Псевдоним:
                              </span>
                              <span className="font-medium">
                                {formData.artistName || "Не указано"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Email:</span>
                              <span className="font-medium">
                                {formData.email || "Не указано"}
                              </span>
                            </div>
                          </div>
                        </Card>

                        <Card className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <FileText className="h-5 w-5 text-primary" />
                            <h4 className="font-medium">Документы</h4>
                            <CheckCircle2 className="h-5 w-5 text-green-500 ml-auto" />
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                Удостоверение:
                              </span>
                              <span className="text-green-600 font-medium">
                                {formData.idDocument ? "Загружено" : "Не загружено"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                Сертификаты:
                              </span>
                              <span className="text-green-600 font-medium">
                                {formData.certification
                                  ? "Загружено"
                                  : "Не загружено"}
                              </span>
                            </div>
                          </div>
                        </Card>

                        <Card className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <ImageIcon className="h-5 w-5 text-primary" />
                            <h4 className="font-medium">Портфолио</h4>
                            <CheckCircle2 className="h-5 w-5 text-green-500 ml-auto" />
                          </div>
                          <div className="text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                Загружено работ:
                              </span>
                              <span className="font-medium">
                                {formData.portfolioImages.length} файлов
                              </span>
                            </div>
                          </div>
                        </Card>
                      </div>

                      <Button size="lg" className="w-full">
                        <Shield className="mr-2 h-5 w-5" />
                        Отправить на верификацию
                      </Button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={stepIndex === 0}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Назад
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={stepIndex === verificationSteps.length - 1}
                >
                  Далее
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Status */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Статус верификации</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">ID заявки:</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {mockRequest.id}
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Статус:</span>
                  {getStatusBadge(mockRequest.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Дата подачи:</span>
                  <span className="text-sm font-medium">
                    {mockRequest.submitDate}
                  </span>
                </div>
              </div>
            </Card>

            {/* Recent Verifications */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Недавние верификации</h3>
              <div className="space-y-3">
                {recentVerifications.map((artist) => (
                  <div
                    key={artist.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex-shrink-0">
                      {getStatusIcon(artist.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {artist.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {artist.specialization}
                      </p>
                    </div>
                    {artist.status === "approved" && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-medium">
                          {artist.rating}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Help Card */}
            <Card className="p-6 bg-primary/5 border-primary/20">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Нужна помощь?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Если у вас возникли вопросы по процессу верификации, свяжитесь с
                нашей службой поддержки.
              </p>
              <Button variant="outline" className="w-full">
                Связаться с поддержкой
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
