import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  getTotalArtworks,
  getActiveSalesCount,
  getAveragePriceGrowth,
  getTradingVolume,
  getTotalTransactions,
  getAverageLiquidity,
  getHourlyActivity,
  getPriceTrendsByStyle,
  getDemandByStyle,
  getTopArtists
} from "./stats";
import { getDb } from './db';
import { artworks, transactions, artists, galleries, auctions } from '../drizzle/schema';
import { sql, eq, gte, lte, desc, and } from 'drizzle-orm';

// Input schema for filter state
const filterInputSchema = z.object({
  timeRange: z.enum(['24h', '7d', '30d', '90d', '1y', 'all']).default('30d'),
  genres: z.array(z.string()).default([]),
  artists: z.array(z.string()).default([]),
  priceRange: z.object({
    min: z.number().default(0),
    max: z.number().default(1000000),
  }).default({ min: 0, max: 1000000 }),
  galleries: z.array(z.string()).default([]),
  events: z.array(z.string()).default([]),
  sortBy: z.enum(['volume', 'growth', 'popularity', 'recent']).default('volume'),
});

// Helper function to convert timeRange to Date
function getTimeRangeDate(timeRange: '24h' | '7d' | '30d' | '90d' | '1y' | 'all'): Date {
  const now = new Date();
  switch (timeRange) {
    case '24h':
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case '90d':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    case '1y':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    case 'all':
      return new Date(2000, 0, 1);
  }
}

