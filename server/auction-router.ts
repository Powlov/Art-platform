import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { auctions, bids, artworks, users } from "../drizzle/schema-sqlite";
import { eq, and, desc, gt, gte } from "drizzle-orm";

/**
 * Live Auction Room API Router
 * Handles real-time auction operations including:
 * - Fetching active auctions
 * - Placing bids
 * - Getting bid history
 * - Managing auction state
 */

// Input validation schemas
const placeBidSchema = z.object({
  auctionId: z.number().positive(),
  amount: z.number().positive(),
  isAutomatic: z.boolean().optional().default(false),
});

const getAuctionSchema = z.object({
  auctionId: z.number().positive(),
});

const getBidHistorySchema = z.object({
  auctionId: z.number().positive(),
  limit: z.number().min(1).max(100).optional().default(10),
  offset: z.number().min(0).optional().default(0),
});

const createAuctionSchema = z.object({
  artworkId: z.number().positive(),
  startPrice: z.number().positive(),
  minIncrement: z.number().positive().optional().default(10000),
  durationMinutes: z.number().min(5).max(1440).optional().default(60), // 5 min to 24 hours
});

const getActiveAuctionsSchema = z.object({
  limit: z.number().min(1).max(50).optional().default(10),
  offset: z.number().min(0).optional().default(0),
  status: z.enum(["all", "live", "upcoming", "completed"]).optional().default("all"),
});

/**
 * Auction Router
 */
