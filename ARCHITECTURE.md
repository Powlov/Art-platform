# ART BANK MARKET - Архитектура Системы

## 1. Обзор Архитектуры

Платформа ART BANK MARKET построена на микросервисной архитектуре с четкой разделением между фронтенд и бэкенд компонентами. Система обеспечивает масштабируемость, надежность и высокую производительность для работы с большими объемами данных о произведениях искусства и транзакциях.

| Компонент | Технология | Назначение |
|-----------|-----------|-----------|
| Frontend | React 19 + TypeScript + Tailwind CSS | Интерактивный пользовательский интерфейс |
| Backend API | Go + REST | Обработка бизнес-логики и управление данными |
| Database | PostgreSQL | Хранение структурированных данных |
| File Storage | AWS S3 | Хранение изображений и документов |
| Blockchain | Ethereum + IPFS | Неизменяемые паспорта и провенанс |
| Real-time | WebSocket | Обновление цен и уведомления в реальном времени |
| Cache | Redis (опционально) | Кэширование часто используемых данных |

## 2. Модель Данных

### 2.1 Основные Сущности

```
┌─────────────────────────────────────────────────────────────┐
│                        USER SYSTEM                           │
├─────────────────────────────────────────────────────────────┤
│ User (id, email, password_hash, role, created_at)           │
│ ├── Profile (user_id, name, bio, avatar_url, phone)         │
│ ├── Wallet (user_id, balance, credit_line, insurance)       │
│ ├── Portfolio (user_id, total_value, artworks_count)        │
│ └── Notifications (user_id, type, content, read_at)         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      ARTWORK SYSTEM                          │
├─────────────────────────────────────────────────────────────┤
│ Artwork (id, title, artist_id, description, created_at)     │
│ ├── Metadata (artwork_id, technique, dimensions, year)      │
│ ├── Pricing (artwork_id, current_price, base_price)         │
│ ├── PriceHistory (artwork_id, price, timestamp, reason)     │
│ ├── BlockchainPassport (artwork_id, tx_hash, ipfs_hash)     │
│ ├── Provenance (artwork_id, owner_id, acquired_at)          │
│ ├── QRCode (artwork_id, code_data, generated_at)            │
│ └── News (artwork_id, title, content, source, created_at)   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     MARKETPLACE SYSTEM                       │
├─────────────────────────────────────────────────────────────┤
│ Auction (id, artwork_id, start_price, end_time, status)     │
│ ├── Bid (auction_id, bidder_id, amount, timestamp)          │
│ └── AuctionResult (auction_id, winner_id, final_price)      │
│                                                              │
│ Transaction (id, seller_id, buyer_id, artwork_id, amount)   │
│ └── TransactionDetails (transaction_id, status, timestamp)  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      GALLERY SYSTEM                          │
├─────────────────────────────────────────────────────────────┤
│ Gallery (id, owner_id, name, description, created_at)       │
│ ├── GalleryProfile (gallery_id, logo_url, website, phone)   │
│ ├── Club (gallery_id, name, description, membership_fee)    │
│ ├── ClubMember (club_id, user_id, joined_at, tier)          │
│ ├── LandingPage (gallery_id, content, template, style)      │
│ └── GalleryArtworks (gallery_id, artwork_id, added_at)      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   COMMUNICATION SYSTEM                       │
├─────────────────────────────────────────────────────────────┤
│ Message (id, sender_id, recipient_id, content, created_at)  │
│ ├── MessageAttachment (message_id, file_url, type)          │
│ ├── MessageRead (message_id, user_id, read_at)              │
│ └── Chat (id, participants, created_at, updated_at)         │
│                                                              │
│ Call (id, initiator_id, recipient_id, type, duration)       │
│ └── CallRecord (call_id, recording_url, created_at)         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     ANALYTICS SYSTEM                         │
├─────────────────────────────────────────────────────────────┤
│ Analytics (id, user_id, event_type, data, created_at)       │
│ ├── ViewHistory (user_id, artwork_id, viewed_at)            │
│ ├── SearchHistory (user_id, query, results_count)           │
│ └── PriceIndex (genre, artist_id, avg_price, timestamp)     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    STREAMING SYSTEM                          │
├─────────────────────────────────────────────────────────────┤
│ Stream (id, title, description, start_time, end_time)       │
│ ├── StreamSession (stream_id, video_url, chat_enabled)      │
│ ├── StreamComment (stream_id, user_id, comment, timestamp)  │
│ ├── StreamMaterial (stream_id, file_url, title, type)       │
│ └── StreamViewer (stream_id, user_id, joined_at, left_at)   │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Роли Пользователей

| Роль | Описание | Основные Функции |
|------|---------|-----------------|
| **Administrator** | Администратор платформы | Управление пользователями, модерация, статистика |
| **Artist** | Художник | Управление портфолио, консультации, аналитика |
| **Collector** | Коллекционер | Покупка, wishlist, управление портфелем |
| **Gallery** | Галерея | Управление клубом, лендинг, аналитика продаж |
| **Partner** | Партнер | Управление событиями, спонсорство |
| **Curator** | Куратор | Создание подборок, рекомендации |
| **Consultant** | Консультант | Консультации, управление расписанием |
| **Guest** | Гость | Просмотр маркетплейса, регистрация |

## 3. API Архитектура

### 3.1 REST Endpoints

```
# Authentication
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh-token

