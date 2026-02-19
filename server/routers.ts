import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { 
  getArtworks, getArtworkById, createArtwork, updateArtwork,
  getArtistByUserId, createArtist,
  getGalleryByUserId, createGallery,
  getCollectorByUserId, createCollector,
  getActiveAuctions, createAuction,
  getTransactionsByUserId, createTransaction,
  getNews, createNews,
  getMessages, createMessage,
  getWishlist, addToWishlist, removeFromWishlist,
  createArtworkPassport
} from "./db";
import { InsertArtwork, InsertArtist, InsertGallery, InsertCollector, InsertAuction, InsertTransaction, InsertNews, InsertMessage } from "../drizzle/schema";
import { registerUser, loginUser, getUserById, updateUserProfile, createTestAccounts } from "./auth";
import { getStatisticsDashboard, getLiveTransactionFeed, getTradingVolume, getTotalTransactions, getAveragePriceGrowth, getPriceTrendsByStyle, getDemandByStyle, getTopArtists, getAverageLiquidity, getTotalArtworks, getActiveSalesCount, getHourlyActivity } from "./stats";
import { auctionRouter as liveAuctionRouter } from "./auction-router";
import { passportRouter } from "./passport-router";
import { walletRouter } from "./wallet-router";
import { uploadRouter } from "./upload-router";
import { statisticsRouter } from "./statistics-router";
import { sendNotification } from "./websocket";
import { 
  sendArtworkApprovedEmail, 
  sendArtworkRejectedEmail, 
  sendNewArtworkNotificationEmail,
  sendPurchaseConfirmationEmail,
  sendSaleNotificationEmail 
} from "./email-utils";
import {
  generateCertificateId,
  generateArtworkQRCode,
  generateBlockchainData,
  initializeProvenance
} from "./passport-utils";

