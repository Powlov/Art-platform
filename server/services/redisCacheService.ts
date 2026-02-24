import { createClient, RedisClientType } from 'redis';

/**
 * Redis Cache Service for Graph Trust
 * 
 * Caches frequently accessed graph queries to reduce Neo4j load
 */

export class RedisCacheService {
  private client: RedisClientType | null = null;
  private url: string;
  private password: string;

  constructor() {
    this.url = process.env.REDIS_URL || 'redis://localhost:6379';
    this.password = process.env.REDIS_PASSWORD || 'artbank2026';
  }

  /**
   * Connect to Redis
   */
  async connect(): Promise<void> {
    try {
      this.client = createClient({
        url: this.url,
        password: this.password,
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > 10) {
              return new Error('Redis connection failed after 10 retries');
            }
            return retries * 100;
          },
        },
      });

      this.client.on('error', (err) => console.error('Redis Client Error:', err));
      this.client.on('connect', () => console.log('✅ Redis connected'));
      this.client.on('reconnecting', () => console.log('🔄 Redis reconnecting...'));

      await this.client.connect();
    } catch (error) {
      console.error('❌ Redis connection failed:', error);
      throw error;
    }
  }

  /**
   * Get cached value
   */
  async get<T = any>(key: string): Promise<T | null> {
    if (!this.client) throw new Error('Redis not connected');

    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  }

  /**
   * Set cached value with TTL
   */
  async set(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
    if (!this.client) throw new Error('Redis not connected');

    try {
      await this.client.setEx(key, ttlSeconds, JSON.stringify(value));
    } catch (error) {
      console.error('Redis SET error:', error);
    }
  }

  /**
   * Delete cached value
   */
  async del(key: string): Promise<void> {
    if (!this.client) throw new Error('Redis not connected');

    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Redis DEL error:', error);
    }
  }

  /**
   * Delete by pattern (e.g., "artwork:*")
   */
  async delPattern(pattern: string): Promise<void> {
    if (!this.client) throw new Error('Redis not connected');

    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
    } catch (error) {
      console.error('Redis DELPATTERN error:', error);
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    if (!this.client) throw new Error('Redis not connected');

    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis EXISTS error:', error);
      return false;
    }
  }

  /**
   * Get TTL (time to live) for key
   */
  async ttl(key: string): Promise<number> {
    if (!this.client) throw new Error('Redis not connected');

    try {
      return await this.client.ttl(key);
    } catch (error) {
      console.error('Redis TTL error:', error);
      return -1;
    }
  }

  /**
   * Increment counter
   */
  async incr(key: string): Promise<number> {
    if (!this.client) throw new Error('Redis not connected');

    try {
      return await this.client.incr(key);
    } catch (error) {
      console.error('Redis INCR error:', error);
      return 0;
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<any> {
    if (!this.client) throw new Error('Redis not connected');

    try {
      const info = await this.client.info('stats');
      const lines = info.split('\r\n');
      const stats: any = {};

      lines.forEach(line => {
        const [key, value] = line.split(':');
        if (key && value) {
          stats[key] = value;
        }
      });

      return {
        totalConnectionsReceived: parseInt(stats.total_connections_received || '0'),
        totalCommandsProcessed: parseInt(stats.total_commands_processed || '0'),
        instantaneousOpsPerSec: parseInt(stats.instantaneous_ops_per_sec || '0'),
        totalNetInputBytes: parseInt(stats.total_net_input_bytes || '0'),
        totalNetOutputBytes: parseInt(stats.total_net_output_bytes || '0'),
        keyspaceHits: parseInt(stats.keyspace_hits || '0'),
        keyspaceMisses: parseInt(stats.keyspace_misses || '0'),
        evictedKeys: parseInt(stats.evicted_keys || '0'),
      };
    } catch (error) {
      console.error('Redis STATS error:', error);
      return null;
    }
  }

  /**
   * Flush all cache
   */
  async flushAll(): Promise<void> {
    if (!this.client) throw new Error('Redis not connected');

    try {
      await this.client.flushAll();
      console.log('✅ Redis cache flushed');
    } catch (error) {
      console.error('Redis FLUSHALL error:', error);
    }
  }

  /**
   * Close connection
   */
  async close(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      console.log('✅ Redis connection closed');
    }
  }
}

// Singleton instance
export const redisCache = new RedisCacheService();

/**
 * Cache decorator for async functions
 */
export function Cached(ttl: number = 3600) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${propertyKey}:${JSON.stringify(args)}`;

      // Try to get from cache
      const cached = await redisCache.get(cacheKey);
      if (cached !== null) {
        return cached;
      }

      // Execute original method
      const result = await originalMethod.apply(this, args);

      // Store in cache
      await redisCache.set(cacheKey, result, ttl);

      return result;
    };

    return descriptor;
  };
}
