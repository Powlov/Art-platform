#!/usr/bin/env python3
"""
ML Pricing Engine для Art-Market Platform
Реализует расчёт Fair Value по формуле из pricing_model_document.md.pdf

Формула: P = (V₀ + ΣΔVᵢ) × (1 + R_f + R_a + R_m + R_c)

Где:
- V₀ = базовая стоимость (последняя рыночная оценка)
- ΔVᵢ = изменение стоимости от события i
  ΔVᵢ = [(α_artist·I_artist) + (α_segment·I_segment) + (α_collector·I_collector)] × C_direct × P_i_old
- R_f, R_a, R_m, R_c = коэффициенты риска (financing, artist, market, condition)

Параметры:
- α_artist = 0.05 (влияние репутации художника)
- α_segment = 0.02 (влияние сегмента рынка)
- α_collector = 0.01 (влияние репутации коллекционера)
- M_self = 0.10 (множитель для самостоятельных продаж)
- C_direct = 0.03 (коэффициент для прямых продаж)
"""

from flask import Flask, jsonify, request
from dataclasses import dataclass, asdict
from typing import List, Dict, Optional
import math
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

# ===================== КОНСТАНТЫ МОДЕЛИ =====================

ALPHA_ARTIST = 0.05  # Влияние репутации художника
ALPHA_SEGMENT = 0.02  # Влияние сегмента рынка
ALPHA_COLLECTOR = 0.01  # Влияние репутации коллекционера
M_SELF = 0.10  # Множитель для самостоятельных продаж
C_DIRECT = 0.03  # Коэффициент для прямых продаж

# Базовые коэффициенты риска (можно настраивать)
BASE_R_F = 0.02  # Financing risk (базовый 2%)
BASE_R_A = 0.03  # Artist risk (базовый 3%)
BASE_R_M = 0.04  # Market risk (базовый 4%)
BASE_R_C = 0.01  # Condition risk (базовый 1%)

# ===================== DATA MODELS =====================

@dataclass
class EventDelta:
    """Изменение стоимости от события"""
    event_type: str  # 'exhibition', 'award', 'sale', 'restoration', etc.
    artist_impact: float  # I_artist (0-1)
    segment_impact: float  # I_segment (0-1)
    collector_impact: float  # I_collector (0-1)
    is_direct_sale: bool  # Прямая продажа?
    previous_price: float  # P_i_old
    timestamp: str
    description: str

    def calculate_delta(self) -> float:
        """Рассчитать ΔVᵢ для события"""
        impact = (
            ALPHA_ARTIST * self.artist_impact +
            ALPHA_SEGMENT * self.segment_impact +
            ALPHA_COLLECTOR * self.collector_impact
        )
        
        c_factor = C_DIRECT if self.is_direct_sale else 1.0
        delta = impact * c_factor * self.previous_price
        
        return delta

@dataclass
class RiskCoefficients:
    """Коэффициенты риска"""
    r_financing: float = BASE_R_F
    r_artist: float = BASE_R_A
    r_market: float = BASE_R_M
    r_condition: float = BASE_R_C

    def total_risk(self) -> float:
        """Суммарный коэффициент риска"""
        return self.r_financing + self.r_artist + self.r_market + self.r_condition

@dataclass
class ValuationInput:
    """Входные данные для оценки"""
    artwork_id: str
    title: str
    artist_name: str
    base_value: float  # V₀
    events: List[Dict]  # Список событий (будет преобразован в EventDelta)
    risk_coefficients: Optional[Dict] = None  # Опциональные кастомные риски
    
    # ML-параметры (50+)
    artist_reputation: float = 0.5  # 0-1
    market_demand: float = 0.5
    historical_sales_count: int = 0
    exhibition_count: int = 0
    condition_score: float = 0.8  # 0-1
    rarity_score: float = 0.5
    provenance_verified: bool = False
    material: str = "oil"
    size_cm2: float = 10000
    year_created: int = 2000
    artist_age: int = 50
    market_segment: str = "contemporary"  # contemporary, modern, classic
    geographic_market: str = "russia"
    auction_house_tier: int = 2  # 1=top (Christie's), 2=mid, 3=regional
    currency: str = "RUB"

