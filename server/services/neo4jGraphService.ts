import neo4j, { Driver, Session, Transaction } from 'neo4j-driver';

/**
 * Neo4j Graph Database Service for Graph Trust Module
 * 
 * Manages connections, queries, and graph operations for:
 * - Artists, Galleries, Artworks, Collectors
 * - Provenance tracking
 * - Trust score calculations
 * - Relationship analysis
 */

export class Neo4jGraphService {
  private driver: Driver | null = null;
  private uri: string;
  private username: string;
  private password: string;

  constructor() {
    this.uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
    this.username = process.env.NEO4J_USERNAME || 'neo4j';
    this.password = process.env.NEO4J_PASSWORD || 'artbank2026';
  }

  /**
   * Initialize Neo4j connection
   */
  async connect(): Promise<void> {
    try {
      this.driver = neo4j.driver(
        this.uri,
        neo4j.auth.basic(this.username, this.password),
        {
          maxConnectionPoolSize: 50,
          connectionAcquisitionTimeout: 60000,
          maxTransactionRetryTime: 30000,
        }
      );

      // Verify connectivity
      await this.driver.verifyConnectivity();
      console.log('✅ Neo4j connected:', this.uri);

      // Initialize constraints and indexes
      await this.initializeSchema();
    } catch (error) {
      console.error('❌ Neo4j connection failed:', error);
      throw error;
    }
  }

  /**
   * Initialize database schema (constraints, indexes)
   */
  private async initializeSchema(): Promise<void> {
    const session = this.getSession();
    try {
      // Constraints for uniqueness
      await session.run(`
        CREATE CONSTRAINT artist_id IF NOT EXISTS
        FOR (a:Artist) REQUIRE a.id IS UNIQUE
      `);

      await session.run(`
        CREATE CONSTRAINT gallery_id IF NOT EXISTS
        FOR (g:Gallery) REQUIRE g.id IS UNIQUE
      `);

      await session.run(`
        CREATE CONSTRAINT artwork_id IF NOT EXISTS
        FOR (a:Artwork) REQUIRE a.id IS UNIQUE
      `);

      await session.run(`
        CREATE CONSTRAINT collector_id IF NOT EXISTS
        FOR (c:Collector) REQUIRE c.id IS UNIQUE
      `);

      // Indexes for performance
      await session.run(`
        CREATE INDEX artist_name IF NOT EXISTS
        FOR (a:Artist) ON (a.name)
      `);

      await session.run(`
        CREATE INDEX artwork_title IF NOT EXISTS
        FOR (a:Artwork) ON (a.title)
      `);

      await session.run(`
        CREATE INDEX trust_score IF NOT EXISTS
        FOR (n:Artist|Gallery|Collector) ON (n.trustScore)
      `);

      console.log('✅ Neo4j schema initialized');
    } catch (error) {
      console.error('❌ Schema initialization failed:', error);
    } finally {
      await session.close();
    }
  }

  /**
   * Get a new session
   */
  private getSession(): Session {
    if (!this.driver) {
      throw new Error('Neo4j driver not initialized. Call connect() first.');
    }
    return this.driver.session();
  }

  /**
   * Create or update an Artist node
   */
  async createArtist(data: {
    id: string;
    name: string;
    digitalId: string;
    birthYear?: number;
    nationality?: string;
    artMovement?: string;
    trustScore?: number;
    verified?: boolean;
  }): Promise<any> {
    const session = this.getSession();
    try {
      const result = await session.run(
        `
        MERGE (a:Artist {id: $id})
        SET a.name = $name,
            a.digitalId = $digitalId,
            a.birthYear = $birthYear,
            a.nationality = $nationality,
            a.artMovement = $artMovement,
            a.trustScore = COALESCE($trustScore, 85.0),
            a.verified = COALESCE($verified, false),
            a.updatedAt = datetime()
        ON CREATE SET a.createdAt = datetime()
        RETURN a
        `,
        data
      );

      return result.records[0]?.get('a').properties;
    } finally {
      await session.close();
    }
  }

  /**
   * Create or update a Gallery node
   */
  async createGallery(data: {
    id: string;
    name: string;
    digitalId: string;
    established?: number;
    location?: string;
    type?: string;
    trustScore?: number;
    verified?: boolean;
  }): Promise<any> {
    const session = this.getSession();
    try {
      const result = await session.run(
        `
        MERGE (g:Gallery {id: $id})
        SET g.name = $name,
            g.digitalId = $digitalId,
            g.established = $established,
            g.location = $location,
            g.type = $type,
            g.trustScore = COALESCE($trustScore, 85.0),
            g.verified = COALESCE($verified, false),
            g.updatedAt = datetime()
        ON CREATE SET g.createdAt = datetime()
        RETURN g
        `,
        data
      );

      return result.records[0]?.get('g').properties;
    } finally {
      await session.close();
    }
  }

