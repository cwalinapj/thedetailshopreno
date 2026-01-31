#!/usr/bin/env node
/**
 * Optimized Pipeline: Process → Upload immediately
 * Streams each processed image directly to B2 without local storage
 */

import sharp from 'sharp';
import {glob} from 'glob';
import path from 'path';
import fs from 'fs/promises';
import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3';

const CONFIG = {
  inputDir: process.env.INPUT_DIR || './uploads',
  sizes: [360, 640, 960, 1440, 1920],
  formats: ['avif', 'webp', 'jpg'],
  quality: {avif: 65, webp: 80, jpg: 85},
  minFileSize: 1024, // 1KB minimum (keep small images)
  concurrency: 4,
  b2: {
    keyId: process.env.B2_KEY_ID,
    appKey: process.env.B2_APP_KEY,
    bucket: process.env.B2_BUCKET_NAME || 'thedetailshopreno',
    endpoint: process.env.B2_ENDPOINT || 'https://s3.us-west-004.backblazeb2.com',
    region: 'us-west-004',
  },
};

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const CONTENT_TYPES = {avif: 'image/avif', webp: 'image/webp', jpg: 'image/jpeg'};

// Initialize B2 client
const s3 = new S3Client({
  endpoint: CONFIG.b2.endpoint,
  region: CONFIG.b2.region,
  credentials: {accessKeyId: CONFIG.b2.keyId, secretAccessKey: CONFIG.b2.appKey},
  forcePathStyle: true,
});

/**
 * Upload buffer to B2
 */
async function uploadToB2(key, buffer, contentType) {
  await s3.send(new PutObjectCommand({
    Bucket: CONFIG.b2.bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  }));
}

/**
 * Process single image and upload all variants immediately
 */
async function processAndUpload(inputPath, relativePath) {
  const baseName = path.parse(relativePath).name;
  const dir = path.dirname(relativePath);

  try {
    const stats = await fs.stat(inputPath);
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) return {skipped: true};

    let uploaded = 0;

    // For small images, just convert formats without resizing
    if (stats.size < CONFIG.minFileSize || metadata.width < 400) {
      for (const format of CONFIG.formats) {
        const key = `${dir}/${baseName}.${format}`;
        let buffer;

        if (format === 'avif') buffer = await image.clone().avif({quality: CONFIG.quality.avif}).toBuffer();
        else if (format === 'webp') buffer = await image.clone().webp({quality: CONFIG.quality.webp}).toBuffer();
        else buffer = await image.clone().jpeg({quality: CONFIG.quality.jpg}).toBuffer();

        await uploadToB2(key, buffer, CONTENT_TYPES[format]);
        uploaded++;
      }
      return {success: true, uploaded, small: true};
    }

    // For larger images, create all size variants
    for (const width of CONFIG.sizes) {
      if (metadata.width < width) continue;

      const resized = image.clone().resize(width, null, {withoutEnlargement: true, fit: 'inside'});

      for (const format of CONFIG.formats) {
        const key = `${dir}/${baseName}-${width}w.${format}`;
        let buffer;

        if (format === 'avif') buffer = await resized.clone().avif({quality: CONFIG.quality.avif}).toBuffer();
        else if (format === 'webp') buffer = await resized.clone().webp({quality: CONFIG.quality.webp}).toBuffer();
        else buffer = await resized.clone().jpeg({quality: CONFIG.quality.jpg}).toBuffer();

        await uploadToB2(key, buffer, CONTENT_TYPES[format]);
        uploaded++;
      }
    }

    return {success: true, uploaded};
  } catch (error) {
    return {error: true, message: error.message};
  }
}

/**
 * Get all image files
 */
async function getImageFiles() {
  const patterns = IMAGE_EXTENSIONS.map(ext => path.join(CONFIG.inputDir, '**', `*${ext}`));
  const files = [];
  for (const pattern of patterns) {
    files.push(...await glob(pattern, {nocase: true}));
  }
  return files.filter(f => !/-\d+x\d+\.(jpg|jpeg|png|webp)$/i.test(f));
}

/**
 * Main
 */
async function main() {
  console.log('========================================');
  console.log('Process + Upload Pipeline (Optimized)');
  console.log('========================================\n');

  if (!CONFIG.b2.keyId || !CONFIG.b2.appKey) {
    console.error('B2_KEY_ID and B2_APP_KEY required');
    process.exit(1);
  }

  const files = await getImageFiles();
  console.log(`Found ${files.length} images\n`);

  let processed = 0, uploaded = 0, errors = 0;

  for (let i = 0; i < files.length; i += CONFIG.concurrency) {
    const batch = files.slice(i, i + CONFIG.concurrency);
    const results = await Promise.all(batch.map(f => {
      const rel = path.relative(CONFIG.inputDir, f);
      return processAndUpload(f, rel);
    }));

    for (const r of results) {
      if (r.success) { processed++; uploaded += r.uploaded; }
      else if (r.error) { errors++; }
    }

    const pct = Math.round(((i + batch.length) / files.length) * 100);
    console.log(`Progress: ${pct}% | Processed: ${processed} | Uploaded: ${uploaded} variants`);
  }

  console.log(`\n✅ Done! ${processed} images → ${uploaded} variants uploaded to B2`);
}

main().catch(console.error);
