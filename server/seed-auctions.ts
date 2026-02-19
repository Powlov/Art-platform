import { getDb } from './db';
import { auctions, artworks } from '../drizzle/schema-sqlite';
import { eq, and } from 'drizzle-orm';

const db = getDb();

async function seedAuctions() {
  console.log('🎨 Starting auction seeding...');
  
  try {
    // Get all available artworks
    const availableArtworks = await db
      .select()
      .from(artworks)
      .where(eq(artworks.status, 'available'))
      .limit(5);
    
    if (availableArtworks.length === 0) {
      console.log('⚠️  No available artworks found. Creating test artworks first...');
      
      // Create test artworks
      const testArtworks = [
        {
          title: 'Закат над горами',
          description: 'Потрясающий пейзаж с горным закатом',
          artistId: 1,
          year: 2023,
          technique: 'Масло',
          dimensions: '120x80 см',
          medium: 'Холст',
          genre: 'Пейзаж',
          basePrice: '250000',
          currentPrice: '250000',
          imageUrl: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800',
          status: 'available' as const,
        },
        {
          title: 'Городские мечты',
          description: 'Абстрактное изображение городского пейзажа',
          artistId: 1,
          year: 2024,
          technique: 'Акрил',
          dimensions: '100x70 см',
          medium: 'Холст',
          genre: 'Абстракция',
          basePrice: '180000',
          currentPrice: '180000',
          imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
          status: 'available' as const,
        },
        {
          title: 'Абстрактная композиция #5',
          description: 'Современная абстрактная работа',
          artistId: 1,
          year: 2024,
          technique: 'Смешанная техника',
          dimensions: '90x90 см',
          medium: 'Холст',
          genre: 'Абстракция',
          basePrice: '150000',
          currentPrice: '150000',
          imageUrl: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800',
          status: 'available' as const,
        },
        {
          title: 'Портрет в синем',
          description: 'Выразительный портрет в синих тонах',
          artistId: 1,
          year: 2023,
          technique: 'Масло',
          dimensions: '80x60 см',
          medium: 'Холст',
          genre: 'Портрет',
          basePrice: '320000',
          currentPrice: '320000',
          imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
          status: 'available' as const,
        },
        {
          title: 'Морской пейзаж',
          description: 'Спокойное море на закате',
          artistId: 1,
          year: 2024,
          technique: 'Акварель',
          dimensions: '70x50 см',
          medium: 'Бумага',
          genre: 'Марина',
          basePrice: '95000',
          currentPrice: '95000',
          imageUrl: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800',
          status: 'available' as const,
        },
      ];
      
      for (const artwork of testArtworks) {
        await db.insert(artworks).values(artwork);
      }
      
      console.log(`✅ Created ${testArtworks.length} test artworks`);
      
      // Reload artworks
      const newArtworks = await db
        .select()
        .from(artworks)
        .where(eq(artworks.status, 'available'))
        .limit(5);
      
      availableArtworks.push(...newArtworks);
    }
    
    console.log(`📦 Found ${availableArtworks.length} available artworks`);
    
    // Delete existing test auctions
    await db.delete(auctions);
    console.log('🗑️  Cleared existing auctions');
    
    // Create test auctions
    const now = new Date();
    const testAuctions = [
      {
        artworkId: availableArtworks[0].id,
        startPrice: availableArtworks[0].basePrice,
        currentBid: '485000', // Active bidding
        highestBidderId: 3,
        startTime: new Date(now.getTime() - 2 * 60 * 60 * 1000), // Started 2 hours ago
        endTime: new Date(now.getTime() + 45 * 60 * 1000), // Ends in 45 minutes
        status: 'active' as const,
        bidsCount: 28,
      },
      {
        artworkId: availableArtworks[1].id,
        startPrice: availableArtworks[1].basePrice,
        currentBid: '320000',
        highestBidderId: 4,
        startTime: new Date(now.getTime() - 1 * 60 * 60 * 1000), // Started 1 hour ago
        endTime: new Date(now.getTime() + 3 * 60 * 60 * 1000), // Ends in 3 hours
        status: 'active' as const,
        bidsCount: 15,
      },
      {
        artworkId: availableArtworks[2].id,
        startPrice: availableArtworks[2].basePrice,
        currentBid: availableArtworks[2].basePrice,
        highestBidderId: null,
        startTime: new Date(now.getTime() + 2 * 60 * 60 * 1000), // Starts in 2 hours
        endTime: new Date(now.getTime() + 26 * 60 * 60 * 1000), // Ends in 26 hours
        status: 'pending' as const,
        bidsCount: 0,
      },
      {
        artworkId: availableArtworks[3]?.id || availableArtworks[0].id,
        startPrice: availableArtworks[3]?.basePrice || availableArtworks[0].basePrice,
        currentBid: '420000',
        highestBidderId: 2,
        startTime: new Date(now.getTime() - 4 * 60 * 60 * 1000), // Started 4 hours ago
        endTime: new Date(now.getTime() + 20 * 60 * 1000), // Ends in 20 minutes (HOT!)
        status: 'active' as const,
        bidsCount: 42,
      },
      {
        artworkId: availableArtworks[4]?.id || availableArtworks[1].id,
        startPrice: availableArtworks[4]?.basePrice || availableArtworks[1].basePrice,
        currentBid: availableArtworks[4]?.basePrice || availableArtworks[1].basePrice,
        highestBidderId: null,
        startTime: new Date(now.getTime() + 6 * 60 * 60 * 1000), // Starts in 6 hours
        endTime: new Date(now.getTime() + 30 * 60 * 60 * 1000), // Ends in 30 hours
        status: 'pending' as const,
        bidsCount: 0,
      },
    ];
    
    for (const auction of testAuctions) {
      await db.insert(auctions).values(auction);
    }
    
    console.log(`✅ Created ${testAuctions.length} test auctions`);
    
    // Verify
    const allAuctions = await db.select().from(auctions);
    console.log(`\n📊 Total auctions in database: ${allAuctions.length}`);
    console.log('   - Active:', allAuctions.filter(a => a.status === 'active').length);
    console.log('   - Pending:', allAuctions.filter(a => a.status === 'pending').length);
    console.log('   - Completed:', allAuctions.filter(a => a.status === 'completed').length);
    
    console.log('\n🎉 Auction seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding auctions:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAuctions()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedAuctions };
