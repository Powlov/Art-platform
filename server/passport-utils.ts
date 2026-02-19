import QRCode from 'qrcode';
import { randomBytes } from 'crypto';

/**
 * Generate a unique certificate ID for artwork passport
 */
export function generateCertificateId(): string {
  const timestamp = Date.now().toString(36);
  const random = randomBytes(8).toString('hex');
  return `ARTBNK-${timestamp}-${random}`.toUpperCase();
}

/**
 * Generate QR code data URL for artwork passport
 * @param artworkId - The ID of the artwork
 * @param certificateId - Unique certificate ID
 * @returns Base64-encoded QR code image
 */
export async function generateArtworkQRCode(
  artworkId: number,
  certificateId: string
): Promise<string> {
  // URL that will be embedded in QR code
  // Points to the artwork passport page
  const passportUrl = `${process.env.PUBLIC_URL || 'https://artbank.market'}/artwork-passport/${artworkId}?cert=${certificateId}`;
  
  try {
    // Generate QR code as data URL (Base64)
    const qrCodeDataUrl = await QRCode.toDataURL(passportUrl, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 1,
      margin: 2,
      width: 512,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Generate blockchain-style token ID
 */
export function generateTokenId(artworkId: number): string {
  const prefix = 'ARTBNK';
  const timestamp = Date.now();
  const hash = randomBytes(4).toString('hex');
  return `${prefix}-${artworkId}-${timestamp}-${hash}`.toUpperCase();
}

/**
 * Generate mock IPFS hash for artwork metadata
 */
export function generateIPFSHash(): string {
  // In production, this would be an actual IPFS hash
  // For now, generate a realistic-looking hash
  const hash = randomBytes(32).toString('hex');
  return `Qm${hash.substring(0, 44)}`;
}

/**
 * Create provenance entry
 */
export interface ProvenanceEntry {
  date: string;
  type: 'creation' | 'sale' | 'transfer' | 'exhibition' | 'authentication';
  owner?: string;
  location?: string;
  price?: number;
  notes?: string;
  verified: boolean;
}

/**
 * Initialize provenance history for new artwork
 */
export function initializeProvenance(
  artistName: string,
  creationDate: string,
  location: string
): ProvenanceEntry[] {
  return [
    {
      date: creationDate,
      type: 'creation',
      owner: artistName,
      location: location,
      notes: 'Original creation by artist',
      verified: true,
    },
    {
      date: new Date().toISOString().split('T')[0],
      type: 'authentication',
      notes: 'Authenticated by ART BANK PLATFORM',
      verified: true,
    },
  ];
}

/**
 * Add new provenance entry
 */
export function addProvenanceEntry(
  currentHistory: ProvenanceEntry[],
  newEntry: ProvenanceEntry
): ProvenanceEntry[] {
  return [...currentHistory, newEntry];
}

/**
 * Blockchain verification data
 */
export interface BlockchainData {
  verified: boolean;
  network: string;
  tokenId: string;
  contractAddress: string;
  ipfsHash: string;
}

/**
 * Generate mock blockchain verification data
 * In production, this would interact with actual blockchain
 */
export function generateBlockchainData(artworkId: number): BlockchainData {
  return {
    verified: true,
    network: 'Ethereum',
    tokenId: generateTokenId(artworkId),
    contractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    ipfsHash: generateIPFSHash(),
  };
}