export const auctionRouter = router({
  /**
   * Get active auctions list
   */
  getActiveAuctions: publicProcedure
    .input(getActiveAuctionsSchema)
    .query(async ({ input }) => {
      const { limit, offset, status } = input;
      const now = new Date();
      const db = getDb();

      if (!db) {
        throw new Error("Database not available");
      }

      try {
        let query = db
          .select({
            auction: auctions,
            artwork: artworks,
            highestBidder: users,
          })
          .from(auctions)
          .leftJoin(artworks, eq(auctions.artworkId, artworks.id))
          .leftJoin(users, eq(auctions.highestBidderId, users.id))
          .limit(limit)
          .offset(offset);

        // Filter by status
        if (status === "live") {
          query = query.where(
            and(
              eq(auctions.status, "active"),
              gte(auctions.endTime, now)
            )
          );
        } else if (status === "upcoming") {
          query = query.where(
            and(
              eq(auctions.status, "pending"),
              gt(auctions.startTime, now)
            )
          );
        } else if (status === "completed") {
          query = query.where(eq(auctions.status, "completed"));
        }

        const results = await query;

        // Transform results
        return results.map((row) => ({
          id: row.auction.id,
          artworkId: row.auction.artworkId,
          artworkTitle: row.artwork?.title || "Unknown Artwork",
          artworkImage: row.artwork?.imageUrl || "",
          artistName: "Artist Name", // Would need join with artists table
          startPrice: parseFloat(row.auction.startPrice || "0"),
          currentBid: parseFloat(row.auction.currentBid || row.auction.startPrice || "0"),
          minIncrement: 10000, // Default, should come from auction settings
          highestBidder: row.highestBidder
            ? {
                id: row.highestBidder.id,
                name: row.highestBidder.name || "Anonymous",
                avatar: row.highestBidder.avatar || "",
              }
            : null,
          startTime: row.auction.startTime,
          endTime: row.auction.endTime,
          status: row.auction.status,
          bidsCount: row.auction.bidsCount || 0,
          watchers: 0, // Would need separate watchers table
          isHot: (row.auction.bidsCount || 0) > 20,
        }));
      } catch (error) {
        console.error("Error fetching active auctions:", error);
        throw new Error("Failed to fetch active auctions");
      }
    }),

  /**
   * Get specific auction details
   */
  getAuction: publicProcedure
    .input(getAuctionSchema)
    .query(async ({ input }) => {
      const { auctionId } = input;
      const db = getDb();

      if (!db) {
        throw new Error("Database not available");
      }

      try {
        const result = await db
          .select({
            auction: auctions,
            artwork: artworks,
            highestBidder: users,
          })
          .from(auctions)
          .leftJoin(artworks, eq(auctions.artworkId, artworks.id))
          .leftJoin(users, eq(auctions.highestBidderId, users.id))
          .where(eq(auctions.id, auctionId))
          .limit(1);

        if (!result || result.length === 0) {
          throw new Error("Auction not found");
        }

        const row = result[0];
        return {
          id: row.auction.id,
          artworkId: row.auction.artworkId,
          artwork: {
            id: row.artwork?.id || 0,
            title: row.artwork?.title || "Unknown Artwork",
            description: row.artwork?.description || "",
            imageUrl: row.artwork?.imageUrl || "",
            year: row.artwork?.year || new Date().getFullYear(),
            medium: row.artwork?.medium || "Unknown",
            dimensions: row.artwork?.dimensions || "Unknown",
            technique: row.artwork?.technique || "Unknown",
          },
          startPrice: parseFloat(row.auction.startPrice || "0"),
          currentBid: parseFloat(row.auction.currentBid || row.auction.startPrice || "0"),
          minIncrement: 10000,
          highestBidder: row.highestBidder
            ? {
                id: row.highestBidder.id,
                name: row.highestBidder.name || "Anonymous",
                avatar: row.highestBidder.avatar || "",
              }
            : null,
          startTime: row.auction.startTime,
          endTime: row.auction.endTime,
          status: row.auction.status,
          bidsCount: row.auction.bidsCount || 0,
          watchers: 0,
          isHot: (row.auction.bidsCount || 0) > 20,
        };
      } catch (error) {
        console.error("Error fetching auction:", error);
        throw new Error("Failed to fetch auction details");
      }
    }),

  /**
   * Get bid history for an auction
   */
  getBidHistory: publicProcedure
    .input(getBidHistorySchema)
    .query(async ({ input }) => {
      const { auctionId, limit, offset } = input;
      const db = getDb();

      if (!db) {
        throw new Error("Database not available");
      }

      try {
        const results = await db
          .select({
            bid: bids,
            bidder: users,
          })
          .from(bids)
          .leftJoin(users, eq(bids.bidderId, users.id))
          .where(eq(bids.auctionId, auctionId))
          .orderBy(desc(bids.timestamp))
          .limit(limit)
          .offset(offset);

        return results.map((row) => ({
          id: row.bid.id,
          auctionId: row.bid.auctionId,
          amount: parseFloat(row.bid.amount || "0"),
          timestamp: row.bid.timestamp,
          bidder: {
            id: row.bidder?.id || 0,
            name: row.bidder?.name || "Anonymous",
            avatar: row.bidder?.avatar || "",
          },
          isAutomatic: false, // Would need to track this in bids table
        }));
      } catch (error) {
        console.error("Error fetching bid history:", error);
        throw new Error("Failed to fetch bid history");
      }
    }),

  /**
   * Place a bid (protected - requires authentication)
   */
  placeBid: protectedProcedure
    .input(placeBidSchema)
    .mutation(async ({ input, ctx }) => {
      const { auctionId, amount, isAutomatic } = input;
      const userId = ctx.user?.id;

      if (!userId) {
        throw new Error("Authentication required");
      }

      const db = getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      try {
        // Get auction details
        const auctionResult = await db
          .select()
          .from(auctions)
          .where(eq(auctions.id, auctionId))
          .limit(1);

        if (!auctionResult || auctionResult.length === 0) {
          throw new Error("Auction not found");
        }

        const auction = auctionResult[0];

        // Validate auction status
        if (auction.status !== "active") {
          throw new Error("Auction is not active");
        }

        // Check if auction has ended
        if (new Date() > new Date(auction.endTime)) {
          throw new Error("Auction has ended");
        }

        // Validate bid amount
        const currentBid = parseFloat(auction.currentBid || auction.startPrice || "0");
        const minBid = currentBid + 10000; // Default increment

        if (amount < minBid) {
          throw new Error(`Minimum bid is ₽${minBid.toLocaleString()}`);
        }

        // Check if user is already highest bidder
        if (auction.highestBidderId === userId) {
          throw new Error("You are already the highest bidder");
        }

        // Insert bid
        await db.insert(bids).values({
          auctionId,
          bidderId: userId,
          amount: amount.toString(),
          timestamp: new Date(),
        });

        // Update auction
        await db
          .update(auctions)
          .set({
            currentBid: amount.toString(),
            highestBidderId: userId,
            bidsCount: (auction.bidsCount || 0) + 1,
            updatedAt: new Date(),
          })
          .where(eq(auctions.id, auctionId));

        return {
          success: true,
          newBid: {
            id: Date.now(), // Would be returned from insert
            auctionId,
            amount,
            timestamp: new Date(),
            bidder: {
              id: userId,
              name: ctx.user?.name || "You",
              avatar: ctx.user?.avatar || "",
            },
            isAutomatic,
          },
        };
      } catch (error) {
        console.error("Error placing bid:", error);
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Failed to place bid");
      }
    }),

  /**
   * Create a new auction (admin/gallery only)
   */
  createAuction: protectedProcedure
    .input(createAuctionSchema)
    .mutation(async ({ input, ctx }) => {
      const { artworkId, startPrice, minIncrement, durationMinutes } = input;
      const userId = ctx.user?.id;

      if (!userId) {
        throw new Error("Authentication required");
      }

      // Check user role (admin, gallery, or artwork owner)
      const userRole = ctx.user?.role;
      if (!["admin", "gallery", "artist"].includes(userRole || "")) {
        throw new Error("Insufficient permissions");
      }

      const db = getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      try {
        // Verify artwork exists and is available
        const artworkResult = await db
          .select()
          .from(artworks)
          .where(eq(artworks.id, artworkId))
          .limit(1);

        if (!artworkResult || artworkResult.length === 0) {
          throw new Error("Artwork not found");
        }

        const artwork = artworkResult[0];
        if (artwork.status === "sold" || artwork.status === "auction") {
          throw new Error("Artwork is not available for auction");
        }

        // Create auction
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);

        await db.insert(auctions).values({
          artworkId,
          startPrice: startPrice.toString(),
          currentBid: startPrice.toString(),
          highestBidderId: null,
          startTime,
          endTime,
          status: "active",
          bidsCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Update artwork status
        await db
          .update(artworks)
          .set({
            status: "auction",
            updatedAt: new Date(),
          })
          .where(eq(artworks.id, artworkId));

        return {
          success: true,
          message: "Auction created successfully",
        };
      } catch (error) {
        console.error("Error creating auction:", error);
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Failed to create auction");
      }
    }),

  /**
   * Get auction participants (users who have bid)
   */
  getParticipants: publicProcedure
    .input(getAuctionSchema)
    .query(async ({ input }) => {
      const { auctionId } = input;
      const db = getDb();

      if (!db) {
        throw new Error("Database not available");
      }

      try {
        // Get unique bidders with their bid counts
        const results = await db
          .select({
            bidder: users,
            bid: bids,
          })
          .from(bids)
          .leftJoin(users, eq(bids.bidderId, users.id))
          .where(eq(bids.auctionId, auctionId))
          .orderBy(desc(bids.timestamp));

        // Group by user and count bids
        const participantsMap = new Map();
        
        results.forEach((row) => {
          if (row.bidder) {
            const userId = row.bidder.id;
            if (!participantsMap.has(userId)) {
              participantsMap.set(userId, {
                id: userId,
                name: row.bidder.name || "Anonymous",
                avatar: row.bidder.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
                bidCount: 1,
                isActive: true, // Could check last bid time
              });
            } else {
              const participant = participantsMap.get(userId);
              participant.bidCount += 1;
            }
          }
        });

        return Array.from(participantsMap.values()).slice(0, 10); // Top 10 participants
      } catch (error) {
        console.error("Error fetching participants:", error);
        throw new Error("Failed to fetch participants");
      }
    }),

  /**
   * Get auction statistics
   */
  getAuctionStats: publicProcedure
    .input(getAuctionSchema)
    .query(async ({ input }) => {
      const { auctionId } = input;
      const db = getDb();

      if (!db) {
        throw new Error("Database not available");
      }

      try {
        const auction = await db
          .select()
          .from(auctions)
          .where(eq(auctions.id, auctionId))
          .limit(1);

        if (!auction || auction.length === 0) {
          throw new Error("Auction not found");
        }

        const bidResults = await db
          .select()
          .from(bids)
          .where(eq(bids.auctionId, auctionId));

        const totalBids = bidResults.length;
        const uniqueBidders = new Set(bidResults.map((b) => b.bidderId)).size;
        const avgBidIncrement =
          totalBids > 1
            ? (parseFloat(auction[0].currentBid || "0") - parseFloat(auction[0].startPrice || "0")) / (totalBids - 1)
            : 0;

        return {
          totalBids,
          uniqueBidders,
          avgBidIncrement,
          startPrice: parseFloat(auction[0].startPrice || "0"),
          currentBid: parseFloat(auction[0].currentBid || "0"),
          priceIncrease: parseFloat(auction[0].currentBid || "0") - parseFloat(auction[0].startPrice || "0"),
          priceIncreasePercent:
            ((parseFloat(auction[0].currentBid || "0") - parseFloat(auction[0].startPrice || "0")) /
              parseFloat(auction[0].startPrice || "1")) *
            100,
        };
      } catch (error) {
        console.error("Error fetching auction stats:", error);
        throw new Error("Failed to fetch auction statistics");
      }
    }),
});

export default auctionRouter;
