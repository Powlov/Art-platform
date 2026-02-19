import { drizzle } from 'drizzle-orm/mysql2';
import { 
  users, artworks, artists, galleries, collectors, 
  auctions, transactions, news, provenance, wishlists 
} from '../drizzle/schema.js';

const db = drizzle(process.env.DATABASE_URL);

const seedData = {
  users: [
    {
      openId: 'user-artist-1',
      name: 'Иван Петров',
      email: 'ivan@example.com',
      loginMethod: 'oauth',
      role: 'artist',
      lastSignedIn: new Date(),
    },
    {
      openId: 'user-collector-1',
      name: 'Мария Сидорова',
      email: 'maria@example.com',
      loginMethod: 'oauth',
      role: 'collector',
      lastSignedIn: new Date(),
    },
    {
      openId: 'user-gallery-1',
      name: 'Галерея Современного Искусства',
      email: 'gallery@example.com',
      loginMethod: 'oauth',
      role: 'gallery',
      lastSignedIn: new Date(),
    },
    {
      openId: 'user-curator-1',
      name: 'Алексей Кураторов',
      email: 'curator@example.com',
      loginMethod: 'oauth',
      role: 'curator',
      lastSignedIn: new Date(),
    },
  ],
  artworks: [
    {
      title: 'Абстрактная гармония',
      description: 'Современное абстрактное произведение, выполненное маслом на холсте',
      artistId: 1,
      galleryId: 3,
      year: 2023,
      technique: 'Масло',
      dimensions: '100x150 см',
      medium: 'Холст',
      basePrice: '50000.00',
      currentPrice: '55000.00',
      imageUrl: 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=800&h=600&fit=crop',
      status: 'available',
      blockchainVerified: true,
      blockchainHash: '0x1234567890abcdef',
      ipfsHash: 'QmXxxx',
      uniqueId: 'ART-001',
    },
    {
      title: 'Городской пейзаж',
      description: 'Современный взгляд на городскую архитектуру',
      artistId: 1,
      galleryId: 3,
      year: 2023,
      technique: 'Акрил',
      dimensions: '80x120 см',
      medium: 'Холст',
      basePrice: '35000.00',
      currentPrice: '40000.00',
      imageUrl: 'https://images.unsplash.com/photo-1549887534-f3c9ca7f91f0?w=800&h=600&fit=crop',
      status: 'auction',
      blockchainVerified: true,
      blockchainHash: '0x1234567890abcdef2',
      ipfsHash: 'QmYyyy',
      uniqueId: 'ART-002',
    },
    {
      title: 'Портрет в стиле фьюжн',
      description: 'Экспериментальный портрет, сочетающий классику и модерн',
      artistId: 1,
      galleryId: 3,
      year: 2024,
      technique: 'Смешанная техника',
      dimensions: '60x80 см',
      medium: 'Холст',
      basePrice: '25000.00',
      currentPrice: '28000.00',
      imageUrl: 'https://images.unsplash.com/photo-1561214115-6d2f1b0609fa?w=800&h=600&fit=crop',
      status: 'available',
      blockchainVerified: true,
      blockchainHash: '0x1234567890abcdef3',
      ipfsHash: 'QmZzzz',
      uniqueId: 'ART-003',
    },
  ],
  artists: [
    {
      userId: 1,
      bio: 'Современный художник, специализирующийся на абстрактном искусстве',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      website: 'https://example.com/artist1',
      socialMedia: { instagram: '@artist1', twitter: '@artist1' },
      followers: 1250,
      totalSales: 15,
      totalRevenue: '450000.00',
    },
  ],
  galleries: [
    {
      userId: 3,
      name: 'Галерея Современного Искусства',
      description: 'Ведущая галерея современного искусства в центре города',
      address: 'ул. Тверская, 15, Москва',
      phone: '+7 (495) 123-45-67',
      email: 'gallery@example.com',
      website: 'https://example.com/gallery',
      logo: 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=200&h=200&fit=crop',
      members: 45,
    },
  ],
  collectors: [
    {
      userId: 2,
      bio: 'Частный коллекционер с 20-летним опытом',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      portfolioValue: '2500000.00',
      artworksCount: 87,
    },
  ],
  auctions: [
    {
      artworkId: 2,
      startPrice: '35000.00',
      currentBid: '42000.00',
      highestBidderId: 2,
      startTime: new Date(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'active',
      bidsCount: 5,
    },
  ],
  transactions: [
    {
      artworkId: 1,
      sellerId: 1,
      buyerId: 2,
      amount: '55000.00',
      type: 'sale',
      status: 'completed',
      transactionHash: '0xabc123def456',
    },
  ],
  news: [
    {
      title: 'Новая выставка современного искусства открывается в галерее',
      content: 'Галерея Современного Искусства представляет новую коллекцию работ молодых художников',
      category: 'general',
      source: 'Art News',
      imageUrl: 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=800&h=600&fit=crop',
    },
    {
      title: 'Рост цен на произведения современного искусства',
      content: 'Анализ рынка показывает значительный рост спроса на работы молодых художников',
      category: 'market',
      source: 'Art Market Report',
      imageUrl: 'https://images.unsplash.com/photo-1549887534-f3c9ca7f91f0?w=800&h=600&fit=crop',
    },
    {
      title: 'Иван Петров представляет новую серию работ',
      content: 'Известный художник Иван Петров представляет свою новую серию абстрактных работ',
      category: 'artist',
      relatedArtistId: 1,
      source: 'Artist Profile',
      imageUrl: 'https://images.unsplash.com/photo-1561214115-6d2f1b0609fa?w=800&h=600&fit=crop',
    },
  ],
  provenance: [
    {
      artworkId: 1,
      ownerId: 2,
      acquiredDate: new Date(),
      price: '55000.00',
      notes: 'Приобретено на аукционе галереи',
    },
  ],
  wishlists: [
    {
      userId: 2,
      artworkId: 2,
    },
    {
      userId: 2,
      artworkId: 3,
    },
  ],
};

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    // Insert users
    console.log('📝 Inserting users...');
    for (const user of seedData.users) {
      await db.insert(users).values(user).onDuplicateKeyUpdate({
        set: { lastSignedIn: new Date() },
      });
    }

    // Insert artists
    console.log('🎨 Inserting artists...');
    for (const artist of seedData.artists) {
      await db.insert(artists).values(artist);
    }

    // Insert galleries
    console.log('🏛️ Inserting galleries...');
    for (const gallery of seedData.galleries) {
      await db.insert(galleries).values(gallery);
    }

    // Insert collectors
    console.log('👤 Inserting collectors...');
    for (const collector of seedData.collectors) {
      await db.insert(collectors).values(collector);
    }

    // Insert artworks
    console.log('🖼️ Inserting artworks...');
    for (const artwork of seedData.artworks) {
      await db.insert(artworks).values(artwork);
    }

    // Insert auctions
    console.log('🔨 Inserting auctions...');
    for (const auction of seedData.auctions) {
      await db.insert(auctions).values(auction);
    }

    // Insert transactions
    console.log('💳 Inserting transactions...');
    for (const transaction of seedData.transactions) {
      await db.insert(transactions).values(transaction);
    }

    // Insert news
    console.log('📰 Inserting news...');
    for (const newsItem of seedData.news) {
      await db.insert(news).values(newsItem);
    }

    // Insert provenance
    console.log('📜 Inserting provenance...');
    for (const prov of seedData.provenance) {
      await db.insert(provenance).values(prov);
    }

    // Insert wishlists
    console.log('❤️ Inserting wishlists...');
    for (const wishlist of seedData.wishlists) {
      await db.insert(wishlists).values(wishlist);
    }

    console.log('✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

seed();