// Artwork Router
const artworkRouter = router({
  list: publicProcedure
    .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
    .query(async ({ input }) => {
      return getArtworks(input.limit, input.offset);
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getArtworkById(input.id);
    }),

  create: protectedProcedure
    .input(z.object({
      title: z.string(),
      description: z.string().optional(),
      artistId: z.number(),
      artistName: z.string().optional(), // For passport generation
      galleryId: z.number().optional(),
      year: z.number().optional(),
      technique: z.string().optional(),
      dimensions: z.string().optional(),
      medium: z.string().optional(),
      basePrice: z.string().optional(),
      currentPrice: z.string().optional(),
      imageUrl: z.string().optional(),
      status: z.enum(["available", "sold", "auction", "unavailable"]).default("available"),
      autoGeneratePassport: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      // Create artwork
      const now = Date.now();
      const data: any = {
        ...input,
        basePrice: input.basePrice ? parseFloat(input.basePrice) : undefined,
        currentPrice: input.currentPrice ? parseFloat(input.currentPrice) : undefined,
        moderationStatus: 'pending', // New artworks start as pending
        submittedAt: now,
      };
      
      const artworkId = createArtwork(data) as number;
      
      // Auto-generate passport if enabled
      if (input.autoGeneratePassport && artworkId) {
        try {
          // Generate certificate ID
          const certificateId = generateCertificateId();
          
          // Generate QR code
          const qrCodeData = await generateArtworkQRCode(artworkId, certificateId);
          const qrCodeUrl = `${process.env.PUBLIC_URL || 'https://artbank.market'}/artwork-passport/${artworkId}?cert=${certificateId}`;
          
          // Generate blockchain data
          const blockchainData = generateBlockchainData(artworkId);
          
          // Initialize provenance
          const artistName = input.artistName || 'Unknown Artist';
          const creationDate = input.year ? `${input.year}-01-01` : new Date().toISOString().split('T')[0];
          const location = 'Art Bank Platform';
          const provenance = initializeProvenance(artistName, creationDate, location);
          
          // Create passport
          createArtworkPassport({
            artworkId,
            certificateId,
            qrCodeData,
            qrCodeUrl,
            blockchainVerified: blockchainData.verified,
            blockchainNetwork: blockchainData.network,
            tokenId: blockchainData.tokenId,
            contractAddress: blockchainData.contractAddress,
            ipfsHash: blockchainData.ipfsHash,
            provenanceHistory: JSON.stringify(provenance),
            authenticityVerified: true,
            verificationDate: new Date(),
          });
          
          console.log(`[Passport] Auto-generated for artwork #${artworkId}`);
        } catch (error) {
          console.error(`[Passport] Failed to generate for artwork #${artworkId}:`, error);
          // Don't fail the artwork creation if passport generation fails
        }
      }
      
      // Send email notification to admin about new submission
      sendNewArtworkNotificationEmail(
        input.title,
        input.artistName || 'Unknown Artist',
        artworkId
      ).catch(err => console.error('[Email] Failed to send admin notification:', err));
      
      return artworkId;
    }),

  purchase: protectedProcedure
    .input(z.object({
      artworkId: z.number(),
      price: z.string(),
    }))
    .mutation(async ({ input, ctx: { user } }) => {
      if (!user) throw new Error("User not authenticated");
      
      // Get artwork details
      const artwork = await getArtworkById(input.artworkId);
      if (!artwork) throw new Error("Artwork not found");
      if (artwork.status !== 'available') throw new Error("Artwork is not available for purchase");
      
      // Create transaction record
      const transaction = await createTransaction({
        artworkId: input.artworkId,
        sellerId: artwork.artistId || 1,
        buyerId: user.id,
        amount: input.price,
        type: 'sale',
        status: 'completed',
      });
      
      // Update artwork status to sold
      await updateArtwork(input.artworkId, {
        status: 'sold',
      });
      
      return { 
        success: true, 
        transaction,
        message: 'Purchase completed successfully'
      };
    }),

  // Get user's artworks
  getMyArtworks: protectedProcedure
    .input(z.object({
      status: z.enum(['pending', 'approved', 'rejected', 'draft']).optional(),
      search: z.string().optional(),
      limit: z.number().default(50),
      offset: z.number().default(0),
    }))
    .query(async ({ input, ctx: { user } }) => {
      if (!user) throw new Error("User not authenticated");
      
      const db = getDb();
      if (!db) throw new Error("Database not available");

      let query = `
        SELECT 
          a.*,
          u.name as artistName,
          u.avatar as artistAvatar
        FROM artworks a
        LEFT JOIN users u ON a.artistId = u.id
        WHERE a.artistId = ?
      `;
      
      const params: any[] = [user.id];

      // Filter by status
      if (input.status) {
        query += ` AND a.status = ?`;
        params.push(input.status);
      }

      // Filter by search query
      if (input.search && input.search.trim()) {
        query += ` AND (a.title LIKE ? OR a.description LIKE ?)`;
        const searchPattern = `%${input.search}%`;
        params.push(searchPattern, searchPattern);
      }

      query += ` ORDER BY a.id DESC LIMIT ? OFFSET ?`;
      params.push(input.limit, input.offset);

      const artworks = db.prepare(query).all(...params);

      return artworks.map((artwork: any) => ({
        ...artwork,
        basePrice: artwork.basePrice ? Number(artwork.basePrice) * 100 : 0, // Convert to cents
        currentPrice: artwork.currentPrice ? Number(artwork.currentPrice) * 100 : 0,
        views: artwork.views || 0,
      }));
    }),

  // Delete artwork
  delete: protectedProcedure
    .input(z.object({
      artworkId: z.number(),
    }))
    .mutation(async ({ input, ctx: { user } }) => {
      if (!user) throw new Error("User not authenticated");
      
      const db = getDb();
      if (!db) throw new Error("Database not available");

      // Check if user owns the artwork
      const artwork = db.prepare(`
        SELECT * FROM artworks WHERE id = ? AND artistId = ?
      `).get(input.artworkId, user.id);

      if (!artwork) {
        throw new Error("Artwork not found or you don't have permission to delete it");
      }

      // Check if artwork is in an active auction
      const activeAuction = db.prepare(`
        SELECT * FROM auctions 
        WHERE artworkId = ? AND status IN ('active', 'pending')
      `).get(input.artworkId);

      if (activeAuction) {
        throw new Error("Cannot delete artwork with active auction");
      }

      // Delete related records first
      db.prepare(`DELETE FROM artwork_passport WHERE artworkId = ?`).run(input.artworkId);
      db.prepare(`DELETE FROM wishlists WHERE artworkId = ?`).run(input.artworkId);
      
      // Delete the artwork
      db.prepare(`DELETE FROM artworks WHERE id = ?`).run(input.artworkId);

      return { success: true, message: 'Artwork deleted successfully' };
    }),

  // Update artwork
  update: protectedProcedure
    .input(z.object({
      artworkId: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      year: z.number().optional(),
      technique: z.string().optional(),
      dimensions: z.string().optional(),
      medium: z.string().optional(),
      basePrice: z.string().optional(),
      imageUrl: z.string().optional(),
      status: z.enum(["available", "sold", "auction", "unavailable", "pending", "approved", "rejected", "draft"]).optional(),
    }))
    .mutation(async ({ input, ctx: { user } }) => {
      if (!user) throw new Error("User not authenticated");
      
      const db = getDb();
      if (!db) throw new Error("Database not available");

      // Check if user owns the artwork
      const artwork = db.prepare(`
        SELECT * FROM artworks WHERE id = ? AND artistId = ?
      `).get(input.artworkId, user.id);

      if (!artwork) {
        throw new Error("Artwork not found or you don't have permission to edit it");
      }

      const { artworkId, ...updateData } = input;
      const updates: string[] = [];
      const values: any[] = [];

      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined) {
          updates.push(`${key} = ?`);
          if (key === 'basePrice') {
            values.push(parseFloat(value as string));
          } else {
            values.push(value);
          }
        }
      });

      if (updates.length === 0) {
        return { success: true, message: 'No changes to update' };
      }

      const query = `UPDATE artworks SET ${updates.join(', ')} WHERE id = ?`;
      values.push(artworkId);

      db.prepare(query).run(...values);

      return { success: true, message: 'Artwork updated successfully' };
    }),
});

