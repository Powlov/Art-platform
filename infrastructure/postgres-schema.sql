-- ============================================================================
-- ART-OS PostgreSQL Database Schema
-- ============================================================================
-- Version: 1.0.0
-- Date: 2026-03-15
-- Description: Complete database schema for Art-OS platform with link tables
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CORE ENTITIES
-- ============================================================================

-- Users table with role-based access
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'artist', 'collector', 'gallery', 'partner', 'curator', 'consultant', 'guest')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- User profiles
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    bio TEXT,
    avatar_url TEXT,
    phone VARCHAR(50),
    country VARCHAR(100),
    city VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_profiles_user_id ON profiles(user_id);

-- Artworks
CREATE TABLE artworks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    artist_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    category VARCHAR(100),
    medium VARCHAR(100),
    width_cm NUMERIC(10, 2),
    height_cm NUMERIC(10, 2),
    depth_cm NUMERIC(10, 2),
    year_created INTEGER,
    current_price NUMERIC(15, 2),
    currency VARCHAR(10) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved', 'auction', 'unlisted')),
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_artworks_artist_id ON artworks(artist_id);
CREATE INDEX idx_artworks_status ON artworks(status);
CREATE INDEX idx_artworks_category ON artworks(category);

-- Artwork media files
CREATE TABLE artwork_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artwork_id UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    media_type VARCHAR(50) DEFAULT 'image' CHECK (media_type IN ('image', 'video', 'ar_model', 'document')),
    is_primary BOOLEAN DEFAULT FALSE,
    order_position INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_artwork_media_artwork_id ON artwork_media(artwork_id);

-- ============================================================================
-- LINK TABLES (for ACID guarantees and STOP logic)
-- ============================================================================

-- Ownership link with STOP logic (only one active owner)
CREATE TABLE ownership_link (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artwork_id UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acquired_price NUMERIC(15, 2),
    is_active BOOLEAN DEFAULT TRUE,
    ended_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_active_owner UNIQUE (artwork_id, is_active) WHERE (is_active = TRUE)
);

CREATE INDEX idx_ownership_artwork ON ownership_link(artwork_id);
CREATE INDEX idx_ownership_owner ON ownership_link(owner_id);
CREATE INDEX idx_ownership_active ON ownership_link(is_active) WHERE is_active = TRUE;

-- Gallery representation link
CREATE TABLE representation_link (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artwork_id UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
    gallery_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP,
    commission_percent NUMERIC(5, 2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_representation_artwork ON representation_link(artwork_id);
CREATE INDEX idx_representation_gallery ON representation_link(gallery_id);

-- Exhibition participation
CREATE TABLE exhibition_link (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artwork_id UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
    exhibition_id UUID NOT NULL REFERENCES exhibitions(id) ON DELETE CASCADE,
    displayed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    removed_at TIMESTAMP,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exhibition_artwork ON exhibition_link(artwork_id);
CREATE INDEX idx_exhibition_event ON exhibition_link(exhibition_id);

-- ============================================================================
-- TRANSACTIONS & MARKETPLACE
-- ============================================================================

-- Transactions with Saga pattern support
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artwork_id UUID NOT NULL REFERENCES artworks(id) ON DELETE RESTRICT,
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    amount NUMERIC(15, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    transaction_type VARCHAR(50) DEFAULT 'direct_sale' CHECK (transaction_type IN ('direct_sale', 'auction', 'offer', 'rental')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'compensating', 'compensated')),
    saga_id UUID,
    stripe_payment_intent_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_transactions_artwork ON transactions(artwork_id);
CREATE INDEX idx_transactions_buyer ON transactions(buyer_id);
CREATE INDEX idx_transactions_seller ON transactions(seller_id);
CREATE INDEX idx_transactions_saga ON transactions(saga_id);
CREATE INDEX idx_transactions_status ON transactions(status);

-- Transaction steps for Saga pattern
CREATE TABLE transaction_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    step_name VARCHAR(100) NOT NULL,
    step_status VARCHAR(50) DEFAULT 'pending' CHECK (step_status IN ('pending', 'executing', 'completed', 'failed', 'compensating', 'compensated')),
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    error_message TEXT,
    compensation_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transaction_steps_transaction ON transaction_steps(transaction_id);

-- Auctions
CREATE TABLE auctions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artwork_id UUID NOT NULL REFERENCES artworks(id) ON DELETE RESTRICT,
    start_price NUMERIC(15, 2) NOT NULL,
    reserve_price NUMERIC(15, 2),
    current_price NUMERIC(15, 2),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'ended', 'cancelled')),
    winner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_auctions_artwork ON auctions(artwork_id);
CREATE INDEX idx_auctions_status ON auctions(status);

-- Bids
CREATE TABLE bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auction_id UUID NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
    bidder_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(15, 2) NOT NULL,
    is_winning BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bids_auction ON bids(auction_id);
CREATE INDEX idx_bids_bidder ON bids(bidder_id);

-- ============================================================================
-- EVENTS & EXHIBITIONS
-- ============================================================================

CREATE TABLE exhibitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    curator_id UUID REFERENCES users(id) ON DELETE SET NULL,
    venue VARCHAR(255),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exhibitions_curator ON exhibitions(curator_id);
CREATE INDEX idx_exhibitions_status ON exhibitions(status);

-- ============================================================================
-- ANALYTICS & PRICING
-- ============================================================================

-- Price history for cascade pricing
CREATE TABLE price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artwork_id UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
    price NUMERIC(15, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    changed_reason VARCHAR(100),
    changed_by VARCHAR(50), -- 'user', 'cascade', 'algorithm', 'market'
    transaction_id UUID REFERENCES transactions(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_price_history_artwork ON price_history(artwork_id);
CREATE INDEX idx_price_history_created ON price_history(created_at);

-- Market analytics
CREATE TABLE market_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artwork_id UUID REFERENCES artworks(id) ON DELETE CASCADE,
    metric_type VARCHAR(100) NOT NULL, -- 'fair_price', 'demand_score', 'liquidity', 'volatility'
    metric_value NUMERIC(15, 5) NOT NULL,
    confidence_score NUMERIC(5, 4), -- 0.0000 to 1.0000
    algorithm_version VARCHAR(50),
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_snapshot JSONB
);

CREATE INDEX idx_analytics_artwork ON market_analytics(artwork_id);
CREATE INDEX idx_analytics_metric_type ON market_analytics(metric_type);

-- ============================================================================
-- MEDIA & NEWS
-- ============================================================================

CREATE TABLE media_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    content TEXT,
    source_url TEXT,
    source_name VARCHAR(255),
    published_at TIMESTAMP,
    sentiment_score NUMERIC(5, 4), -- -1.0000 to 1.0000
    keywords JSONB,
    mentioned_artworks JSONB, -- array of artwork_ids
    mentioned_artists JSONB, -- array of artist_ids
    price_impact_score NUMERIC(5, 4), -- predicted price impact
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_media_published ON media_items(published_at);
CREATE INDEX idx_media_sentiment ON media_items(sentiment_score);

-- ============================================================================
-- BLOCKCHAIN & PROVENANCE
-- ============================================================================

CREATE TABLE blockchain_passports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artwork_id UUID NOT NULL REFERENCES artworks(id) ON DELETE RESTRICT,
    blockchain_hash VARCHAR(255) UNIQUE NOT NULL,
    ipfs_cid VARCHAR(255),
    contract_address VARCHAR(255),
    token_id VARCHAR(255),
    metadata_json JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_blockchain_artwork ON blockchain_passports(artwork_id);
CREATE INDEX idx_blockchain_hash ON blockchain_passports(blockchain_hash);

-- Provenance chain
CREATE TABLE provenance_chain (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artwork_id UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL, -- 'created', 'sold', 'exhibited', 'authenticated', 'restored'
    event_date TIMESTAMP NOT NULL,
    description TEXT,
    participant_id UUID REFERENCES users(id),
    location VARCHAR(255),
    documentation_url TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_provenance_artwork ON provenance_chain(artwork_id);
CREATE INDEX idx_provenance_event_date ON provenance_chain(event_date);

-- ============================================================================
-- MESSAGING & COMMUNICATION
-- ============================================================================

CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE conversation_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_read_at TIMESTAMP
);

CREATE INDEX idx_conv_participants_conv ON conversation_participants(conversation_id);
CREATE INDEX idx_conv_participants_user ON conversation_participants(user_id);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'artwork_link')),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created ON messages(created_at);

