// ============================================================================
// ART-OS Neo4j Graph Schema
// ============================================================================
// Version: 1.0.0
// Date: 2026-03-15
// Description: Graph database schema for Art-OS provenance and relationships
// ============================================================================

// ============================================================================
// CONSTRAINTS & INDEXES
// ============================================================================

// Asset (Artwork) constraints
CREATE CONSTRAINT asset_id_unique IF NOT EXISTS FOR (a:Asset) REQUIRE a.id IS UNIQUE;
CREATE INDEX asset_title_idx IF NOT EXISTS FOR (a:Asset) ON (a.title);
CREATE INDEX asset_status_idx IF NOT EXISTS FOR (a:Asset) ON (a.status);
CREATE INDEX asset_category_idx IF NOT EXISTS FOR (a:Asset) ON (a.category);

// Person constraints
CREATE CONSTRAINT person_id_unique IF NOT EXISTS FOR (p:Person) REQUIRE p.id IS UNIQUE;
CREATE INDEX person_email_idx IF NOT EXISTS FOR (p:Person) ON (p.email);
CREATE INDEX person_role_idx IF NOT EXISTS FOR (p:Person) ON (p.role);

// Entity (Gallery, Institution) constraints
CREATE CONSTRAINT entity_id_unique IF NOT EXISTS FOR (e:Entity) REQUIRE e.id IS UNIQUE;
CREATE INDEX entity_type_idx IF NOT EXISTS FOR (e:Entity) ON (e.type);

// Transaction constraints
CREATE CONSTRAINT transaction_id_unique IF NOT EXISTS FOR (t:Transaction) REQUIRE t.id IS UNIQUE;
CREATE INDEX transaction_date_idx IF NOT EXISTS FOR (t:Transaction) ON (t.date);

// Event constraints
CREATE CONSTRAINT event_id_unique IF NOT EXISTS FOR (ev:Event) REQUIRE ev.id IS UNIQUE;
CREATE INDEX event_type_idx IF NOT EXISTS FOR (ev:Event) ON (ev.type);
CREATE INDEX event_date_idx IF NOT EXISTS FOR (ev:Event) ON (ev.date);

// MediaItem constraints
CREATE CONSTRAINT media_id_unique IF NOT EXISTS FOR (m:MediaItem) REQUIRE m.id IS UNIQUE;
CREATE INDEX media_published_idx IF NOT EXISTS FOR (m:MediaItem) ON (m.published_at);

// ============================================================================
// NODE LABELS & PROPERTIES
// ============================================================================

// Asset (Artwork) node properties:
// - id: UUID
// - title: string
// - description: text
// - category: string (painting, sculpture, photography, etc.)
// - medium: string
// - year_created: integer
// - width_cm, height_cm, depth_cm: float
// - current_price: float
// - currency: string
// - status: string (available, sold, auction, etc.)
// - created_at: datetime
// - updated_at: datetime

// Person node properties:
// - id: UUID
// - email: string
// - full_name: string
// - role: string (artist, collector, gallery, curator, etc.)
// - bio: text
// - created_at: datetime

// Entity node properties:
// - id: UUID
// - name: string
// - type: string (gallery, museum, auction_house, etc.)
// - location: string
// - created_at: datetime

// Transaction node properties:
// - id: UUID
// - amount: float
// - currency: string
// - date: datetime
// - transaction_type: string (sale, auction, rental, etc.)
// - status: string

// Event node properties:
// - id: UUID
// - type: string (exhibition, authentication, restoration, etc.)
// - date: datetime
// - location: string
// - description: text

// MediaItem node properties:
// - id: UUID
// - title: string
// - content: text
// - source_url: string
// - published_at: datetime
// - sentiment_score: float (-1.0 to 1.0)
// - price_impact: float

// ============================================================================
// RELATIONSHIPS
// ============================================================================

// Core relationships:

// Asset-Person relationships
// (:Asset)-[:CREATED_BY {date: datetime}]->(:Person) // Artist created artwork
// (:Asset)-[:OWNED_BY {from: datetime, to: datetime?, price: float, active: boolean}]->(:Person) // Current/historical ownership
// (:Asset)-[:REPRESENTED_BY {from: datetime, to: datetime?, commission: float}]->(:Person) // Gallery representation
// (:Asset)-[:AUTHENTICATED_BY {date: datetime, method: string}]->(:Person) // Expert authentication

