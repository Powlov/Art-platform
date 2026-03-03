-- Migration: Banking System Tables
-- Created: 2026-03-03

-- Update users role enum to include 'bank'
-- SQLite doesn't support ALTER TYPE, so we handle this in code

-- Create Bank Partners table
CREATE TABLE IF NOT EXISTS bank_partners (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  bankCode TEXT UNIQUE NOT NULL,
  bankName TEXT NOT NULL,
  legalName TEXT NOT NULL,
  licenseNumber TEXT,
  registrationNumber TEXT,
  
  contactPerson TEXT,
  contactEmail TEXT,
  contactPhone TEXT,
  address TEXT,
  
  apiKey TEXT,
  webhookUrl TEXT,
  connectionStatus TEXT DEFAULT 'pending' CHECK(connectionStatus IN ('pending', 'connected', 'suspended', 'disconnected')),
  
  totalLoanVolume REAL DEFAULT 0,
  activeLoans INTEGER DEFAULT 0,
  avgLTV REAL DEFAULT 0,
  
  settings TEXT,
  metadata TEXT,
  
  lastSyncAt INTEGER,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,
  
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- Create Banking Loans table
CREATE TABLE IF NOT EXISTS banking_loans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  loanId TEXT UNIQUE NOT NULL,
  
  bankPartnerId INTEGER NOT NULL,
  borrowerId INTEGER NOT NULL,
  artworkId INTEGER NOT NULL,
  artworkValue REAL NOT NULL,
  
  loanAmount REAL NOT NULL,
  ltv REAL NOT NULL,
  currentLTV REAL NOT NULL,
  interestRate REAL NOT NULL,
  termMonths INTEGER NOT NULL,
  
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'active', 'paid', 'defaulted', 'margin_call')),
  
  marginCallThreshold REAL DEFAULT 80,
  riskLevel TEXT DEFAULT 'medium' CHECK(riskLevel IN ('low', 'medium', 'high', 'critical')),
  
  lastValuationDate INTEGER,
  nextValuationDate INTEGER,
  valuationFrequencyDays INTEGER DEFAULT 30,
  
  approvedAt INTEGER,
  disbursedAt INTEGER,
  maturityDate INTEGER,
  paidAt INTEGER,
  
  notes TEXT,
  metadata TEXT,
  
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,
  
  FOREIGN KEY (bankPartnerId) REFERENCES bank_partners(id),
  FOREIGN KEY (borrowerId) REFERENCES users(id),
  FOREIGN KEY (artworkId) REFERENCES artworks(id)
);

-- Create Loan Valuations History table
CREATE TABLE IF NOT EXISTS loan_valuations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  loanId INTEGER NOT NULL,
  artworkId INTEGER NOT NULL,
  
  valuationAmount REAL NOT NULL,
  valuationMethod TEXT NOT NULL CHECK(valuationMethod IN ('ml_engine', 'expert', 'market', 'manual')),
  confidence REAL,
  
  previousLTV REAL,
  newLTV REAL NOT NULL,
  
  valuedBy INTEGER,
  notes TEXT,
  metadata TEXT,
  
  createdAt INTEGER NOT NULL,
  
  FOREIGN KEY (loanId) REFERENCES banking_loans(id),
  FOREIGN KEY (artworkId) REFERENCES artworks(id),
  FOREIGN KEY (valuedBy) REFERENCES users(id)
);

-- Create Bank API Logs table
CREATE TABLE IF NOT EXISTS bank_api_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bankPartnerId INTEGER NOT NULL,
  
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL CHECK(method IN ('GET', 'POST', 'PUT', 'DELETE')),
  
  requestPayload TEXT,
  responsePayload TEXT,
  statusCode INTEGER,
  
  responseTime INTEGER,
  errorMessage TEXT,
  
  ipAddress TEXT,
  userAgent TEXT,
  
  createdAt INTEGER NOT NULL,
  
  FOREIGN KEY (bankPartnerId) REFERENCES bank_partners(id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bank_partners_userId ON bank_partners(userId);
CREATE INDEX IF NOT EXISTS idx_bank_partners_bankCode ON bank_partners(bankCode);
CREATE INDEX IF NOT EXISTS idx_bank_partners_connectionStatus ON bank_partners(connectionStatus);

CREATE INDEX IF NOT EXISTS idx_banking_loans_loanId ON banking_loans(loanId);
CREATE INDEX IF NOT EXISTS idx_banking_loans_bankPartnerId ON banking_loans(bankPartnerId);
CREATE INDEX IF NOT EXISTS idx_banking_loans_borrowerId ON banking_loans(borrowerId);
CREATE INDEX IF NOT EXISTS idx_banking_loans_artworkId ON banking_loans(artworkId);
CREATE INDEX IF NOT EXISTS idx_banking_loans_status ON banking_loans(status);
CREATE INDEX IF NOT EXISTS idx_banking_loans_riskLevel ON banking_loans(riskLevel);

CREATE INDEX IF NOT EXISTS idx_loan_valuations_loanId ON loan_valuations(loanId);
CREATE INDEX IF NOT EXISTS idx_loan_valuations_artworkId ON loan_valuations(artworkId);
CREATE INDEX IF NOT EXISTS idx_loan_valuations_createdAt ON loan_valuations(createdAt);

CREATE INDEX IF NOT EXISTS idx_bank_api_logs_bankPartnerId ON bank_api_logs(bankPartnerId);
CREATE INDEX IF NOT EXISTS idx_bank_api_logs_createdAt ON bank_api_logs(createdAt);