-- ============================================================================
-- EVENT LOG (for Event Router)
-- ============================================================================

CREATE TABLE event_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL,
    event_source VARCHAR(100) NOT NULL, -- 'api', 'router', 'analytics', 'transaction', 'media'
    payload JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    retry_count INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP
);

CREATE INDEX idx_event_log_type ON event_log(event_type);
CREATE INDEX idx_event_log_status ON event_log(status);
CREATE INDEX idx_event_log_created ON event_log(created_at);

-- ============================================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artworks_updated_at BEFORE UPDATE ON artworks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_auctions_updated_at BEFORE UPDATE ON auctions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exhibitions_updated_at BEFORE UPDATE ON exhibitions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Active artworks with ownership
CREATE VIEW active_artworks_with_owners AS
SELECT 
    a.id, a.title, a.artist_id, a.current_price, a.status,
    o.owner_id, u.email as owner_email,
    p.full_name as owner_name
FROM artworks a
LEFT JOIN ownership_link o ON a.id = o.artwork_id AND o.is_active = TRUE
LEFT JOIN users u ON o.owner_id = u.id
LEFT JOIN profiles p ON u.id = p.user_id
WHERE a.status != 'unlisted';

-- Transaction summary
CREATE VIEW transaction_summary AS
SELECT 
    t.id, t.artwork_id, t.amount, t.transaction_type, t.status,
    a.title as artwork_title,
    s.email as seller_email, b.email as buyer_email,
    t.created_at, t.completed_at
FROM transactions t
JOIN artworks a ON t.artwork_id = a.id
JOIN users s ON t.seller_id = s.id
JOIN users b ON t.buyer_id = b.id;

-- ============================================================================
-- SEED DATA (basic setup)
-- ============================================================================

-- Insert system user for automated operations
INSERT INTO users (id, email, password_hash, role, is_active, is_verified)
VALUES ('00000000-0000-0000-0000-000000000001', 'system@art-os.internal', 'SYSTEM_ACCOUNT', 'admin', FALSE, TRUE);

COMMENT ON TABLE users IS 'Core users with role-based access control';
COMMENT ON TABLE ownership_link IS 'Link table enforcing single active owner (STOP logic)';
COMMENT ON TABLE transactions IS 'Transactions with Saga pattern support for distributed consistency';
COMMENT ON TABLE transaction_steps IS 'Individual steps in Saga pattern with compensation data';
COMMENT ON TABLE event_log IS 'Event log for Event Router tracking all system events';

-- End of schema
