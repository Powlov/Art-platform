/**
 * EMULATED Neo4j Graph Service for Sandbox Development
 * Uses in-memory storage instead of Docker Neo4j
 * Implements core Graph Trust functionality
 */

interface GraphNode {
  id: string;
  type: 'artist' | 'gallery' | 'artwork' | 'collector' | 'transaction';
  name: string;
  trustScore: number;
  verified: boolean;
  digitalId?: string;
  metadata?: Record<string, any>;
  connections: string[];
  createdAt: Date;
}

interface GraphEdge {
  id: string;
  from: string;
  to: string;
  type: 'ownership' | 'exhibition' | 'sale' | 'authentication' | 'provenance';
  timestamp: Date;
  verified: boolean;
  metadata?: Record<string, any>;
}

interface ProvenanceChain {
  artworkId: string;
  chain: Array<{
    nodeId: string;
    nodeName: string;
    nodeType: string;
    edgeType: string;
    timestamp: Date;
    verified: boolean;
  }>;
  trustScore: number;
}

interface TrustScoreResult {
  nodeId: string;
  trustScore: number;
  level: 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Low';
  factors: {
    baseScore: number;
    verificationBonus: number;
    connectionBonus: number;
    networkTrustBonus: number;
  };
  connectionCount: number;
  verifiedConnections: number;
}

interface SimilarArtwork {
  artworkId: string;
  similarity: number;
  commonFactors: string[];
}

interface SuspiciousPattern {
  type: 'circular_ownership' | 'rapid_trades' | 'price_anomaly';
  entities: string[];
  confidence: number;
  evidence: string;
}

interface NetworkStats {
  totalNodes: number;
  totalEdges: number;
  nodesByType: Record<string, number>;
  edgesByType: Record<string, number>;
  avgTrustScore: number;
  verifiedPercentage: number;
}

export class Neo4jGraphServiceEmulated {
  private nodes: Map<string, GraphNode> = new Map();
  private edges: Map<string, GraphEdge> = new Map();
  private connected: boolean = false;

  constructor() {
    console.log('[Neo4jGraphServiceEmulated] Using in-memory graph storage (Docker unavailable)');
  }

  async connect(): Promise<void> {
    this.connected = true;
    await this.initSampleData();
    console.log('[Neo4jGraphServiceEmulated] In-memory graph connected with sample data');
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    console.log('[Neo4jGraphServiceEmulated] Disconnected');
  }

  isConnected(): boolean {
    return this.connected;
  }

  // ===================== NODE OPERATIONS =====================

  async createNode(node: Omit<GraphNode, 'createdAt' | 'connections'>): Promise<GraphNode> {
    const newNode: GraphNode = {
      ...node,
      connections: [],
      createdAt: new Date()
    };
    this.nodes.set(node.id, newNode);
    console.log(`[Neo4j] Created node ${node.id} (${node.type})`);
    return newNode;
  }

  async getNode(nodeId: string): Promise<GraphNode | null> {
    return this.nodes.get(nodeId) || null;
  }

  async getAllNodes(): Promise<GraphNode[]> {
    return Array.from(this.nodes.values());
  }

  async getNodesByType(type: string): Promise<GraphNode[]> {
    return Array.from(this.nodes.values()).filter(n => n.type === type);
  }

  async updateNode(nodeId: string, updates: Partial<GraphNode>): Promise<GraphNode | null> {
    const node = this.nodes.get(nodeId);
    if (!node) return null;

    const updated = { ...node, ...updates };
    this.nodes.set(nodeId, updated);
    console.log(`[Neo4j] Updated node ${nodeId}`);
    return updated;
  }