# Users
GET    /api/v1/users/{id}
PUT    /api/v1/users/{id}
GET    /api/v1/users/{id}/profile
GET    /api/v1/users/{id}/portfolio
GET    /api/v1/users/{id}/statistics

# Artworks
GET    /api/v1/artworks
GET    /api/v1/artworks/{id}
POST   /api/v1/artworks (artist/gallery)
PUT    /api/v1/artworks/{id}
GET    /api/v1/artworks/{id}/passport
GET    /api/v1/artworks/{id}/price-history
GET    /api/v1/artworks/{id}/news
GET    /api/v1/artworks/search

# Auctions
GET    /api/v1/auctions
GET    /api/v1/auctions/{id}
POST   /api/v1/auctions (admin/gallery)
POST   /api/v1/auctions/{id}/bid
GET    /api/v1/auctions/{id}/bids

# Transactions
GET    /api/v1/transactions
GET    /api/v1/transactions/{id}
POST   /api/v1/transactions (buy artwork)
GET    /api/v1/transactions/history

# Galleries
GET    /api/v1/galleries
GET    /api/v1/galleries/{id}
POST   /api/v1/galleries (owner)
PUT    /api/v1/galleries/{id}
GET    /api/v1/galleries/{id}/club
POST   /api/v1/galleries/{id}/club/members

# Landing Pages
GET    /api/v1/landing/{id}
POST   /api/v1/landing (gallery/partner)
PUT    /api/v1/landing/{id}
GET    /api/v1/landing/{id}/preview

# Messages
GET    /api/v1/messages
POST   /api/v1/messages (send)
GET    /api/v1/messages/{id}
PUT    /api/v1/messages/{id}/read
POST   /api/v1/messages/{id}/attachment

# Analytics
GET    /api/v1/analytics/market
GET    /api/v1/analytics/user/{id}
GET    /api/v1/analytics/trends
GET    /api/v1/analytics/price-index

# QR Codes
GET    /api/v1/qr/{id}
POST   /api/v1/qr/generate
POST   /api/v1/qr/scan

# Streams
GET    /api/v1/streams
GET    /api/v1/streams/{id}
POST   /api/v1/streams (admin)
POST   /api/v1/streams/{id}/comment
GET    /api/v1/streams/{id}/materials
```

### 3.2 WebSocket Events

```
# Real-time Price Updates
artwork:price-changed
auction:bid-placed
auction:time-updated

# Notifications
notification:new
notification:read

# Chat
message:new
message:delivered
message:read
user:typing
user:online
user:offline

# Streaming
stream:started
stream:ended
stream:comment-added
stream:viewer-joined
stream:viewer-left
```

## 4. Frontend Структура

```
client/
├── src/
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Marketplace.tsx
│   │   ├── ArtworkDetails.tsx
│   │   ├── Auctions.tsx
│   │   ├── Wallet.tsx
│   │   ├── Streams.tsx
│   │   ├── Consultations.tsx
│   │   ├── Clubs.tsx
│   │   ├── LandingBuilder.tsx
│   │   ├── Profile.tsx
│   │   ├── Admin.tsx
│   │   ├── Messenger.tsx
│   │   └── NotFound.tsx
│   │
│   ├── components/
│   │   ├── Navigation.tsx
│   │   ├── ArtworkCard.tsx
│   │   ├── AuctionCard.tsx
│   │   ├── WalletDisplay.tsx
│   │   ├── PriceChart.tsx
│   │   ├── QRScanner.tsx
│   │   ├── MessengerWidget.tsx
│   │   ├── LandingPageBuilder.tsx
│   │   ├── AnalyticsPanel.tsx
│   │   └── ui/ (shadcn/ui components)
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── WebSocketContext.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useWebSocket.ts
│   │   ├── useArtwork.ts
│   │   └── useAnalytics.ts
│   │
│   ├── services/
│   │   ├── api.ts
│   │   ├── websocket.ts
│   │   ├── qr.ts
│   │   └── storage.ts
│   │
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── validators.ts
│   │   └── formatters.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
└── public/
    ├── images/
    ├── icons/
    └── fonts/
