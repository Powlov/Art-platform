# Changelog - ART BANK Platform v3.6

## [v3.6.0] - 2026-02-25

### 🎨 Major UI Enhancements

#### **MLValuationCalculator Component**
- **Интерактивная форма расчёта Fair Value** (24 KB, 700+ строк)
  - Слайдеры для параметров: artist reputation, market demand, condition score
  - Динамическое управление событиями (ΔVᵢ) с кнопками добавить/удалить
  - Real-time интеграция с Python ML service (port 5001)
  - Visual breakdown результатов: factors, event deltas, risk multiplier
  - Progress bars для confidence scores
  - Валидация форм с user-friendly сообщениями об ошибках
  - Responsive design (Tailwind CSS)

**Формула расчёта:**
\`\`\`
P = (V₀ + ΣΔVᵢ) × (1 + R_f + R_a + R_m + R_c)
\`\`\`

**Параметры:**
- Artist Reputation (0-100%)
- Market Demand (0-100%)
- Condition Score (0-100%)
- Historical Sales Count
- Exhibition Count
- Provenance Verified (checkbox)

**События (ΔVᵢ):**
- Type: exhibition, award, sale, restoration, authentication
- Impacts: artist, segment, collector (0-100%)
- Direct sale flag (C_direct = 0.03)
- Description & timestamp

**Результат:**
- Base Value → Fair Value (с процентом изменения)
- Confidence Score (30-95%)
- Trend indicator (up ↗ / down ↘ / stable →)
- Total Delta (ΣΔVᵢ)
- Risk Multiplier (×1.xxx)
- Факторы с весами и описаниями
- Event deltas по каждому событию

#### **GraphTrustProvenanceViewer Component**
- **Визуализация Provenance Chain** (16 KB, 500+ строк)
  - Поиск по artwork ID
  - Timeline цепочки владения (artist → gallery → collector)
  - Trust Score Analysis:
    - Base Score: 85
    - Verification Bonus: +10
    - Connection Bonus: +0.5/connection (max +10)
    - Network Trust Bonus: +5% avg
  - Levels: Excellent (95-100), Very Good (90-94), Good (85-89), Fair (75-84), Low (<75)
  - Node type icons: artist 👤, gallery 🏛️, collector 👤, artwork 📦
  - Verified status с CheckCircle ✓
  - Edge labels (аутентификация, выставка, продажа, владение)
  - Анимированные переходы между узлами (framer-motion)
  - Итоговый Trust Score цепи

**Mock Data (готово для API):**
- artwork-001: Василий Кандинский "Композиция VIII"
- Chain: Artist (1923) → Gallery (1924) → Collector (2020)
- Trust Score: 96.5 (Excellent)

### 📊 Updated TransactionLedCore Page
- Интеграция MLValuationCalculator в "ml-valuation" tab
- Интеграция GraphTrustProvenanceViewer в "graph-trust" tab
- Сохранены исторические ML valuations
- Импорты новых компонентов

### 🎨 Design System
- **Color Palette:**
  - Purple: #7C3AED (primary ML)
  - Blue: #3B82F6 (Graph Trust)
  - Green: #10B981 (success, verified)
  - Orange: #F97316 (risk, warnings)
- **Components:**
  - Badges для статусов (event types, trust levels)
  - Progress bars (confidence, weights)
  - Sliders (Shadcn UI)
  - Cards с hover effects
  - Animated transitions (framer-motion)

### 🔧 Technical Details
- **Stack:** React 18, TypeScript, Tailwind CSS, Shadcn UI
- **State Management:** React hooks (useState)
- **Animations:** framer-motion
- **Validation:** Client-side form validation
- **Error Handling:** Try-catch с fallback messaging
- **API Integration:** Fetch API → Python ML service (localhost:5001)

### 📦 Files Changed
1. `client/src/components/MLValuationCalculator.tsx` (24 KB, new)
2. `client/src/components/GraphTrustProvenanceViewer.tsx` (16 KB, new)
3. `client/src/pages/TransactionLedCore.tsx` (updated imports, tab integration)

### 🚀 Deployment
- Frontend: Cloudflare Pages
- Backend: Node.js/Express + Python/Flask (dual services via PM2)
- Production URL: https://3000-iy4dn2rimxvzecagspuih-3844e1b6.sandbox.novita.ai
- GitHub: https://github.com/Powlov/Art-platform

### 📈 Performance
- Components lazy-load via React.lazy
- Animations optimized (GPU-accelerated)
- Form debouncing на slider changes (optional)
- API calls мemoized (optional caching)

### 🐛 Bug Fixes
- None (new features only)

### 📚 Documentation
- README_ML_PRICING_ENGINE.md (comprehensive guide)
- CHANGELOG.md (this file)

---

## [v3.5.0] - 2026-02-25

### 🧠 ML Pricing Engine
- Python/Flask микросервис для расчёта Fair Value
- Формула: P = (V₀ + ΣΔVᵢ) × (1 + R_f + R_a + R_m + R_c)
- 50+ параметров оценки
- Динамическая корректировка рисков
- API endpoints: /health, /api/valuation/calculate, /api/valuation/batch
- Tested: Кандинский "Композиция VIII" → 15M → 17.6M RUB (+17.3%)

### 🕸️ Neo4j Graph Trust (Emulated)
- In-memory граф-база для sandbox
- 10 sample nodes (artists, galleries, artworks, collectors)
- Trust Score calculation
- Provenance tracking
- Fraud detection (wash trading, rapid trades)

### 🔌 tRPC Integration
- Endpoint: core.calculateMLFairValue
- Fallback logic для ML service unavailable
- Type-safe API

### ⚙️ PM2 Dual Services
- art-bank-server (Node.js, port 3000)
- ml-pricing-engine (Python, port 5001)
- Auto-restart, health monitoring

### 📖 Documentation
- README_ML_PRICING_ENGINE.md (12 KB)
- Архитектура, формулы, API reference, deployment guide

---

## Previous Versions
- v3.4.0: Transaction-Led Core initial release
- v3.3.0: Banking API Bridge, LTV calculator
- v3.2.0: Anti-Fraud Guardian
- v3.1.0: Asset Management Module
- v3.0.0: Core platform architecture

---

**Total commits:** 9  
**Latest:** 0174a8e - "feat: Add interactive UI components for ML Valuation & Graph Trust"  
**GitHub:** https://github.com/Powlov/Art-platform
