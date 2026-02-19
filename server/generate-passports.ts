import Database from "better-sqlite3";
import {
  generateCertificateId,
  generateArtworkQRCode,
  generateBlockchainData,
  initializeProvenance
} from "./passport-utils.js";

/**
 * Script to generate passports for existing artworks
 * Run with: npx tsx server/generate-passports.ts
 */

async function generatePassports() {
  try {
    console.log('🎫 Generating passports for existing artworks...\n');
    
    const db = new Database('./artbank.db');
    
    // Get all artworks without passports
    const artworks = db.prepare(`
      SELECT a.id, a.title, a.artistId, a.year
      FROM artworks a
      LEFT JOIN artwork_passport p ON a.id = p.artwork_id
      WHERE p.id IS NULL
    `).all() as Array<{ id: number; title: string; artistId: number; year: number }>;
    
    console.log(`Found ${artworks.length} artworks without passports\n`);
    
    if (artworks.length === 0) {
      console.log('✅ All artworks already have passports!');
      db.close();
      return;
    }
    
    let successCount = 0;
    let failCount = 0;
    
    for (const artwork of artworks) {
      try {
        console.log(`Processing artwork #${artwork.id}: "${artwork.title}"...`);
        
        // Generate certificate ID
        const certificateId = generateCertificateId();
        
        // Generate QR code
        const qrCodeData = await generateArtworkQRCode(artwork.id, certificateId);
        const qrCodeUrl = `${process.env.PUBLIC_URL || 'https://artbank.market'}/artwork-passport/${artwork.id}?cert=${certificateId}`;
        
        // Generate blockchain data
        const blockchainData = generateBlockchainData(artwork.id);
        
        // Initialize provenance
        const artistName = 'Artist'; // Default name, can be updated later
        const creationDate = artwork.year ? `${artwork.year}-01-01` : new Date().toISOString().split('T')[0];
        const location = 'Art Bank Platform';
        const provenance = initializeProvenance(artistName, creationDate, location);
        
        // Insert passport
        db.prepare(`
          INSERT INTO artwork_passport (
            artwork_id, certificate_id, qr_code_data, qr_code_url,
            blockchain_verified, blockchain_network, token_id, contract_address, ipfs_hash,
            provenance_history, authenticity_verified, verification_date, last_updated
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          artwork.id,
          certificateId,
          qrCodeData,
          qrCodeUrl,
          blockchainData.verified ? 1 : 0,
          blockchainData.network,
          blockchainData.tokenId,
          blockchainData.contractAddress,
          blockchainData.ipfsHash,
          JSON.stringify(provenance),
          1, // authenticity_verified
          new Date().toISOString(),
          new Date().toISOString()
        );
        
        console.log(`  ✅ Certificate: ${certificateId}`);
        console.log(`  ✅ Token ID: ${blockchainData.tokenId}\n`);
        
        successCount++;
      } catch (error) {
        console.error(`  ❌ Failed: ${error}\n`);
        failCount++;
      }
    }
    
    console.log('\n📊 Summary:');
    console.log(`  ✅ Success: ${successCount}`);
    console.log(`  ❌ Failed: ${failCount}`);
    console.log(`  📋 Total: ${artworks.length}\n`);
    
    db.close();
    
    console.log('✨ Passport generation complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Generation failed:', error);
    process.exit(1);
  }
}

generatePassports();
