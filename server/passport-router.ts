import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  createArtworkPassport,
  getArtworkPassport,
  getArtworkPassportByCertificate,
  updateArtworkPassport,
  verifyArtworkPassport,
  getArtworkById
} from "./db";
import {
  generateCertificateId,
  generateArtworkQRCode,
  generateBlockchainData,
  initializeProvenance,
  addProvenanceEntry,
  type ProvenanceEntry
} from "./passport-utils";

/**
 * Artwork Passport API Router
 * Handles digital passport operations including:
 * - Creating passports with QR codes
 * - Retrieving passport data
 * - Updating provenance history
 * - Blockchain verification
 */

// Input validation schemas
const createPassportSchema = z.object({
  artworkId: z.number().positive(),
  artistName: z.string(),
  creationDate: z.string(),
  location: z.string(),
});

const getPassportSchema = z.object({
  artworkId: z.number().positive(),
});

const getByCertificateSchema = z.object({
  certificateId: z.string(),
});

const updateProvenanceSchema = z.object({
  artworkId: z.number().positive(),
  entry: z.object({
    date: z.string(),
    type: z.enum(['creation', 'sale', 'transfer', 'exhibition', 'authentication']),
    owner: z.string().optional(),
    location: z.string().optional(),
    price: z.number().optional(),
    notes: z.string().optional(),
    verified: z.boolean(),
  }),
});

const verifyPassportSchema = z.object({
  artworkId: z.number().positive(),
});

export const passportRouter = router({
  /**
   * Create a new digital passport for an artwork
   */
  create: protectedProcedure
    .input(createPassportSchema)
    .mutation(async ({ input }) => {
      const { artworkId, artistName, creationDate, location } = input;

      // Check if passport already exists
      const existingPassport = getArtworkPassport(artworkId);
      if (existingPassport) {
        throw new Error("Passport already exists for this artwork");
      }

      // Generate certificate ID
      const certificateId = generateCertificateId();

      // Generate QR code
      const qrCodeData = await generateArtworkQRCode(artworkId, certificateId);
      const qrCodeUrl = `${process.env.PUBLIC_URL || 'https://artbank.market'}/artwork-passport/${artworkId}?cert=${certificateId}`;

      // Generate blockchain data
      const blockchainData = generateBlockchainData(artworkId);

      // Initialize provenance history
      const provenance = initializeProvenance(artistName, creationDate, location);

      // Create passport
      const passportId = createArtworkPassport({
        artworkId,
        certificateId,
        qrCodeData,
        qrCodeUrl,
        blockchainVerified: blockchainData.verified,
        blockchainNetwork: blockchainData.network,
        tokenId: blockchainData.tokenId,
        contractAddress: blockchainData.contractAddress,
        ipfsHash: blockchainData.ipfsHash,
        provenanceHistory: JSON.stringify(provenance),
        authenticityVerified: true,
        verificationDate: new Date(),
      });

      return {
        success: true,
        passportId,
        certificateId,
        qrCodeData,
        blockchain: blockchainData,
      };
    }),

  /**
   * Get passport by artwork ID
   */
  getByArtwork: publicProcedure
    .input(getPassportSchema)
    .query(async ({ input }) => {
      const { artworkId } = input;

      const passport = getArtworkPassport(artworkId);
      if (!passport) {
        return null;
      }

      // Parse provenance history
      const provenanceHistory = passport.provenanceHistory
        ? JSON.parse(passport.provenanceHistory)
        : [];

      return {
        ...passport,
        provenanceHistory,
      };
    }),

  /**
   * Get passport by certificate ID
   */
  getByCertificate: publicProcedure
    .input(getByCertificateSchema)
    .query(async ({ input }) => {
      const { certificateId } = input;

      const passport = getArtworkPassportByCertificate(certificateId);
      if (!passport) {
        return null;
      }

      // Parse provenance history
      const provenanceHistory = passport.provenanceHistory
        ? JSON.parse(passport.provenanceHistory)
        : [];

      return {
        ...passport,
        provenanceHistory,
      };
    }),

  /**
   * Update provenance history
   */
  updateProvenance: protectedProcedure
    .input(updateProvenanceSchema)
    .mutation(async ({ input }) => {
      const { artworkId, entry } = input;

      const passport = getArtworkPassport(artworkId);
      if (!passport) {
        throw new Error("Passport not found");
      }

      // Parse current provenance
      const currentHistory: ProvenanceEntry[] = passport.provenanceHistory
        ? JSON.parse(passport.provenanceHistory)
        : [];

      // Add new entry
      const updatedHistory = addProvenanceEntry(currentHistory, entry as ProvenanceEntry);

      // Update passport
      updateArtworkPassport(artworkId, {
        provenanceHistory: JSON.stringify(updatedHistory),
      });

      return {
        success: true,
        provenanceHistory: updatedHistory,
      };
    }),

  /**
   * Verify artwork authenticity
   */
  verify: protectedProcedure
    .input(verifyPassportSchema)
    .mutation(async ({ input }) => {
      const { artworkId } = input;

      verifyArtworkPassport(artworkId);

      return {
        success: true,
        message: "Artwork verified successfully",
      };
    }),

  /**
   * Generate new QR code for existing passport
   */
  regenerateQR: protectedProcedure
    .input(getPassportSchema)
    .mutation(async ({ input }) => {
      const { artworkId } = input;

      const passport = getArtworkPassport(artworkId);
      if (!passport) {
        throw new Error("Passport not found");
      }

      // Generate new QR code with same certificate
      const qrCodeData = await generateArtworkQRCode(artworkId, passport.certificateId);

      // Update passport
      updateArtworkPassport(artworkId, {
        qrCodeData,
      });

      return {
        success: true,
        qrCodeData,
      };
    }),
});
