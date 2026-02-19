import { readFileSync } from 'fs';
import Database from 'better-sqlite3';

async function applyMigration() {
  try {
    console.log('📦 Applying artwork_passport migration...');
    
    // Use better-sqlite3 directly for migrations
    const db = new Database('./artbank.db');
    
    // Read migration file
    const migrationSQL = readFileSync('./migrations/0002_artwork_passport.sql', 'utf-8');
    
    // Execute the CREATE TABLE statement
    db.exec(migrationSQL);
    
    console.log('✅ Migration applied successfully!');
    console.log('📋 Created table: artwork_passport');
    
    // Verify table was created
    const result = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='artwork_passport'`).get();
    if (result) {
      console.log('✅ Table verified: artwork_passport exists');
    }
    
    db.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

applyMigration();
