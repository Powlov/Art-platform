# Neo4j Graph Trust Integration

## Обзор

Neo4j интеграция для модуля **Graph Trust** — графовая база данных для управления связями между участниками арт-рынка.

## 🎯 Возможности

### 1. Графовая модель данных

**Узлы (Nodes)**:
- `Artist` — Художники
- `Gallery` — Галереи и музеи
- `Artwork` — Произведения искусства
- `Collector` — Коллекционеры

**Связи (Relationships)**:
- `CREATED` — Художник создал произведение
- `OWNS` — Коллекционер владеет произведением
- `EXHIBITED` — Галерея выставляла произведение
- `SOLD_TO` — Продажа произведения
- `AUTHENTICATED` — Аутентификация произведения

### 2. Trust Score Calculation

Индекс доверия рассчитывается на основе:
- **Верификация** (+10 баллов)
- **Количество связей** (+0.5 за связь, макс. +10)
- **Средний Trust Score связанных узлов** (+5% от среднего)
- **Базовая оценка**: 85/100

### 3. Провинанс-трекинг

Полная история произведения:
- Цепочка владельцев
- История выставок
- История продаж
- Аутентификация экспертами

### 4. Fraud Detection через графовый анализ

- Детектирование циклической торговли (wash trading)
- Поиск аномальных паттернов
- Анализ связей между аффилированными лицами
- Shortest path анализ для выявления скрытых связей

### 5. Рекомендации похожих произведений

- Поиск по художнику
- Поиск по стилю/движению
- Анализ популярности у коллекционеров

---

## 🚀 Быстрый старт

### 1. Запуск Neo4j через Docker Compose

```bash
cd /home/user/webapp
docker-compose up -d neo4j redis
```

**Проверка**:
```bash
docker ps | grep neo4j
docker ps | grep redis
```

**Neo4j Browser**: http://localhost:7474
- Username: `neo4j`
- Password: `artbank2026`

**Redis CLI**:
```bash
docker exec -it art-bank-redis redis-cli -a artbank2026
```

### 2. Инициализация графа с тестовыми данными

```bash
cd /home/user/webapp
npx tsx server/scripts/initGraph.ts
```

**Вывод**:
```
🚀 Initializing Graph Database...

📝 Creating Artists...
✅ Created: Василий Кандинский
✅ Created: Марк Шагал
✅ Created: Казимир Малевич

📝 Creating Galleries...
✅ Created: Третьяковская галерея
✅ Created: Государственный Эрмитаж
✅ Created: Государственный Русский музей

📝 Creating Collectors...
✅ Created: Частная коллекция "Арт-Инвест"
✅ Created: Фонд "Русское наследие"

📝 Creating Artworks...
✅ Created: Абстрактная композиция №7
✅ Created: Городской пейзаж
✅ Created: Чёрный квадрат
✅ Created: Композиция VIII

📝 Creating Relationships...
✅ Кандинский CREATED Абстрактная композиция №7
✅ Третьяковская галерея EXHIBITED Абстрактная композиция №7
✅ Арт-Инвест OWNS Абстрактная композиция №7

📊 Graph Statistics:
   Artists: 3
   Galleries: 3
   Artworks: 4
   Collectors: 2
   Total Nodes: 12
   Total Relationships: 10

✅ Graph Database Initialization Complete!
```

### 3. Использование API

#### 3.1 Создать художника

```typescript
const artist = await client.graph.createArtist.mutate({
  id: 'artist-004',
  name: 'Илья Репин',
  digitalId: 'DID:ART:ARTIST:004',
  birthYear: 1844,
  nationality: 'Russian',
  artMovement: 'Realism',
  trustScore: 97.5,
  verified: true
});
```

#### 3.2 Связать художника с произведением

```typescript
await client.graph.linkArtistArtwork.mutate({
  artistId: 'artist-004',
  artworkId: 'artwork-005',
  year: 1881
});
```

#### 3.3 Получить провинанс произведения

```typescript
const provenance = await client.graph.getProvenanceChain.query({
  artworkId: 'artwork-001'
});

console.log(provenance.provenance);
// [{
//   nodes: [/* chain of owners */],
//   relationships: [/* ownership transfers */]
// }]
```

#### 3.4 Рассчитать Trust Score

```typescript
const trust = await client.graph.calculateTrustScore.query({
  nodeId: 'artwork-001'
});

console.log(trust);
// {
//   nodeId: 'artwork-001',
//   trustScore: 95.2,
//   level: 'excellent'
// }
```

#### 3.5 Детектировать подозрительные паттерны

```typescript
const fraud = await client.graph.detectSuspiciousPatterns.query({
  artworkId: 'artwork-001'
});

console.log(fraud);
// {
//   artworkId: 'artwork-001',
//   patterns: [],
//   riskScore: 0,
//   recommendation: 'No suspicious patterns detected'
// }
```

