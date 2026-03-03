-- Fix FOREIGN KEY in bank_partners table

-- Step 1: Rename old table
ALTER TABLE bank_partners RENAME TO bank_partners_old;

-- Step 2: Create new table with correct FK
CREATE TABLE bank_partners (
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

-- Step 3: Copy data
INSERT INTO bank_partners SELECT * FROM bank_partners_old;

-- Step 4: Drop old table
DROP TABLE bank_partners_old;

-- Step 5: Recreate indexes
CREATE INDEX IF NOT EXISTS idx_bank_partners_userId ON bank_partners(userId);
CREATE INDEX IF NOT EXISTS idx_bank_partners_bankCode ON bank_partners(bankCode);
CREATE INDEX IF NOT EXISTS idx_bank_partners_connectionStatus ON bank_partners(connectionStatus);
