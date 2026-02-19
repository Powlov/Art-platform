import { createTestAccounts } from './auth.js';
import { getDb, createArtwork, createArtist, createGallery, createNews, createAuction } from './db.js';
import { users } from '../drizzle/schema-sqlite.js';
import { eq } from 'drizzle-orm';

console.log('[Seed] Starting database seeding...');

// Create test accounts
console.log('[Seed] Creating test accounts...');
const accounts = await createTestAccounts();
console.log(`[Seed] Created ${accounts.length} test accounts:`);
accounts.forEach(acc => {
  console.log(`  - ${acc.email} (${acc.role}) - password: ${acc.password}`);
});

const db = getDb();
if (!db) {
  console.error('[Seed] Database not available');
  process.exit(1);
}

// Get artist users
const artistUsers = db.select().from(users)
  .where(eq(users.role, 'artist'))
  .all();

// Create artists profiles
console.log('[Seed] Creating artist profiles...');
for (const user of artistUsers) {
  try {
    createArtist({
      userId: user.id,
      bio: `${user.name} is a talented contemporary artist known for innovative works.`,
      profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`,
      website: `https://example.com/${user.username}`,
      socialMedia: JSON.stringify({
        instagram: `@${user.username}`,
        twitter: `@${user.username}`
      }),
      followers: Math.floor(Math.random() * 10000) + 100,
    });
    console.log(`  - Created artist profile for ${user.name}`);
  } catch (error) {
    console.error(`  - Error creating artist for ${user.name}:`, error.message);
  }
}

// Get artist IDs after creation
const artistProfiles = db.select().from((await import('../drizzle/schema-sqlite.js')).artists).all();

// Create artworks
console.log('[Seed] Creating artworks...');
const artworks = [
  {
    title: "Sunset Over Mountains",
    description: "A vibrant abstract representation of nature's beauty at dusk",
    technique: "Oil on Canvas",
    medium: "Oil Paint",
    genre: "Abstract",
    year: 2024,
    dimensions: "120x90 cm",
    basePrice: 15000,
    currentPrice: 15000,
    imageUrl: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800",
  },
  {
    title: "Urban Dreams",
    description: "Modern cityscape with surrealist elements",
    technique: "Acrylic on Canvas",
    medium: "Acrylic Paint",
    genre: "Surrealism",
    year: 2024,
    dimensions: "100x70 cm",
    basePrice: 12000,
    currentPrice: 12000,
    imageUrl: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=800",
  },
  {
    title: "Whispers of the Sea",
    description: "Serene ocean scene with dramatic lighting",
    technique: "Watercolor",
    medium: "Watercolor",
    genre: "Landscape",
    year: 2023,
    dimensions: "80x60 cm",
    basePrice: 8000,
    currentPrice: 8000,
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800",
  },
  {
    title: "Geometric Harmony",
    description: "Contemporary exploration of form and color",
    technique: "Mixed Media",
    medium: "Mixed Media",
    genre: "Contemporary",
    year: 2024,
    dimensions: "150x150 cm",
    basePrice: 25000,
    currentPrice: 25000,
    imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800",
  },
  {
    title: "Portrait in Blue",
    description: "Expressive portrait with bold color palette",
    technique: "Oil on Canvas",
    medium: "Oil Paint",
    genre: "Portrait",
    year: 2024,
    dimensions: "90x70 cm",
    basePrice: 18000,
    currentPrice: 18000,
    imageUrl: "https://images.unsplash.com/photo-1578926219924-1c7678c5cf4e?w=800",
  },
  {
    title: "Forest Meditation",
    description: "Tranquil forest scene inviting contemplation",
    technique: "Oil on Canvas",
    medium: "Oil Paint",
    genre: "Landscape",
    year: 2023,
    dimensions: "110x80 cm",
    basePrice: 14000,
    currentPrice: 14000,
    imageUrl: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=800",
  },
  {
    title: "Digital Cosmos",
    description: "Futuristic vision of space and technology",
    technique: "Digital Art",
    medium: "Digital",
    genre: "Digital Art",
    year: 2024,
    dimensions: "Digital - 4K",
    basePrice: 5000,
    currentPrice: 5000,
    imageUrl: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800",
  },
  {
    title: "Autumn Symphony",
    description: "Vibrant celebration of fall colors",
    technique: "Acrylic on Canvas",
    medium: "Acrylic Paint",
    genre: "Abstract",
    year: 2023,
    dimensions: "100x100 cm",
    basePrice: 16000,
    currentPrice: 16000,
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
  },
];

if (artistProfiles.length > 0) {
  for (let i = 0; i < artworks.length; i++) {
    const artwork = artworks[i];
    const artistProfile = artistProfiles[i % artistProfiles.length];
    
    try {
      createArtwork({
        ...artwork,
        artistId: artistProfile.id,
        uniqueId: `ART-${Date.now()}-${i}`,
        status: i % 4 === 0 ? 'sold' : 'available',
      });
      console.log(`  - Created artwork: ${artwork.title}`);
    } catch (error) {
      console.error(`  - Error creating artwork ${artwork.title}:`, error.message);
    }
  }
}

// Create news articles
console.log('[Seed] Creating news articles...');
const newsArticles = [
  {
    title: "Contemporary Art Market Shows Strong Growth in 2024",
    content: "The contemporary art market has seen unprecedented growth this year, with sales increasing by 35% compared to last year. Digital art and NFTs continue to gain mainstream acceptance.",
    category: "market" as const,
    source: "Art Market News",
    imageUrl: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800",
  },
  {
    title: "New Exhibition Opens at Metropolitan Gallery",
    content: "A groundbreaking exhibition featuring works from emerging artists opens this week at the Metropolitan Gallery. The show explores themes of identity and technology in the modern age.",
    category: "general" as const,
    source: "Gallery Today",
    imageUrl: "https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=800",
  },
  {
    title: "Abstract Art Renaissance: A New Era Begins",
    content: "Art critics are noting a resurgence of interest in abstract expressionism among both collectors and new artists. This movement is bringing fresh perspectives to traditional techniques.",
    category: "style" as const,
    source: "Art Review",
    imageUrl: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800",
  },
];

for (const article of newsArticles) {
  try {
    createNews(article);
    console.log(`  - Created news: ${article.title}`);
  } catch (error) {
    console.error(`  - Error creating news ${article.title}:`, error.message);
  }
}

console.log('\n[Seed] Database seeding completed!');
console.log('\n====================================');
console.log('=== TEST ACCOUNTS CREATED ===');
console.log('====================================');
console.log('\nYou can now login with these accounts:\n');
accounts.forEach(acc => {
  console.log(`${acc.role.toUpperCase().padEnd(12)} | Email: ${acc.email.padEnd(30)} | Password: ${acc.password}`);
});
console.log('\n====================================\n');
