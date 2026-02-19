import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { eq, and, or, desc } from "drizzle-orm";
import { 
  InsertUser, users, artworks, artists, galleries, collectors, auctions, 
  transactions, news, messages, wishlists, messageRequests, notifications,
  artworkPassports, wallets, walletTransactions, paymentMethods, paymentGatewayLogs,
  InsertArtwork, InsertArtist, InsertGallery, InsertCollector, InsertAuction, 
  InsertTransaction, InsertNews, InsertMessage, InsertWishlist, InsertMessageRequest,
  InsertNotification, InsertArtworkPassport, InsertWallet, InsertWalletTransaction,
  InsertPaymentMethod, InsertPaymentGatewayLog
} from "../drizzle/schema-sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let _db: ReturnType<typeof drizzle> | null = null;
let _sqlite: Database.Database | null = null;

export function getDb() {
  if (!_db) {
    try {
      const dbPath = path.join(__dirname, "..", "artbank.db");
      console.log("[Database] Connecting to SQLite at:", dbPath);
      _sqlite = new Database(dbPath);
      _sqlite.pragma("journal_mode = WAL");
      _db = drizzle(_sqlite);
      console.log("[Database] Connected successfully");
    } catch (error) {
      console.error("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ===== USERNAME FUNCTIONS =====
export function checkUsernameAvailable(username: string): boolean {
  const db = getDb();
  if (!db) return false;
  
  const result = db.select().from(users).where(eq(users.username, username)).all();
  return result.length === 0;
}

export function getUserByEmail(email: string) {
  const db = getDb();
  if (!db) return null;
  
  const result = db.select().from(users).where(eq(users.email, email)).all();
  return result[0] || null;
}

export function getUserByOpenId(openId: string) {
  const db = getDb();
  if (!db) return null;
  
  const result = db.select().from(users).where(eq(users.openId, openId)).all();
  return result[0] || null;
}

export function getUserByUsername(username: string) {
  const db = getDb();
  if (!db) return null;
  
  const result = db.select().from(users).where(eq(users.username, username)).all();
  return result[0] || null;
}

export function getUserById(id: number) {
  const db = getDb();
  if (!db) return null;
  
  const result = db.select().from(users).where(eq(users.id, id)).all();
  return result[0] || null;
}

export function updateUsername(userId: number, username: string) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  
  db.update(users).set({ username }).where(eq(users.id, userId)).run();
}

// ===== USER CREATION =====
export function createUser(data: InsertUser) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  
  const result = db.insert(users).values(data).run();
  return result.lastInsertRowid;
}

// ===== PRIVACY FUNCTIONS =====
export function updatePrivacySettings(userId: number, settings: {
  privacyShowName?: boolean;
  privacyShowAvatar?: boolean;
  privacyShowBio?: boolean;
  privacyShowCollection?: boolean;
  privacyShowBlog?: boolean;
  privacyAllowMessages?: boolean;
}) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  
  db.update(users).set(settings).where(eq(users.id, userId)).run();
}

export function getUserProfile(userId: number) {
  const db = getDb();
  if (!db) return null;
  
  const result = db.select().from(users).where(eq(users.id, userId)).all();
  return result[0] || null;
}

// ===== MESSENGER FUNCTIONS =====
export function getMessageRequests(userId: number) {
  const db = getDb();
  if (!db) return [];
  
  return db.select().from(messageRequests)
    .where(eq(messageRequests.recipientId, userId))
    .orderBy(desc(messageRequests.createdAt))
    .all();
}

export function createMessageRequest(senderId: number, recipientId: number, message: string) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  
  const data: InsertMessageRequest = {
    senderId,
    recipientId,
    message,
    status: "pending",
  };
  
  const result = db.insert(messageRequests).values(data).run();
  return result.lastInsertRowid;
}

export function acceptMessageRequest(requestId: number) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  
  db.update(messageRequests)
    .set({ status: "accepted" })
    .where(eq(messageRequests.id, requestId))
    .run();
}

