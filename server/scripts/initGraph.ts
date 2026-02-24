import { neo4jService } from './services/neo4jGraphService';
import { redisCache } from './services/redisCacheService';

/**
 * Initialize Neo4j Graph Database with sample data
 * Run this script once to populate the graph with test data
 */

async function initializeGraphDatabase() {
  console.log('🚀 Initializing Graph Database...\n');

  try {
    // Connect to Neo4j
    await neo4jService.connect();
    await redisCache.connect();

    // ==========================================
    // CREATE ARTISTS
    // ==========================================
    console.log('📝 Creating Artists...');

    const kandinsky = await neo4jService.createArtist({
      id: 'artist-001',
      name: 'Василий Кандинский',
      digitalId: 'DID:ART:ARTIST:001',
      birthYear: 1866,
      nationality: 'Russian',
      artMovement: 'Abstract',
      trustScore: 98.5,
      verified: true,
    });
    console.log('✅ Created:', kandinsky.name);

    const chagall = await neo4jService.createArtist({
      id: 'artist-002',
      name: 'Марк Шагал',
      digitalId: 'DID:ART:ARTIST:002',
      birthYear: 1887,
      nationality: 'Russian',
      artMovement: 'Surrealism',
      trustScore: 96.8,
      verified: true,
    });
    console.log('✅ Created:', chagall.name);

    const malevich = await neo4jService.createArtist({
      id: 'artist-003',
      name: 'Казимир Малевич',
      digitalId: 'DID:ART:ARTIST:003',
      birthYear: 1879,
      nationality: 'Russian',
      artMovement: 'Suprematism',
      trustScore: 97.2,
      verified: true,
    });
    console.log('✅ Created:', malevich.name);

    // ==========================================
    // CREATE GALLERIES
    // ==========================================
    console.log('\n📝 Creating Galleries...');

    const tretyakov = await neo4jService.createGallery({
      id: 'gallery-001',
      name: 'Третьяковская галерея',
      digitalId: 'DID:ART:GALLERY:001',
      established: 1856,
      location: 'Moscow',
      type: 'National Museum',
      trustScore: 99.8,
      verified: true,
    });
    console.log('✅ Created:', tretyakov.name);

    const hermitage = await neo4jService.createGallery({
      id: 'gallery-002',
      name: 'Государственный Эрмитаж',
      digitalId: 'DID:ART:GALLERY:002',
      established: 1764,
      location: 'Saint Petersburg',
      type: 'National Museum',
      trustScore: 99.9,
      verified: true,
    });
    console.log('✅ Created:', hermitage.name);

    const russianMuseum = await neo4jService.createGallery({
      id: 'gallery-003',
      name: 'Государственный Русский музей',
      digitalId: 'DID:ART:GALLERY:003',
      established: 1895,
      location: 'Saint Petersburg',
      type: 'National Museum',
      trustScore: 99.5,
      verified: true,
    });
    console.log('✅ Created:', russianMuseum.name);

    // ==========================================
    // CREATE COLLECTORS
    // ==========================================
    console.log('\n📝 Creating Collectors...');

    const collector1 = await neo4jService.createCollector({
      id: 'collector-001',
      name: 'Частная коллекция "Арт-Инвест"',
      digitalId: 'DID:ART:COLLECTOR:001',
      portfolioValue: 450000000,
      artworksOwned: 189,
      investmentHorizon: 'long-term',
      trustScore: 92.4,
      verified: true,
    });
    console.log('✅ Created:', collector1.name);

    const collector2 = await neo4jService.createCollector({
      id: 'collector-002',
      name: 'Фонд "Русское наследие"',
      digitalId: 'DID:ART:COLLECTOR:002',
      portfolioValue: 680000000,
      artworksOwned: 234,
      investmentHorizon: 'long-term',
      trustScore: 94.1,
      verified: true,
    });
    console.log('✅ Created:', collector2.name);

    // ==========================================
    // CREATE ARTWORKS
    // ==========================================
    console.log('\n📝 Creating Artworks...');

    const artwork1 = await neo4jService.createArtwork({
      id: 'artwork-001',
      title: 'Абстрактная композиция №7',
      digitalId: 'DID:ART:ARTWORK:001',
      year: 1923,
      medium: 'Oil on Canvas',
      dimensions: '100x120cm',
      currentPrice: 15000000,
      trustScore: 95.2,
      verified: true,
    });
    console.log('✅ Created:', artwork1.title);

    const artwork2 = await neo4jService.createArtwork({
      id: 'artwork-002',
      title: 'Городской пейзаж',
      digitalId: 'DID:ART:ARTWORK:002',
      year: 1918,
      medium: 'Oil on Canvas',
      dimensions: '80x100cm',
      currentPrice: 35000000,
      trustScore: 93.8,
      verified: true,
    });
    console.log('✅ Created:', artwork2.title);

    const artwork3 = await neo4jService.createArtwork({
      id: 'artwork-003',
      title: 'Чёрный квадрат',
      digitalId: 'DID:ART:ARTWORK:003',
      year: 1915,
      medium: 'Oil on Canvas',
      dimensions: '79.5x79.5cm',
      currentPrice: 120000000,
      trustScore: 98.5,
      verified: true,
    });
    console.log('✅ Created:', artwork3.title);

    const artwork4 = await neo4jService.createArtwork({
      id: 'artwork-004',
      title: 'Композиция VIII',
      digitalId: 'DID:ART:ARTWORK:004',
      year: 1923,
      medium: 'Oil on Canvas',
      dimensions: '140x201cm',
      currentPrice: 42000000,
      trustScore: 96.3,
      verified: true,
    });
    console.log('✅ Created:', artwork4.title);

    // ==========================================
    // CREATE RELATIONSHIPS
    // ==========================================
    console.log('\n📝 Creating Relationships...');

    // Artist -> Artwork (CREATED)
    await neo4jService.createCreatedRelationship('artist-001', 'artwork-001', 1923);
    console.log('✅ Кандинский CREATED Абстрактная композиция №7');

    await neo4jService.createCreatedRelationship('artist-002', 'artwork-002', 1918);
    console.log('✅ Шагал CREATED Городской пейзаж');

    await neo4jService.createCreatedRelationship('artist-003', 'artwork-003', 1915);
    console.log('✅ Малевич CREATED Чёрный квадрат');

    await neo4jService.createCreatedRelationship('artist-001', 'artwork-004', 1923);
    console.log('✅ Кандинский CREATED Композиция VIII');

    // Gallery -> Artwork (EXHIBITED)
    await neo4jService.createExhibitedRelationship('gallery-001', 'artwork-001', {
      exhibitionName: 'Русский авангард',
      startDate: '2023-01-15',
      endDate: '2023-03-30',
    });
    console.log('✅ Третьяковская галерея EXHIBITED Абстрактная композиция №7');

    await neo4jService.createExhibitedRelationship('gallery-002', 'artwork-003', {
      exhibitionName: 'Супрематизм',
      startDate: '2022-10-01',
      endDate: '2023-01-10',
    });
    console.log('✅ Эрмитаж EXHIBITED Чёрный квадрат');

    await neo4jService.createExhibitedRelationship('gallery-003', 'artwork-004', {
      exhibitionName: 'Геометрия цвета',
      startDate: '2023-05-01',
      endDate: '2023-08-15',
    });
    console.log('✅ Русский музей EXHIBITED Композиция VIII');

    // Collector -> Artwork (OWNS)
    await neo4jService.createOwnsRelationship('collector-001', 'artwork-001', {
      acquiredDate: '2020-06-15',
      purchasePrice: 12000000,
      provenance: 'Private auction, verified by Sotheby\'s',
    });
    console.log('✅ Арт-Инвест OWNS Абстрактная композиция №7');

    await neo4jService.createOwnsRelationship('collector-002', 'artwork-003', {
      acquiredDate: '2015-11-20',
      purchasePrice: 95000000,
      provenance: 'Christie\'s auction, direct from Tretyakov Gallery',
    });
    console.log('✅ Русское наследие OWNS Чёрный квадрат');

    await neo4jService.createOwnsRelationship('collector-001', 'artwork-004', {
      acquiredDate: '2021-03-10',
      purchasePrice: 38000000,
      provenance: 'Private sale, verified by Russian Museum',
    });
    console.log('✅ Арт-Инвест OWNS Композиция VIII');

    // ==========================================
    // VERIFY GRAPH
    // ==========================================
    console.log('\n📊 Graph Statistics:');
    const stats = await neo4jService.getNetworkStats();
    console.log('   Artists:', stats.nodes.Artist || 0);
    console.log('   Galleries:', stats.nodes.Gallery || 0);
    console.log('   Artworks:', stats.nodes.Artwork || 0);
    console.log('   Collectors:', stats.nodes.Collector || 0);
    console.log('   Total Nodes:', stats.totalNodes);
    console.log('   Total Relationships:', stats.totalRelationships);

    // ==========================================
    // TEST PROVENANCE CHAIN
    // ==========================================
    console.log('\n🔍 Testing Provenance Chain for Artwork-001:');
    const provenance = await neo4jService.getProvenanceChain('artwork-001');
    console.log(`   Found ${provenance.length} provenance paths`);

    // ==========================================
    // TEST TRUST SCORE
    // ==========================================
    console.log('\n⭐ Testing Trust Score Calculation:');
    const trustScore = await neo4jService.calculateTrustScore('artwork-001');
    console.log(`   Artwork-001 Trust Score: ${trustScore.toFixed(1)}/100`);

    // ==========================================
    // TEST FRAUD DETECTION
    // ==========================================
    console.log('\n🛡️ Testing Fraud Detection:');
    const patterns = await neo4jService.detectSuspiciousPatterns('artwork-001');
    console.log(`   Suspicious patterns detected: ${patterns.length}`);

    console.log('\n✅ Graph Database Initialization Complete!\n');

    // Close connections
    await neo4jService.close();
    await redisCache.close();

    console.log('🎉 All services shut down gracefully\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Initialization failed:', error);
    process.exit(1);
  }
}

// Run initialization
initializeGraphDatabase();