#### 3.6 Найти похожие произведения

```typescript
const similar = await client.graph.findSimilarArtworks.query({
  artworkId: 'artwork-001',
  limit: 5
});

console.log(similar.similar);
// [
//   { id: 'artwork-004', title: 'Композиция VIII', popularity: 12 },
//   ...
// ]
```

---

## 🏗️ Архитектура

```
┌─────────────────────────────────────────┐
│        Transaction-Led Core             │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐   ┌──────────────┐   │
│  │   Neo4j      │   │    Redis     │   │
│  │   Graph DB   │   │    Cache     │   │
│  │              │   │              │   │
│  │ • Artists    │   │ • Provenance │   │
│  │ • Galleries  │◄──┤ • Trust      │   │
│  │ • Artworks   │   │   Scores     │   │
│  │ • Collectors │   │ • Similar    │   │
│  └──────────────┘   └──────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│           tRPC API Layer                │
│  /api/trpc/graph.*                      │
└─────────────────────────────────────────┘
```

---

## 📊 Neo4j Cypher Examples

### Найти все произведения художника

```cypher
MATCH (artist:Artist {name: 'Василий Кандинский'})-[:CREATED]->(artwork:Artwork)
RETURN artwork.title, artwork.year, artwork.currentPrice
ORDER BY artwork.year DESC
```

### Провинанс произведения

```cypher
MATCH path = (artwork:Artwork {id: 'artwork-001'})<-[r*]-(n)
WHERE r IS NOT NULL
RETURN path
ORDER BY length(path) DESC
```

### Детектирование циклической торговли

```cypher
MATCH path = (artwork:Artwork {id: 'artwork-001'})<-[:OWNS*2..5]-(artwork)
WHERE length(path) >= 2
RETURN path, length(path) as cycleLength
ORDER BY cycleLength ASC
```

### Рассчитать Trust Score

```cypher
MATCH (n:Artwork {id: 'artwork-001'})
OPTIONAL MATCH (n)-[r]-(connected)
WITH n, count(r) as connections,
     avg(connected.trustScore) as avgConnectedTrust
RETURN n.verified as verified,
       connections,
       avgConnectedTrust
```

### Найти похожие произведения

```cypher
MATCH (artwork:Artwork {id: 'artwork-001'})<-[:CREATED]-(artist:Artist)
MATCH (artist)-[:CREATED]->(similar:Artwork)
WHERE similar.id <> 'artwork-001'
WITH similar, artwork
MATCH (similar)<-[:OWNS]-(collector:Collector)
RETURN similar, count(collector) as popularity
ORDER BY popularity DESC, similar.trustScore DESC
LIMIT 10
```

---

## 🔧 Конфигурация

### Environment Variables

```bash
# Neo4j
NEO4J_URI=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=artbank2026

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=artbank2026
```

### Docker Compose Services

**Neo4j**:
- HTTP: http://localhost:7474
- Bolt: bolt://localhost:7687
- Memory: 2GB heap, 1GB pagecache
- Plugins: APOC, Graph Data Science

**Redis**:
- Port: 6379
- Max Memory: 512MB
- Policy: allkeys-lru (LRU eviction)

---

## 📈 Performance

### Кеширование (Redis)

- **Provenance chains**: 1 час TTL
- **Similar artworks**: 6 часов TTL
- **Network stats**: 5 минут TTL
- **Trust scores**: Real-time (no cache)

### Индексы (Neo4j)

- `Artist.name` — Index
- `Artwork.title` — Index
- `*.trustScore` — Index
- `*.id` — Unique Constraint

---

## 🧪 Тестирование

```bash
# Запуск Neo4j и Redis
docker-compose up -d neo4j redis

# Инициализация данных
npx tsx server/scripts/initGraph.ts

# Проверка Neo4j
curl http://localhost:7474

# Проверка Redis
docker exec -it art-bank-redis redis-cli -a artbank2026 PING
```

---

## 📚 Дополнительные ресурсы

- [Neo4j Documentation](https://neo4j.com/docs/)
- [Cypher Query Language](https://neo4j.com/developer/cypher/)
- [Graph Data Science](https://neo4j.com/docs/graph-data-science/)
- [Redis Documentation](https://redis.io/docs/)

---

## 🎯 Roadmap

### Q2 2026
- ✅ Neo4j интеграция
- ✅ Redis кеширование
- ✅ Trust Score calculation
- ✅ Provenance tracking
- ✅ Fraud detection via graphs

### Q3 2026
- ⏳ Graph Data Science алгоритмы (Community Detection, PageRank)
- ⏳ Real-time graph updates via WebSocket
- ⏳ Advanced fraud patterns (GNN models)
- ⏳ Multi-tenancy support

---

**Автор**: ART BANK Development Team  
**Дата**: 2026-02-24  
**Версия**: v3.42.0