// Artist Router
const artistRouter = router({
  getProfile: protectedProcedure
    .query(async ({ ctx: { user } }) => {
      if (!user) throw new Error("User not found");
      return getArtistByUserId(user.id);
    }),

  create: protectedProcedure
    .input(z.object({
      bio: z.string().optional(),
      profileImage: z.string().optional(),
      website: z.string().optional(),
      socialMedia: z.record(z.string(), z.string()).optional(),
    }))
    .mutation(async ({ input, ctx: { user } }) => {
      if (!user) throw new Error("User not found");
      const data: InsertArtist = {
        userId: user.id,
        ...input,
      };
      return createArtist(data);
    }),
});

// Gallery Router
const galleryRouter = router({
  getProfile: protectedProcedure
    .query(async ({ ctx: { user } }) => {
      if (!user) throw new Error("User not found");
      return getGalleryByUserId(user.id);
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional(),
      address: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().optional(),
      website: z.string().optional(),
      logo: z.string().optional(),
    }))
    .mutation(async ({ input, ctx: { user } }) => {
      if (!user) throw new Error("User not found");
      const data: InsertGallery = {
        userId: user.id,
        ...input,
      };
      return createGallery(data);
    }),
});

// Collector Router
const collectorRouter = router({
  getProfile: protectedProcedure
    .query(async ({ ctx: { user } }) => {
      if (!user) throw new Error("User not found");
      return getCollectorByUserId(user.id);
    }),

  create: protectedProcedure
    .input(z.object({
      bio: z.string().optional(),
      profileImage: z.string().optional(),
    }))
    .mutation(async ({ input, ctx: { user } }) => {
      if (!user) throw new Error("User not found");
      const data: InsertCollector = {
        userId: user.id,
        ...input,
      };
      return createCollector(data);
    }),
});

