import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  password: varchar("password", { length: 255 }),
  username: varchar("username", { length: 12 }).unique(),
  avatar: text("avatar"),
  bio: text("bio"),
  loginMethod: varchar("loginMethod", { length: 64 }).default("email"),
  role: mysqlEnum("role", ["user", "admin", "artist", "collector", "gallery", "partner", "curator", "consultant"]).default("user").notNull(),
  // Privacy settings
  privacyShowName: boolean("privacyShowName").default(true),
  privacyShowAvatar: boolean("privacyShowAvatar").default(true),
  privacyShowBio: boolean("privacyShowBio").default(true),
  privacyShowCollection: boolean("privacyShowCollection").default(true),
  privacyShowBlog: boolean("privacyShowBlog").default(true),
  privacyAllowMessages: boolean("privacyAllowMessages").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Artworks table
export const artworks = mysqlTable("artworks", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  artistId: int("artistId").notNull(),
  galleryId: int("galleryId"),
  year: int("year"),
  technique: varchar("technique", { length: 255 }),
  dimensions: varchar("dimensions", { length: 100 }),
  medium: varchar("medium", { length: 255 }),
  genre: varchar("genre", { length: 100 }),
  basePrice: decimal("basePrice", { precision: 15, scale: 2 }),
  currentPrice: decimal("currentPrice", { precision: 15, scale: 2 }),
  imageUrl: text("imageUrl"),
  status: mysqlEnum("status", ["available", "sold", "auction", "unavailable"]).default("available"),
  blockchainVerified: boolean("blockchainVerified").default(false),
  blockchainHash: varchar("blockchainHash", { length: 255 }),
  ipfsHash: varchar("ipfsHash", { length: 255 }),
  uniqueId: varchar("uniqueId", { length: 100 }).unique(),
  qrCode: text("qrCode"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Artwork = typeof artworks.$inferSelect;
export type InsertArtwork = typeof artworks.$inferInsert;

// Artists table
export const artists = mysqlTable("artists", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  bio: text("bio"),
  profileImage: text("profileImage"),
  website: varchar("website", { length: 255 }),
  socialMedia: json("socialMedia"),
  followers: int("followers").default(0),
  totalSales: int("totalSales").default(0),
  totalRevenue: decimal("totalRevenue", { precision: 15, scale: 2 }).default("0"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Artist = typeof artists.$inferSelect;
export type InsertArtist = typeof artists.$inferInsert;

// Galleries table
export const galleries = mysqlTable("galleries", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  address: text("address"),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 320 }),
  website: varchar("website", { length: 255 }),
  logo: text("logo"),
  members: int("members").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Gallery = typeof galleries.$inferSelect;
export type InsertGallery = typeof galleries.$inferInsert;

// Collectors table
export const collectors = mysqlTable("collectors", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  bio: text("bio"),
  profileImage: text("profileImage"),
  portfolioValue: decimal("portfolioValue", { precision: 15, scale: 2 }).default("0"),
  artworksCount: int("artworksCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Collector = typeof collectors.$inferSelect;
export type InsertCollector = typeof collectors.$inferInsert;

// Auctions table
export const auctions = mysqlTable("auctions", {
  id: int("id").autoincrement().primaryKey(),
  artworkId: int("artworkId").notNull(),
  startPrice: decimal("startPrice", { precision: 15, scale: 2 }).notNull(),
  currentBid: decimal("currentBid", { precision: 15, scale: 2 }),
  highestBidderId: int("highestBidderId"),
  startTime: timestamp("startTime").notNull(),
  endTime: timestamp("endTime").notNull(),
  status: mysqlEnum("status", ["pending", "active", "completed", "cancelled"]).default("pending"),
  bidsCount: int("bidsCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Auction = typeof auctions.$inferSelect;
export type InsertAuction = typeof auctions.$inferInsert;

// Bids table
export const bids = mysqlTable("bids", {
  id: int("id").autoincrement().primaryKey(),
  auctionId: int("auctionId").notNull(),
  bidderId: int("bidderId").notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type Bid = typeof bids.$inferSelect;
export type InsertBid = typeof bids.$inferInsert;

// Transactions table
export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  artworkId: int("artworkId").notNull(),
  sellerId: int("sellerId").notNull(),
  buyerId: int("buyerId").notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  type: mysqlEnum("type", ["sale", "auction", "transfer"]).notNull(),
  status: mysqlEnum("status", ["pending", "completed", "cancelled"]).default("pending"),
  transactionHash: varchar("transactionHash", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

// Provenance table
export const provenance = mysqlTable("provenance", {
  id: int("id").autoincrement().primaryKey(),
  artworkId: int("artworkId").notNull(),
  ownerId: int("ownerId").notNull(),
  acquiredDate: timestamp("acquiredDate").notNull(),
  price: decimal("price", { precision: 15, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Provenance = typeof provenance.$inferSelect;
export type InsertProvenance = typeof provenance.$inferInsert;

// Wishlist table
export const wishlists = mysqlTable("wishlists", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  artworkId: int("artworkId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Wishlist = typeof wishlists.$inferSelect;
export type InsertWishlist = typeof wishlists.$inferInsert;

// News table
export const news = mysqlTable("news", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  category: mysqlEnum("category", ["artwork", "artist", "style", "market", "general"]).notNull(),
  relatedArtworkId: int("relatedArtworkId"),
  relatedArtistId: int("relatedArtistId"),
  source: varchar("source", { length: 255 }),
  imageUrl: text("imageUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type News = typeof news.$inferSelect;
export type InsertNews = typeof news.$inferInsert;

// Messages table
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  senderId: int("senderId").notNull(),
  recipientId: int("recipientId").notNull(),
  content: text("content").notNull(),
  type: mysqlEnum("type", ["text", "file", "artwork_link"]).default("text"),
  fileUrl: text("fileUrl"),
  artworkId: int("artworkId"),
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

// Message Requests table
export const messageRequests = mysqlTable("messageRequests", {
  id: int("id").autoincrement().primaryKey(),
  senderId: int("senderId").notNull(),
  recipientId: int("recipientId").notNull(),
  message: text("message"),
  status: mysqlEnum("status", ["pending", "accepted", "rejected"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MessageRequest = typeof messageRequests.$inferSelect;
export type InsertMessageRequest = typeof messageRequests.$inferInsert;

// User Blog Posts table
export const blogPosts = mysqlTable("blogPosts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  imageUrl: text("imageUrl"),
  videoUrl: text("videoUrl"),
  likes: int("likes").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

// Notifications table
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["message_request", "message", "artwork_sold", "auction_bid", "news", "follow"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  relatedUserId: int("relatedUserId"),
  relatedArtworkId: int("relatedArtworkId"),
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

// Landing Pages table
export const landingPages = mysqlTable("landingPages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  templateId: varchar("templateId", { length: 100 }),
  content: json("content"),
  isPublished: boolean("isPublished").default(false),
  url: varchar("url", { length: 255 }).unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LandingPage = typeof landingPages.$inferSelect;
export type InsertLandingPage = typeof landingPages.$inferInsert;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  artworks: many(artworks),
  artists: many(artists),
  galleries: many(galleries),
  collectors: many(collectors),
  messages: many(messages),
  messageRequests: many(messageRequests),
  blogPosts: many(blogPosts),
  notifications: many(notifications),
  landingPages: many(landingPages),
}));

export const artworksRelations = relations(artworks, ({ one, many }) => ({
  artist: one(artists, {
    fields: [artworks.artistId],
    references: [artists.id],
  }),
  gallery: one(galleries, {
    fields: [artworks.galleryId],
    references: [galleries.id],
  }),
  auctions: many(auctions),
  transactions: many(transactions),
  provenance: many(provenance),
  wishlists: many(wishlists),
}));

export const artistsRelations = relations(artists, ({ one, many }) => ({
  user: one(users, {
    fields: [artists.userId],
    references: [users.id],
  }),
  artworks: many(artworks),
}));

export const galleriesRelations = relations(galleries, ({ one, many }) => ({
  user: one(users, {
    fields: [galleries.userId],
    references: [users.id],
  }),
  artworks: many(artworks),
}));

export const collectorsRelations = relations(collectors, ({ one, many }) => ({
  user: one(users, {
    fields: [collectors.userId],
    references: [users.id],
  }),
  wishlists: many(wishlists),
}));

export const auctionsRelations = relations(auctions, ({ one, many }) => ({
  artwork: one(artworks, {
    fields: [auctions.artworkId],
    references: [artworks.id],
  }),
  bids: many(bids),
}));

export const bidsRelations = relations(bids, ({ one }) => ({
  auction: one(auctions, {
    fields: [bids.auctionId],
    references: [auctions.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  artwork: one(artworks, {
    fields: [transactions.artworkId],
    references: [artworks.id],
  }),
}));

export const provenanceRelations = relations(provenance, ({ one }) => ({
  artwork: one(artworks, {
    fields: [provenance.artworkId],
    references: [artworks.id],
  }),
}));

export const wishlistsRelations = relations(wishlists, ({ one }) => ({
  user: one(users, {
    fields: [wishlists.userId],
    references: [users.id],
  }),
  artwork: one(artworks, {
    fields: [wishlists.artworkId],
    references: [artworks.id],
  }),
}));

export const newsRelations = relations(news, ({ one }) => ({
  artwork: one(artworks, {
    fields: [news.relatedArtworkId],
    references: [artworks.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
  recipient: one(users, {
    fields: [messages.recipientId],
    references: [users.id],
  }),
}));

export const messageRequestsRelations = relations(messageRequests, ({ one }) => ({
  sender: one(users, {
    fields: [messageRequests.senderId],
    references: [users.id],
  }),
  recipient: one(users, {
    fields: [messageRequests.recipientId],
    references: [users.id],
  }),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  user: one(users, {
    fields: [blogPosts.userId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const landingPagesRelations = relations(landingPages, ({ one }) => ({
  user: one(users, {
    fields: [landingPages.userId],
    references: [users.id],
  }),
}));

// Partnerships table - для сотрудничества и партнёрств
export const partnerships = mysqlTable("partnerships", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  partnerId: int("partnerId").notNull(),
  type: mysqlEnum("type", ["gallery", "producer", "copyRights", "consultant", "partner"]).notNull(),
  status: mysqlEnum("status", ["active", "inactive", "pending"]).default("pending"),
  description: text("description"),
  commission: decimal("commission", { precision: 5, scale: 2 }),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Partnership = typeof partnerships.$inferSelect;
export type InsertPartnership = typeof partnerships.$inferInsert;

// Artwork Views table - для статистики просмотров
export const artworkViews = mysqlTable("artworkViews", {
  id: int("id").autoincrement().primaryKey(),
  artworkId: int("artworkId").notNull(),
  userId: int("userId"),
  viewedAt: timestamp("viewedAt").defaultNow().notNull(),
});

export type ArtworkView = typeof artworkViews.$inferSelect;
export type InsertArtworkView = typeof artworkViews.$inferInsert;

// Price History table - для истории изменения цен
export const priceHistory = mysqlTable("priceHistory", {
  id: int("id").autoincrement().primaryKey(),
  artworkId: int("artworkId").notNull(),
  price: decimal("price", { precision: 15, scale: 2 }).notNull(),
  changePercent: decimal("changePercent", { precision: 5, scale: 2 }),
  recordedAt: timestamp("recordedAt").defaultNow().notNull(),
});

export type PriceHistory = typeof priceHistory.$inferSelect;
export type InsertPriceHistory = typeof priceHistory.$inferInsert;

// Events table - для событий и мероприятий
export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  type: mysqlEnum("type", ["exhibition", "auction", "discussion", "workshop", "other"]).notNull(),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate"),
  location: varchar("location", { length: 255 }),
  organizerId: int("organizerId"),
  imageUrl: text("imageUrl"),
  status: mysqlEnum("status", ["upcoming", "ongoing", "completed", "cancelled"]).default("upcoming"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

// Artwork Events (junction table) - связь произведений с событиями
export const artworkEvents = mysqlTable("artworkEvents", {
  id: int("id").autoincrement().primaryKey(),
  artworkId: int("artworkId").notNull(),
  eventId: int("eventId").notNull(),
  participationType: mysqlEnum("participationType", ["exhibited", "sold", "featured"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ArtworkEvent = typeof artworkEvents.$inferSelect;
export type InsertArtworkEvent = typeof artworkEvents.$inferInsert;

// Wallets table - для личных кошельков
export const wallets = mysqlTable("wallets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  balance: decimal("balance", { precision: 15, scale: 2 }).default("0"),
  currency: varchar("currency", { length: 10 }).default("USD"),
  cardConnected: boolean("cardConnected").default(false),
  cardLastFour: varchar("cardLastFour", { length: 4 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = typeof wallets.$inferInsert;

// Wallet Transactions table - для истории транзакций
export const walletTransactions = mysqlTable("walletTransactions", {
  id: int("id").autoincrement().primaryKey(),
  walletId: int("walletId").notNull(),
  type: mysqlEnum("type", ["deposit", "withdrawal", "payment", "refund", "commission"]).notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  description: text("description"),
  relatedTransactionId: int("relatedTransactionId"),
  status: mysqlEnum("status", ["pending", "completed", "failed"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WalletTransaction = typeof walletTransactions.$inferSelect;
export type InsertWalletTransaction = typeof walletTransactions.$inferInsert;

// Relations for new tables
export const partnershipsRelations = relations(partnerships, ({ one }) => ({
  user: one(users, {
    fields: [partnerships.userId],
    references: [users.id],
  }),
  partner: one(users, {
    fields: [partnerships.partnerId],
    references: [users.id],
  }),
}));

export const artworkViewsRelations = relations(artworkViews, ({ one }) => ({
  artwork: one(artworks, {
    fields: [artworkViews.artworkId],
    references: [artworks.id],
  }),
}));

export const priceHistoryRelations = relations(priceHistory, ({ one }) => ({
  artwork: one(artworks, {
    fields: [priceHistory.artworkId],
    references: [artworks.id],
  }),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  organizer: one(users, {
    fields: [events.organizerId],
    references: [users.id],
  }),
  artworkEvents: many(artworkEvents),
}));

export const artworkEventsRelations = relations(artworkEvents, ({ one }) => ({
  artwork: one(artworks, {
    fields: [artworkEvents.artworkId],
    references: [artworks.id],
  }),
  event: one(events, {
    fields: [artworkEvents.eventId],
    references: [events.id],
  }),
}));

export const walletsRelations = relations(wallets, ({ one, many }) => ({
  user: one(users, {
    fields: [wallets.userId],
    references: [users.id],
  }),
  transactions: many(walletTransactions),
}));

export const walletTransactionsRelations = relations(walletTransactions, ({ one }) => ({
  wallet: one(wallets, {
    fields: [walletTransactions.walletId],
    references: [wallets.id],
  }),
}));
