-- Migration: Update users role to include 'bank'
-- SQLite doesn't support ALTER TABLE ... MODIFY COLUMN, so we need to recreate the table

-- Step 1: Rename old table
ALTER TABLE users RENAME TO users_old;

-- Step 2: Create new users table with updated role constraint
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  openId TEXT UNIQUE,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT,
  username TEXT,
  avatar TEXT,
  bio TEXT,
  loginMethod TEXT DEFAULT 'email',
  role TEXT DEFAULT 'user' NOT NULL CHECK(role IN ('user', 'admin', 'artist', 'collector', 'gallery', 'partner', 'curator', 'consultant', 'bank')),
  privacyShowName INTEGER DEFAULT 1,
  privacyShowAvatar INTEGER DEFAULT 1,
  privacyShowBio INTEGER DEFAULT 1,
  privacyShowCollection INTEGER DEFAULT 1,
  privacyShowBlog INTEGER DEFAULT 1,
  privacyAllowMessages INTEGER DEFAULT 1,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,
  lastSignedIn INTEGER NOT NULL
);

-- Step 3: Copy data from old table
INSERT INTO users SELECT * FROM users_old;

-- Step 4: Drop old table
DROP TABLE users_old;

-- Step 5: Recreate indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_openId ON users(openId);
