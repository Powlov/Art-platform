# Cloudflare R2 Upload System - Setup Guide

## Overview

The ART BANK Platform uses **Cloudflare R2** for scalable and cost-effective image storage. R2 is S3-compatible and offers zero egress fees, making it perfect for artwork images.

## Features

✅ **Drag-and-drop** upload interface  
✅ **Automatic image optimization** (WebP conversion)  
✅ **Multiple image variants** (original, large, medium, thumbnail)  
✅ **Real-time upload progress**  
✅ **File validation** (type, size)  
✅ **10MB file size limit**  
✅ **Sharp-based compression** (85% quality)  

## Setup Instructions

### 1. Create Cloudflare R2 Bucket

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **R2** section
3. Click **Create bucket**
4. Name your bucket: `artbank-uploads`
5. Choose a location (automatic is fine)
6. Click **Create bucket**

### 2. Generate R2 API Tokens

1. In R2 dashboard, click **Manage R2 API Tokens**
2. Click **Create API token**
3. Configure permissions:
   - **Token name**: `artbank-upload-token`
   - **Permissions**: Object Read & Write
   - **Specific bucket**: `artbank-uploads`
4. Click **Create API token**
5. **Copy and save** the credentials:
   - Access Key ID
   - Secret Access Key
   - Account ID (from R2 dashboard URL)

### 3. Enable Public Access (Optional)

For public artwork images:

1. In your bucket settings, click **Settings**
2. Under **Public Access**, click **Allow Access**
3. Copy the **Public Bucket URL**: `https://pub-xxxxx.r2.dev`

### 4. Configure Environment Variables

Add to your `.env` file:

```bash
# Cloudflare R2 Configuration
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=artbank-uploads
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

### 5. Restart Server

```bash
pm2 restart art-bank-market
```

## Usage

### In Artwork Submission Form

The `ImageUpload` component is already integrated:

```tsx
<ImageUpload
  onUploadComplete={(urls) => {
    setImageUrl(urls.large);
    toast({
      title: 'Image uploaded!',
      description: 'Image successfully uploaded and optimized.',
    });
  }}
  maxSizeMB={10}
  showPreview={true}
/>
```

### Image Variants Generated

Each upload creates 4 optimized versions:

- **Original**: 2400px max width, 90% quality
- **Large**: 1920px max width, 85% quality
- **Medium**: 800px max width, 80% quality
- **Thumbnail**: 400px max width, 75% quality

All variants are converted to **WebP** format for optimal performance.

### API Endpoints

#### Check Configuration
```typescript
const config = await trpc.upload.isConfigured.query();
// Returns: { configured: true, provider: 'Cloudflare R2', maxSizeMB: 10 }
```

#### Upload Image
```typescript
const result = await trpc.upload.uploadArtworkImage.mutate({
  imageData: base64String,
  filename: 'artwork.jpg',
  contentType: 'image/jpeg',
});

// Returns: { 
//   success: true, 
//   urls: { 
//     original: 'https://...',
//     large: 'https://...',
//     medium: 'https://...',
//     thumbnail: 'https://...'
//   } 
// }
```

#### Delete Image
```typescript
await trpc.upload.deleteFile.mutate({
  fileUrl: 'https://pub-xxxxx.r2.dev/artworks/image.webp'
});
```

#### Get Presigned URL (Direct Upload)
```typescript
const { uploadUrl, fileUrl } = await trpc.upload.getPresignedUrl.mutate({
  filename: 'artwork.jpg',
  contentType: 'image/jpeg',
});

// Use uploadUrl to PUT file directly from browser
await fetch(uploadUrl, {
  method: 'PUT',
  body: fileBuffer,
  headers: { 'Content-Type': 'image/jpeg' }
});
```

## File Structure

```
server/
├── r2-utils.ts           # R2 utilities and image processing
├── upload-router.ts      # tRPC upload endpoints
└── routers.ts            # Router registration

client/
└── src/
    └── components/
        └── ImageUpload.tsx  # Drag-and-drop upload component
```

## Image Processing Pipeline

1. **File Validation**: Type and size checks
2. **Base64 Decoding**: Convert client data to Buffer
3. **Sharp Processing**: Resize, optimize, convert to WebP
4. **Generate Variants**: Create 4 optimized sizes
5. **Upload to R2**: Parallel upload of all variants
6. **Return URLs**: Public URLs for each variant

## Cost Estimation

Cloudflare R2 Pricing (as of 2024):
- **Storage**: $0.015/GB/month
- **Class A operations** (writes): $4.50/million
- **Class B operations** (reads): $0.36/million
- **Egress**: **FREE** (no bandwidth charges!)

Example for 10,000 artworks:
- **Storage**: 100GB = $1.50/month
- **Uploads**: 10K writes = $0.045
- **Views**: 1M reads = $0.36
- **Total**: ~$2/month 🎉

## Security Features

✅ **Authentication required**: Protected tRPC endpoints  
✅ **File validation**: Type and size checks  
✅ **Virus scanning**: TODO (optional)  
✅ **Rate limiting**: TODO (optional)  
✅ **Signed URLs**: For temporary access  

## Troubleshooting

### Upload fails with "R2 client not configured"
- Check that all R2_* environment variables are set in `.env`
- Restart the server after adding variables

### Images not accessible (404)
- Verify R2_PUBLIC_URL is correct
- Enable public access on your R2 bucket
- Check bucket permissions

### Upload is slow
- Image processing is CPU-intensive
- Large files take longer to compress
- Consider using presigned URLs for direct upload

### "File size exceeds limit"
- Default limit is 10MB
- Adjust `maxSizeMB` prop in ImageUpload component
- Update validation in `r2-utils.ts`

## Alternative: AWS S3

If you prefer AWS S3, the code is S3-compatible:

```bash
# In .env, use these instead:
R2_ACCOUNT_ID=your-aws-account-id
R2_ACCESS_KEY_ID=your-aws-access-key
R2_SECRET_ACCESS_KEY=your-aws-secret-key
R2_BUCKET_NAME=your-s3-bucket
R2_PUBLIC_URL=https://your-bucket.s3.amazonaws.com

# Update endpoint in r2-utils.ts:
endpoint: 'https://s3.amazonaws.com'
```

## Next Steps

- [ ] Add virus scanning (ClamAV)
- [ ] Implement rate limiting
- [ ] Add upload quotas per user
- [ ] Track storage usage in database
- [ ] Support for multiple images per artwork
- [ ] Video upload support
- [ ] Custom domain for R2 bucket

## Support

For issues or questions:
- Check [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- Review Sharp documentation for image processing
- Contact platform administrators

---

**Platform**: ART BANK v3.16.0  
**Last Updated**: 2026-01-26
