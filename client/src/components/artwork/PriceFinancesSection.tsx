import React from 'react';
import { Line } from 'react-chartjs-2';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PriceHistoryData {
  date: string;
  price: number;
  eventType: 'sale' | 'auction' | 'appraisal';
}

interface PriceFinancesProps {
  currentPrice: number;
  initialPrice: number;
  status: 'available' | 'reserved' | 'sold';
  priceHistory: PriceHistoryData[];
  currency?: string;
}

const statusLabels = {
  available: { label: 'Доступно', color: 'bg-green-100 text-green-800' },
  reserved: { label: 'Резерв', color: 'bg-orange-100 text-orange-800' },
  sold: { label: 'Продано', color: 'bg-gray-100 text-gray-800' },
};

export default function PriceFinancesSection({ 
  currentPrice, 
  initialPrice, 
  status, 
  priceHistory,
  currency = '₽' 
}: PriceFinancesProps) {
  const priceChange = ((currentPrice - initialPrice) / initialPrice) * 100;
  const isPositive = priceChange >= 0;

  // Chart data
  const chartData = {
    labels: priceHistory.map(item => item.date),
    datasets: [
      {
        label: 'Цена',
        data: priceHistory.map(item => item.price),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.parsed.y.toLocaleString()} ${currency}`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: any) => `${value.toLocaleString()} ${currency}`,
        },
      },
    },
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  return (
    <div className="space-y-6">
      {/* Current Price & Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Финансовая Информация</CardTitle>
            <Badge className={statusLabels[status].color}>
              {statusLabels[status].label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Price */}
            <div>
              <p className="text-sm text-gray-600 mb-1">Текущая цена</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatPrice(currentPrice)} {currency}
              </p>
            </div>

            {/* Initial Price */}
            <div>
              <p className="text-sm text-gray-600 mb-1">Начальная цена</p>
              <p className="text-2xl font-semibold text-gray-500">
                {formatPrice(initialPrice)} {currency}
              </p>
            </div>

            {/* Price Change */}
            <div>
              <p className="text-sm text-gray-600 mb-1">Изменение</p>
              <div className="flex items-center gap-2">
                {isPositive ? (
                  <TrendingUp className="text-green-600" size={24} />
                ) : (
                  <TrendingDown className="text-red-600" size={24} />
                )}
                <p className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? '+' : ''}{priceChange.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Chart */}
      <Card>
        <CardHeader>
          <CardTitle>История Изменения Цены</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>

      {/* Price History Table */}
      <Card>
        <CardHeader>
          <CardTitle>История Сделок</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {priceHistory.map((item, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    item.eventType === 'sale' ? 'bg-green-500' :
                    item.eventType === 'auction' ? 'bg-blue-500' :
                    'bg-gray-500'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.eventType === 'sale' ? 'Продажа' :
                       item.eventType === 'auction' ? 'Аукцион' :
                       'Оценка'}
                    </p>
                    <p className="text-xs text-gray-500">{item.date}</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900">
                  {formatPrice(item.price)} {currency}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