// Auction Router
// Use the enhanced Live Auction Router
const auctionRouter = liveAuctionRouter;

// Transaction Router
const transactionRouter = router({
  list: protectedProcedure
    .input(z.object({ limit: z.number().default(20) }))
    .query(async ({ input, ctx: { user } }) => {
      if (!user) throw new Error("User not found");
      return getTransactionsByUserId(user.id, input.limit);
    }),

  create: protectedProcedure
    .input(z.object({
      artworkId: z.number(),
      sellerId: z.number(),
      buyerId: z.number(),
      amount: z.string(),
      type: z.enum(["sale", "auction", "bid"]).default("sale"),
    }))
    .mutation(async ({ input }) => {
      const data: any = {
        ...input,
        amount: parseFloat(input.amount),
      };
      return createTransaction(data);
    }),
});

// News Router
const newsRouter = router({
  list: publicProcedure
    .input(z.object({ category: z.string().optional(), limit: z.number().default(20) }))
    .query(async ({ input }) => {
      return getNews(input.category, input.limit);
    }),

  create: protectedProcedure
    .input(z.object({
      title: z.string(),
      content: z.string(),
      category: z.enum(["general", "market", "artist", "style"]).default("general"),
      source: z.string().optional(),
      imageUrl: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const data: InsertNews = input;
      return createNews(data);
    }),
});

// Message Router
const messageRouter = router({
  list: protectedProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ input, ctx: { user } }) => {
      if (!user) throw new Error("User not found");
      return getMessages(user.id, input.limit);
    }),

  send: protectedProcedure
    .input(z.object({
      recipientId: z.number(),
      content: z.string(),
      type: z.enum(["text", "file", "artwork_link"]).default("text"),
      fileUrl: z.string().optional(),
      artworkId: z.number().optional(),
    }))
    .mutation(async ({ input, ctx: { user } }) => {
      if (!user) throw new Error("User not found");
      const data: InsertMessage = {
        senderId: user.id,
        recipientId: input.recipientId,
        content: input.content,
        type: input.type,
        fileUrl: input.fileUrl,
        artworkId: input.artworkId,
      };
      return createMessage(user.id, input.recipientId, input.content, input.type);
    }),
});

// Wishlist Router
const wishlistRouter = router({
  list: protectedProcedure
    .query(async ({ ctx: { user } }) => {
      if (!user) throw new Error("User not found");
      return getWishlist(user.id);
    }),

  add: protectedProcedure
    .input(z.object({ artworkId: z.number() }))
    .mutation(async ({ input, ctx: { user } }) => {
      if (!user) throw new Error("User not found");
      return addToWishlist(user.id, input.artworkId);
    }),

  remove: protectedProcedure
    .input(z.object({ artworkId: z.number() }))
    .mutation(async ({ input, ctx: { user } }) => {
      if (!user) throw new Error("User not found");
      return removeFromWishlist(user.id, input.artworkId);
    }),
});

