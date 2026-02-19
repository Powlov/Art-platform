import { integer, sqliteTable, text, real } from "drizzle-orm/sqlite-core";

/**
 * Core user table backing auth flow.
 */
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  openId: text("openId").unique(),
  name: text("name"),
  email: text("email").unique(),
  password: text("password"),
  username: text("username", { length: 12 }).unique(),
  avatar: text("avatar"),
  bio: text("bio"),
  loginMethod: text("loginMethod").default("email"),
  role: text("role", { enum: ["user", "admin", "artist", "collector", "gallery", "partner", "curator", "consultant"] }).default("user").notNull(),
  // Privacy settings
  privacyShowName: integer("privacyShowName", { mode: "boolean" }).default(true),
  privacyShowAvatar: integer("privacyShowAvatar", { mode: "boolean" }).default(true),
  privacyShowBio: integer("privacyShowBio", { mode: "boolean" }).default(true),
  privacyShowCollection: integer("privacyShowCollection", { mode: "boolean" }).default(true),
  privacyShowBlog: integer("privacyShowBlog", { mode: "boolean" }).default(true),
  privacyAllowMessages: integer("privacyAllowMessages", { mode: "boolean" }).default(true),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  lastSignedIn: integer("lastSignedIn", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Artworks table
export const artworks = sqliteTable("artworks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  artistId: integer("artistId").notNull(),
  galleryId: integer("galleryId"),
  year: integer("year"),
  technique: text("technique"),
  dimensions: text("dimensions"),
  medium: text("medium"),
  genre: text("genre"),
  basePrice: real("basePrice"),
  currentPrice: real("currentPrice"),
  imageUrl: text("imageUrl"),
  status: text("status", { enum: ["available", "sold", "auction", "unavailable"] }).default("available"),
  blockchainVerified: integer("blockchainVerified", { mode: "boolean" }).default(false),
  blockchainHash: text("blockchainHash"),
  ipfsHash: text("ipfsHash"),
  uniqueId: text("uniqueId").unique(),
  qrCode: text("qrCode"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export type Artwork = typeof artworks.$inferSelect;
export type InsertArtwork = typeof artworks.$inferInsert;

// Artists table
export const artists = sqliteTable("artists", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  bio: text("bio"),
  profileImage: text("profileImage"),
  website: text("website"),
  socialMedia: text("socialMedia"), // JSON string
  followers: integer("followers").default(0),
  totalSales: integer("totalSales").default(0),
  totalRevenue: real("totalRevenue").default(0),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export type Artist = typeof artists.$inferSelect;
export type InsertArtist = typeof artists.$inferInsert;

// Galleries table
export const galleries = sqliteTable("galleries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  logo: text("logo"),
  members: integer("members").default(0),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export type Gallery = typeof galleries.$inferSelect;
export type InsertGallery = typeof galleries.$inferInsert;

// Collectors table
export const collectors = sqliteTable("collectors", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  bio: text("bio"),
  profileImage: text("profileImage"),
  portfolioValue: real("portfolioValue").default(0),
  artworksCount: integer("artworksCount").default(0),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export type Collector = typeof collectors.$inferSelect;
export type InsertCollector = typeof collectors.$inferInsert;

// Auctions table
export const auctions = sqliteTable("auctions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  artworkId: integer("artworkId").notNull(),
  startPrice: real("startPrice").notNull(),
  currentBid: real("currentBid"),
  highestBidderId: integer("highestBidderId"),
  startTime: integer("startTime", { mode: "timestamp" }).notNull(),
  endTime: integer("endTime", { mode: "timestamp" }).notNull(),
  status: text("status", { enum: ["pending", "active", "completed", "cancelled"] }).default("pending"),
  bidsCount: integer("bidsCount").default(0),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export type Auction = typeof auctions.$inferSelect;
export type InsertAuction = typeof auctions.$inferInsert;

// Bids table
export const bids = sqliteTable("bids", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  auctionId: integer("auctionId").notNull(),
  bidderId: integer("bidderId").notNull(),
  amount: real("amount").notNull(),
  timestamp: integer("timestamp", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export type Bid = typeof bids.$inferSelect;
export type InsertBid = typeof bids.$inferInsert;

// Transactions table
export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  artworkId: integer("artworkId").notNull(),
  sellerId: integer("sellerId").notNull(),
  buyerId: integer("buyerId").notNull(),
  amount: real("amount").notNull(),
  type: text("type", { enum: ["sale", "auction", "transfer"] }).notNull(),
  status: text("status", { enum: ["pending", "completed", "cancelled"] }).default("pending"),
  transactionHash: text("transactionHash"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

// Wishlists table
export const wishlists = sqliteTable("wishlists", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  artworkId: integer("artworkId").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export type Wishlist = typeof wishlists.$inferSelect;
export type InsertWishlist = typeof wishlists.$inferInsert;

// News table
export const news = sqliteTable("news", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category", { enum: ["artwork", "artist", "style", "market", "general"] }).notNull(),
  relatedArtworkId: integer("relatedArtworkId"),
  relatedArtistId: integer("relatedArtistId"),
  source: text("source"),
  imageUrl: text("imageUrl"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export type News = typeof news.$inferSelect;
export type InsertNews = typeof news.$inferInsert;

// Messages table
export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  senderId: integer("senderId").notNull(),
  recipientId: integer("recipientId").notNull(),
  content: text("content").notNull(),
  type: text("type", { enum: ["text", "file", "artwork_link"] }).default("text"),
  fileUrl: text("fileUrl"),
  artworkId: integer("artworkId"),
  isRead: integer("isRead", { mode: "boolean" }).default(false),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

// Message Requests table
export const messageRequests = sqliteTable("messageRequests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  senderId: integer("senderId").notNull(),
  recipientId: integer("recipientId").notNull(),
  message: text("message"),
  status: text("status", { enum: ["pending", "accepted", "rejected"] }).default("pending"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export type MessageRequest = typeof messageRequests.$inferSelect;
export type InsertMessageRequest = typeof messageRequests.$inferInsert;

// Notifications table
export const notifications = sqliteTable("notifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  type: text("type", { enum: ["message_request", "message", "artwork_sold", "auction_bid", "news", "follow"] }).notNull(),
  title: text("title").notNull(),
  content: text("content"),
  relatedUserId: integer("relatedUserId"),
  relatedArtworkId: integer("relatedArtworkId"),
  isRead: integer("isRead", { mode: "boolean" }).default(false),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

// Artwork Passport table
export const artworkPassports = sqliteTable("artwork_passport", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  artworkId: integer("artwork_id").notNull().unique(),
  certificateId: text("certificate_id").notNull().unique(),
  issuanceDate: integer("issuance_date", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  qrCodeData: text("qr_code_data").notNull(),
  qrCodeUrl: text("qr_code_url"),
  blockchainVerified: integer("blockchain_verified", { mode: "boolean" }).default(false),
  blockchainNetwork: text("blockchain_network"),
  tokenId: text("token_id"),
  contractAddress: text("contract_address"),
  ipfsHash: text("ipfs_hash"),
  provenanceHistory: text("provenance_history"), // JSON string
  authenticityVerified: integer("authenticity_verified", { mode: "boolean" }).default(false),
  verificationDate: integer("verification_date", { mode: "timestamp" }),
  lastUpdated: integer("last_updated", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export type ArtworkPassport = typeof artworkPassports.$inferSelect;
export type InsertArtworkPassport = typeof artworkPassports.$inferInsert;

// Wallets table - user balance and currency management
export const wallets = sqliteTable("wallets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull().unique(),
  balance: real("balance").notNull().default(0),
  currency: text("currency").notNull().default("USD"),
  status: text("status", { enum: ["active", "frozen", "closed"] }).notNull().default("active"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = typeof wallets.$inferInsert;

// Wallet Transactions table - deposit, withdraw, transfer history
export const walletTransactions = sqliteTable("wallet_transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  walletId: integer("walletId").notNull(),
  userId: integer("userId").notNull(),
  amount: real("amount").notNull(),
  type: text("type", { enum: ["deposit", "withdraw", "transfer_in", "transfer_out", "purchase", "refund", "commission"] }).notNull(),
  status: text("status", { enum: ["pending", "processing", "completed", "failed", "cancelled"] }).notNull().default("pending"),
  description: text("description"),
  relatedTransactionId: integer("relatedTransactionId"),
  relatedArtworkId: integer("relatedArtworkId"),
  paymentMethodId: integer("paymentMethodId"),
  externalTransactionId: text("externalTransactionId"),
  metadata: text("metadata"), // JSON string
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  completedAt: integer("completedAt", { mode: "timestamp" }),
});

export type WalletTransaction = typeof walletTransactions.$inferSelect;
export type InsertWalletTransaction = typeof walletTransactions.$inferInsert;

// Payment Methods table - saved payment cards and methods
export const paymentMethods = sqliteTable("payment_methods", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  type: text("type", { enum: ["card", "bank_account", "yookassa", "stripe", "paypal"] }).notNull(),
  provider: text("provider", { enum: ["stripe", "yookassa", "paypal", "manual"] }).notNull(),
  isDefault: integer("isDefault", { mode: "boolean" }).notNull().default(false),
  isActive: integer("isActive", { mode: "boolean" }).notNull().default(true),
  
  // Card/Account info (encrypted or tokenized)
  last4: text("last4"),
  brand: text("brand"),
  expiryMonth: integer("expiryMonth"),
  expiryYear: integer("expiryYear"),
  
  // Provider-specific tokens
  stripePaymentMethodId: text("stripePaymentMethodId"),
  yookassaPaymentMethodId: text("yookassaPaymentMethodId"),
  paypalAccountId: text("paypalAccountId"),
  
  // Billing details
  billingName: text("billingName"),
  billingEmail: text("billingEmail"),
  billingAddress: text("billingAddress"),
  billingCity: text("billingCity"),
  billingCountry: text("billingCountry"),
  billingPostalCode: text("billingPostalCode"),
  
  metadata: text("metadata"), // JSON string
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type InsertPaymentMethod = typeof paymentMethods.$inferInsert;

// Payment Gateway Logs - for debugging and audit
export const paymentGatewayLogs = sqliteTable("payment_gateway_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId"),
  walletTransactionId: integer("walletTransactionId"),
  provider: text("provider", { enum: ["stripe", "yookassa", "paypal", "manual"] }).notNull(),
  action: text("action", { enum: ["payment_intent", "charge", "refund", "transfer", "webhook"] }).notNull(),
  requestPayload: text("requestPayload"), // JSON string
  responsePayload: text("responsePayload"), // JSON string
  statusCode: integer("statusCode"),
  errorMessage: text("errorMessage"),
  externalId: text("externalId"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export type PaymentGatewayLog = typeof paymentGatewayLogs.$inferSelect;
export type InsertPaymentGatewayLog = typeof paymentGatewayLogs.$inferInsert;
