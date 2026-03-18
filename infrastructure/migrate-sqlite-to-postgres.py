#!/usr/bin/env python3
"""
Migration script from SQLite to PostgreSQL-compatible schema
Reads from artbank.db (SQLite) and prepares data for Art-OS architecture
"""

import sqlite3
import json
import uuid
from datetime import datetime
from pathlib import Path

class DatabaseMigration:
    def __init__(self, sqlite_path: str, output_path: str):
        self.sqlite_path = sqlite_path
        self.output_path = output_path
        self.sqlite_conn = None
        self.postgres_conn = None
        
    def connect_sqlite(self):
        """Connect to source SQLite database"""
        self.sqlite_conn = sqlite3.connect(self.sqlite_path)
        self.sqlite_conn.row_factory = sqlite3.Row
        print(f"✅ Connected to SQLite: {self.sqlite_path}")
        
    def connect_postgres_sim(self):
        """Connect to target PostgreSQL-like SQLite database"""
        self.postgres_conn = sqlite3.connect(self.output_path)
        print(f"✅ Connected to target database: {self.output_path}")
        
    def create_postgres_schema(self):
        """Create PostgreSQL-compatible tables in SQLite"""
        cursor = self.postgres_conn.cursor()
        
        # Users table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL CHECK (role IN ('admin', 'artist', 'collector', 'gallery', 'partner', 'curator', 'consultant', 'guest')),
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            last_login TEXT,
            is_active INTEGER DEFAULT 1,
            is_verified INTEGER DEFAULT 0
        )
        """)
        
        # Profiles table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS profiles (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            full_name TEXT,
            bio TEXT,
            avatar_url TEXT,
            phone TEXT,
            country TEXT,
            city TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id)
        )
        """)
        
        # Artworks table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS artworks (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            artist_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
            category TEXT,
            medium TEXT,
            width_cm REAL,
            height_cm REAL,
            depth_cm REAL,
            year_created INTEGER,
            current_price REAL,
            currency TEXT DEFAULT 'USD',
            status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved', 'auction', 'unlisted')),
            is_featured INTEGER DEFAULT 0,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
        """)
        
        # Artwork media
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS artwork_media (
            id TEXT PRIMARY KEY,
            artwork_id TEXT NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
            media_url TEXT NOT NULL,
            media_type TEXT DEFAULT 'image' CHECK (media_type IN ('image', 'video', 'ar_model', 'document')),
            is_primary INTEGER DEFAULT 0,
            order_position INTEGER DEFAULT 0,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
        """)
        
        # Ownership link with STOP logic
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS ownership_link (
            id TEXT PRIMARY KEY,
            artwork_id TEXT NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
            owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            acquired_at TEXT DEFAULT CURRENT_TIMESTAMP,
            acquired_price REAL,
            is_active INTEGER DEFAULT 1,
            ended_at TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
        """)
        
        # Create unique index for active ownership (STOP logic)
        cursor.execute("""
        CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_owner 
        ON ownership_link(artwork_id) WHERE is_active = 1
        """)
        
        # Transactions with Saga support
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS transactions (
            id TEXT PRIMARY KEY,
            artwork_id TEXT NOT NULL REFERENCES artworks(id) ON DELETE RESTRICT,
            seller_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
            buyer_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
            amount REAL NOT NULL,
            currency TEXT DEFAULT 'USD',
            transaction_type TEXT DEFAULT 'direct_sale' CHECK (transaction_type IN ('direct_sale', 'auction', 'offer', 'rental')),
            status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'compensating', 'compensated')),
            saga_id TEXT,
            stripe_payment_intent_id TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            completed_at TEXT
        )
        """)
        
        # Transaction steps for Saga pattern
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS transaction_steps (
            id TEXT PRIMARY KEY,
            transaction_id TEXT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
            step_name TEXT NOT NULL,
            step_status TEXT DEFAULT 'pending' CHECK (step_status IN ('pending', 'executing', 'completed', 'failed', 'compensating', 'compensated')),
            started_at TEXT,
            completed_at TEXT,
            error_message TEXT,
            compensation_data TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
        """)
        
        # Price history
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS price_history (
            id TEXT PRIMARY KEY,
            artwork_id TEXT NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
            price REAL NOT NULL,
            currency TEXT DEFAULT 'USD',
            changed_reason TEXT,
            changed_by TEXT,
            transaction_id TEXT REFERENCES transactions(id),
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
        """)
        
        # Event log for Event Router
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS event_log (
            id TEXT PRIMARY KEY,
            event_type TEXT NOT NULL,
            event_source TEXT NOT NULL,
            payload TEXT NOT NULL,
            status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
            retry_count INTEGER DEFAULT 0,
            error_message TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            processed_at TEXT
        )
        """)
        
        self.postgres_conn.commit()
        print("✅ PostgreSQL-compatible schema created")
        
    def migrate_users(self):
        """Migrate users and profiles"""
        cursor_src = self.sqlite_conn.cursor()
        cursor_dst = self.postgres_conn.cursor()
        
        # Get users from source
        cursor_src.execute("SELECT * FROM users")
        users = cursor_src.fetchall()
        
        migrated_count = 0
        for user in users:
            user_id = str(uuid.uuid4())
            
            # Map 'user' role to 'guest'
            role = user['role'] if user['role'] != 'user' else 'guest'
            
            cursor_dst.execute("""
            INSERT INTO users (id, email, password_hash, role, created_at, is_active, is_verified)
            VALUES (?, ?, ?, ?, ?, 1, 1)
            """, (user_id, user['email'], user['password'], role, 
                  user['createdAt'] if 'createdAt' in user.keys() else datetime.now().isoformat()))
            
            # Create profile if fullName exists
            if 'fullName' in user.keys() and user['fullName']:
                profile_id = str(uuid.uuid4())
                bio = user['bio'] if 'bio' in user.keys() else None
                avatar = user['avatarUrl'] if 'avatarUrl' in user.keys() else None
                cursor_dst.execute("""
                INSERT INTO profiles (id, user_id, full_name, bio, avatar_url, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """, (profile_id, user_id, user['fullName'], 
                      bio, avatar, datetime.now().isoformat()))
            
            migrated_count += 1
        
        self.postgres_conn.commit()
        print(f"✅ Migrated {migrated_count} users")
        return migrated_count
    
    def migrate_artworks(self):
        """Migrate artworks and create ownership links"""
        cursor_src = self.sqlite_conn.cursor()
        cursor_dst = self.postgres_conn.cursor()
        
        # Get artworks
        cursor_src.execute("SELECT * FROM artworks")
        artworks = cursor_src.fetchall()
        
        # Get user mapping (old email -> new UUID)
        cursor_dst.execute("SELECT id, email FROM users")
        user_map = {row[1]: row[0] for row in cursor_dst.fetchall()}
        
        migrated_count = 0
        for artwork in artworks:
            artwork_id = str(uuid.uuid4())
            
            # Find artist by email or use first admin
            artist_email = artwork['artistEmail'] if 'artistEmail' in artwork.keys() else 'admin@artbank.com'
            artist_id = user_map.get(artist_email, list(user_map.values())[0])
            
            description = artwork['description'] if 'description' in artwork.keys() else ''
            category = artwork['category'] if 'category' in artwork.keys() else 'painting'
            price = artwork['price'] if 'price' in artwork.keys() else 0
            
            cursor_dst.execute("""
            INSERT INTO artworks (id, title, description, artist_id, category, 
                                 current_price, currency, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (artwork_id, artwork['title'], description, 
                  artist_id, category,
                  price, 'USD', 'available', 
                  datetime.now().isoformat()))
            
            # Create artwork media if imageUrl exists
            if 'imageUrl' in artwork.keys() and artwork['imageUrl']:
                media_id = str(uuid.uuid4())
                cursor_dst.execute("""
                INSERT INTO artwork_media (id, artwork_id, media_url, media_type, is_primary)
                VALUES (?, ?, ?, ?, 1)
                """, (media_id, artwork_id, artwork['imageUrl'], 'image'))
            
            # Create initial ownership link (artist owns it)
            ownership_id = str(uuid.uuid4())
            cursor_dst.execute("""
            INSERT INTO ownership_link (id, artwork_id, owner_id, acquired_at, acquired_price, is_active)
            VALUES (?, ?, ?, ?, ?, 1)
            """, (ownership_id, artwork_id, artist_id, datetime.now().isoformat(), 
                  price))
            
            # Create initial price history
            price_id = str(uuid.uuid4())
            cursor_dst.execute("""
            INSERT INTO price_history (id, artwork_id, price, currency, changed_reason, changed_by)
            VALUES (?, ?, ?, ?, ?, ?)
            """, (price_id, artwork_id, price, 'USD', 
                  'Initial listing', 'user'))
            
            migrated_count += 1
        
        self.postgres_conn.commit()
        print(f"✅ Migrated {migrated_count} artworks with ownership links")
        return migrated_count
    
    def create_sample_events(self):
        """Create sample events for Event Router testing"""
        cursor = self.postgres_conn.cursor()
        
        events = [
            {
                'event_type': 'artwork.created',
                'event_source': 'api',
                'payload': json.dumps({'action': 'create', 'entity': 'artwork'})
            },
            {
                'event_type': 'transaction.completed',
                'event_source': 'transaction_hub',
                'payload': json.dumps({'action': 'complete', 'entity': 'transaction'})
            },
            {
                'event_type': 'price.updated',
                'event_source': 'analytics',
                'payload': json.dumps({'action': 'cascade_pricing', 'reason': 'market_update'})
            }
        ]
        
        for event in events:
            event_id = str(uuid.uuid4())
            cursor.execute("""
            INSERT INTO event_log (id, event_type, event_source, payload, status)
            VALUES (?, ?, ?, ?, 'pending')
            """, (event_id, event['event_type'], event['event_source'], event['payload']))
        
        self.postgres_conn.commit()
        print(f"✅ Created {len(events)} sample events")
        
    def run_migration(self):
        """Run full migration"""
        print("\n" + "="*60)
        print("🚀 Starting Art-OS Database Migration")
        print("="*60 + "\n")
        
        try:
            # Connect to databases
            self.connect_sqlite()
            self.connect_postgres_sim()
            
            # Create schema
            print("\n📋 Step 1: Creating PostgreSQL-compatible schema...")
            self.create_postgres_schema()
            
            # Migrate users
            print("\n👥 Step 2: Migrating users and profiles...")
            user_count = self.migrate_users()
            
            # Migrate artworks
            print("\n🎨 Step 3: Migrating artworks and creating ownership links...")
            artwork_count = self.migrate_artworks()
            
            # Create sample events
            print("\n📡 Step 4: Creating sample events for Event Router...")
            self.create_sample_events()
            
            print("\n" + "="*60)
            print("✅ Migration completed successfully!")
            print("="*60)
            print(f"\n📊 Summary:")
            print(f"  - Users migrated: {user_count}")
            print(f"  - Artworks migrated: {artwork_count}")
            print(f"  - Database location: {self.output_path}")
            print(f"\n💡 Next steps:")
            print(f"  1. Review migrated data")
            print(f"  2. Test STOP logic (unique active ownership)")
            print(f"  3. Create Go Event Router to consume event_log")
            print(f"  4. Integrate with Neo4j for graph relationships")
            print()
            
        except Exception as e:
            print(f"\n❌ Migration failed: {e}")
            raise
        finally:
            if self.sqlite_conn:
                self.sqlite_conn.close()
            if self.postgres_conn:
                self.postgres_conn.close()

def main():
    # Paths
    sqlite_path = Path(__file__).parent.parent / "artbank.db"
    output_path = Path(__file__).parent.parent / "artbank-postgres.db"
    
    # Run migration
    migration = DatabaseMigration(str(sqlite_path), str(output_path))
    migration.run_migration()

if __name__ == "__main__":
    main()
