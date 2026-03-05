import Database from 'better-sqlite3';
import bcryptjs from 'bcryptjs';

const db = new Database('./artbank.db');

console.log('🔐 Verifying bank user passwords...\n');

const testPassword = 'bank123456';

const bankUsers = db.prepare(`
  SELECT id, email, name, password 
  FROM users 
  WHERE role = 'bank'
`).all();

for (const user of bankUsers) {
  const isValid = await bcryptjs.compare(testPassword, user.password);
  console.log(`${user.email}: ${isValid ? '✅ Password OK' : '❌ Password INVALID'}`);
}

db.close();