@dataclass
class ValuationResult:
    """Результат оценки"""
    artwork_id: str
    title: str
    artist: str
    base_value: float  # V₀
    total_delta: float  # ΣΔVᵢ
    risk_multiplier: float  # (1 + R_f + R_a + R_m + R_c)
    fair_value: float  # Итоговая P
    confidence: float  # 0-100%
    trend: str  # 'up', 'down', 'stable'
    factors: List[Dict]  # Детализация по факторам
    event_deltas: List[Dict]  # Детализация по событиям

# ===================== ML ENGINE LOGIC =====================

class MLPricingEngine:
    """Движок машинного обучения для расчёта Fair Value"""
    
    def __init__(self):
        self.model_version = "v1.0.0"
        logging.info(f"[MLPricingEngine] Initialized {self.model_version}")
    
    def calculate_fair_value(self, input_data: ValuationInput) -> ValuationResult:
        """Основной метод расчёта Fair Value"""
        
        # 1. Парсим события и рассчитываем ΔVᵢ
        event_deltas_list = []
        total_delta = 0.0
        
        for event_dict in input_data.events:
            event = EventDelta(
                event_type=event_dict.get('event_type', 'unknown'),
                artist_impact=event_dict.get('artist_impact', 0.0),
                segment_impact=event_dict.get('segment_impact', 0.0),
                collector_impact=event_dict.get('collector_impact', 0.0),
                is_direct_sale=event_dict.get('is_direct_sale', False),
                previous_price=event_dict.get('previous_price', input_data.base_value),
                timestamp=event_dict.get('timestamp', ''),
                description=event_dict.get('description', '')
            )
            
            delta = event.calculate_delta()
            total_delta += delta
            
            event_deltas_list.append({
                'event_type': event.event_type,
                'delta': round(delta, 2),
                'description': event.description,
                'timestamp': event.timestamp
            })
        
        # 2. Рассчитываем коэффициенты риска
        if input_data.risk_coefficients:
            risks = RiskCoefficients(
                r_financing=input_data.risk_coefficients.get('r_financing', BASE_R_F),
                r_artist=input_data.risk_coefficients.get('r_artist', BASE_R_A),
                r_market=input_data.risk_coefficients.get('r_market', BASE_R_M),
                r_condition=input_data.risk_coefficients.get('r_condition', BASE_R_C)
            )
        else:
            # Динамически корректируем риски на основе ML-параметров
            risks = self._adjust_risks_ml(input_data)
        
        risk_multiplier = 1.0 + risks.total_risk()
        
        # 3. Применяем формулу: P = (V₀ + ΣΔVᵢ) × (1 + R_f + R_a + R_m + R_c)
        fair_value = (input_data.base_value + total_delta) * risk_multiplier
        
        # 4. Рассчитываем confidence (на основе количества данных)
        confidence = self._calculate_confidence(input_data, len(event_deltas_list))
        
        # 5. Определяем тренд
        trend = self._determine_trend(input_data.base_value, fair_value)
        
        # 6. Формируем факторы
        factors = self._build_factors(input_data, risks, total_delta, risk_multiplier)
        
        return ValuationResult(
            artwork_id=input_data.artwork_id,
            title=input_data.title,
            artist=input_data.artist_name,
            base_value=input_data.base_value,
            total_delta=round(total_delta, 2),
            risk_multiplier=round(risk_multiplier, 4),
            fair_value=round(fair_value, 2),
            confidence=round(confidence, 1),
            trend=trend,
            factors=factors,
            event_deltas=event_deltas_list
        )
    
    def _adjust_risks_ml(self, input_data: ValuationInput) -> RiskCoefficients:
        """Корректировка рисков на основе ML-параметров"""
        
        # Artist risk: зависит от репутации и возраста
        r_artist = BASE_R_A
        if input_data.artist_reputation < 0.3:
            r_artist += 0.02  # Неизвестный художник: +2% риска
        elif input_data.artist_reputation > 0.8:
            r_artist -= 0.01  # Известный художник: -1% риска
        
        if input_data.artist_age < 30:
            r_artist += 0.015  # Молодой художник: +1.5% риска
        
        # Market risk: зависит от спроса и сегмента
        r_market = BASE_R_M
        if input_data.market_demand < 0.3:
            r_market += 0.03  # Низкий спрос: +3% риска
        elif input_data.market_demand > 0.7:
            r_market -= 0.015  # Высокий спрос: -1.5% риска
        
        if input_data.market_segment == 'contemporary':
            r_market += 0.01  # Современное искусство волатильнее
        elif input_data.market_segment == 'classic':
            r_market -= 0.01  # Классика стабильнее
        
        # Condition risk
        r_condition = BASE_R_C
        if input_data.condition_score < 0.6:
            r_condition += 0.02  # Плохое состояние: +2% риска
        elif input_data.condition_score > 0.9:
            r_condition -= 0.005  # Отличное состояние: -0.5% риска
        
        # Financing risk: зависит от ликвидности
        r_financing = BASE_R_F
        if input_data.historical_sales_count < 3:
            r_financing += 0.015  # Мало продаж: +1.5% риска
        
        if not input_data.provenance_verified:
            r_financing += 0.01  # Непроверенная провенанс: +1% риска
        
        return RiskCoefficients(
            r_financing=round(r_financing, 4),
            r_artist=round(r_artist, 4),
            r_market=round(r_market, 4),
            r_condition=round(r_condition, 4)
        )
    
    def _calculate_confidence(self, input_data: ValuationInput, event_count: int) -> float:
        """Расчёт уверенности модели (0-100%)"""
        
        confidence = 50.0  # Базовая уверенность
        
        # Увеличение confidence от количества данных
        confidence += min(event_count * 5, 20)  # +5% за событие, max +20%
        confidence += min(input_data.historical_sales_count * 3, 15)  # +3% за продажу, max +15%
        confidence += min(input_data.exhibition_count * 2, 10)  # +2% за выставку, max +10%
        
        # Бонусы
        if input_data.provenance_verified:
            confidence += 5
        
        if input_data.artist_reputation > 0.7:
            confidence += 3
        
        if input_data.auction_house_tier == 1:
            confidence += 5  # Топ-аукционы надёжнее
        
        # Штрафы
        if input_data.condition_score < 0.5:
            confidence -= 5
        
        if input_data.market_demand < 0.3:
            confidence -= 3
        
        return min(max(confidence, 30), 95)  # Ограничиваем 30-95%
    
    def _determine_trend(self, base_value: float, fair_value: float) -> str:
        """Определить тренд изменения стоимости"""
        diff_pct = ((fair_value - base_value) / base_value) * 100
        
        if diff_pct > 5:
            return 'up'
        elif diff_pct < -5:
            return 'down'
        else:
            return 'stable'
    
    def _build_factors(
        self, 
        input_data: ValuationInput, 
        risks: RiskCoefficients, 
        total_delta: float,
        risk_multiplier: float
    ) -> List[Dict]:
        """Построить список факторов для отображения"""
        
        factors = []
        
        # 1. Base Value
        factors.append({
            'name': 'Base Value (V₀)',
            'impact': input_data.base_value,
            'weight': 100.0,
            'description': 'Последняя рыночная оценка'
        })
        
        # 2. Event Deltas
        if total_delta != 0:
            factors.append({
                'name': 'Event Deltas (ΣΔVᵢ)',
                'impact': total_delta,
                'weight': (abs(total_delta) / input_data.base_value) * 100,
                'description': f'Влияние {len(input_data.events)} событий'
            })
        
        # 3. Artist Reputation
        factors.append({
            'name': 'Artist Reputation',
            'impact': input_data.artist_reputation * 100,
            'weight': ALPHA_ARTIST * 100,
            'description': f'{input_data.artist_name} (репутация {input_data.artist_reputation:.1%})'
        })
        
        # 4. Market Demand
        factors.append({
            'name': 'Market Demand',
            'impact': input_data.market_demand * 100,
            'weight': ALPHA_SEGMENT * 100,
            'description': f'Спрос на сегмент {input_data.market_segment}'
        })
        
        # 5. Condition
        factors.append({
            'name': 'Condition Score',
            'impact': input_data.condition_score * 100,
            'weight': 8.0,
            'description': f'Состояние работы: {input_data.condition_score:.1%}'
        })
        
        # 6. Provenance
        factors.append({
            'name': 'Provenance Verified',
            'impact': 100 if input_data.provenance_verified else 0,
            'weight': 5.0,
            'description': 'Проверенная история владения'
        })
        
        # 7. Risk Multiplier
        factors.append({
            'name': 'Risk Adjustment',
            'impact': (risk_multiplier - 1.0) * 100,
            'weight': risks.total_risk() * 100,
            'description': f'Риски: finance {risks.r_financing:.2%}, artist {risks.r_artist:.2%}, market {risks.r_market:.2%}, condition {risks.r_condition:.2%}'
        })
        
        return factors

