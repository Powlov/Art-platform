import { getDb } from './db';
import { artworks, transactions, auctions, artists } from '../drizzle/schema';
import { sql, desc, gte, lte } from 'drizzle-orm';

/**
 * Get total artworks count
 */
export async function getTotalArtworks() {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(artworks);

  return result[0]?.count || 0;
}

/**
 * Get active sales count
 */
export async function getActiveSalesCount() {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(artworks)
    .where(sql`status = 'auction' OR status = 'available'`);

  return result[0]?.count || 0;
}

/**
 * Get average price growth
 */
export async function getAveragePriceGrowth(timeRange: 'day' | 'week' | 'month' | 'year' | 'all' = 'month') {
  const db = await getDb();
  if (!db) return 0;

  const now = new Date();
  let startDate = new Date();

  switch (timeRange) {
    case 'day':
      startDate.setDate(now.getDate() - 1);
      break;
    case 'week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      startDate = new Date(2000, 0, 1);
  }

  const result = await db
    .select({
      avgGrowth: sql<number>`AVG(CAST(current_price AS FLOAT) - CAST(base_price AS FLOAT))`,
    })
    .from(artworks)
    .where(gte(artworks.createdAt, startDate));

  return result[0]?.avgGrowth || 0;
}

/**
 * Get trading volume by time range
 */
export async function getTradingVolume(timeRange: 'day' | 'week' | 'month' | 'year' | 'all' = 'month') {
  const db = await getDb();
  if (!db) return 0;

  const now = new Date();
  let startDate = new Date();

  switch (timeRange) {
    case 'day':
      startDate.setDate(now.getDate() - 1);
      break;
    case 'week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      startDate = new Date(2000, 0, 1);
  }

  const result = await db
    .select({
      totalVolume: sql<number>`SUM(CAST(amount AS FLOAT))`,
    })
    .from(transactions)
    .where(gte(transactions.createdAt, startDate));

  return result[0]?.totalVolume || 0;
}

/**
 * Get total transactions count by time range
 */
export async function getTotalTransactions(timeRange: 'day' | 'week' | 'month' | 'year' | 'all' = 'month') {
  const db = await getDb();
  if (!db) return 0;

  const now = new Date();
  let startDate = new Date();

  switch (timeRange) {
    case 'day':
      startDate.setDate(now.getDate() - 1);
      break;
    case 'week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      startDate = new Date(2000, 0, 1);
  }

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(transactions)
    .where(gte(transactions.createdAt, startDate));

  return result[0]?.count || 0;
}

/**
 * Get hourly activity
 */
export async function getHourlyActivity(timeRange: 'day' | 'week' | 'month' | 'year' | 'all' = 'day') {
  const db = await getDb();
  if (!db) return [];

  const now = new Date();
  let startDate = new Date();

  switch (timeRange) {
    case 'day':
      startDate.setDate(now.getDate() - 1);
      break;
    case 'week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      startDate = new Date(2000, 0, 1);
  }

  const result = await db
    .select({
      hour: sql<string>`EXTRACT(HOUR FROM created_at)`,
      count: sql<number>`count(*)`,
    })
    .from(transactions)
    .where(gte(transactions.createdAt, startDate));

  return result || [];
}

/**
 * Get average liquidity
 */
export async function getAverageLiquidity(timeRange: 'day' | 'week' | 'month' | 'year' | 'all' = 'month') {
  const db = await getDb();
  if (!db) return 0;

  const now = new Date();
  let startDate = new Date();

  switch (timeRange) {
    case 'day':
      startDate.setDate(now.getDate() - 1);
      break;
    case 'week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      startDate = new Date(2000, 0, 1);
  }

  // Calculate liquidity as ratio of sold artworks to total artworks
  const totalResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(artworks);

  const soldResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(artworks)
    .where(sql`status = 'sold'`);

  const total = totalResult[0]?.count || 1;
  const sold = soldResult[0]?.count || 0;

  return (sold / total) * 100;
}

/**
 * Get live transaction feed
 */
export async function getLiveTransactionFeed(limit: number = 20, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select()
    .from(transactions)
    .orderBy(desc(transactions.createdAt))
    .limit(limit)
    .offset(offset);

  return result || [];
}

/**
 * Get price trends by style
 */
export async function getPriceTrendsByStyle() {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select({
      style: artworks.genre,
      avgPrice: sql<number>`AVG(CAST(current_price AS FLOAT))`,
      count: sql<number>`count(*)`,
    })
    .from(artworks)
    .groupBy(artworks.genre);

  return result || [];
}

/**
 * Get demand by style
 */
export async function getDemandByStyle() {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select({
      style: artworks.genre,
      demand: sql<number>`count(*)`,
    })
    .from(artworks)
    .groupBy(artworks.genre)
    .orderBy(sql`count(*) DESC`);

  return result || [];
}

/**
 * Get top artists by views/purchases
 */
export async function getTopArtists(limit: number = 10) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select({
      id: artists.id,
      name: artists.userId,
      artworkCount: sql<number>`count(artworks.id)`,
    })
    .from(artists)
    .leftJoin(artworks, sql`artists.id = artworks.artist_id`)
    .groupBy(artists.id)
    .orderBy(sql`count(artworks.id) DESC`)
    .limit(limit);

  return result || [];
}

/**
 * Get statistics dashboard data
 */
export async function getStatisticsDashboard(timeRange: 'day' | 'week' | 'month' | 'year' | 'all' = 'month') {
  return {
    totalArtworks: await getTotalArtworks(),
    activeSales: await getActiveSalesCount(),
    averagePriceGrowth: await getAveragePriceGrowth(timeRange),
    tradingVolume: await getTradingVolume(timeRange),
    totalTransactions: await getTotalTransactions(timeRange),
    averageLiquidity: await getAverageLiquidity(timeRange),
    priceTrendsByStyle: await getPriceTrendsByStyle(),
    demandByStyle: await getDemandByStyle(),
    topArtists: await getTopArtists(),
  };
}
