import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';

console.log('📦 Applying wallet system migration...');

const db = new Database('./artbank.db');
db.pragma('foreign_keys = ON');

try {
  const migrationSQL = readFileSync(
    join(process.cwd(), 'migrations/0003_wallet_system.sql'),
    'utf-8'
  );

  // Execute entire migration as one transaction
  db.exec(migrationSQL);

  // Verify tables exist
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('wallets', 'wallet_transactions', 'payment_sessions')").all();
  
  console.log('✅ Migration applied successfully');
  console.log('📊 Created tables:', tables.map(t => t.name).join(', '));

  // Create default wallets for existing users
  const users = db.prepare('SELECT id FROM users').all();
  const insertWallet = db.prepare(`
    INSERT OR IGNORE INTO wallets (user_id, balance, currency, status)
    VALUES (?, 0.0, 'USD', 'active')
  `);

  let walletsCreated = 0;
  for (const user of users) {
    const result = insertWallet.run(user.id);
    if (result.changes > 0) walletsCreated++;
  }

  console.log(`✅ Created ${walletsCreated} wallets for existing users`);

} catch (error) {
  console.error('❌ Migration failed:', error);
  throw error;
} finally {
  db.close();
}