export function rejectMessageRequest(requestId: number) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  
  db.update(messageRequests)
    .set({ status: "rejected" })
    .where(eq(messageRequests.id, requestId))
    .run();
}

export function getConversation(userId1: number, userId2: number) {
  const db = getDb();
  if (!db) return [];
  
  return db.select().from(messages)
    .where(
      or(
        and(eq(messages.senderId, userId1), eq(messages.recipientId, userId2)),
        and(eq(messages.senderId, userId2), eq(messages.recipientId, userId1))
      )
    )
    .orderBy(desc(messages.createdAt))
    .all();
}

export function getConversations(userId: number) {
  const db = getDb();
  if (!db) return [];
  
  return db.select().from(messages)
    .where(
      or(
        eq(messages.senderId, userId),
        eq(messages.recipientId, userId)
      )
    )
    .orderBy(desc(messages.createdAt))
    .all();
}

export function createMessage(senderId: number, recipientId: number, content: string, type: string = "text") {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  
  const data: InsertMessage = {
    senderId,
    recipientId,
    content,
    type: type as any,
    isRead: false,
  };
  
  const result = db.insert(messages).values(data).run();
  
  // Create notification
  createNotification(recipientId, "message", `New message from user ${senderId}`, `You have a new message`, senderId);
  
  return result.lastInsertRowid;
}

export function markMessageAsRead(messageId: number) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  
  db.update(messages).set({ isRead: true }).where(eq(messages.id, messageId)).run();
}

// ===== NOTIFICATION FUNCTIONS =====
export function getUserNotifications(userId: number) {
  const db = getDb();
  if (!db) return [];
  
  return db.select().from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .all();
}

export function createNotification(userId: number, type: string, title: string, content?: string, relatedUserId?: number, relatedArtworkId?: number) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  
  const data: InsertNotification = {
    userId,
    type: type as any,
    title,
    content,
    relatedUserId,
    relatedArtworkId,
  };
  
  return db.insert(notifications).values(data).run().lastInsertRowid;
}

export function markNotificationAsRead(notificationId: number) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  
  db.update(notifications).set({ isRead: true }).where(eq(notifications.id, notificationId)).run();
}

// ===== ARTWORK FUNCTIONS =====
export function getArtworks(limit: number = 20, offset: number = 0) {
  const db = getDb();
  if (!db) return [];
  
  return db.select().from(artworks).limit(limit).offset(offset).all();
}

export function getArtworkById(id: number) {
  const db = getDb();
  if (!db) return null;
  
  const result = db.select().from(artworks).where(eq(artworks.id, id)).all();
  return result[0] || null;
}

export function createArtwork(data: InsertArtwork) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(artworks).values(data).run().lastInsertRowid;
}

export function updateArtwork(id: number, data: Partial<InsertArtwork>) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(artworks).set(data).where(eq(artworks.id, id)).run();
}

// ============================================
// Artwork Passport Functions
// ============================================

export function createArtworkPassport(data: InsertArtworkPassport) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(artworkPassports).values(data).run().lastInsertRowid;
}

export function getArtworkPassport(artworkId: number) {
  const db = getDb();
  if (!db) return null;
  
  const result = db.select().from(artworkPassports).where(eq(artworkPassports.artworkId, artworkId)).all();
  return result[0] || null;
}

export function getArtworkPassportByCertificate(certificateId: string) {
  const db = getDb();
  if (!db) return null;
  
  const result = db.select().from(artworkPassports).where(eq(artworkPassports.certificateId, certificateId)).all();
  return result[0] || null;
}

export function updateArtworkPassport(artworkId: number, data: Partial<InsertArtworkPassport>) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(artworkPassports).set({
    ...data,
    lastUpdated: new Date()
  }).where(eq(artworkPassports.artworkId, artworkId)).run();
}

export function verifyArtworkPassport(artworkId: number) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(artworkPassports).set({
    authenticityVerified: true,
    verificationDate: new Date(),
    lastUpdated: new Date()
  }).where(eq(artworkPassports.artworkId, artworkId)).run();
}

