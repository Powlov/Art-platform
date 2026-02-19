-- Migration: Add moderation system
-- Created: 2026-01-24

-- Add moderation status to artworks
ALTER TABLE artworks ADD COLUMN moderationStatus TEXT DEFAULT 'pending';
ALTER TABLE artworks ADD COLUMN moderationNotes TEXT;
ALTER TABLE artworks ADD COLUMN moderatedBy INTEGER;
ALTER TABLE artworks ADD COLUMN moderatedAt INTEGER;
ALTER TABLE artworks ADD COLUMN submittedAt INTEGER;

-- Create moderation history table
CREATE TABLE IF NOT EXISTS moderation_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  artworkId INTEGER NOT NULL,
  previousStatus TEXT,
  newStatus TEXT NOT NULL,
  moderatorId INTEGER NOT NULL,
  notes TEXT,
  createdAt INTEGER DEFAULT (strftime('%s', 'now') * 1000),
  FOREIGN KEY (artworkId) REFERENCES artworks(id) ON DELETE CASCADE,
  FOREIGN KEY (moderatorId) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_moderation_history_artwork ON moderation_history(artworkId);
CREATE INDEX IF NOT EXISTS idx_moderation_history_moderator ON moderation_history(moderatorId);
CREATE INDEX IF NOT EXISTS idx_artworks_moderation_status ON artworks(moderationStatus);

-- Update existing artworks to have a default moderation status
UPDATE artworks SET moderationStatus = 'approved' WHERE moderationStatus IS NULL;
UPDATE artworks SET submittedAt = createdAt WHERE submittedAt IS NULL;
