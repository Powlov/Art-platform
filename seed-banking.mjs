import Database from 'better-sqlite3';
import bcryptjs from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const db = new Database(path.join(__dirname, 'artbank.db'));

async function seedBanking() {
  console.log('🌱 Seeding banking data...\n');

  const banks = [
    { email: 'bank@sberbank.ru', name: 'Сбербанк', code: 'SBERBANK', legal: 'ПАО Сбербанк', lic: 'БИК 044525225' },
    { email: 'bank@vtb.ru', name: 'ВТБ', code: 'VTB', legal: 'ПАО ВТБ', lic: 'БИК 044525187' },
    { email: 'bank@alfabank.ru', name: 'Альфа-Банк', code: 'ALFABANK', legal: 'АО Альфа-Банк', lic: 'БИК 044525593' },
    { email: 'bank@tinkoff.ru', name: 'Тинькофф Банк', code: 'TINKOFF', legal: 'АО Тинькофф Банк', lic: 'БИК 044525974' }
  ];

  console.log('📦 Creating bank users and partners...');
  const bankPartnerIds = [];

for (const bank of banks) {
  // Check/create user
  let user = db.prepare('SELECT * FROM users WHERE email = ?').get(bank.email);
  let userId;

  if (!user) {
    // Hash password using bcrypt
    const hashedPassword = await bcryptjs.hash('bank123456', 10);
    const r = db.prepare(`INSERT INTO users (email, name, role, password, username, createdAt, updatedAt, lastSignedIn) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(bank.email, bank.name, 'bank', hashedPassword, bank.code.toLowerCase(), Date.now(), Date.now(), Date.now());
    userId = r.lastInsertRowid;
    console.log(`  ✅ Created user: ${bank.name} (ID: ${userId})`);
  } else {
    userId = user.id;
    // Update existing user with hashed password
    const hashedPassword = await bcryptjs.hash('bank123456', 10);
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedPassword, userId);
    console.log(`  ✅ Updated password for: ${bank.name} (ID: ${userId})`);
  }

  // Check/create partner
  let partner = db.prepare('SELECT * FROM bank_partners WHERE bankCode = ?').get(bank.code);

  if (!partner) {
    const r = db.prepare(`INSERT INTO bank_partners (userId, bankCode, bankName, legalName, licenseNumber, contactEmail, apiKey, webhookUrl, connectionStatus, totalLoanVolume, activeLoans, avgLTV, settings, lastSyncAt, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
      userId, bank.code, bank.name, bank.legal, bank.lic, bank.email,
      `${bank.code.toLowerCase()}_${Math.random().toString(36).substring(2, 15)}`,
      `https://api.${bank.code.toLowerCase()}.ru/webhooks/artbank`, 'connected',
      0, 0, 0, JSON.stringify({ maxLTV: 70, minArtworkValue: 1000000, interestRates: { low: 8.5, medium: 10.5, high: 12.5 }, valuationFrequencyDays: 30 }),
      Date.now(), Date.now(), Date.now()
    );
    bankPartnerIds.push(r.lastInsertRowid);
    console.log(`  ✅ Created partner: ${bank.name} (ID: ${r.lastInsertRowid})`);
  } else {
    bankPartnerIds.push(partner.id);
    console.log(`  ℹ️  Partner exists: ${bank.name} (ID: ${partner.id})`);
  }
}

console.log('\n💰 Creating loans...');
const artworks = db.prepare('SELECT * FROM artworks LIMIT 10').all();

if (artworks.length === 0) {
  console.log('  ⚠️  No artworks found. Skipping loans.');
} else {
  const loanData = [
    { artwork: 0, bank: 0, amount: 11500000, value: 17594700, rate: 8.5, term: 24 },
    { artwork: 1, bank: 1, amount: 8200000, value: 12850000, rate: 9.2, term: 18 },
    { artwork: 2, bank: 0, amount: 15000000, value: 22500000, rate: 8.8, term: 36 },
    { artwork: 3, bank: 2, amount: 6500000, value: 9800000, rate: 10.1, term: 12 },
    { artwork: 4, bank: 1, amount: 19000000, value: 28500000, rate: 9.5, term: 24 },
    { artwork: 5, bank: 3, amount: 4200000, value: 6500000, rate: 11.2, term: 12 },
    { artwork: 6, bank: 0, amount: 12800000, value: 19200000, rate: 8.9, term: 30 },
    { artwork: 7, bank: 2, amount: 7600000, value: 11400000, rate: 9.8, term: 18 },
    { artwork: 8, bank: 1, amount: 22000000, value: 32500000, rate: 9.3, term: 36 },
    { artwork: 9, bank: 3, amount: 9500000, value: 14250000, rate: 10.5, term: 24 },
  ];

  for (let i = 0; i < Math.min(loanData.length, artworks.length); i++) {
    const loan = loanData[i];
    const artwork = artworks[loan.artwork];
    if (!artwork || !bankPartnerIds[loan.bank]) continue;

    const ltv = (loan.amount / loan.value) * 100;
    const loanId = `LOAN-${String(i + 1).padStart(3, '0')}`;
    const now = Date.now();
    const risk = ltv < 60 ? 'low' : ltv < 70 ? 'medium' : 'high';

    const existing = db.prepare('SELECT * FROM banking_loans WHERE loanId = ?').get(loanId);

    if (!existing) {
      const r = db.prepare(`INSERT INTO banking_loans (loanId, bankPartnerId, borrowerId, artworkId, artworkValue, loanAmount, ltv, currentLTV, interestRate, termMonths, status, marginCallThreshold, riskLevel, lastValuationDate, nextValuationDate, valuationFrequencyDays, approvedAt, disbursedAt, maturityDate, notes, metadata, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
        loanId, bankPartnerIds[loan.bank], artwork.artistId, artwork.id, loan.value, loan.amount, ltv, ltv, loan.rate, loan.term,
        'active', 80, risk, now, now + 30 * 24 * 60 * 60 * 1000, 30, now - 60 * 24 * 60 * 60 * 1000, now - 50 * 24 * 60 * 60 * 1000,
        now + loan.term * 30 * 24 * 60 * 60 * 1000, 'Demo loan', JSON.stringify({ source: 'seed' }), now, now
      );

      db.prepare(`INSERT INTO loan_valuations (loanId, artworkId, valuationAmount, valuationMethod, confidence, previousLTV, newLTV, notes, metadata, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
        r.lastInsertRowid, artwork.id, loan.value, 'ml_engine', 85 + Math.random() * 10, null, ltv, 'Initial ML valuation',
        JSON.stringify({ model: 'ml_pricing_v2.5', factors: ['market_demand', 'artist_reputation', 'historical_sales'] }), now
      );

      console.log(`  ✅ Loan ${loanId} - ${banks[loan.bank].name} - ${(loan.amount / 1000000).toFixed(1)}M RUB`);
    } else {
      console.log(`  ℹ️  Loan ${loanId} exists`);
    }
  }
}

  console.log('\n✅ Banking data seeded!');
  console.log('\n📊 Summary:');
  console.log(`  - Bank partners: ${bankPartnerIds.length}`);
  console.log(`  - Sample loans: 8`);
  console.log('\n🔐 Login credentials:');
  banks.forEach(b => console.log(`  ${b.email} / bank123456`));

  db.close();
}

// Run the async function
seedBanking().catch(err => {
  console.error('❌ Error seeding banking data:', err);
  db.close();
  process.exit(1);
});
