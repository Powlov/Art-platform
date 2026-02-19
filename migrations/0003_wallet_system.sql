-- Wallet System Migration
-- Creates tables for user wallets and transaction history

-- Wallets table
CREATE TABLE IF NOT EXISTS wallets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  balance REAL DEFAULT 0.0,
  currency TEXT DEFAULT 'USD',
  frozen_amount REAL DEFAULT 0.0,
  status TEXT CHECK(status IN ('active', 'frozen', 'closed')) DEFAULT 'active',
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Wallet transactions table
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  wallet_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  type TEXT CHECK(type IN ('deposit', 'withdrawal', 'purchase', 'sale', 'refund', 'fee', 'transfer_in', 'transfer_out', 'bid_lock', 'bid_unlock')) NOT NULL,
  amount REAL NOT NULL,
  balance_before REAL NOT NULL,
  balance_after REAL NOT NULL,
  status TEXT CHECK(status IN ('pending', 'completed', 'failed', 'cancelled')) DEFAULT 'pending',
  payment_method TEXT CHECK(payment_method IN ('stripe', 'yandex_kassa', 'crypto', 'bank_transfer', 'balance')) DEFAULT 'balance',
  payment_id TEXT,
  reference_id TEXT,
  reference_type TEXT,
  description TEXT,
  metadata TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  completed_at INTEGER,
  FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Payment sessions table (for Stripe/Yandex.Kassa checkout sessions)
CREATE TABLE IF NOT EXISTS payment_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  session_id TEXT UNIQUE NOT NULL,
  payment_provider TEXT CHECK(payment_provider IN ('stripe', 'yandex_kassa')) NOT NULL,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT CHECK(status IN ('created', 'pending', 'completed', 'expired', 'cancelled')) DEFAULT 'created',
  checkout_url TEXT,
  success_url TEXT,
  cancel_url TEXT,
  metadata TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  expires_at INTEGER,
  completed_at INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallets_status ON wallets(status);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id ON wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_type ON wallet_transactions(type);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_status ON wallet_transactions(status);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_payment_id ON wallet_transactions(payment_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created_at ON wallet_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_payment_sessions_user_id ON payment_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_sessions_session_id ON payment_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_payment_sessions_status ON payment_sessions(status);
CREATE INDEX IF NOT EXISTS idx_payment_sessions_created_at ON payment_sessions(created_at);
