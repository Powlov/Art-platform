import Database from 'better-sqlite3';

const db = new Database('./artbank.db');

console.log('🔍 Checking bank users...\n');

const bankUsers = db.prepare(`
  SELECT id, email, name, role, password 
  FROM users 
  WHERE role = 'bank'
`).all();

console.log(`Found ${bankUsers.length} bank users:\n`);
bankUsers.forEach(user => {
  console.log(`ID: ${user.id}`);
  console.log(`Email: ${user.email}`);
  console.log(`Name: ${user.name}`);
  console.log(`Has Password: ${user.password ? 'YES ✅' : 'NO ❌'}`);
  console.log('---');
});

db.close();