export const statisticsRouter = router({
  // Get overview statistics
  getOverview: publicProcedure
    .input(filterInputSchema)
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const startDate = getTimeRangeDate(input.timeRange);

      // Total artworks
      const totalArtworks = await getTotalArtworks();

      // Active sales
      const activeSales = await getActiveSalesCount();

      // Trading volume
      const volumeResult = await db
        .select({ totalVolume: sql<number>`SUM(CAST(amount AS FLOAT))` })
        .from(transactions)
        .where(gte(transactions.createdAt, startDate));

      // Total transactions
      const transactionsResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(transactions)
        .where(gte(transactions.createdAt, startDate));

      // Average price
      const avgPriceResult = await db
        .select({
          avgPrice: sql<number>`AVG(CAST(current_price AS FLOAT))`
        })
        .from(artworks)
        .where(gte(artworks.createdAt, startDate));

      // Active participants (unique users in transactions)
      const participantsResult = await db
        .select({
          count: sql<number>`COUNT(DISTINCT buyer_id)`
        })
        .from(transactions)
        .where(gte(transactions.createdAt, startDate));

      // Price growth calculation
      const priceGrowthResult = await db
        .select({
          growth: sql<number>`((AVG(CAST(current_price AS FLOAT)) - AVG(CAST(base_price AS FLOAT))) / NULLIF(AVG(CAST(base_price AS FLOAT)), 0)) * 100`
        })
        .from(artworks)
        .where(gte(artworks.createdAt, startDate));

      // Liquidity
      const liquidity = await getAverageLiquidity('month');

      return {
        totalTransactions: transactionsResult[0]?.count || 0,
        totalVolume: volumeResult[0]?.totalVolume || 0,
        averagePrice: avgPriceResult[0]?.avgPrice || 0,
        activeParticipants: participantsResult[0]?.count || 0,
        totalArtworks,
        activeSales,
        priceGrowth: priceGrowthResult[0]?.growth || 0,
        tradingVolume: volumeResult[0]?.totalVolume || 0,
        liquidity: liquidity || 0,
      };
    }),

  // Get personalized collection stats
  getPersonalStats: protectedProcedure
    .input(filterInputSchema)
    .query(async ({ input, ctx: { user } }) => {
      if (!user) throw new Error("User not authenticated");

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const startDate = getTimeRangeDate(input.timeRange);

      // User's collection (owned artworks)
      const collectionResult = await db
        .select({
          count: sql<number>`count(*)`,
          totalValue: sql<number>`SUM(CAST(current_price AS FLOAT))`,
        })
        .from(artworks)
        .where(eq(artworks.ownerId, user.id));

      // User's collection growth
      const growthResult = await db
        .select({
          growth: sql<number>`((SUM(CAST(current_price AS FLOAT)) - SUM(CAST(base_price AS FLOAT))) / NULLIF(SUM(CAST(base_price AS FLOAT)), 0)) * 100`
        })
        .from(artworks)
        .where(eq(artworks.ownerId, user.id));

      // Top performing artwork in user's collection
      const topPerformer = await db
        .select({
          title: artworks.title,
          growth: sql<number>`((CAST(current_price AS FLOAT) - CAST(base_price AS FLOAT)) / NULLIF(CAST(base_price AS FLOAT), 0)) * 100`
        })
        .from(artworks)
        .where(eq(artworks.ownerId, user.id))
        .orderBy(desc(sql`((CAST(current_price AS FLOAT) - CAST(base_price AS FLOAT)) / NULLIF(CAST(base_price AS FLOAT), 0)) * 100`))
        .limit(1);

      // Market average growth for comparison
      const marketGrowthResult = await db
        .select({
          growth: sql<number>`((AVG(CAST(current_price AS FLOAT)) - AVG(CAST(base_price AS FLOAT))) / NULLIF(AVG(CAST(base_price AS FLOAT)), 0)) * 100`
        })
        .from(artworks)
        .where(gte(artworks.createdAt, startDate));

      const myGrowth = growthResult[0]?.growth || 0;
      const marketGrowth = marketGrowthResult[0]?.growth || 0;

      return {
        myCollection: {
          totalValue: collectionResult[0]?.totalValue || 0,
          totalArtworks: collectionResult[0]?.count || 0,
          avgGrowth: myGrowth,
          topPerformer: topPerformer[0]?.title || 'N/A',
        },
        marketComparison: {
          myGrowth,
          marketGrowth,
          difference: myGrowth - marketGrowth,
        },
      };
    }),

  // Get personalized recommendations
  getRecommendations: protectedProcedure
    .query(async ({ ctx: { user } }) => {
      if (!user) throw new Error("User not authenticated");

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get user's most purchased genres
      const userGenres = await db
        .select({
          genre: artworks.genre,
          count: sql<number>`count(*)`
        })
        .from(artworks)
        .where(eq(artworks.ownerId, user.id))
        .groupBy(artworks.genre)
        .orderBy(desc(sql`count(*)`))
        .limit(3);

      // Get trending artists in user's preferred genres
      const trendingArtists = await db
        .select({
          id: artists.id,
          name: artists.userId,
          salesCount: sql<number>`count(distinct transactions.id)`,
        })
        .from(artists)
        .leftJoin(artworks, eq(artworks.artistId, artists.id))
        .leftJoin(transactions, eq(transactions.artworkId, artworks.id))
        .where(sql`${artworks.genre} IN (${userGenres.map(g => g.genre).join(', ')})`)
        .groupBy(artists.id)
        .orderBy(desc(sql`count(distinct transactions.id)`))
        .limit(5);

      // Mock recommendations for now (will be replaced with AI/ML in future)
      return {
        recommendations: [
          {
            type: 'artist' as const,
            name: trendingArtists[0]?.name || 'Artist Name',
            reason: 'Схожий стиль с вашей коллекцией',
            potential: 85,
          },
          {
            type: 'genre' as const,
            name: userGenres[0]?.genre || 'Современное искусство',
            reason: 'Растущий тренд в вашем сегменте',
            potential: 78,
          },
          {
            type: 'event' as const,
            name: 'Аукцион современного искусства',
            reason: 'Интересные лоты по вашим параметрам',
            potential: 92,
          },
        ],
      };
    }),

  // Get grouped data by genres
  getByGenre: publicProcedure
    .input(filterInputSchema)
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const startDate = getTimeRangeDate(input.timeRange);

      const result = await db
        .select({
          name: artworks.genre,
          volume: sql<number>`SUM(CAST(current_price AS FLOAT))`,
          growth: sql<number>`((AVG(CAST(current_price AS FLOAT)) - AVG(CAST(base_price AS FLOAT))) / NULLIF(AVG(CAST(base_price AS FLOAT)), 0)) * 100`,
          count: sql<number>`count(*)`,
        })
        .from(artworks)
        .where(gte(artworks.createdAt, startDate))
        .groupBy(artworks.genre)
        .orderBy(desc(sql`SUM(CAST(current_price AS FLOAT))`))
        .limit(10);

      return { byGenre: result };
    }),

  // Get grouped data by artists
  getByArtist: publicProcedure
    .input(filterInputSchema)
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const startDate = getTimeRangeDate(input.timeRange);

      const result = await db
        .select({
          id: artists.id,
          name: artists.userId,
          sales: sql<number>`count(distinct transactions.id)`,
          revenue: sql<number>`SUM(CAST(transactions.amount AS FLOAT))`,
          growth: sql<number>`((AVG(CAST(artworks.current_price AS FLOAT)) - AVG(CAST(artworks.base_price AS FLOAT))) / NULLIF(AVG(CAST(artworks.base_price AS FLOAT)), 0)) * 100`,
        })
        .from(artists)
        .leftJoin(artworks, eq(artworks.artistId, artists.id))
        .leftJoin(transactions, eq(transactions.artworkId, artworks.id))
        .where(gte(transactions.createdAt, startDate))
        .groupBy(artists.id)
        .orderBy(desc(sql`SUM(CAST(transactions.amount AS FLOAT))`))
        .limit(10);

      return { byArtist: result };
    }),

  // Get grouped data by price range
  getByPriceRange: publicProcedure
    .input(filterInputSchema)
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const priceRanges = [
        { range: '< $1,000', min: 0, max: 1000 },
        { range: '$1,000 - $5,000', min: 1000, max: 5000 },
        { range: '$5,000 - $10,000', min: 5000, max: 10000 },
        { range: '$10,000 - $50,000', min: 10000, max: 50000 },
        { range: '> $50,000', min: 50000, max: 1000000000 },
      ];

      const results = await Promise.all(
        priceRanges.map(async ({ range, min, max }) => {
          const result = await db
            .select({
              count: sql<number>`count(*)`,
              avgPrice: sql<number>`AVG(CAST(current_price AS FLOAT))`,
            })
            .from(artworks)
            .where(
              and(
                gte(artworks.currentPrice, min.toString()),
                lte(artworks.currentPrice, max.toString())
              )
            );

          return {
            range,
            count: result[0]?.count || 0,
            avgPrice: result[0]?.avgPrice || 0,
          };
        })
      );

      return { byPriceRange: results };
    }),

  // Get style trends with demand calculation
  getByStyle: publicProcedure
    .input(filterInputSchema)
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const startDate = getTimeRangeDate(input.timeRange);

      // Get current period data
      const currentResult = await db
        .select({
          style: artworks.genre,
          demand: sql<number>`count(*)`,
        })
        .from(artworks)
        .where(gte(artworks.createdAt, startDate))
        .groupBy(artworks.genre)
        .orderBy(desc(sql`count(*)`));

      // Get previous period data for trend calculation
      const prevStartDate = new Date(startDate.getTime() - (Date.now() - startDate.getTime()));
      const prevResult = await db
        .select({
          style: artworks.genre,
          demand: sql<number>`count(*)`,
        })
        .from(artworks)
        .where(
          and(
            gte(artworks.createdAt, prevStartDate),
            lte(artworks.createdAt, startDate)
          )
        )
        .groupBy(artworks.genre);

      // Calculate trends
      const prevMap = new Map(prevResult.map(r => [r.style, r.demand]));
      const byStyle = currentResult.map(current => {
        const prevDemand = prevMap.get(current.style) || 0;
        let trend: 'up' | 'down' | 'stable' = 'stable';
        if (current.demand > prevDemand * 1.1) trend = 'up';
        else if (current.demand < prevDemand * 0.9) trend = 'down';

        return {
          style: current.style || 'Other',
          demand: current.demand,
          trend,
        };
      });

      return { byStyle };
    }),

  // Export statistics data (returns formatted data for CSV/Excel export)
  exportData: publicProcedure
    .input(filterInputSchema)
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const startDate = getTimeRangeDate(input.timeRange);

      // Get comprehensive data for export
      const artworksData = await db
        .select()
        .from(artworks)
        .where(gte(artworks.createdAt, startDate))
        .limit(1000);

      const transactionsData = await db
        .select()
        .from(transactions)
        .where(gte(transactions.createdAt, startDate))
        .limit(1000);

      return {
        artworks: artworksData,
        transactions: transactionsData,
        exportedAt: new Date().toISOString(),
        timeRange: input.timeRange,
      };
    }),
});