```

## 5. Backend Структура (Go)

```
backend/
├── cmd/
│   └── main.go
├── internal/
│   ├── auth/
│   │   ├── handler.go
│   │   ├── service.go
│   │   └── middleware.go
│   │
│   ├── user/
│   │   ├── handler.go
│   │   ├── service.go
│   │   ├── repository.go
│   │   └── model.go
│   │
│   ├── artwork/
│   │   ├── handler.go
│   │   ├── service.go
│   │   ├── repository.go
│   │   ├── model.go
│   │   └── pricing.go (ML pricing algorithm)
│   │
│   ├── auction/
│   │   ├── handler.go
│   │   ├── service.go
│   │   ├── repository.go
│   │   └── model.go
│   │
│   ├── transaction/
│   │   ├── handler.go
│   │   ├── service.go
│   │   └── repository.go
│   │
│   ├── gallery/
│   │   ├── handler.go
│   │   ├── service.go
│   │   └── repository.go
│   │
│   ├── message/
│   │   ├── handler.go
│   │   ├── service.go
│   │   └── repository.go
│   │
│   ├── analytics/
│   │   ├── handler.go
│   │   ├── service.go
│   │   └── calculator.go
│   │
│   ├── blockchain/
│   │   ├── passport.go
│   │   ├── qr.go
│   │   └── ipfs.go
│   │
│   ├── websocket/
│   │   ├── hub.go
│   │   ├── client.go
│   │   └── handler.go
│   │
│   └── config/
│       └── config.go
│
├── pkg/
│   ├── database/
│   │   └── postgres.go
│   ├── storage/
│   │   └── s3.go
│   └── logger/
│       └── logger.go
│
└── migrations/
    └── *.sql
```

## 6. Поток Данных

### 6.1 Покупка Произведения

```
User (Frontend)
    ↓
[Checkout Page]
    ↓
POST /api/v1/transactions
    ↓
Backend: Validate User & Artwork
    ↓
Backend: Create Transaction
    ↓
Backend: Update Artwork Ownership
    ↓
Backend: Trigger Cascade Pricing Algorithm
    ↓
Backend: Update Related Artworks Prices
    ↓
Backend: Create Blockchain Passport Entry
    ↓
Backend: Emit WebSocket Event
    ↓
Frontend: Update UI & Show Confirmation
    ↓
User: Artwork Added to Portfolio
```

### 6.2 Аукцион с Каскадным Эффектом

```
User Places Bid
    ↓
POST /api/v1/auctions/{id}/bid
    ↓
Backend: Validate Bid Amount
    ↓
Backend: Update Auction State
    ↓
Auction Ends (No More Bids)
    ↓
Backend: Apply 3% Price Reduction
    ↓
Backend: Trigger Cascade Effect
    ↓
ML Algorithm: Analyze 9 Factors
    ├── Artist Reputation
    ├── Historical Prices
    ├── Market Demand
    ├── Genre Trends
    ├── Artwork Condition
    ├── Size & Medium
    ├── Exhibition History
    ├── Similar Works Prices
    └── Time on Market
    ↓
Backend: Calculate New Prices for Related Works
    ↓
Backend: Update Database
    ↓
WebSocket: Broadcast Price Updates
    ↓
Frontend: Update Price Charts in Real-time
```

## 7. Безопасность

### 7.1 Аутентификация и Авторизация
- JWT токены с 24-часовым сроком действия
- Refresh tokens для продления сессии
- Role-based access control (RBAC)
- Двухфакторная аутентификация (опционально)

### 7.2 Защита Данных
- Шифрование паролей (bcrypt)
- HTTPS для всех коммуникаций
- CORS политика
- Rate limiting на API endpoints
- Input validation и sanitization

### 7.3 Blockchain Безопасность
- Цифровые подписи для транзакций
- Неизменяемость записей в IPFS
- Верификация провенанса
- Смарт-контракты для сложных операций

## 8. Масштабируемость

### 8.1 Горизонтальное Масштабирование
- Stateless API servers (можно запустить несколько экземпляров)
- Load balancer для распределения трафика
- Database replication для читаемости
- Cache layer (Redis) для часто используемых данных

### 8.2 Вертикальное Масштабирование
- Оптимизация запросов к БД
- Индексирование часто используемых полей
- Кэширование результатов аналитики
- Асинхронная обработка тяжелых операций

## 9. Мониторинг и Логирование

### 9.1 Метрики
- Количество активных пользователей
- Объем торговли
- Среднее время отклика API
- Ошибки и исключения
- Использование ресурсов (CPU, Memory, Disk)

### 9.2 Логирование
- Структурированное логирование (JSON)
- Разные уровни логирования (DEBUG, INFO, WARN, ERROR)
- Централизованное хранилище логов
- Алерты при критических ошибках

## 10. Развертывание

### 10.1 Окружение
- **Development**: Локальная машина с Docker
- **Staging**: Тестовое окружение перед production
- **Production**: Облачное окружение (AWS/GCP/Azure)

### 10.2 CI/CD Pipeline
- Автоматическое тестирование при каждом commit
- Сборка Docker образов
- Развертывание на staging при merge в develop
- Развертывание на production при merge в main