// Asset-Entity relationships
// (:Asset)-[:EXHIBITED_AT {from: datetime, to: datetime, is_featured: boolean}]->(:Entity) // Exhibition participation
// (:Asset)-[:SOLD_VIA {date: datetime, commission: float}]->(:Entity) // Sold through gallery/auction house

// Asset-Transaction relationships
// (:Asset)-[:TRANSACTED_IN {role: string}]->(:Transaction) // Artwork involved in transaction
// (:Person)-[:BOUGHT {role: 'buyer'}]->(:Transaction) // Person as buyer
// (:Person)-[:SOLD {role: 'seller'}]->(:Transaction) // Person as seller

// Asset-Event relationships
// (:Asset)-[:PARTICIPATED_IN]->(:Event) // Artwork in event
// (:Person)-[:ORGANIZED]->(:Event) // Person organized event
// (:Entity)-[:HOSTED]->(:Event) // Entity hosted event

// Asset-Asset relationships (provenance chain)
// (:Asset)-[:SIMILAR_TO {score: float, algorithm: string}]->(:Asset) // Similar artworks (for pricing)
// (:Asset)-[:INFLUENCES_PRICE_OF {impact_percent: float, reason: string}]->(:Asset) // Cascade pricing
// (:Asset)-[:DERIVATIVE_OF {type: string}]->(:Asset) // Edition, copy, inspired by

// Media relationships
// (:MediaItem)-[:MENTIONS {context: string}]->(:Asset) // News mentions artwork
// (:MediaItem)-[:MENTIONS {context: string}]->(:Person) // News mentions person
// (:MediaItem)-[:INFLUENCES_MARKET {impact: float}]->(:Asset) // Media impact on pricing

// ============================================================================
// EXAMPLE QUERIES
// ============================================================================

// 1. Find ownership history of an artwork
// MATCH (a:Asset {id: 'artwork-uuid'})-[o:OWNED_BY]->(p:Person)
// RETURN p.full_name, o.from, o.to, o.price
// ORDER BY o.from DESC;

// 2. Find all artworks by an artist
// MATCH (artist:Person {id: 'artist-uuid'})<-[:CREATED_BY]-(artwork:Asset)
// RETURN artwork.title, artwork.current_price, artwork.status;

// 3. Calculate fair price based on similar sold artworks
// MATCH (target:Asset {id: 'artwork-uuid'})-[:SIMILAR_TO]->(similar:Asset)
// MATCH (similar)-[t:TRANSACTED_IN]->(tx:Transaction {status: 'completed'})
// RETURN avg(tx.amount) as fair_price, count(similar) as sample_size;

// 4. Find provenance chain (who owned it before)
// MATCH path = (a:Asset {id: 'artwork-uuid'})-[:OWNED_BY*]->(owners:Person)
// RETURN path;

// 5. Detect circular ownership (fraud detection)
// MATCH (a:Asset)-[:OWNED_BY*2..]->(a)
// RETURN a.id, a.title;

// 6. Find artworks exhibited at same venues (market context)
// MATCH (target:Asset {id: 'artwork-uuid'})-[:EXHIBITED_AT]->(venue:Entity)
// MATCH (similar:Asset)-[:EXHIBITED_AT]->(venue)
// WHERE similar.id <> target.id
// RETURN similar.title, similar.current_price, venue.name;

// 7. Media sentiment impact on artist's works
// MATCH (artist:Person {id: 'artist-uuid'})<-[:CREATED_BY]-(artwork:Asset)
// MATCH (media:MediaItem)-[:MENTIONS]->(artist)
// WHERE media.published_at > datetime() - duration('P30D')
// RETURN avg(media.sentiment_score) as avg_sentiment,
//        count(media) as mention_count,
//        artwork.title, artwork.current_price;

// 8. Transaction network analysis (detect manipulation)
// MATCH (buyer:Person)-[:BOUGHT]->(tx:Transaction)<-[:SOLD]-(seller:Person)
// MATCH (tx)-[:TRANSACTED_IN]-(artwork:Asset)
// WHERE tx.date > datetime() - duration('P90D')
// WITH buyer, seller, count(tx) as transaction_count
// WHERE transaction_count > 5
// RETURN buyer.email, seller.email, transaction_count
// ORDER BY transaction_count DESC;