export function getArtistByUserId(userId: number) {
  const db = getDb();
  if (!db) return null;
  
  const result = db.select().from(artists).where(eq(artists.userId, userId)).all();
  return result[0] || null;
}

export function createArtist(data: InsertArtist) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(artists).values(data).run().lastInsertRowid;
}

export function getGalleryByUserId(userId: number) {
  const db = getDb();
  if (!db) return null;
  
  const result = db.select().from(galleries).where(eq(galleries.userId, userId)).all();
  return result[0] || null;
}

export function createGallery(data: InsertGallery) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(galleries).values(data).run().lastInsertRowid;
}

export function getCollectorByUserId(userId: number) {
  const db = getDb();
  if (!db) return null;
  
  const result = db.select().from(collectors).where(eq(collectors.userId, userId)).all();
  return result[0] || null;
}

export function createCollector(data: InsertCollector) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(collectors).values(data).run().lastInsertRowid;
}

export function getActiveAuctions() {
  const db = getDb();
  if (!db) return [];
  
  return db.select().from(auctions).where(eq(auctions.status, "active")).all();
}

export function createAuction(data: InsertAuction) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(auctions).values(data).run().lastInsertRowid;
}

export function getTransactionsByUserId(userId: number, limit: number = 20) {
  const db = getDb();
  if (!db) return [];
  
  return db.select().from(transactions)
    .where(or(eq(transactions.sellerId, userId), eq(transactions.buyerId, userId)))
    .limit(limit)
    .all();
}

export function createTransaction(data: InsertTransaction) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(transactions).values(data).run().lastInsertRowid;
}

export function getNews(category?: string, limit: number = 20) {
  const db = getDb();
  if (!db) return [];
  
  if (category) {
    return db.select().from(news).where(eq(news.category, category as any)).limit(limit).all();
  }
  
  return db.select().from(news).limit(limit).all();
}

export function createNews(data: InsertNews) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(news).values(data).run().lastInsertRowid;
}

export function getMessages(userId: number, limit: number = 50) {
  const db = getDb();
  if (!db) return [];
  
  return db.select().from(messages)
    .where(or(eq(messages.senderId, userId), eq(messages.recipientId, userId)))
    .limit(limit)
    .all();
}

export function getWishlist(userId: number) {
  const db = getDb();
  if (!db) return [];
  
  return db.select().from(wishlists).where(eq(wishlists.userId, userId)).all();
}

export function addToWishlist(userId: number, artworkId: number) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  
  const data: InsertWishlist = { userId, artworkId };
  return db.insert(wishlists).values(data).run().lastInsertRowid;
}

export function removeFromWishlist(userId: number, artworkId: number) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  
  db.delete(wishlists)
    .where(and(eq(wishlists.userId, userId), eq(wishlists.artworkId, artworkId)))
    .run();
}

// ===== WALLET FUNCTIONS =====

/**
 * Get user's wallet
 */
export function getWalletByUserId(userId: number) {
  const db = getDb();
  if (!db) return null;
  
  return db.select().from(wallets).where(eq(wallets.userId, userId)).get();
}

/**
 * Create wallet for user
 */
export function createWallet(data: InsertWallet) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(wallets).values(data).run().lastInsertRowid;
}

/**
 * Update wallet balance
 */
export function updateWalletBalance(walletId: number, newBalance: number) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  
  db.update(wallets)
    .set({ balance: newBalance, updatedAt: new Date() })
    .where(eq(wallets.id, walletId))
    .run();
}

/**
 * Get wallet transactions
 */
export function getWalletTransactions(userId: number, limit: number = 50, offset: number = 0) {
  const db = getDb();
  if (!db) return [];
  
  return db.select()
    .from(walletTransactions)
    .where(eq(walletTransactions.userId, userId))
    .orderBy(desc(walletTransactions.createdAt))
    .limit(limit)
    .offset(offset)
    .all();
}

/**
 * Create wallet transaction
 */
export function createWalletTransaction(data: InsertWalletTransaction) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(walletTransactions).values(data).run().lastInsertRowid;
}

/**
 * Update wallet transaction status
 */
