-- Migration: Transaction-Led Core - Graph Trust & Asset Management
-- Description: Creates tables for Graph Trust nodes/edges and Asset Management
-- Date: 2026-02-22

-- =================================================
-- GRAPH TRUST MODULE
-- =================================================

-- Graph nodes: artists, galleries, artworks, collectors, transactions
CREATE TABLE IF NOT EXISTS graph_nodes (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK(type IN ('artist', 'gallery', 'artwork', 'collector', 'transaction')),
  name TEXT NOT NULL,
  digital_id TEXT UNIQUE NOT NULL,
  trust_score REAL DEFAULT 85.0,
  connections INTEGER DEFAULT 0,
  verified INTEGER DEFAULT 0, -- SQLite uses INTEGER for booleans
  metadata TEXT, -- JSON string
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Graph edges: relationships between nodes
CREATE TABLE IF NOT EXISTS graph_edges (
  id TEXT PRIMARY KEY,
  from_node TEXT NOT NULL,
  to_node TEXT NOT NULL,
  edge_type TEXT NOT NULL CHECK(edge_type IN ('ownership', 'exhibition', 'sale', 'authentication', 'provenance')),
  verified INTEGER DEFAULT 0,
  smart_contract TEXT,
  signatures TEXT, -- JSON array of signatures
  metadata TEXT, -- JSON string
  timestamp TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (from_node) REFERENCES graph_nodes(id),
  FOREIGN KEY (to_node) REFERENCES graph_nodes(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_graph_nodes_type ON graph_nodes(type);
CREATE INDEX IF NOT EXISTS idx_graph_nodes_verified ON graph_nodes(verified);
CREATE INDEX IF NOT EXISTS idx_graph_nodes_trust_score ON graph_nodes(trust_score DESC);
CREATE INDEX IF NOT EXISTS idx_graph_edges_from ON graph_edges(from_node);
CREATE INDEX IF NOT EXISTS idx_graph_edges_to ON graph_edges(to_node);
CREATE INDEX IF NOT EXISTS idx_graph_edges_type ON graph_edges(edge_type);

-- =================================================
-- ML-VALUATION ENGINE
-- =================================================

CREATE TABLE IF NOT EXISTS ml_valuations (
  id TEXT PRIMARY KEY,
  artwork_id TEXT NOT NULL,
  current_price REAL NOT NULL,
  fair_value REAL NOT NULL,
  confidence REAL NOT NULL,
  trend TEXT CHECK(trend IN ('up', 'down', 'stable')),
  parameters TEXT NOT NULL, -- JSON with 50+ parameters
  factors TEXT NOT NULL, -- JSON array of factors
  calculated_at TEXT DEFAULT (datetime('now')),
  next_update TEXT
);

CREATE INDEX IF NOT EXISTS idx_ml_valuations_artwork ON ml_valuations(artwork_id);
CREATE INDEX IF NOT EXISTS idx_ml_valuations_calculated ON ml_valuations(calculated_at DESC);

-- =================================================
-- ANTI-FRAUD MODULE
-- =================================================

CREATE TABLE IF NOT EXISTS fraud_alerts (
  id TEXT PRIMARY KEY,
  alert_type TEXT NOT NULL CHECK(alert_type IN ('wash_trading', 'price_manipulation', 'fake_provenance', 'anomaly', 'suspicious_pattern')),
  severity TEXT NOT NULL CHECK(severity IN ('critical', 'high', 'medium', 'low')),
  artwork_id TEXT,
  entity_ids TEXT NOT NULL, -- JSON array
  description TEXT NOT NULL,
  evidence TEXT NOT NULL, -- JSON array
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'investigating', 'resolved', 'false_positive')),
  assigned_to TEXT,
  resolution TEXT,
  timestamp TEXT DEFAULT (datetime('now')),
  resolved_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_fraud_alerts_type ON fraud_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_severity ON fraud_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_status ON fraud_alerts(status);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_artwork ON fraud_alerts(artwork_id);

-- =================================================
-- BANKING API BRIDGE
-- =================================================

CREATE TABLE IF NOT EXISTS banking_loans (
  loan_id TEXT PRIMARY KEY,
  bank_id TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  artwork_id TEXT NOT NULL,
  artwork_value REAL NOT NULL,
  loan_amount REAL NOT NULL,
  ltv REAL NOT NULL,
  current_ltv REAL NOT NULL,
  interest_rate REAL NOT NULL,
  term INTEGER NOT NULL, -- months
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'pending', 'defaulted', 'paid')),
  margin_call_threshold REAL DEFAULT 80.0,
  last_valuation TEXT DEFAULT (datetime('now')),
  next_valuation TEXT,
  risk_level TEXT DEFAULT 'low' CHECK(risk_level IN ('low', 'medium', 'high')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_banking_loans_bank ON banking_loans(bank_id);
CREATE INDEX IF NOT EXISTS idx_banking_loans_artwork ON banking_loans(artwork_id);
CREATE INDEX IF NOT EXISTS idx_banking_loans_status ON banking_loans(status);
CREATE INDEX IF NOT EXISTS idx_banking_loans_risk ON banking_loans(risk_level);

-- =================================================
-- ASSET MANAGEMENT & CUSTODY
-- =================================================

CREATE TABLE IF NOT EXISTS asset_custody (
  asset_id TEXT PRIMARY KEY,
  artwork_id TEXT NOT NULL,
  title TEXT NOT NULL,
  location_facility TEXT NOT NULL,
  location_address TEXT NOT NULL,
  location_room TEXT NOT NULL,
  location_coordinates TEXT, -- JSON: {lat, lng}
  temperature REAL,
  humidity REAL,
  light REAL,
  last_check TEXT DEFAULT (datetime('now')),
  insurance_policy TEXT NOT NULL,
  insurance_coverage REAL NOT NULL,
  insurance_provider TEXT NOT NULL,
  insurance_expires TEXT NOT NULL,
  value_optimization_strategy TEXT CHECK(value_optimization_strategy IN ('museum_exhibition', 'auction_house', 'gallery_display', 'storage')),
  value_optimization_expected_increase REAL,
  value_optimization_duration INTEGER,
  value_optimization_partner TEXT,
  status TEXT DEFAULT 'stored' CHECK(status IN ('stored', 'in_transit', 'on_display', 'being_authenticated')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_asset_custody_artwork ON asset_custody(artwork_id);
CREATE INDEX IF NOT EXISTS idx_asset_custody_status ON asset_custody(status);
CREATE INDEX IF NOT EXISTS idx_asset_custody_facility ON asset_custody(location_facility);

-- =================================================
-- SYSTEM METRICS (for monitoring)
-- =================================================

CREATE TABLE IF NOT EXISTS core_metrics (
  id TEXT PRIMARY KEY,
  module TEXT NOT NULL CHECK(module IN ('graph_trust', 'ml_valuation', 'anti_fraud', 'banking_api', 'asset_management')),
  metric_name TEXT NOT NULL,
  metric_value REAL NOT NULL,
  unit TEXT,
  timestamp TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_core_metrics_module ON core_metrics(module);
CREATE INDEX IF NOT EXISTS idx_core_metrics_timestamp ON core_metrics(timestamp DESC);

-- =================================================
-- SEED DATA
-- =================================================

-- Sample Graph Nodes
INSERT OR IGNORE INTO graph_nodes (id, type, name, digital_id, trust_score, connections, verified) VALUES
  ('artist-001', 'artist', 'Василий Кандинский', 'DID:ART:ARTIST:001', 98.5, 347, 1),
  ('gallery-001', 'gallery', 'Третьяковская галерея', 'DID:ART:GALLERY:001', 99.8, 1234, 1),
  ('artwork-001', 'artwork', 'Абстрактная композиция №7', 'DID:ART:ARTWORK:001', 95.2, 45, 1),
  ('collector-001', 'collector', 'Частная коллекция "Арт-Инвест"', 'DID:ART:COLLECTOR:001', 92.4, 189, 1);

-- Sample Graph Edges
INSERT OR IGNORE INTO graph_edges (id, from_node, to_node, edge_type, verified) VALUES
  ('edge-001', 'artist-001', 'artwork-001', 'ownership', 1),
  ('edge-002', 'artwork-001', 'gallery-001', 'exhibition', 1),
  ('edge-003', 'collector-001', 'artwork-001', 'ownership', 1);
