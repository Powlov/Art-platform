import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import sharp from 'sharp';
import crypto from 'crypto';

// Initialize R2 client
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'artbank-uploads';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || '';

// Create S3 client configured for R2
const r2Client = R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY
  ? new S3Client({
      region: 'auto',
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    })
  : null;

/**
 * Generate unique filename
 */
export function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  return `${timestamp}-${randomString}.${extension}`;
}

/**
 * Image processing options
 */
export interface ImageProcessingOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

/**
 * Process and optimize image
 */
export async function processImage(
  buffer: Buffer,
  options: ImageProcessingOptions = {}
): Promise<Buffer> {
  const {
    width = 1920,
    height,
    quality = 85,
    format = 'webp',
    fit = 'inside',
  } = options;

  let sharpInstance = sharp(buffer);

  // Resize if dimensions specified
  if (width || height) {
    sharpInstance = sharpInstance.resize(width, height, {
      fit,
      withoutEnlargement: true,
    });
  }

  // Convert to specified format with quality
  switch (format) {
    case 'jpeg':
      sharpInstance = sharpInstance.jpeg({ quality, progressive: true });
      break;
    case 'png':
      sharpInstance = sharpInstance.png({ quality, compressionLevel: 9 });
      break;
    case 'webp':
      sharpInstance = sharpInstance.webp({ quality });
      break;
  }

  return await sharpInstance.toBuffer();
}

/**
 * Generate multiple image sizes (thumbnails)
 */
export async function generateImageVariants(
  buffer: Buffer,
  filename: string
): Promise<{
  original: { key: string; buffer: Buffer; size: string };
  large: { key: string; buffer: Buffer; size: string };
  medium: { key: string; buffer: Buffer; size: string };
  thumbnail: { key: string; buffer: Buffer; size: string };
}> {
  const baseName = filename.replace(/\.[^/.]+$/, '');

  const [original, large, medium, thumbnail] = await Promise.all([
    processImage(buffer, { width: 2400, quality: 90, format: 'webp' }),
    processImage(buffer, { width: 1920, quality: 85, format: 'webp' }),
    processImage(buffer, { width: 800, quality: 80, format: 'webp' }),
    processImage(buffer, { width: 400, quality: 75, format: 'webp' }),
  ]);

  return {
    original: { key: `${baseName}-original.webp`, buffer: original, size: 'original' },
    large: { key: `${baseName}-large.webp`, buffer: large, size: 'large' },
    medium: { key: `${baseName}-medium.webp`, buffer: medium, size: 'medium' },
    thumbnail: { key: `${baseName}-thumb.webp`, buffer: thumbnail, size: 'thumbnail' },
  };
}

/**
 * Upload file to R2
 */
export async function uploadToR2(
  buffer: Buffer,
  filename: string,
  contentType: string = 'image/webp',
  folder: string = 'artworks'
): Promise<string> {
  if (!r2Client) {
    throw new Error('R2 client not configured. Please set R2 environment variables.');
  }

  const key = `${folder}/${filename}`;

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await r2Client.send(command);

  // Return public URL
  if (R2_PUBLIC_URL) {
    return `${R2_PUBLIC_URL}/${key}`;
  }

  // Fallback to R2 dev URL format
  return `https://pub-${R2_ACCOUNT_ID}.r2.dev/${key}`;
}

/**
 * Upload multiple image variants
 */
export async function uploadImageVariants(
  buffer: Buffer,
  originalFilename: string,
  folder: string = 'artworks'
): Promise<{
  original: string;
  large: string;
  medium: string;
  thumbnail: string;
}> {
  const filename = generateUniqueFilename(originalFilename);
  const variants = await generateImageVariants(buffer, filename);

  const [originalUrl, largeUrl, mediumUrl, thumbnailUrl] = await Promise.all([
    uploadToR2(variants.original.buffer, variants.original.key, 'image/webp', folder),
    uploadToR2(variants.large.buffer, variants.large.key, 'image/webp', folder),
    uploadToR2(variants.medium.buffer, variants.medium.key, 'image/webp', folder),
    uploadToR2(variants.thumbnail.buffer, variants.thumbnail.key, 'image/webp', folder),
  ]);

  return {
    original: originalUrl,
    large: largeUrl,
    medium: mediumUrl,
    thumbnail: thumbnailUrl,
  };
}

/**
 * Delete file from R2
 */
export async function deleteFromR2(fileUrl: string): Promise<void> {
  if (!r2Client) {
    throw new Error('R2 client not configured.');
  }

  // Extract key from URL
  const urlParts = fileUrl.split('/');
  const key = urlParts.slice(3).join('/'); // Remove protocol and domain

  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  await r2Client.send(command);
}

/**
 * Generate presigned URL for direct upload from client
 */
export async function generatePresignedUploadUrl(
  filename: string,
  contentType: string,
  expiresIn: number = 3600
): Promise<{ uploadUrl: string; fileUrl: string; key: string }> {
  if (!r2Client) {
    throw new Error('R2 client not configured.');
  }

  const key = `temp/${generateUniqueFilename(filename)}`;

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn });
  const fileUrl = R2_PUBLIC_URL 
    ? `${R2_PUBLIC_URL}/${key}` 
    : `https://pub-${R2_ACCOUNT_ID}.r2.dev/${key}`;

  return { uploadUrl, fileUrl, key };
}

/**
 * Check if R2 is configured
 */
export function isR2Configured(): boolean {
  return !!(R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY);
}

/**
 * Validate image file
 */
export function validateImageFile(
  file: { mimetype: string; size: number },
  maxSizeMB: number = 10
): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  
  if (!allowedTypes.includes(file.mimetype)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.',
    };
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit.`,
    };
  }

  return { valid: true };
}
