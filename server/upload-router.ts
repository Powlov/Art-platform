import { router, protectedProcedure } from './_core/trpc';
import { z } from 'zod';
import multer from 'multer';
import { 
  uploadImageVariants, 
  deleteFromR2, 
  generatePresignedUploadUrl,
  isR2Configured,
  validateImageFile,
} from './r2-utils';

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

/**
 * Upload Router
 * Handles file uploads to Cloudflare R2
 */
export const uploadRouter = router({
  /**
   * Check if upload is configured
   */
  isConfigured: protectedProcedure.query(async () => {
    return {
      configured: isR2Configured(),
      provider: 'Cloudflare R2',
      maxSizeMB: 10,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    };
  }),

  /**
   * Generate presigned URL for direct client upload
   */
  getPresignedUrl: protectedProcedure
    .input(z.object({
      filename: z.string(),
      contentType: z.string(),
    }))
    .mutation(async ({ input, ctx: { user } }) => {
      if (!user) throw new Error("User not authenticated");

      if (!isR2Configured()) {
        throw new Error("File upload not configured. Please set R2 environment variables.");
      }

      const { uploadUrl, fileUrl, key } = await generatePresignedUploadUrl(
        input.filename,
        input.contentType
      );

      return {
        uploadUrl,
        fileUrl,
        key,
        expiresIn: 3600, // 1 hour
      };
    }),

  /**
   * Upload artwork image (server-side processing)
   * This endpoint expects base64 encoded image data
   */
  uploadArtworkImage: protectedProcedure
    .input(z.object({
      imageData: z.string(), // base64 encoded image
      filename: z.string(),
      contentType: z.string().optional(),
    }))
    .mutation(async ({ input, ctx: { user } }) => {
      if (!user) throw new Error("User not authenticated");

      if (!isR2Configured()) {
        throw new Error("File upload not configured. Please set R2 environment variables.");
      }

      try {
        // Decode base64 image
        const base64Data = input.imageData.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        // Validate file
        const validation = validateImageFile({
          mimetype: input.contentType || 'image/jpeg',
          size: buffer.length,
        });

        if (!validation.valid) {
          throw new Error(validation.error);
        }

        // Upload with multiple variants
        const urls = await uploadImageVariants(buffer, input.filename, 'artworks');

        return {
          success: true,
          urls,
          message: 'Image uploaded successfully',
        };
      } catch (error: any) {
        console.error('Upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }
    }),

  /**
   * Delete uploaded file
   */
  deleteFile: protectedProcedure
    .input(z.object({
      fileUrl: z.string().url(),
    }))
    .mutation(async ({ input, ctx: { user } }) => {
      if (!user) throw new Error("User not authenticated");

      if (!isR2Configured()) {
        throw new Error("File upload not configured.");
      }

      try {
        await deleteFromR2(input.fileUrl);

        return {
          success: true,
          message: 'File deleted successfully',
        };
      } catch (error: any) {
        console.error('Delete error:', error);
        throw new Error(`Delete failed: ${error.message}`);
      }
    }),

  /**
   * Get upload statistics for user
   */
  getStats: protectedProcedure
    .query(async ({ ctx: { user } }) => {
      if (!user) throw new Error("User not authenticated");

      // TODO: Track upload statistics in database
      // For now, return mock data
      return {
        totalUploads: 0,
        totalSizeMB: 0,
        quotaMB: 1000, // 1GB quota per user
        usedPercentage: 0,
      };
    }),
});