export 
// Statistics Router
const statsRouter = router({
  dashboard: publicProcedure
    .input(z.object({
      timeRange: z.enum(["day", "week", "month", "year", "all"]).default("month"),
    }))
    .query(async ({ input }) => {
      return getStatisticsDashboard(input.timeRange);
    }),

  liveTransactions: publicProcedure
    .input(z.object({
      limit: z.number().default(20),
      offset: z.number().default(0),
    }))
    .query(async ({ input }) => {
      return getLiveTransactionFeed(input.limit, input.offset);
    }),

  tradingVolume: publicProcedure
    .input(z.object({
      timeRange: z.enum(["day", "week", "month", "year", "all"]).default("month"),
    }))
    .query(async ({ input }) => {
      return getTradingVolume(input.timeRange);
    }),

  totalTransactions: publicProcedure
    .input(z.object({
      timeRange: z.enum(["day", "week", "month", "year", "all"]).default("month"),
    }))
    .query(async ({ input }) => {
      return getTotalTransactions(input.timeRange);
    }),

  priceTrends: publicProcedure
    .query(async () => {
      return getPriceTrendsByStyle();
    }),

  demandByStyle: publicProcedure
    .query(async () => {
      return getDemandByStyle();
    }),

  topArtists: publicProcedure
    .input(z.object({
      limit: z.number().default(10),
    }))
    .query(async ({ input }) => {
      return getTopArtists(input.limit);
    }),

  hourlyActivity: publicProcedure
    .input(z.object({
      timeRange: z.enum(["day", "week", "month", "year", "all"]).default("day"),
    }))
    .query(async ({ input }) => {
      return getHourlyActivity(input.timeRange);
    }),

  averageLiquidity: publicProcedure
    .input(z.object({
      timeRange: z.enum(["day", "week", "month", "year", "all"]).default("month"),
    }))
    .query(async ({ input }) => {
      return getAverageLiquidity(input.timeRange);
    }),
});