// 9. Find authentication chain
// MATCH (a:Asset {id: 'artwork-uuid'})-[:AUTHENTICATED_BY]->(expert:Person)
// RETURN expert.full_name, expert.role;

// 10. Cascade pricing impact analysis
// MATCH (source:Asset)-[i:INFLUENCES_PRICE_OF]->(target:Asset)
// WHERE source.id = 'sold-artwork-uuid'
// RETURN target.id, target.title, i.impact_percent, i.reason;

// ============================================================================
// SAMPLE DATA CREATION
// ============================================================================

// Create sample artist
// CREATE (artist:Person {
//   id: 'artist-001',
//   email: 'artist@example.com',
//   full_name: 'Jane Artist',
//   role: 'artist',
//   created_at: datetime()
// });

// Create sample artwork
// CREATE (artwork:Asset {
//   id: 'artwork-001',
//   title: 'Sunset Dreams',
//   category: 'painting',
//   medium: 'oil on canvas',
//   year_created: 2024,
//   current_price: 15000.00,
//   currency: 'USD',
//   status: 'available',
//   created_at: datetime()
// });

// Link artist to artwork
// MATCH (artist:Person {id: 'artist-001'}), (artwork:Asset {id: 'artwork-001'})
// CREATE (artwork)-[:CREATED_BY {date: datetime('2024-01-15')}]->(artist);

// Create ownership
// MATCH (collector:Person {id: 'collector-001'}), (artwork:Asset {id: 'artwork-001'})
// CREATE (artwork)-[:OWNED_BY {
//   from: datetime('2024-06-01'),
//   price: 15000.00,
//   active: true
// }]->(collector);

// ============================================================================
// PERFORMANCE OPTIMIZATION
// ============================================================================

// For large graphs, consider:
// 1. Using apoc procedures for bulk operations
// 2. Creating composite indexes for frequent query patterns
// 3. Using graph algorithms library for network analysis
// 4. Implementing caching for frequently accessed paths
// 5. Using Memgraph for real-time queries, Neo4j for archival

// Example composite index (if supported):
// CREATE INDEX asset_category_status_idx IF NOT EXISTS 
// FOR (a:Asset) ON (a.category, a.status);

// ============================================================================
// MIGRATION FROM RELATIONAL DB
// ============================================================================

// To migrate from PostgreSQL:
// 1. Export users/profiles as Person nodes
// 2. Export artworks as Asset nodes
// 3. Export ownership_link as OWNED_BY relationships
// 4. Export transactions as Transaction nodes + relationships
// 5. Export exhibition_link as EXHIBITED_AT relationships

// Example migration query (pseudo-code):
// LOAD CSV WITH HEADERS FROM 'file:///artworks.csv' AS row
// CREATE (a:Asset {
//   id: row.id,
//   title: row.title,
//   current_price: toFloat(row.current_price),
//   status: row.status
// });

// ============================================================================
// ANALYTICS QUERIES FOR KDE ALGORITHM
// ============================================================================

// 1. Get price distribution for similar artworks (for KDE)
// MATCH (target:Asset {id: $artworkId})-[:SIMILAR_TO]->(similar:Asset)
// MATCH (similar)-[:TRANSACTED_IN]->(tx:Transaction {status: 'completed'})
// RETURN collect(tx.amount) as prices;

// 2. Get trust-weighted ownership history
// MATCH (a:Asset {id: $artworkId})-[o:OWNED_BY]->(owner:Person)
// OPTIONAL MATCH (owner)-[:AUTHENTICATED_BY]-(expert:Person)
// RETURN owner.id, o.price, count(expert) as trust_score
// ORDER BY o.from DESC;

// 3. Market gravity analysis (cluster detection)
// MATCH (a:Asset)-[:EXHIBITED_AT]->(venue:Entity)
// WITH venue, count(a) as artwork_count, avg(a.current_price) as avg_price
// WHERE artwork_count > 10
// RETURN venue.name, venue.location, artwork_count, avg_price
// ORDER BY avg_price DESC;

// End of schema