  /**
   * Create or update an Artwork node
   */
  async createArtwork(data: {
    id: string;
    title: string;
    digitalId: string;
    year?: number;
    medium?: string;
    dimensions?: string;
    currentPrice?: number;
    trustScore?: number;
    verified?: boolean;
  }): Promise<any> {
    const session = this.getSession();
    try {
      const result = await session.run(
        `
        MERGE (a:Artwork {id: $id})
        SET a.title = $title,
            a.digitalId = $digitalId,
            a.year = $year,
            a.medium = $medium,
            a.dimensions = $dimensions,
            a.currentPrice = $currentPrice,
            a.trustScore = COALESCE($trustScore, 85.0),
            a.verified = COALESCE($verified, false),
            a.updatedAt = datetime()
        ON CREATE SET a.createdAt = datetime()
        RETURN a
        `,
        data
      );

      return result.records[0]?.get('a').properties;
    } finally {
      await session.close();
    }
  }

  /**
   * Create or update a Collector node
   */
  async createCollector(data: {
    id: string;
    name: string;
    digitalId: string;
    portfolioValue?: number;
    artworksOwned?: number;
    investmentHorizon?: string;
    trustScore?: number;
    verified?: boolean;
  }): Promise<any> {
    const session = this.getSession();
    try {
      const result = await session.run(
        `
        MERGE (c:Collector {id: $id})
        SET c.name = $name,
            c.digitalId = $digitalId,
            c.portfolioValue = $portfolioValue,
            c.artworksOwned = $artworksOwned,
            c.investmentHorizon = $investmentHorizon,
            c.trustScore = COALESCE($trustScore, 85.0),
            c.verified = COALESCE($verified, false),
            c.updatedAt = datetime()
        ON CREATE SET c.createdAt = datetime()
        RETURN c
        `,
        data
      );

      return result.records[0]?.get('c').properties;
    } finally {
      await session.close();
    }
  }

  /**
   * Create CREATED relationship (Artist -> Artwork)
   */
  async createCreatedRelationship(artistId: string, artworkId: string, year?: number): Promise<void> {
    const session = this.getSession();
    try {
      await session.run(
        `
        MATCH (artist:Artist {id: $artistId})
        MATCH (artwork:Artwork {id: $artworkId})
        MERGE (artist)-[r:CREATED]->(artwork)
        SET r.year = $year,
            r.verified = true,
            r.createdAt = datetime()
        `,
        { artistId, artworkId, year }
      );
    } finally {
      await session.close();
    }
  }

  /**
   * Create OWNS relationship (Collector -> Artwork)
   */
  async createOwnsRelationship(
    collectorId: string,
    artworkId: string,
    data: {
      acquiredDate?: string;
      purchasePrice?: number;
      provenance?: string;
    }
  ): Promise<void> {
    const session = this.getSession();
    try {
      await session.run(
        `
        MATCH (collector:Collector {id: $collectorId})
        MATCH (artwork:Artwork {id: $artworkId})
        MERGE (collector)-[r:OWNS]->(artwork)
        SET r.acquiredDate = $acquiredDate,
            r.purchasePrice = $purchasePrice,
            r.provenance = $provenance,
            r.verified = true,
            r.createdAt = datetime()
        `,
        { collectorId, artworkId, ...data }
      );
    } finally {
      await session.close();
    }
  }

