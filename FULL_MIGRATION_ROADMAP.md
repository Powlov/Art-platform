# 🚀 ПОЛНАЯ МИГРАЦИЯ НА ART-OS: 6-8 недель

**Статус**: 🟢 Начало разработки  
**Дата старта**: 2026-03-12  
**Планируемое завершение**: 2026-04-30 (7 недель)  
**Команда**: Full Stack Team

---

## 📅 TIMELINE И MILESTONES

```
Неделя 1-2: ФАЗА 1 - Инфраструктура и миграция БД ⚡
Неделя 2-3: ФАЗА 2 - Event Router и Kafka 📨
Неделя 3-4: ФАЗА 3 - Analytics Service 🧠
Неделя 4-5: ФАЗА 4 - Transaction Hub 💸
Неделя 5-6: ФАЗА 5 - Media Hub 📰
Неделя 6-7: ФАЗА 6 - Тестирование и деплой ✅
```

---

## 📊 ФАЗА 1: ИНФРАСТРУКТУРА (Неделя 1-2)

### Цель: Подготовить базовую инфраструктуру

### День 1-2: Установка баз данных

#### 1.1 PostgreSQL ✅
```bash
# Установка PostgreSQL 15
docker run -d \
  --name artbank-postgres \
  -e POSTGRES_DB=artbank \
  -e POSTGRES_USER=artbank \
  -e POSTGRES_PASSWORD=secure_password \
  -p 5432:5432 \
  -v pgdata:/var/lib/postgresql/data \
  postgres:15-alpine

# Создание схемы
psql -h localhost -U artbank -d artbank -f schema.sql
```

**Таблицы для создания**:
- `users` - Пользователи
- `assets` - Произведения искусства
- `persons` - Художники/Коллекционеры
- `entities` - Банки/Галереи
- `transactions` - Сделки
- `events` - События/Выставки
- `media_items` - Новости

**Таблицы связей**:
- `ownership_link` - Владение активами
- `representation_link` - Представительство галерей
- `transaction_link` - Связь транзакций
- `mention_link` - Упоминания в медиа

#### 1.2 Neo4j ✅
```bash
# Установка Neo4j 5.x
docker run -d \
  --name artbank-neo4j \
  -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/artbank_password \
  -e NEO4J_dbms_memory_heap_max__size=2G \
  -v neo4j_data:/data \
  neo4j:5-community

# Создание индексов
CREATE INDEX asset_id FOR (a:Asset) ON (a.id);
CREATE INDEX person_id FOR (p:Person) ON (p.id);
CREATE INDEX entity_id FOR (e:Entity) ON (e.id);
```

**Узлы (Nodes)**:
- `Asset` - Произведения
- `Person` - Люди
- `Entity` - Организации
- `Transaction` - Сделки
- `MediaItem` - Новости
- `Event` - События

**Связи (Edges)**:
- `[:CREATED]` - Авторство
- `[:OWNS]` - Владение
- `[:SOLD_VIA]` - Продажа через
- `[:MENTIONS]` - Упоминание
- `[:EXHIBITED_AT]` - Выставлялось на
- `[:REPRESENTS]` - Представляет

#### 1.3 Memgraph ✅
```bash
# Установка Memgraph для быстрых операций
docker run -d \
  --name artbank-memgraph \
  -p 7688:7687 \
  -v memgraph_data:/var/lib/memgraph \
  memgraph/memgraph-platform

# Синхронизация с Neo4j через Kafka
```

### День 3-4: Kafka Setup

#### 1.4 Apache Kafka Cluster ✅
```bash
# Docker Compose для Kafka + Zookeeper
version: '3.8'
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:7.5.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
    ports:
      - "2181:2181"
  
  kafka:
    image: confluentinc/cp-kafka:7.5.0
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: "true"

# Запуск
docker-compose up -d
```

**Kafka Topics для создания**:
- `tx.requests` - Запросы на транзакции
- `tx.result` - Результаты транзакций
- `analytics.requests` - Запросы аналитики
- `analytics.result` - Результаты аналитики
- `media.events` - События медиа
- `graph.updates` - Обновления графа
- `system.stop` - Критические ошибки

### День 5-7: Миграция данных

#### 1.5 SQLite → PostgreSQL ✅
```python
# scripts/migrate_sqlite_to_postgres.py
import sqlite3
import psycopg2
from typing import Dict, List

def migrate_table(sqlite_conn, pg_conn, table_name: str, mapping: Dict):
    """Миграция одной таблицы"""
    sqlite_cursor = sqlite_conn.cursor()
    pg_cursor = pg_conn.cursor()
    
    # Читаем из SQLite
    sqlite_cursor.execute(f"SELECT * FROM {table_name}")
    rows = sqlite_cursor.fetchall()
    
    # Вставляем в PostgreSQL
    for row in rows:
        pg_cursor.execute(
            f"INSERT INTO {table_name} VALUES (...)",
            row
        )
    
    pg_conn.commit()

# Миграция всех таблиц
migrate_table(sqlite_conn, pg_conn, 'users', USER_MAPPING)
migrate_table(sqlite_conn, pg_conn, 'artworks', ARTWORK_MAPPING)
# ... остальные таблицы
```

