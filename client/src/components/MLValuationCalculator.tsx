import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calculator,
  TrendingUp,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  Info,
  BarChart3,
  DollarSign,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EventInput {
  event_type: string;
  artist_impact: number;
  segment_impact: number;
  collector_impact: number;
  is_direct_sale: boolean;
  previous_price: number;
  timestamp: string;
  description: string;
}

interface ValuationResult {
  artwork_id: string;
  title: string;
  artist: string;
  base_value: number;
  total_delta: number;
  risk_multiplier: number;
  fair_value: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  factors: Array<{
    name: string;
    impact: number;
    weight: number;
    description: string;
  }>;
  event_deltas: Array<{
    event_type: string;
    delta: number;
    description: string;
    timestamp: string;
  }>;
}

const MLValuationCalculator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [artworkId, setArtworkId] = useState('artwork-' + Date.now());
  const [title, setTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const [baseValue, setBaseValue] = useState<number>(10000000);
  const [artistReputation, setArtistReputation] = useState(0.5);
  const [marketDemand, setMarketDemand] = useState(0.5);
  const [conditionScore, setConditionScore] = useState(0.8);
  const [provenanceVerified, setProvenanceVerified] = useState(false);
  const [historicalSalesCount, setHistoricalSalesCount] = useState(3);
  const [exhibitionCount, setExhibitionCount] = useState(5);

  const [events, setEvents] = useState<EventInput[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);

  // New event form state
  const [newEvent, setNewEvent] = useState<EventInput>({
    event_type: 'exhibition',
    artist_impact: 0.5,
    segment_impact: 0.5,
    collector_impact: 0.0,
    is_direct_sale: false,
    previous_price: baseValue,
    timestamp: new Date().toISOString().split('T')[0],
    description: '',
  });

  const handleAddEvent = () => {
    setEvents([...events, { ...newEvent, previous_price: baseValue }]);
    setNewEvent({
      event_type: 'exhibition',
      artist_impact: 0.5,
      segment_impact: 0.5,
      collector_impact: 0.0,
      is_direct_sale: false,
      previous_price: baseValue,
      timestamp: new Date().toISOString().split('T')[0],
      description: '',
    });
    setShowEventForm(false);
  };

  const handleRemoveEvent = (index: number) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  const handleCalculate = async () => {
    if (!title || !artistName) {
      setError('Заполните обязательные поля: Название работы и Художник');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5001/api/valuation/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artwork_id: artworkId,
          title,
          artist_name: artistName,
          base_value: baseValue,
          events,
          artist_reputation: artistReputation,
          market_demand: marketDemand,
          historical_sales_count: historicalSalesCount,
          exhibition_count: exhibitionCount,
          condition_score: conditionScore,
          provenance_verified: provenanceVerified,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Ошибка при расчёте Fair Value. Проверьте, что ML-сервис запущен.');
      console.error('[MLCalculator] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return (value * 100).toFixed(1) + '%';
  };

  return (
    <div className="space-y-6">
      {/* Calculator Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-purple-600" />
            ML Valuation Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Название работы *</Label>
              <Input
                id="title"
                placeholder="Например: Композиция VIII"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="artist">Художник *</Label>
              <Input
                id="artist"
                placeholder="Например: Василий Кандинский"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
              />
            </div>
          </div>

          {/* Base Value */}
          <div className="space-y-2">
            <Label htmlFor="baseValue">Базовая стоимость (V₀)</Label>
            <div className="flex items-center gap-4">
              <Input
                id="baseValue"
                type="number"
                value={baseValue}
                onChange={(e) => setBaseValue(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 whitespace-nowrap">
                {formatCurrency(baseValue)}
              </span>
            </div>
          </div>

          {/* Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center justify-between">
                  <span>Репутация художника</span>
                  <span className="text-purple-600 font-semibold">{formatPercent(artistReputation)}</span>
                </Label>
                <Slider
                  value={[artistReputation * 100]}
                  onValueChange={(v) => setArtistReputation(v[0] / 100)}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center justify-between">
                  <span>Рыночный спрос</span>
                  <span className="text-purple-600 font-semibold">{formatPercent(marketDemand)}</span>
                </Label>
                <Slider
                  value={[marketDemand * 100]}
                  onValueChange={(v) => setMarketDemand(v[0] / 100)}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center justify-between">
                  <span>Состояние работы</span>
                  <span className="text-purple-600 font-semibold">{formatPercent(conditionScore)}</span>
                </Label>
                <Slider
                  value={[conditionScore * 100]}
                  onValueChange={(v) => setConditionScore(v[0] / 100)}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="salesCount">Историческое кол-во продаж</Label>
                <Input
                  id="salesCount"
                  type="number"
                  value={historicalSalesCount}
                  onChange={(e) => setHistoricalSalesCount(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exhibitionCount">Количество выставок</Label>
                <Input
                  id="exhibitionCount"
                  type="number"
                  value={exhibitionCount}
                  onChange={(e) => setExhibitionCount(Number(e.target.value))}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="provenance"
                  checked={provenanceVerified}
                  onCheckedChange={(checked) => setProvenanceVerified(checked as boolean)}
                />
                <Label htmlFor="provenance" className="cursor-pointer">
                  Провенанс проверен
                </Label>
              </div>
            </div>
          </div>

          {/* Events */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">События (ΔVᵢ)</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEventForm(!showEventForm)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Добавить событие
              </Button>
            </div>

            {showEventForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 border border-purple-200 rounded-lg space-y-4 bg-purple-50"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Тип события</Label>
                    <Select
                      value={newEvent.event_type}
                      onValueChange={(v) => setNewEvent({ ...newEvent, event_type: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="exhibition">Выставка</SelectItem>
                        <SelectItem value="award">Награда</SelectItem>
                        <SelectItem value="sale">Продажа</SelectItem>
                        <SelectItem value="restoration">Реставрация</SelectItem>
                        <SelectItem value="authentication">Аутентификация</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Дата</Label>
                    <Input
                      type="date"
                      value={newEvent.timestamp}
                      onChange={(e) => setNewEvent({ ...newEvent, timestamp: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Описание</Label>
                  <Input
                    placeholder="Например: Выставка в Третьяковской галерее"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Влияние художника ({formatPercent(newEvent.artist_impact)})</Label>
                    <Slider
                      value={[newEvent.artist_impact * 100]}
                      onValueChange={(v) => setNewEvent({ ...newEvent, artist_impact: v[0] / 100 })}
                      max={100}
                      step={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Влияние сегмента ({formatPercent(newEvent.segment_impact)})</Label>
                    <Slider
                      value={[newEvent.segment_impact * 100]}
                      onValueChange={(v) => setNewEvent({ ...newEvent, segment_impact: v[0] / 100 })}
                      max={100}
                      step={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Влияние коллекционера ({formatPercent(newEvent.collector_impact)})</Label>
                    <Slider
                      value={[newEvent.collector_impact * 100]}
                      onValueChange={(v) => setNewEvent({ ...newEvent, collector_impact: v[0] / 100 })}
                      max={100}
                      step={5}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="directSale"
                      checked={newEvent.is_direct_sale}
                      onCheckedChange={(checked) =>
                        setNewEvent({ ...newEvent, is_direct_sale: checked as boolean })
                      }
                    />
                    <Label htmlFor="directSale" className="cursor-pointer">
                      Прямая продажа (C_direct = 0.03)
                    </Label>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowEventForm(false)}>
                      Отмена
                    </Button>
                    <Button size="sm" onClick={handleAddEvent}>
                      Добавить
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {events.length > 0 && (
              <div className="space-y-2">
                {events.map((event, index) => (
                  <div
                    key={index}
                    className="p-3 border border-gray-200 rounded-lg flex items-center justify-between hover:border-purple-300 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{event.event_type}</Badge>
                        <span className="text-sm text-gray-600">{event.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-800">{event.description}</p>
                      <div className="flex gap-3 mt-2 text-xs text-gray-600">
                        <span>Artist: {formatPercent(event.artist_impact)}</span>
                        <span>Segment: {formatPercent(event.segment_impact)}</span>
                        <span>Collector: {formatPercent(event.collector_impact)}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveEvent(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          {/* Calculate Button */}
          <Button
            onClick={handleCalculate}
            disabled={loading}
            className="w-full h-12 text-base font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Расчёт Fair Value...
              </>
            ) : (
              <>
                <Calculator className="w-5 h-5 mr-2" />
                Рассчитать Fair Value
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Result Display */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Summary Card */}
          <Card className="border-purple-300 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Результат оценки ML-модели
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Базовая стоимость (V₀)</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(result.base_value)}
                  </p>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Fair Value (ML)</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {formatCurrency(result.fair_value)}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    {result.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
                    {result.trend === 'down' && (
                      <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />
                    )}
                    <span
                      className={`text-sm font-semibold ${
                        result.trend === 'up'
                          ? 'text-green-600'
                          : result.trend === 'down'
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {((result.fair_value - result.base_value) / result.base_value * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Уверенность модели</p>
                  <div className="flex items-center justify-center gap-3">
                    <Progress value={result.confidence} className="w-24 h-3" />
                    <span className="text-3xl font-bold text-blue-600">{result.confidence}%</span>
                  </div>
                </div>
              </div>

              {/* Deltas & Risk */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Изменение от событий (ΣΔVᵢ)</p>
                  <p className="text-2xl font-bold text-green-600">
                    +{formatCurrency(result.total_delta)}
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Риск-мультипликатор</p>
                  <p className="text-2xl font-bold text-orange-600">
                    ×{result.risk_multiplier.toFixed(3)}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    (+{((result.risk_multiplier - 1) * 100).toFixed(1)}% премия)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Factors Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                Факторы оценки
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.factors.map((factor, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{factor.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{factor.description}</p>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {factor.weight.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={Math.min(factor.weight, 100)} className="flex-1 h-2" />
                      <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                        {factor.impact >= 1000
                          ? formatCurrency(factor.impact)
                          : factor.impact.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Event Deltas Card */}
          {result.event_deltas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Изменения от событий (ΔVᵢ)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.event_deltas.map((delta, index) => (
                    <div
                      key={index}
                      className="p-4 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <Badge className="bg-green-100 text-green-700">{delta.event_type}</Badge>
                          <span className="text-sm text-gray-600 ml-2">{delta.timestamp}</span>
                        </div>
                        <span className="text-lg font-bold text-green-600">
                          +{formatCurrency(delta.delta)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{delta.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default MLValuationCalculator;
