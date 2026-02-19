import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('./artbank.db');

console.log('Applying moderation system migration...');

try {
  const migrationSQL = fs.readFileSync(
    path.join(__dirname, '../migrations/0004_moderation_system.sql'),
    'utf-8'
  );

  // Split by semicolon and execute each statement
  const statements = migrationSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--'));

  statements.forEach((statement, index) => {
    try {
      db.prepare(statement).run();
      console.log(`✅ Statement ${index + 1} executed successfully`);
    } catch (error: any) {
      // Ignore "duplicate column" errors (migration already applied)
      if (!error.message.includes('duplicate column')) {
        console.error(`❌ Statement ${index + 1} failed:`, error.message);
        throw error;
      } else {
        console.log(`⚠️  Statement ${index + 1} skipped (already applied)`);
      }
    }
  });

  // Verify the migration
  console.log('\n=== Verifying migration ===');
  const columns = db.prepare(`PRAGMA table_info(artworks)`).all();
  const hasModerationStatus = columns.some((col: any) => col.name === 'moderationStatus');
  
  const tables = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='moderation_history'`).all();
  const hasHistoryTable = tables.length > 0;

  console.log(`✅ moderationStatus column: ${hasModerationStatus ? 'EXISTS' : 'MISSING'}`);
  console.log(`✅ moderation_history table: ${hasHistoryTable ? 'EXISTS' : 'MISSING'}`);

  if (hasModerationStatus && hasHistoryTable) {
    console.log('\n✅ Migration completed successfully!');
  } else {
    console.error('\n❌ Migration incomplete!');
  }

  db.close();
} catch (error) {
  console.error('Migration failed:', error);
  db.close();
  process.exit(1);
}