#### 1.6 Создание графа в Neo4j ✅
```python
# scripts/populate_neo4j.py
from neo4j import GraphDatabase

class Neo4jPopulator:
    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))
    
    def create_asset_node(self, asset_data):
        with self.driver.session() as session:
            session.run("""
                CREATE (a:Asset {
                    id: $id,
                    name: $name,
                    creation_year: $year,
                    base_price: $price,
                    status: $status
                })
            """, **asset_data)
    
    def create_ownership_relationship(self, owner_id, asset_id, date):
        with self.driver.session() as session:
            session.run("""
                MATCH (p:Person {id: $owner_id})
                MATCH (a:Asset {id: $asset_id})
                CREATE (p)-[:OWNS {since: $date}]->(a)
            """, owner_id=owner_id, asset_id=asset_id, date=date)

# Заполнение графа из PostgreSQL
populator = Neo4jPopulator("bolt://localhost:7687", "neo4j", "password")
# ... populate
```

**Deliverables ФАЗЫ 1**:
- ✅ PostgreSQL с мигрированными данными
- ✅ Neo4j с графом связей
- ✅ Memgraph для быстрых операций
- ✅ Kafka кластер с topics
- ✅ Скрипты миграции данных

---

## 📨 ФАЗА 2: EVENT ROUTER (Неделя 2-3)

### Цель: Создать центральный маршрутизатор событий

### День 8-10: Базовый Router

#### 2.1 Event Router на Go ✅
```go
// cmd/event-router/main.go
package main

import (
    "github.com/gin-gonic/gin"
    "github.com/segmentio/kafka-go"
)

type EventRouter struct {
    kafkaWriter *kafka.Writer
    config      *Config
}

func NewEventRouter(config *Config) *EventRouter {
    writer := kafka.NewWriter(kafka.WriterConfig{
        Brokers: []string{"localhost:9092"},
        Topic:   "tx.requests",
    })
    
    return &EventRouter{
        kafkaWriter: writer,
        config:      config,
    }
}

func (r *EventRouter) HandleTransaction(c *gin.Context) {
    var req TransactionRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }
    
    // Валидация JWT
    token := c.GetHeader("Authorization")
    if !r.validateJWT(token) {
        c.JSON(401, gin.H{"error": "Unauthorized"})
        return
    }
    
    // Публикация в Kafka
    err := r.publishEvent("tx.requests", req)
    if err != nil {
        c.JSON(500, gin.H{"error": "Failed to publish event"})
        return
    }
    
    c.JSON(200, gin.H{"status": "processing"})
}

func main() {
    router := gin.Default()
    eventRouter := NewEventRouter(LoadConfig())
    
    router.POST("/api/v1/transaction", eventRouter.HandleTransaction)
    router.POST("/api/v1/analytics/request", eventRouter.HandleAnalytics)
    
    router.Run(":8080")
}
```

#### 2.2 Kafka Producers/Consumers ✅
```go
// pkg/kafka/producer.go
type Producer struct {
    writer *kafka.Writer
}

func (p *Producer) PublishEvent(topic string, key string, value []byte) error {
    return p.writer.WriteMessages(context.Background(),
        kafka.Message{
            Topic: topic,
            Key:   []byte(key),
            Value: value,
        },
    )
}

// pkg/kafka/consumer.go
type Consumer struct {
    reader *kafka.Reader
}

func (c *Consumer) Consume(handler func(kafka.Message)) {
    for {
        msg, err := c.reader.ReadMessage(context.Background())
        if err != nil {
            log.Printf("Error reading message: %v", err)
            continue
        }
        handler(msg)
    }
}
```

### День 11-12: Security & Circuit Breaker

#### 2.3 JWT Authentication ✅
```go
// pkg/auth/jwt.go
import "github.com/golang-jwt/jwt/v5"

type JWTAuth struct {
    secretKey []byte
}

func (j *JWTAuth) ValidateToken(tokenString string) (*Claims, error) {
    token, err := jwt.ParseWithClaims(tokenString, &Claims{}, 
        func(token *jwt.Token) (interface{}, error) {
            return j.secretKey, nil
        })
    
    if err != nil {
        return nil, err
    }
    
    if claims, ok := token.Claims.(*Claims); ok && token.Valid {
        return claims, nil
    }
    
    return nil, errors.New("Invalid token")
}
```