  async deleteNode(nodeId: string): Promise<boolean> {
    // Remove all connected edges
    const edgesToDelete = Array.from(this.edges.entries())
      .filter(([_, edge]) => edge.from === nodeId || edge.to === nodeId)
      .map(([id, _]) => id);
    
    edgesToDelete.forEach(id => this.edges.delete(id));
    
    const deleted = this.nodes.delete(nodeId);
    if (deleted) console.log(`[Neo4j] Deleted node ${nodeId} and ${edgesToDelete.length} edges`);
    return deleted;
  }

  // ===================== EDGE OPERATIONS =====================

  async createEdge(edge: Omit<GraphEdge, 'timestamp'>): Promise<GraphEdge> {
    const newEdge: GraphEdge = {
      ...edge,
      timestamp: new Date()
    };
    this.edges.set(edge.id, newEdge);

    // Update node connections
    const fromNode = this.nodes.get(edge.from);
    const toNode = this.nodes.get(edge.to);
    
    if (fromNode && !fromNode.connections.includes(edge.to)) {
      fromNode.connections.push(edge.to);
    }
    if (toNode && !toNode.connections.includes(edge.from)) {
      toNode.connections.push(edge.from);
    }

    console.log(`[Neo4j] Created edge ${edge.id}: ${edge.from} --[${edge.type}]--> ${edge.to}`);
    return newEdge;
  }

  async getEdge(edgeId: string): Promise<GraphEdge | null> {
    return this.edges.get(edgeId) || null;
  }

  async getEdgesBetween(fromId: string, toId: string): Promise<GraphEdge[]> {
    return Array.from(this.edges.values()).filter(
      e => (e.from === fromId && e.to === toId) || (e.from === toId && e.to === fromId)
    );
  }

  async getNodeEdges(nodeId: string): Promise<GraphEdge[]> {
    return Array.from(this.edges.values()).filter(
      e => e.from === nodeId || e.to === nodeId
    );
  }

  // ===================== PROVENANCE TRACKING =====================

  async getProvenanceChain(artworkId: string): Promise<ProvenanceChain> {
    const visited = new Set<string>();
    const chain: ProvenanceChain['chain'] = [];
    
    const traverse = (nodeId: string) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      const node = this.nodes.get(nodeId);
      if (!node) return;

      const edges = this.getNodeEdges(nodeId);
      edges.forEach((edge: any) => {
        const targetId = edge.from === nodeId ? edge.to : edge.from;
        const targetNode = this.nodes.get(targetId);
        
        if (targetNode && edge.type === 'provenance') {
          chain.push({
            nodeId: targetNode.id,
            nodeName: targetNode.name,
            nodeType: targetNode.type,
            edgeType: edge.type,
            timestamp: edge.timestamp,
            verified: edge.verified
          });
          traverse(targetId);
        }
      });
    };

    traverse(artworkId);

    // Calculate chain trust score
    const avgTrust = chain.length > 0 
      ? chain.reduce((sum, item) => {
          const node = this.nodes.get(item.nodeId);
          return sum + (node?.trustScore || 0);
        }, 0) / chain.length
      : 0;

