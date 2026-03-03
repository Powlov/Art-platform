-- Fix FOREIGN KEY in banking_loans and loan_valuations tables

PRAGMA foreign_keys=OFF;

-- Fix banking_loans
ALTER TABLE banking_loans RENAME TO banking_loans_old;

CREATE TABLE banking_loans (
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

INSERT INTO banking_loans SELECT * FROM banking_loans_old;
DROP TABLE banking_loans_old;

CREATE INDEX IF NOT EXISTS idx_banking_loans_loanId ON banking_loans(loanId);
CREATE INDEX IF NOT EXISTS idx_banking_loans_bankPartnerId ON banking_loans(bankPartnerId);
CREATE INDEX IF NOT EXISTS idx_banking_loans_borrowerId ON banking_loans(borrowerId);
CREATE INDEX IF NOT EXISTS idx_banking_loans_artworkId ON banking_loans(artworkId);
CREATE INDEX IF NOT EXISTS idx_banking_loans_status ON banking_loans(status);
CREATE INDEX IF NOT EXISTS idx_banking_loans_riskLevel ON banking_loans(riskLevel);

-- Fix loan_valuations
ALTER TABLE loan_valuations RENAME TO loan_valuations_old;

CREATE TABLE loan_valuations (
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

INSERT INTO loan_valuations SELECT * FROM loan_valuations_old;
DROP TABLE loan_valuations_old;

CREATE INDEX IF NOT EXISTS idx_loan_valuations_loanId ON loan_valuations(loanId);
CREATE INDEX IF NOT EXISTS idx_loan_valuations_artworkId ON loan_valuations(artworkId);
CREATE INDEX IF NOT EXISTS idx_loan_valuations_createdAt ON loan_valuations(createdAt);

PRAGMA foreign_keys=ON;
