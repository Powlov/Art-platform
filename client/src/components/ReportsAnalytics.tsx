import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  FileSpreadsheet,
  FilePdf,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

export default function ReportsAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedFormat, setSelectedFormat] = useState('pdf');

  // Mock data
  const quickReports = [
    {
      id: 'portfolio',
      name: 'Портфель займов',
      description: 'Полный отчёт по займам, LTV и рискам',
      icon: PieChart,
      color: 'bg-blue-50 text-blue-600',
      metrics: { loans: 342, volume: '1.25 млрд ₽', avgLTV: '64.5%' },
    },
    {
      id: 'risk',
      name: 'Анализ рисков',
      description: 'Оценка рисков портфеля и рекомендации',
      icon: AlertCircle,
      color: 'bg-red-50 text-red-600',
      metrics: { highRisk: 12, marginCalls: 3, defaultRate: '1.2%' },
    },
    {
      id: 'performance',
      name: 'Производительность',
      description: 'Финансовые показатели за период',
      icon: TrendingUp,
      color: 'bg-green-50 text-green-600',
      metrics: { revenue: '45.2 млн ₽', growth: '+12.5%', roi: '18.3%' },
    },
    {
      id: 'valuation',
      name: 'Оценка активов',
      description: 'История оценок и изменений стоимости',
      icon: BarChart3,
      color: 'bg-purple-50 text-purple-600',
      metrics: { artworks: 342, totalValue: '2.1 млрд ₽', appreciation: '+8.7%' },
    },
  ];

  const scheduledReports = [
    {
      id: '1',
      name: 'Ежедневный дайджест',
      schedule: 'Каждый день в 09:00',
      format: 'PDF',
      status: 'active',
      lastRun: '5 часов назад',
      recipients: ['i.petrov@sberbank.ru', 'm.sidorova@sberbank.ru'],
    },
    {
      id: '2',
      name: 'Недельный отчёт по рискам',
      schedule: 'Каждый понедельник в 08:00',
      format: 'Excel',
      status: 'active',
      lastRun: '2 дня назад',
      recipients: ['risk@sberbank.ru'],
    },
    {
      id: '3',
      name: 'Месячный финансовый отчёт',
      schedule: '1-го числа в 10:00',
      format: 'PDF + Excel',
      status: 'paused',
      lastRun: '15 дней назад',
      recipients: ['finance@sberbank.ru', 'cfo@sberbank.ru'],
    },
  ];

  const recentReports = [
    {
      name: 'Портфель займов - Февраль 2026',
      date: '2026-03-01',
      format: 'PDF',
      size: '2.4 MB',
      status: 'completed',
    },
    {
      name: 'Анализ рисков - Q1 2026',
      date: '2026-03-01',
      format: 'Excel',
      size: '1.8 MB',
      status: 'completed',
    },
    {
      name: 'Производительность - Февраль 2026',
      date: '2026-03-01',
      format: 'PDF',
      size: '1.2 MB',
      status: 'completed',
    },
    {
      name: 'Оценка активов - Февраль 2026',
      date: '2026-02-28',
      format: 'Excel',
      size: '3.1 MB',
      status: 'completed',
    },
  ];

  const handleGenerateReport = (reportId: string) => {
    toast.success('Отчёт генерируется...', {
      description: 'Вы получите уведомление когда отчёт будет готов',
    });
  };

  const handleDownloadReport = (reportName: string) => {
    toast.success(`Загрузка отчёта: ${reportName}`);
  };

  const handleToggleSchedule = (reportId: string, status: string) => {
    const newStatus = status === 'active' ? 'paused' : 'active';
    toast.success(`Отчёт ${newStatus === 'active' ? 'активирован' : 'приостановлен'}`);
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Быстрая генерация отчётов</CardTitle>
          <CardDescription>Создайте отчёт за несколько кликов</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Сегодня</SelectItem>
                <SelectItem value="week">Последняя неделя</SelectItem>
                <SelectItem value="month">Последний месяц</SelectItem>
                <SelectItem value="quarter">Последний квартал</SelectItem>
                <SelectItem value="year">Последний год</SelectItem>
                <SelectItem value="custom">Произвольный период</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedFormat} onValueChange={setSelectedFormat}>
              <SelectTrigger className="w-32">
                <FileText className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="both">PDF + Excel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {quickReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${report.color}`}>
                        <report.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{report.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          {Object.entries(report.metrics).map(([key, value]) => (
                            <div key={key}>
                              <span className="font-medium text-gray-900">{value}</span>
                            </div>
                          ))}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleGenerateReport(report.id)}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Создать отчёт
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scheduled Reports */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Запланированные отчёты</CardTitle>
                <CardDescription>Автоматическая генерация по расписанию</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Clock className="w-4 h-4 mr-2" />
                Добавить
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scheduledReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{report.name}</h4>
                        {report.status === 'active' ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Активен
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
                            <Pause className="w-3 h-3 mr-1" />
                            Приостановлен
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {report.schedule}
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-3 h-3" />
                          {report.format}
                        </div>
                        <div className="text-xs text-gray-500">
                          Последний запуск: {report.lastRun}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleSchedule(report.id, report.status)}
                    >
                      {report.status === 'active' ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500">
                    Получатели: {report.recipients.join(', ')}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Последние отчёты</CardTitle>
            <CardDescription>История сгенерированных отчётов</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentReports.map((report, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {report.format === 'PDF' ? (
                      <div className="p-2 bg-red-50 rounded">
                        <FilePdf className="w-4 h-4 text-red-600" />
                      </div>
                    ) : (
                      <div className="p-2 bg-green-50 rounded">
                        <FileSpreadsheet className="w-4 h-4 text-green-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{report.name}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span>{report.date}</span>
                        <span>•</span>
                        <span>{report.size}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownloadReport(report.name)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Аналитика использования отчётов</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">Всего отчётов</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">342</div>
              <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                +12% за месяц
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Download className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-gray-600">Загрузок</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">1,245</div>
              <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                +8% за месяц
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="text-sm text-gray-600">Запланировано</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">12</div>
              <div className="text-xs text-gray-500 mt-1">Активных расписаний</div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Популярный</span>
              </div>
              <div className="text-sm font-bold text-gray-900">Портфель займов</div>
              <div className="text-xs text-gray-500 mt-1">156 загрузок</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