  /**
   * Create EXHIBITED relationship (Gallery -> Artwork)
   */
  async createExhibitedRelationship(
    galleryId: string,
    artworkId: string,
    data: {
      exhibitionName?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<void> {
    const session = this.getSession();
    try {
      await session.run(
        `
        MATCH (gallery:Gallery {id: $galleryId})
        MATCH (artwork:Artwork {id: $artworkId})
        MERGE (gallery)-[r:EXHIBITED]->(artwork)
        SET r.exhibitionName = $exhibitionName,
            r.startDate = $startDate,
            r.endDate = $endDate,
            r.verified = true,
            r.createdAt = datetime()
        `,
        { galleryId, artworkId, ...data }
      );
    } finally {
      await session.close();
    }
  }

  /**
   * Get artwork provenance chain
   */
  async getProvenanceChain(artworkId: string): Promise<any[]> {
    const session = this.getSession();
    try {
      const result = await session.run(
        `
        MATCH path = (artwork:Artwork {id: $artworkId})<-[r*]-(n)
        WHERE r IS NOT NULL
        RETURN path
        ORDER BY length(path) DESC
        LIMIT 10
        `,
        { artworkId }
      );

      return result.records.map(record => {
        const path = record.get('path');
        return {
          nodes: path.segments.map((seg: any) => seg.start.properties),
          relationships: path.segments.map((seg: any) => ({
            type: seg.relationship.type,
            properties: seg.relationship.properties,
          })),
        };
      });
    } finally {
      await session.close();
    }
  }

  /**
   * Calculate trust score based on connections
   */
  async calculateTrustScore(nodeId: string): Promise<number> {
    const session = this.getSession();
    try {
      const result = await session.run(
        `
        MATCH (n {id: $nodeId})
        OPTIONAL MATCH (n)-[r]-(connected)
        WITH n, count(r) as connections,
             avg(connected.trustScore) as avgConnectedTrust
        RETURN n.verified as verified,
               connections,
               avgConnectedTrust
        `,
        { nodeId }
      );

      if (result.records.length === 0) return 85.0;

      const record = result.records[0];
      const verified = record.get('verified');
      const connections = record.get('connections').toNumber();
      const avgConnectedTrust = record.get('avgConnectedTrust') || 85.0;

      // Trust score formula:
      // Base: 85
      // +10 if verified
      // +0.5 per connection (max +10)
      // +5% of average connected trust
      let trustScore = 85.0;
      if (verified) trustScore += 10;
      trustScore += Math.min(connections * 0.5, 10);
      trustScore += avgConnectedTrust * 0.05;

      return Math.min(trustScore, 100);
    } finally {
      await session.close();
    }
  }

  /**
   * Find similar artworks based on artist, style, medium
   */
  async findSimilarArtworks(artworkId: string, limit: number = 10): Promise<any[]> {
    const session = this.getSession();
    try {
      const result = await session.run(
        `
        MATCH (artwork:Artwork {id: $artworkId})<-[:CREATED]-(artist:Artist)
        MATCH (artist)-[:CREATED]->(similar:Artwork)
        WHERE similar.id <> $artworkId
        WITH similar, artwork
        MATCH (similar)<-[:OWNS]-(collector:Collector)
        RETURN similar, count(collector) as popularity
        ORDER BY popularity DESC, similar.trustScore DESC
        LIMIT $limit
        `,
        { artworkId, limit }
      );

      return result.records.map(record => ({
        ...record.get('similar').properties,
        popularity: record.get('popularity').toNumber(),
      }));
    } finally {
      await session.close();
    }
  }

  /**
   * Get shortest path between two nodes (provenance analysis)
   */
  async getShortestPath(fromId: string, toId: string): Promise<any> {
    const session = this.getSession();
    try {
      const result = await session.run(
        `
        MATCH (from {id: $fromId}), (to {id: $toId})
        MATCH path = shortestPath((from)-[*]-(to))
        RETURN path, length(path) as pathLength
        `,
        { fromId, toId }
      );

      if (result.records.length === 0) return null;

      const record = result.records[0];
      const path = record.get('path');
      const pathLength = record.get('pathLength').toNumber();

      return {
        pathLength,
        nodes: path.segments.map((seg: any) => seg.start.properties),
        relationships: path.segments.map((seg: any) => ({
          type: seg.relationship.type,
          properties: seg.relationship.properties,
        })),
      };
    } finally {
      await session.close();
    }
  }

  /**
   * Detect suspicious patterns (fraud detection)
   */
  async detectSuspiciousPatterns(artworkId: string): Promise<any[]> {
    const session = this.getSession();
    try {
      // Detect circular ownership (wash trading)
      const result = await session.run(
        `
        MATCH path = (artwork:Artwork {id: $artworkId})<-[:OWNS*2..5]-(artwork)
        WHERE length(path) >= 2
        RETURN path, length(path) as cycleLength
        ORDER BY cycleLength ASC
        LIMIT 5
        `,
        { artworkId }
      );

      return result.records.map(record => ({
        type: 'circular_ownership',
        severity: 'high',
        cycleLength: record.get('cycleLength').toNumber(),
        path: record.get('path').segments.map((seg: any) => ({
          node: seg.start.properties,
          relationship: seg.relationship.properties,
        })),
      }));
    } finally {
      await session.close();
    }
  }

  /**
   * Get network statistics
   */
  async getNetworkStats(): Promise<any> {
    const session = this.getSession();
    try {
      const result = await session.run(`
        MATCH (n)
        WITH labels(n)[0] as label, count(n) as count
        RETURN label, count
        UNION
        MATCH ()-[r]->()
        WITH type(r) as relType, count(r) as count
        RETURN relType as label, count
      `);

      const stats: any = {
        nodes: {},
        relationships: {},
        totalNodes: 0,
        totalRelationships: 0,
      };

      result.records.forEach(record => {
        const label = record.get('label');
        const count = record.get('count').toNumber();

        if (['Artist', 'Gallery', 'Artwork', 'Collector'].includes(label)) {
          stats.nodes[label] = count;
          stats.totalNodes += count;
        } else {
          stats.relationships[label] = count;
          stats.totalRelationships += count;
        }
      });

      return stats;
    } finally {
      await session.close();
    }
  }

  /**
   * Close Neo4j connection
   */
  async close(): Promise<void> {
    if (this.driver) {
      await this.driver.close();
      console.log('✅ Neo4j connection closed');
    }
  }
}

// Singleton instance
export const neo4jService = new Neo4jGraphService();