// Moderation Router (Admin only)
const moderationRouter = router({
  // Get pending artworks for moderation
  getPendingArtworks: protectedProcedure
    .input(z.object({
      limit: z.number().default(20),
      offset: z.number().default(0),
    }))
    .query(async ({ input, ctx: { user } }) => {
      if (!user) throw new Error("User not authenticated");
      if (user.role !== 'admin') throw new Error("Unauthorized: Admin access required");
      
      const db = getDb();
      if (!db) throw new Error("Database not available");

      const artworks = db.prepare(`
        SELECT 
          a.*,
          u.name as artistName,
          u.email as artistEmail,
          u.avatar as artistAvatar
        FROM artworks a
        LEFT JOIN users u ON a.artistId = u.id
        WHERE a.moderationStatus = 'pending'
        ORDER BY a.submittedAt DESC
        LIMIT ? OFFSET ?
      `).all(input.limit, input.offset);

      const total = db.prepare(`
        SELECT COUNT(*) as count FROM artworks WHERE moderationStatus = 'pending'
      `).get() as any;

      return {
        artworks: artworks.map((artwork: any) => ({
          ...artwork,
          basePrice: artwork.basePrice ? Number(artwork.basePrice) * 100 : 0,
          currentPrice: artwork.currentPrice ? Number(artwork.currentPrice) * 100 : 0,
        })),
        total: total.count,
        hasMore: (input.offset + input.limit) < total.count,
      };
    }),

  // Get all artworks by moderation status
  getArtworksByStatus: protectedProcedure
    .input(z.object({
      status: z.enum(['pending', 'approved', 'rejected']),
      limit: z.number().default(20),
      offset: z.number().default(0),
    }))
    .query(async ({ input, ctx: { user } }) => {
      if (!user) throw new Error("User not authenticated");
      if (user.role !== 'admin') throw new Error("Unauthorized: Admin access required");
      
      const db = getDb();
      if (!db) throw new Error("Database not available");

      const artworks = db.prepare(`
        SELECT 
          a.*,
          u.name as artistName,
          u.email as artistEmail,
          moderator.name as moderatorName
        FROM artworks a
        LEFT JOIN users u ON a.artistId = u.id
        LEFT JOIN users moderator ON a.moderatedBy = moderator.id
        WHERE a.moderationStatus = ?
        ORDER BY a.moderatedAt DESC, a.submittedAt DESC
        LIMIT ? OFFSET ?
      `).all(input.status, input.limit, input.offset);

      return artworks.map((artwork: any) => ({
        ...artwork,
        basePrice: artwork.basePrice ? Number(artwork.basePrice) * 100 : 0,
        currentPrice: artwork.currentPrice ? Number(artwork.currentPrice) * 100 : 0,
      }));
    }),

  // Approve artwork
  approveArtwork: protectedProcedure
    .input(z.object({
      artworkId: z.number(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx: { user } }) => {
      if (!user) throw new Error("User not authenticated");
      if (user.role !== 'admin') throw new Error("Unauthorized: Admin access required");
      
      const db = getDb();
      if (!db) throw new Error("Database not available");

      // Get current artwork
      const artwork = db.prepare(`SELECT * FROM artworks WHERE id = ?`).get(input.artworkId) as any;
      if (!artwork) throw new Error("Artwork not found");

      const previousStatus = artwork.moderationStatus;
      const now = Date.now();

      // Update artwork status
      db.prepare(`
        UPDATE artworks 
        SET moderationStatus = 'approved',
            moderationNotes = ?,
            moderatedBy = ?,
            moderatedAt = ?
        WHERE id = ?
      `).run(input.notes || null, user.id, now, input.artworkId);

      // Log to moderation history
      db.prepare(`
        INSERT INTO moderation_history (artworkId, previousStatus, newStatus, moderatorId, notes, createdAt)
        VALUES (?, ?, 'approved', ?, ?, ?)
      `).run(input.artworkId, previousStatus, user.id, input.notes || null, now);

      // Send email notification to artist
      const artist = db.prepare(`SELECT u.email, u.name FROM users u 
        INNER JOIN artworks a ON a.artistId = u.id 
        WHERE a.id = ?`).get(input.artworkId) as any;
      
      if (artist?.email) {
        sendArtworkApprovedEmail(
          artist.email,
          artist.name || 'Artist',
          artwork.title,
          input.artworkId
        ).catch(err => console.error('[Email] Failed to send approval email:', err));
        
        // Send WebSocket notification
        if (artist.id) {
          sendNotification(artist.id, {
            type: 'artwork_approved',
            title: 'Artwork Approved!',
            message: `Your artwork "${artwork.title}" has been approved and is now live.`,
            link: `/artwork-passport/${input.artworkId}`,
            artworkId: input.artworkId
          });
        }
      }

      return { 
        success: true, 
        message: 'Artwork approved successfully',
        artworkId: input.artworkId
      };
    }),

  // Reject artwork
  rejectArtwork: protectedProcedure
    .input(z.object({
      artworkId: z.number(),
      reason: z.string().min(10, "Please provide a detailed reason (at least 10 characters)"),
    }))
    .mutation(async ({ input, ctx: { user } }) => {
      if (!user) throw new Error("User not authenticated");
      if (user.role !== 'admin') throw new Error("Unauthorized: Admin access required");
      
      const db = getDb();
      if (!db) throw new Error("Database not available");

      // Get current artwork
      const artwork = db.prepare(`SELECT * FROM artworks WHERE id = ?`).get(input.artworkId) as any;
      if (!artwork) throw new Error("Artwork not found");

      const previousStatus = artwork.moderationStatus;
      const now = Date.now();

      // Update artwork status
      db.prepare(`
        UPDATE artworks 
        SET moderationStatus = 'rejected',
            moderationNotes = ?,
            moderatedBy = ?,
            moderatedAt = ?
        WHERE id = ?
      `).run(input.reason, user.id, now, input.artworkId);

      // Log to moderation history
      db.prepare(`
        INSERT INTO moderation_history (artworkId, previousStatus, newStatus, moderatorId, notes, createdAt)
        VALUES (?, ?, 'rejected', ?, ?, ?)
      `).run(input.artworkId, previousStatus, user.id, input.reason, now);

      // Send email notification to artist with rejection reason
      const artist = db.prepare(`SELECT u.email, u.name FROM users u 
        INNER JOIN artworks a ON a.artistId = u.id 
        WHERE a.id = ?`).get(input.artworkId) as any;
      
      if (artist?.email) {
        sendArtworkRejectedEmail(
          artist.email,
          artist.name || 'Artist',
          artwork.title,
          input.reason
        ).catch(err => console.error('[Email] Failed to send rejection email:', err));
        
        // Send WebSocket notification
        if (artist.id) {
          sendNotification(artist.id, {
            type: 'artwork_rejected',
            title: 'Artwork Needs Revision',
            message: `Your artwork "${artwork.title}" needs some changes. Check the feedback.`,
            link: `/artworks/edit/${input.artworkId}`,
            artworkId: input.artworkId
          });
        }
      }

      return { 
        success: true, 
        message: 'Artwork rejected',
        artworkId: input.artworkId
      };
    }),

  // Get moderation history for an artwork
  getHistory: protectedProcedure
    .input(z.object({
      artworkId: z.number(),
    }))
    .query(async ({ input, ctx: { user } }) => {
      if (!user) throw new Error("User not authenticated");
      if (user.role !== 'admin') throw new Error("Unauthorized: Admin access required");
      
      const db = getDb();
      if (!db) throw new Error("Database not available");

      const history = db.prepare(`
        SELECT 
          mh.*,
          u.name as moderatorName,
          u.avatar as moderatorAvatar
        FROM moderation_history mh
        LEFT JOIN users u ON mh.moderatorId = u.id
        WHERE mh.artworkId = ?
        ORDER BY mh.createdAt DESC
      `).all(input.artworkId);

      return history;
    }),

  // Get moderation statistics
  getStats: protectedProcedure
    .query(async ({ ctx: { user } }) => {
      if (!user) throw new Error("User not authenticated");
      if (user.role !== 'admin') throw new Error("Unauthorized: Admin access required");
      
      const db = getDb();
      if (!db) throw new Error("Database not available");

      const stats = {
        pending: db.prepare(`SELECT COUNT(*) as count FROM artworks WHERE moderationStatus = 'pending'`).get() as any,
        approved: db.prepare(`SELECT COUNT(*) as count FROM artworks WHERE moderationStatus = 'approved'`).get() as any,
        rejected: db.prepare(`SELECT COUNT(*) as count FROM artworks WHERE moderationStatus = 'rejected'`).get() as any,
        total: db.prepare(`SELECT COUNT(*) as count FROM artworks`).get() as any,
      };

      return {
        pending: stats.pending.count,
        approved: stats.approved.count,
        rejected: stats.rejected.count,
        total: stats.total.count,
      };
    }),
});

const appRouter = router({
  stats: statsRouter,
  statistics: statisticsRouter, // Personalized market statistics
  artwork: artworkRouter,
  artist: artistRouter,
  gallery: galleryRouter,
  collector: collectorRouter,
  auction: auctionRouter,
  liveAuction: liveAuctionRouter, // Alias for live auction room
  transaction: transactionRouter,
  news: newsRouter,
  message: messageRouter,
  wishlist: wishlistRouter,
  passport: passportRouter,
  wallet: walletRouter,
  moderation: moderationRouter, // Admin moderation system
  upload: uploadRouter, // File upload to R2
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: protectedProcedure.mutation(() => {
      return { success: true };
    }),
    register: publicProcedure
      .input(z.object({
        email: z.string().email("Invalid email"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        name: z.string().min(2, "Name must be at least 2 characters"),
        role: z.enum(["user", "artist", "collector", "gallery", "partner", "curator", "consultant"]).default("user"),
      }))
      .mutation(async ({ input }) => {
        await registerUser(input.email, input.password, input.name, input.role);
        return { success: true, message: "Registration successful" };
      }),
    login: publicProcedure
      .input(z.object({
        email: z.string().email("Invalid email"),
        password: z.string().min(6, "Invalid password"),
      }))
      .mutation(async ({ input }) => {
        const user = await loginUser(input.email, input.password);
        return { success: true, user };
      }),
    updateProfile: protectedProcedure
      .input(z.object({
        name: z.string().optional(),
        role: z.enum(["user", "artist", "collector", "gallery", "partner", "curator", "consultant"]).optional(),
      }))
      .mutation(async ({ input, ctx: { user } }) => {
        if (!user) throw new Error("User not found");
        return updateUserProfile(user.id, input);
      }),
    createTestAccounts: publicProcedure
      .mutation(async () => {
        return createTestAccounts();
      }),
  }),
});

export { appRouter };
export type AppRouter = typeof appRouter;
