import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "..", "artbank.db");
console.log("[Database Init] Creating database at:", dbPath);

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

console.log("[Database Init] Creating tables...");

// Users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    openId TEXT UNIQUE,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    username TEXT UNIQUE,
    avatar TEXT,
    bio TEXT,
    loginMethod TEXT DEFAULT 'email',
    role TEXT DEFAULT 'user' NOT NULL CHECK(role IN ('user', 'admin', 'artist', 'collector', 'gallery', 'partner', 'curator', 'consultant')),
    privacyShowName INTEGER DEFAULT 1,
    privacyShowAvatar INTEGER DEFAULT 1,
    privacyShowBio INTEGER DEFAULT 1,
    privacyShowCollection INTEGER DEFAULT 1,
    privacyShowBlog INTEGER DEFAULT 1,
    privacyAllowMessages INTEGER DEFAULT 1,
    createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
    updatedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
    lastSignedIn INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
  );
`);

// Artworks table
db.exec(`
  CREATE TABLE IF NOT EXISTS artworks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    artistId INTEGER NOT NULL,
    galleryId INTEGER,
    year INTEGER,
    technique TEXT,
    dimensions TEXT,
    medium TEXT,
    genre TEXT,
    basePrice REAL,
    currentPrice REAL,
    imageUrl TEXT,
    status TEXT DEFAULT 'available' CHECK(status IN ('available', 'sold', 'auction', 'unavailable')),
    blockchainVerified INTEGER DEFAULT 0,
    blockchainHash TEXT,
    ipfsHash TEXT,
    uniqueId TEXT UNIQUE,
    qrCode TEXT,
    createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
    updatedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
  );
`);

// Artists table
db.exec(`
  CREATE TABLE IF NOT EXISTS artists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    bio TEXT,
    profileImage TEXT,
    website TEXT,
    socialMedia TEXT,
    followers INTEGER DEFAULT 0,
    totalSales INTEGER DEFAULT 0,
    totalRevenue REAL DEFAULT 0,
    createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
    updatedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
  );
`);

// Galleries table
db.exec(`
  CREATE TABLE IF NOT EXISTS galleries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    logo TEXT,
    members INTEGER DEFAULT 0,
    createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
    updatedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
  );
`);

// Collectors table
db.exec(`
  CREATE TABLE IF NOT EXISTS collectors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    bio TEXT,
    profileImage TEXT,
    portfolioValue REAL DEFAULT 0,
    artworksCount INTEGER DEFAULT 0,
    createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
    updatedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
  );
`);

// Auctions table
db.exec(`
  CREATE TABLE IF NOT EXISTS auctions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    artworkId INTEGER NOT NULL,
    startPrice REAL NOT NULL,
    currentBid REAL,
    highestBidderId INTEGER,
    startTime INTEGER NOT NULL,
    endTime INTEGER NOT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'active', 'completed', 'cancelled')),
    bidsCount INTEGER DEFAULT 0,
    createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
    updatedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
  );
`);

// Bids table
db.exec(`
  CREATE TABLE IF NOT EXISTS bids (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    auctionId INTEGER NOT NULL,
    bidderId INTEGER NOT NULL,
    amount REAL NOT NULL,
    timestamp INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
  );
`);

// Transactions table
db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    artworkId INTEGER NOT NULL,
    sellerId INTEGER NOT NULL,
    buyerId INTEGER NOT NULL,
    amount REAL NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('sale', 'auction', 'transfer')),
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed', 'cancelled')),
    transactionHash TEXT,
    createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
    updatedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
  );
`);

// Wishlists table
db.exec(`
  CREATE TABLE IF NOT EXISTS wishlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    artworkId INTEGER NOT NULL,
    createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
  );
`);

// News table
db.exec(`
  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('artwork', 'artist', 'style', 'market', 'general')),
    relatedArtworkId INTEGER,
    relatedArtistId INTEGER,
    source TEXT,
    imageUrl TEXT,
    createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
    updatedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
  );
`);

// Messages table
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    senderId INTEGER NOT NULL,
    recipientId INTEGER NOT NULL,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'text' CHECK(type IN ('text', 'file', 'artwork_link')),
    fileUrl TEXT,
    artworkId INTEGER,
    isRead INTEGER DEFAULT 0,
    createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
  );
`);

// Message Requests table
db.exec(`
  CREATE TABLE IF NOT EXISTS messageRequests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    senderId INTEGER NOT NULL,
    recipientId INTEGER NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'rejected')),
    createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
    updatedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
  );
`);

// Notifications table
db.exec(`
  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('message_request', 'message', 'artwork_sold', 'auction_bid', 'news', 'follow')),
    title TEXT NOT NULL,
    content TEXT,
    relatedUserId INTEGER,
    relatedArtworkId INTEGER,
    isRead INTEGER DEFAULT 0,
    createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
  );
`);

console.log("[Database Init] Tables created successfully!");

db.close();
console.log("[Database Init] Database initialized!");