#### 2.4 Circuit Breaker ✅
```go
// pkg/circuitbreaker/breaker.go
type CircuitBreaker struct {
    maxFailures int
    timeout     time.Duration
    state       State
    failures    int
    lastFailure time.Time
}

func (cb *CircuitBreaker) Call(fn func() error) error {
    if cb.state == Open {
        if time.Since(cb.lastFailure) > cb.timeout {
            cb.state = HalfOpen
        } else {
            return ErrCircuitOpen
        }
    }
    
    err := fn()
    if err != nil {
        cb.failures++
        cb.lastFailure = time.Now()
        
        if cb.failures >= cb.maxFailures {
            cb.state = Open
            // Публикация STOP события
            cb.publishStopEvent()
        }
        return err
    }
    
    cb.reset()
    return nil
}
```

**Deliverables ФАЗЫ 2**:
- ✅ Event Router на Go
- ✅ Kafka integration
- ✅ JWT аутентификация
- ✅ Circuit Breaker механизм
- ✅ API Gateway endpoints

---

## 🧠 ФАЗА 3: ANALYTICS SERVICE (Неделя 3-4)

### Цель: Создать интеллектуальное ядро аналитики

### День 13-16: Аналитический сервис

#### 3.1 FastAPI Service ✅
```python
# services/analytics/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
from scipy.stats import gaussian_kde

app = FastAPI(title="Analytics Service")

class PriceRequest(BaseModel):
    asset_id: str
    context: dict

class PriceResponse(BaseModel):
    fair_value: float
    risk_score: float
    confidence: float
    reasoning: str

@app.post("/api/v1/calculate_fair_price", response_model=PriceResponse)
async def calculate_fair_price(request: PriceRequest):
    # Получение данных из Neo4j
    historical_prices = await fetch_historical_prices(request.asset_id)
    
    # KDE алгоритм
    fair_value, confidence = calculate_kde(historical_prices)
    
    # Оценка риска
    risk_score = calculate_risk(request.asset_id)
    
    return PriceResponse(
        fair_value=fair_value,
        risk_score=risk_score,
        confidence=confidence,
        reasoning=f"Based on {len(historical_prices)} similar sales"
    )
```

#### 3.2 KDE Algorithm ✅
```python
# services/analytics/kde.py
from scipy.stats import gaussian_kde
import numpy as np

def calculate_kde(prices: list[float]) -> tuple[float, float]:
    """
    Kernel Density Estimation для вычисления 'гравитации' цен
    
    Returns:
        (fair_price, confidence)
    """
    if len(prices) < 3:
        return np.mean(prices), 0.5
    
    # Создание KDE модели
    kde = gaussian_kde(prices)
    
    # Генерация сетки для поиска пика
    x_grid = np.linspace(min(prices) * 0.8, max(prices) * 1.2, 1000)
    density = kde(x_grid)
    
    # Находим пик плотности (fair price)
    fair_price = x_grid[np.argmax(density)]
    
    # Confidence основан на ширине распределения
    std_dev = np.std(prices)
    confidence = 1.0 / (1.0 + std_dev / fair_price)
    
    return float(fair_price), float(confidence)

def detect_anomalies(new_price: float, historical_prices: list[float]) -> bool:
    """Детекция аномальных цен"""
    if len(historical_prices) < 5:
        return False
    
    fair_price, confidence = calculate_kde(historical_prices)
    
    # Если цена более чем на 40% отличается от справедливой
    deviation = abs(new_price - fair_price) / fair_price
    
    return deviation > 0.4
```

#### 3.3 Neo4j Integration ✅
```python
# services/analytics/graph.py
from neo4j import GraphDatabase

class GraphAnalytics:
    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))
    
    async def get_historical_prices(self, asset_id: str) -> list[float]:
        """Получение исторических цен из графа"""
        with self.driver.session() as session:
            result = session.run("""
                MATCH (a:Asset {id: $asset_id})-[:SOLD_VIA]->(t:Transaction)
                WHERE t.timestamp > datetime() - duration('P12M')
                RETURN t.price as price
                ORDER BY t.timestamp DESC
            """, asset_id=asset_id)
            
            return [record["price"] for record in result]
    
    async def find_similar_assets(self, asset_id: str) -> list[str]:
        """Поиск похожих активов в графе"""
        with self.driver.session() as session:
            result = session.run("""
                MATCH (a:Asset {id: $asset_id})-[:CREATED_BY]->(artist:Person)
                MATCH (artist)-[:CREATED]->(similar:Asset)
                WHERE similar.id <> $asset_id
                AND similar.creation_year >= a.creation_year - 5
                AND similar.creation_year <= a.creation_year + 5
                RETURN similar.id as id
                LIMIT 10
            """, asset_id=asset_id)
            
            return [record["id"] for record in result]
```

