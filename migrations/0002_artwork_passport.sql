-- Artwork Passport Table
-- Stores unique digital passport data for each artwork
-- Includes QR code, blockchain verification, and provenance tracking

CREATE TABLE IF NOT EXISTS artwork_passport (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  artwork_id INTEGER NOT NULL UNIQUE,
  certificate_id TEXT UNIQUE NOT NULL,
  issuance_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  qr_code_data TEXT NOT NULL,
  qr_code_url TEXT,
  blockchain_verified BOOLEAN DEFAULT FALSE,
  blockchain_network TEXT,
  token_id TEXT,
  contract_address TEXT,
  ipfs_hash TEXT,
  provenance_history TEXT,
  authenticity_verified BOOLEAN DEFAULT FALSE,
  verification_date DATETIME,
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE
);
