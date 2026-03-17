#!/usr/bin/env python3
"""
Load data from PostgreSQL (SQLite) to Neo4j graph database
Creates nodes and relationships for Art-OS provenance tracking
"""

import sqlite3
import json
from datetime import datetime
from pathlib import Path

class Neo4jDataLoader:
    def __init__(self, db_path: str, output_path: str):
        self.db_path = db_path
        self.output_path = output_path
        self.conn = None
        self.cypher_statements = []
        
    def connect(self):
        """Connect to database"""
        self.conn = sqlite3.connect(self.db_path)
        self.conn.row_factory = sqlite3.Row
        print(f"✅ Connected to database: {self.db_path}")
        
    def load_users_as_persons(self):
        """Load users as Person nodes"""
        cursor = self.conn.cursor()
        cursor.execute("""
        SELECT u.id, u.email, u.role, p.full_name, p.bio
        FROM users u
        LEFT JOIN profiles p ON u.id = p.user_id
        """)
        users = cursor.fetchall()
        
        statements = []
        for user in users:
            full_name = user['full_name'] if user['full_name'] else user['email'].split('@')[0]
            bio = user['bio'] if user['bio'] else ''
            
            cypher = f"""
CREATE (p:Person {{
  id: '{user['id']}',
  email: '{user['email']}',
  full_name: '{full_name}',
  role: '{user['role']}',
  bio: '{bio}',
  created_at: datetime()
}});"""
            statements.append(cypher)
        
        self.cypher_statements.extend(statements)
        print(f"✅ Prepared {len(statements)} Person nodes")
        return len(statements)
    
    def load_artworks_as_assets(self):
        """Load artworks as Asset nodes"""
        cursor = self.conn.cursor()
        cursor.execute("""
        SELECT * FROM artworks
        """)
        artworks = cursor.fetchall()
        
        statements = []
        for artwork in artworks:
            title = artwork['title'].replace("'", "\\'")
            description = (artwork['description'] or '').replace("'", "\\'")
            
            cypher = f"""
CREATE (a:Asset {{
  id: '{artwork['id']}',
  title: '{title}',
  description: '{description}',
  category: '{artwork['category'] or 'painting'}',
  medium: '{artwork['medium'] or 'unknown'}',
  year_created: {artwork['year_created'] or 2024},
  current_price: {artwork['current_price'] or 0},
  currency: '{artwork['currency']}',
  status: '{artwork['status']}',
  created_at: datetime()
}});"""
            statements.append(cypher)
        
        self.cypher_statements.extend(statements)
        print(f"✅ Prepared {len(statements)} Asset nodes")
        return len(statements)
    
    def create_created_by_relationships(self):
        """Create CREATED_BY relationships"""
        cursor = self.conn.cursor()
        cursor.execute("""
        SELECT id, artist_id FROM artworks
        """)
        artworks = cursor.fetchall()
        
        statements = []
        for artwork in artworks:
            cypher = f"""
MATCH (a:Asset {{id: '{artwork['id']}'}}), (p:Person {{id: '{artwork['artist_id']}'}})
CREATE (a)-[:CREATED_BY {{date: datetime()}}]->(p);"""
            statements.append(cypher)
        
        self.cypher_statements.extend(statements)
        print(f"✅ Prepared {len(statements)} CREATED_BY relationships")
        return len(statements)
    
    def create_owned_by_relationships(self):
        """Create OWNED_BY relationships"""
        cursor = self.conn.cursor()
        cursor.execute("""
        SELECT artwork_id, owner_id, acquired_at, acquired_price, is_active
        FROM ownership_link
        """)
        ownerships = cursor.fetchall()
        
        statements = []
        for ownership in ownerships:
            active = "true" if ownership['is_active'] else "false"
            cypher = f"""
MATCH (a:Asset {{id: '{ownership['artwork_id']}'}}), (p:Person {{id: '{ownership['owner_id']}'}})
CREATE (a)-[:OWNED_BY {{
  from: datetime('{ownership['acquired_at']}'),
  price: {ownership['acquired_price']},
  active: {active}
}}]->(p);"""
            statements.append(cypher)
        
        self.cypher_statements.extend(statements)
        print(f"✅ Prepared {len(statements)} OWNED_BY relationships")
        return len(statements)
    
    def create_sample_similar_to_relationships(self):
        """Create SIMILAR_TO relationships for pricing algorithm"""
        cursor = self.conn.cursor()
        cursor.execute("SELECT id, category FROM artworks")
        artworks = cursor.fetchall()
        
        # Group by category
        by_category = {}
        for artwork in artworks:
            category = artwork['category'] or 'painting'
            if category not in by_category:
                by_category[category] = []
            by_category[category].append(artwork['id'])
        
        statements = []
        for category, artwork_ids in by_category.items():
            # Create similarity links within same category
            for i, id1 in enumerate(artwork_ids):
                for id2 in artwork_ids[i+1:]:
                    cypher = f"""
MATCH (a1:Asset {{id: '{id1}'}}), (a2:Asset {{id: '{id2}'}})
CREATE (a1)-[:SIMILAR_TO {{score: 0.75, algorithm: 'category_match'}}]->(a2);"""
                    statements.append(cypher)
        
        self.cypher_statements.extend(statements)
        print(f"✅ Prepared {len(statements)} SIMILAR_TO relationships")
        return len(statements)
    
    def save_cypher_file(self):
        """Save all Cypher statements to file"""
        with open(self.output_path, 'w') as f:
            f.write("// ============================================================================\n")
            f.write("// Art-OS Neo4j Data Load Script\n")
            f.write(f"// Generated: {datetime.now().isoformat()}\n")
            f.write("// ============================================================================\n\n")
            
            # Add constraints first
            f.write("// Create constraints and indexes\n")
            f.write("CREATE CONSTRAINT asset_id_unique IF NOT EXISTS FOR (a:Asset) REQUIRE a.id IS UNIQUE;\n")
            f.write("CREATE CONSTRAINT person_id_unique IF NOT EXISTS FOR (p:Person) REQUIRE p.id IS UNIQUE;\n")
            f.write("CREATE INDEX asset_category_idx IF NOT EXISTS FOR (a:Asset) ON (a.category);\n")
            f.write("CREATE INDEX person_role_idx IF NOT EXISTS FOR (p:Person) ON (p.role);\n\n")
            
            # Add all statements
            f.write("// Create nodes and relationships\n")
            for statement in self.cypher_statements:
                f.write(statement + "\n")
        
        print(f"✅ Saved Cypher script to: {self.output_path}")
    
    def run_loading(self):
        """Run full data loading"""
        print("\n" + "="*60)
        print("🚀 Starting Neo4j Data Loading")
        print("="*60 + "\n")
        
        try:
            # Connect
            self.connect()
            
            # Load nodes
            print("\n📋 Step 1: Loading Person nodes...")
            person_count = self.load_users_as_persons()
            
            print("\n🎨 Step 2: Loading Asset nodes...")
            asset_count = self.load_artworks_as_assets()
            
            # Create relationships
            print("\n🔗 Step 3: Creating CREATED_BY relationships...")
            created_by_count = self.create_created_by_relationships()
            
            print("\n🔗 Step 4: Creating OWNED_BY relationships...")
            owned_by_count = self.create_owned_by_relationships()
            
            print("\n🔗 Step 5: Creating SIMILAR_TO relationships...")
            similar_to_count = self.create_sample_similar_to_relationships()
            
            # Save to file
            print("\n💾 Step 6: Saving Cypher script...")
            self.save_cypher_file()
            
            print("\n" + "="*60)
            print("✅ Neo4j data loading completed!")
            print("="*60)
            print(f"\n📊 Summary:")
            print(f"  - Person nodes: {person_count}")
            print(f"  - Asset nodes: {asset_count}")
            print(f"  - CREATED_BY relationships: {created_by_count}")
            print(f"  - OWNED_BY relationships: {owned_by_count}")
            print(f"  - SIMILAR_TO relationships: {similar_to_count}")
            print(f"  - Total Cypher statements: {len(self.cypher_statements)}")
            print(f"  - Output file: {self.output_path}")
            print(f"\n💡 Next steps:")
            print(f"  1. Install Neo4j database (docker or standalone)")
            print(f"  2. Run: cypher-shell < {self.output_path}")
            print(f"  3. Query provenance: MATCH (a:Asset)-[:OWNED_BY]->(p:Person) RETURN a, p")
            print(f"  4. Integrate with Analytics Service for KDE algorithm")
            print()
            
        except Exception as e:
            print(f"\n❌ Loading failed: {e}")
            raise
        finally:
            if self.conn:
                self.conn.close()

def main():
    # Paths
    db_path = Path(__file__).parent.parent / "artbank-postgres.db"
    output_path = Path(__file__).parent / "neo4j-data-load.cypher"
    
    # Run loading
    loader = Neo4jDataLoader(str(db_path), str(output_path))
    loader.run_loading()

if __name__ == "__main__":
    main()