**Deliverables ФАЗЫ 3**:
- ✅ Analytics Service (FastAPI)
- ✅ KDE алгоритм
- ✅ Neo4j driver
- ✅ API endpoints
- ✅ Детекция аномалий

---

## 💸 ФАЗА 4: TRANSACTION HUB (Неделя 4-5)

### Цель: Безопасная обработка транзакций

#### 4.1-4.4 Transaction Hub + Saga Pattern ✅

```go
// services/transaction-hub/saga.go
package main

type SagaStep struct {
    Execute   func() error
    Compensate func() error
}

type Saga struct {
    steps []SagaStep
    executedSteps []int
}

func (s *Saga) AddStep(step SagaStep) {
    s.steps = append(s.steps, step)
}

func (s *Saga) Execute() error {
    for i, step := range s.steps {
        if err := step.Execute(); err != nil {
            // Откат всех выполненных шагов
            s.Rollback()
            return err
        }
        s.executedSteps = append(s.executedSteps, i)
    }
    return nil
}

func (s *Saga) Rollback() {
    // Откат в обратном порядке
    for i := len(s.executedSteps) - 1; i >= 0; i-- {
        stepIndex := s.executedSteps[i]
        s.steps[stepIndex].Compensate()
    }
}

// Пример использования
func ProcessTransaction(tx Transaction) error {
    saga := &Saga{}
    
    // Шаг 1: Резервирование актива
    saga.AddStep(SagaStep{
        Execute: func() error {
            return ReserveAsset(tx.AssetID)
        },
        Compensate: func() error {
            return ReleaseAsset(tx.AssetID)
        },
    })
    
    // Шаг 2: Блокировка средств
    saga.AddStep(SagaStep{
        Execute: func() error {
            return BlockFunds(tx.BuyerID, tx.Amount)
        },
        Compensate: func() error {
            return UnblockFunds(tx.BuyerID, tx.Amount)
        },
    })
    
    // Шаг 3: Проверка провенанса
    saga.AddStep(SagaStep{
        Execute: func() error {
            return VerifyProvenance(tx.AssetID)
        },
        Compensate: func() error { return nil },
    })
    
    // Шаг 4: Передача владения
    saga.AddStep(SagaStep{
        Execute: func() error {
            return TransferOwnership(tx.AssetID, tx.BuyerID)
        },
        Compensate: func() error {
            return RevertOwnership(tx.AssetID, tx.SellerID)
        },
    })
    
    // Шаг 5: Завершение платежа
    saga.AddStep(SagaStep{
        Execute: func() error {
            return CompletePayment(tx.BuyerID, tx.SellerID, tx.Amount)
        },
        Compensate: func() error {
            return RefundPayment(tx.BuyerID, tx.Amount)
        },
    })
    
    return saga.Execute()
}
```

**Deliverables ФАЗЫ 4**:
- ✅ Transaction Hub на Go
- ✅ Saga Pattern реализован
- ✅ Компенсирующие транзакции
- ✅ Интеграция с Event Router
- ✅ P2P и Auction потоки

---

## 📰 ФАЗА 5: MEDIA HUB (Неделя 5-6)

### Цель: Медийное влияние и NLP

```python
# services/media-hub/main.py
from fastapi import FastAPI
import spacy
from transformers import pipeline

app = FastAPI()
nlp = spacy.load("en_core_web_sm")
sentiment_analyzer = pipeline("sentiment-analysis")

@app.post("/api/v1/process_news")
async def process_news(news_url: str):
    # Парсинг статьи
    article = parse_article(news_url)
    
    # NLP - извлечение сущностей
    doc = nlp(article.text)
    entities = extract_entities(doc)
    
    # Sentiment analysis
    sentiment = sentiment_analyzer(article.text)[0]
    
    # Создание связей в графе
    await create_media_links(entities, sentiment)
    
    return {"status": "processed", "entities": entities}
```

**Deliverables ФАЗЫ 5**:
- ✅ Media Hub (Python + NLP)
- ✅ Парсинг новостей
- ✅ Sentiment analysis
- ✅ Интеграция с графом

---

## ✅ ФАЗА 6: ТЕСТИРОВАНИЕ (Неделя 6-7)

### 6.1 End-to-end тесты
### 6.2 Load testing
### 6.3 Security audit
### 6.4 Performance optimization
### 6.5 Документация и деплой

---

## 🎯 КРИТЕРИИ УСПЕХА

- [ ] Все 27 задач выполнены
- [ ] API response time < 200ms
- [ ] Throughput > 1000 RPS
- [ ] Zero data loss
- [ ] 99.9% uptime
- [ ] Все тесты проходят

---

**Готов начать ФАЗУ 1! 🚀**