# ===================== FLASK API =====================

engine = MLPricingEngine()

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'service': 'ML Pricing Engine',
        'version': engine.model_version
    }), 200

@app.route('/api/valuation/calculate', methods=['POST'])
def calculate_valuation():
    """
    POST /api/valuation/calculate
    
    Body:
    {
      "artwork_id": "artwork-001",
      "title": "Композиция VIII",
      "artist_name": "Василий Кандинский",
      "base_value": 15000000,
      "events": [
        {
          "event_type": "exhibition",
          "artist_impact": 0.8,
          "segment_impact": 0.6,
          "collector_impact": 0.0,
          "is_direct_sale": false,
          "previous_price": 15000000,
          "timestamp": "2024-01-15",
          "description": "Выставка в Третьяковской галерее"
        }
      ],
      "artist_reputation": 0.95,
      "market_demand": 0.7,
      "condition_score": 0.9,
      "provenance_verified": true
    }
    """
    try:
        data = request.get_json()
        
        # Валидация
        required = ['artwork_id', 'title', 'artist_name', 'base_value']
        for field in required:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Создаём input object
        input_data = ValuationInput(
            artwork_id=data['artwork_id'],
            title=data['title'],
            artist_name=data['artist_name'],
            base_value=float(data['base_value']),
            events=data.get('events', []),
            risk_coefficients=data.get('risk_coefficients'),
            artist_reputation=data.get('artist_reputation', 0.5),
            market_demand=data.get('market_demand', 0.5),
            historical_sales_count=data.get('historical_sales_count', 0),
            exhibition_count=data.get('exhibition_count', 0),
            condition_score=data.get('condition_score', 0.8),
            rarity_score=data.get('rarity_score', 0.5),
            provenance_verified=data.get('provenance_verified', False),
            material=data.get('material', 'oil'),
            size_cm2=data.get('size_cm2', 10000),
            year_created=data.get('year_created', 2000),
            artist_age=data.get('artist_age', 50),
            market_segment=data.get('market_segment', 'contemporary'),
            geographic_market=data.get('geographic_market', 'russia'),
            auction_house_tier=data.get('auction_house_tier', 2),
            currency=data.get('currency', 'RUB')
        )
        
        # Рассчитываем Fair Value
        result = engine.calculate_fair_value(input_data)
        
        logging.info(f"[MLEngine] Calculated Fair Value for {input_data.artwork_id}: {result.fair_value:,.0f} {input_data.currency} (confidence {result.confidence}%)")
        
        return jsonify(asdict(result)), 200
        
    except Exception as e:
        logging.error(f"[MLEngine] Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/valuation/batch', methods=['POST'])
def batch_valuation():
    """Массовая оценка нескольких работ"""
    try:
        data = request.get_json()
        artworks = data.get('artworks', [])
        
        if not artworks:
            return jsonify({'error': 'No artworks provided'}), 400
        
        results = []
        for artwork_data in artworks:
            input_data = ValuationInput(**artwork_data)
            result = engine.calculate_fair_value(input_data)
            results.append(asdict(result))
        
        return jsonify({
            'count': len(results),
            'results': results
        }), 200
        
    except Exception as e:
        logging.error(f"[MLEngine] Batch error: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    logging.info("[MLPricingEngine] Starting server on http://0.0.0.0:5001")
    app.run(host='0.0.0.0', port=5001, debug=False)