    return {
      artworkId,
      chain,
      trustScore: avgTrust
    };
  }

  // ===================== TRUST SCORE CALCULATION =====================

  async calculateTrustScore(nodeId: string): Promise<TrustScoreResult> {
    const node = this.nodes.get(nodeId);
    if (!node) throw new Error(`Node ${nodeId} not found`);

    // Base score
    let baseScore = 85;
    
    // Verification bonus
    let verificationBonus = node.verified ? 10 : 0;
    
    // Connection bonus (0.5 per connection, max 10)
    const connectionCount = node.connections.length;
    let connectionBonus = Math.min(connectionCount * 0.5, 10);
    
    // Network trust bonus (5% of avg connected nodes trust)
    const connectedNodes = node.connections
      .map(id => this.nodes.get(id))
      .filter(n => n !== undefined) as GraphNode[];
    
    const avgConnectedTrust = connectedNodes.length > 0
      ? connectedNodes.reduce((sum, n) => sum + n.trustScore, 0) / connectedNodes.length
      : 0;
    
    let networkTrustBonus = avgConnectedTrust * 0.05;
    
    // Total trust score
    let trustScore = Math.min(baseScore + verificationBonus + connectionBonus + networkTrustBonus, 100);
    
    // Determine level
    let level: TrustScoreResult['level'] = 'Low';
    if (trustScore >= 95) level = 'Excellent';
    else if (trustScore >= 90) level = 'Very Good';
    else if (trustScore >= 85) level = 'Good';
    else if (trustScore >= 75) level = 'Fair';

    // Update node's trust score
    node.trustScore = trustScore;

    const verifiedConnections = connectedNodes.filter(n => n.verified).length;

    return {
      nodeId,
      trustScore,
      level,
      factors: {
        baseScore,
        verificationBonus,
        connectionBonus,
        networkTrustBonus
      },
      connectionCount,
      verifiedConnections
    };
  }

  // ===================== FRAUD DETECTION =====================

  async detectSuspiciousPatterns(artworkId: string): Promise<SuspiciousPattern[]> {
    const patterns: SuspiciousPattern[] = [];

    // Circular ownership detection (wash trading)
    const visited = new Set<string>();
    const path: string[] = [];
    
    const detectCycle = (nodeId: string, depth: number): boolean => {
      if (depth > 5) return false;
      if (path.includes(nodeId)) {
        // Cycle detected
        patterns.push({
          type: 'circular_ownership',
          entities: [...path, nodeId],
          confidence: 0.85,
          evidence: `Circular ownership pattern detected: ${[...path, nodeId].join(' → ')}`
        });
        return true;
      }

      path.push(nodeId);
      visited.add(nodeId);

      const edges = Array.from(this.edges.values()).filter(
        e => e.from === nodeId && e.type === 'ownership'
      );

      for (const edge of edges) {
        if (detectCycle(edge.to, depth + 1)) {
          return true;
        }
      }

      path.pop();
      return false;
    };

    detectCycle(artworkId, 0);

    // Rapid trades detection (5+ trades in 30 days)
    const artworkEdges = Array.from(this.edges.values()).filter(
      e => (e.from === artworkId || e.to === artworkId) && e.type === 'sale'
    );

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentTrades = artworkEdges.filter(e => e.timestamp > thirtyDaysAgo);

    if (recentTrades.length >= 5) {
      patterns.push({
        type: 'rapid_trades',
        entities: recentTrades.map(e => e.from),
        confidence: 0.75,
        evidence: `${recentTrades.length} trades detected in last 30 days (threshold: 5)`
      });
    }

    console.log(`[Neo4j] Detected ${patterns.length} suspicious patterns for artwork ${artworkId}`);
    return patterns;
  }

  // ===================== SIMILARITY ANALYSIS =====================

  async findSimilarArtworks(artworkId: string, limit: number = 5): Promise<SimilarArtwork[]> {
    const artwork = this.nodes.get(artworkId);
    if (!artwork || artwork.type !== 'artwork') return [];

    const allArtworks = Array.from(this.nodes.values()).filter(
      n => n.type === 'artwork' && n.id !== artworkId
    );

    const similarities = allArtworks.map(other => {
      const commonConnections = artwork.connections.filter(c => other.connections.includes(c));
      const similarity = (commonConnections.length / Math.max(artwork.connections.length, other.connections.length)) * 100;

      return {
        artworkId: other.id,
        similarity,
        commonFactors: commonConnections
      };
    });

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }

  // ===================== NETWORK STATISTICS =====================

  async getNetworkStats(): Promise<NetworkStats> {
    const totalNodes = this.nodes.size;
    const totalEdges = this.edges.size;

    const nodesByType: Record<string, number> = {};
    const edgesByType: Record<string, number> = {};

    this.nodes.forEach(node => {
      nodesByType[node.type] = (nodesByType[node.type] || 0) + 1;
    });

    this.edges.forEach(edge => {
      edgesByType[edge.type] = (edgesByType[edge.type] || 0) + 1;
    });

    const allScores = Array.from(this.nodes.values()).map(n => n.trustScore);
    const avgTrustScore = allScores.length > 0 
      ? allScores.reduce((sum, score) => sum + score, 0) / allScores.length
      : 0;

    const verifiedCount = Array.from(this.nodes.values()).filter(n => n.verified).length;
    const verifiedPercentage = totalNodes > 0 ? (verifiedCount / totalNodes) * 100 : 0;

    return {
      totalNodes,
      totalEdges,
      nodesByType,
      edgesByType,
      avgTrustScore: Math.round(avgTrustScore * 10) / 10,
      verifiedPercentage: Math.round(verifiedPercentage * 10) / 10
    };
  }

  // ===================== SHORTEST PATH =====================

  async getShortestPath(fromId: string, toId: string): Promise<string[]> {
    const queue: Array<{ nodeId: string; path: string[] }> = [{ nodeId: fromId, path: [fromId] }];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const current = queue.shift()!;
      
      if (current.nodeId === toId) {
        return current.path;
      }

      if (visited.has(current.nodeId)) continue;
      visited.add(current.nodeId);

      const node = this.nodes.get(current.nodeId);
      if (!node) continue;

      node.connections.forEach(connId => {
        if (!visited.has(connId)) {
          queue.push({
            nodeId: connId,
            path: [...current.path, connId]
          });
        }
      });
    }

    return []; // No path found
  }

  // ===================== SAMPLE DATA INITIALIZATION =====================

  private async initSampleData(): Promise<void> {
    // Artists
    await this.createNode({
      id: 'artist-001',
      type: 'artist',
      name: 'Василий Кандинский',
      trustScore: 98.5,
      verified: true,
      digitalId: 'did:artbank:artist-001',
      metadata: { birthYear: 1866, nationality: 'Russian' }
    });

    await this.createNode({
      id: 'artist-002',
      type: 'artist',
      name: 'Казимир Малевич',
      trustScore: 99.2,
      verified: true,
      digitalId: 'did:artbank:artist-002',
      metadata: { birthYear: 1879, nationality: 'Russian-Ukrainian' }
    });

    await this.createNode({
      id: 'artist-003',
      type: 'artist',
      name: 'Марк Шагал',
      trustScore: 97.8,
      verified: true,
      digitalId: 'did:artbank:artist-003',
      metadata: { birthYear: 1887, nationality: 'Russian-French' }
    });

    // Galleries
    await this.createNode({
      id: 'gallery-001',
      type: 'gallery',
      name: 'Третьяковская галерея',
      trustScore: 99.8,
      verified: true,
      digitalId: 'did:artbank:gallery-001',
      metadata: { location: 'Moscow', established: 1856 }
    });

    await this.createNode({
      id: 'gallery-002',
      type: 'gallery',
      name: 'Эрмитаж',
      trustScore: 99.9,
      verified: true,
      digitalId: 'did:artbank:gallery-002',
      metadata: { location: 'Saint Petersburg', established: 1764 }
    });

    await this.createNode({
      id: 'gallery-003',
      type: 'gallery',
      name: 'ГМИИ им. Пушкина',
      trustScore: 99.7,
      verified: true,
      digitalId: 'did:artbank:gallery-003',
      metadata: { location: 'Moscow', established: 1912 }
    });

    // Artworks
    await this.createNode({
      id: 'artwork-001',
      type: 'artwork',
      name: 'Композиция VIII',
      trustScore: 96.5,
      verified: true,
      digitalId: 'did:artbank:artwork-001',
      metadata: { 
        year: 1923, 
        medium: 'Oil on canvas',
        currentValue: 15000000,
        artistId: 'artist-001'
      }
    });

    await this.createNode({
      id: 'artwork-002',
      type: 'artwork',
      name: 'Чёрный квадрат',
      trustScore: 99.5,
      verified: true,
      digitalId: 'did:artbank:artwork-002',
      metadata: { 
        year: 1915, 
        medium: 'Oil on canvas',
        currentValue: 50000000,
        artistId: 'artist-002'
      }
    });

    await this.createNode({
      id: 'artwork-003',
      type: 'artwork',
      name: 'Я и деревня',
      trustScore: 97.2,
      verified: true,
      digitalId: 'did:artbank:artwork-003',
      metadata: { 
        year: 1911, 
        medium: 'Oil on canvas',
        currentValue: 35000000,
        artistId: 'artist-003'
      }
    });

    // Collectors
    await this.createNode({
      id: 'collector-001',
      type: 'collector',
      name: 'Коллекционер А. Иванов',
      trustScore: 92.3,
      verified: true,
      digitalId: 'did:artbank:collector-001',
      metadata: { registrationYear: 2015 }
    });

    await this.createNode({
      id: 'collector-002',
      type: 'collector',
      name: 'Фонд "Современное искусство"',
      trustScore: 94.7,
      verified: true,
      digitalId: 'did:artbank:collector-002',
      metadata: { registrationYear: 2010 }
    });

    // Relationships
    await this.createEdge({
      id: 'edge-001',
      from: 'artist-001',
      to: 'artwork-001',
      type: 'authentication',
      verified: true,
      metadata: { role: 'creator' }
    });

    await this.createEdge({
      id: 'edge-002',
      from: 'artwork-001',
      to: 'gallery-001',
      type: 'exhibition',
      verified: true,
      metadata: { year: 1924, exhibition: 'Russian Avant-Garde' }
    });

    await this.createEdge({
      id: 'edge-003',
      from: 'gallery-001',
      to: 'collector-001',
      type: 'sale',
      verified: true,
      metadata: { saleDate: '2020-05-15', price: 12000000 }
    });

    await this.createEdge({
      id: 'edge-004',
      from: 'collector-001',
      to: 'artwork-001',
      type: 'ownership',
      verified: true,
      metadata: { acquiredDate: '2020-05-15' }
    });

    await this.createEdge({
      id: 'edge-005',
      from: 'artist-002',
      to: 'artwork-002',
      type: 'authentication',
      verified: true,
      metadata: { role: 'creator' }
    });

    await this.createEdge({
      id: 'edge-006',
      from: 'artwork-002',
      to: 'gallery-002',
      type: 'exhibition',
      verified: true,
      metadata: { year: 1916, exhibition: 'Suprematism Exhibition' }
    });

    await this.createEdge({
      id: 'edge-007',
      from: 'artist-003',
      to: 'artwork-003',
      type: 'authentication',
      verified: true,
      metadata: { role: 'creator' }
    });

    await this.createEdge({
      id: 'edge-008',
      from: 'artwork-003',
      to: 'gallery-003',
      type: 'exhibition',
      verified: true,
      metadata: { year: 1912, exhibition: 'Modern Art' }
    });

    await this.createEdge({
      id: 'edge-009',
      from: 'artwork-001',
      to: 'artwork-002',
      type: 'provenance',
      verified: true,
      metadata: { relation: 'same_period' }
    });

    await this.createEdge({
      id: 'edge-010',
      from: 'collector-002',
      to: 'artwork-003',
      type: 'ownership',
      verified: true,
      metadata: { acquiredDate: '2018-03-10' }
    });

    console.log('[Neo4j] Sample data initialized: 10 nodes, 10 edges');
  }
}

// Singleton instance
let graphServiceInstance: Neo4jGraphServiceEmulated | null = null;

export async function getGraphService(): Promise<Neo4jGraphServiceEmulated> {
  if (!graphServiceInstance) {
    graphServiceInstance = new Neo4jGraphServiceEmulated();
    await graphServiceInstance.connect();
  }
  return graphServiceInstance;
}