export function updateWalletTransactionStatus(
  transactionId: number, 
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled',
  completedAt?: Date
) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  
  const updates: any = { status };
  if (completedAt) {
    updates.completedAt = completedAt;
  }
  
  db.update(walletTransactions)
    .set(updates)
    .where(eq(walletTransactions.id, transactionId))
    .run();
}

/**
 * Process deposit - add funds to wallet
 */
export function processDeposit(userId: number, amount: number, description?: string, paymentMethodId?: number, externalTxId?: string) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  
  const wallet = getWalletByUserId(userId);
  if (!wallet) throw new Error("Wallet not found");
  
  // Create transaction record
  const txData: InsertWalletTransaction = {
    walletId: wallet.id,
    userId,
    amount,
    type: 'deposit',
    status: 'completed',
    description: description || 'Deposit to wallet',
    paymentMethodId,
    externalTransactionId: externalTxId,
    completedAt: new Date(),
  };
  
  const txId = db.insert(walletTransactions).values(txData).run().lastInsertRowid;
  
  // Update wallet balance
  const newBalance = (wallet.balance || 0) + amount;
  updateWalletBalance(wallet.id, newBalance);
  
  return { transactionId: txId, newBalance };
}

/**
 * Process withdrawal - remove funds from wallet
 */
export function processWithdrawal(userId: number, amount: number, description?: string, paymentMethodId?: number) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  
  const wallet = getWalletByUserId(userId);
  if (!wallet) throw new Error("Wallet not found");
  
  if ((wallet.balance || 0) < amount) {
    throw new Error("Insufficient balance");
  }
  
  // Create transaction record
  const txData: InsertWalletTransaction = {
    walletId: wallet.id,
    userId,
    amount,
    type: 'withdraw',
    status: 'processing',
    description: description || 'Withdrawal from wallet',
    paymentMethodId,
  };
  
  const txId = db.insert(walletTransactions).values(txData).run().lastInsertRowid;
  
  // Update wallet balance
  const newBalance = (wallet.balance || 0) - amount;
  updateWalletBalance(wallet.id, newBalance);
  
  return { transactionId: txId, newBalance };
}

/**
 * Process purchase - deduct funds for artwork purchase
 */
export function processPurchase(userId: number, amount: number, artworkId: number, description?: string) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  
  const wallet = getWalletByUserId(userId);
  if (!wallet) throw new Error("Wallet not found");
  
  if ((wallet.balance || 0) < amount) {
    throw new Error("Insufficient balance");
  }
  
  // Create transaction record
  const txData: InsertWalletTransaction = {
    walletId: wallet.id,
    userId,
    amount,
    type: 'purchase',
    status: 'completed',
    description: description || `Purchase artwork #${artworkId}`,
    relatedArtworkId: artworkId,
    completedAt: new Date(),
  };
  
  const txId = db.insert(walletTransactions).values(txData).run().lastInsertRowid;
  
  // Update wallet balance
  const newBalance = (wallet.balance || 0) - amount;
  updateWalletBalance(wallet.id, newBalance);
  
  return { transactionId: txId, newBalance };
}

/**
 * Get payment methods for user
 */
export function getPaymentMethods(userId: number) {
  const db = getDb();
  if (!db) return [];
  
  return db.select()
    .from(paymentMethods)
    .where(and(eq(paymentMethods.userId, userId), eq(paymentMethods.isActive, true)))
    .orderBy(desc(paymentMethods.isDefault))
    .all();
}

/**
 * Create payment method
 */
export function createPaymentMethod(data: InsertPaymentMethod) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  
  // If this is set as default, unset other defaults
  if (data.isDefault) {
    db.update(paymentMethods)
      .set({ isDefault: false })
      .where(eq(paymentMethods.userId, data.userId))
      .run();
  }
  
  return db.insert(paymentMethods).values(data).run().lastInsertRowid;
}

/**
 * Log payment gateway activity
 */
export function logPaymentGateway(data: InsertPaymentGatewayLog) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(paymentGatewayLogs).values(data).run().lastInsertRowid;
}
