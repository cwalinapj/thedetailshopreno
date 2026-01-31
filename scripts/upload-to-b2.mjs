#!/usr/bin/env node
/**
 * B2 Upload Script
 *
 * Uploads processed images to Backblaze B2 bucket
 * Uses the S3-compatible API for easier integration
 */

import {S3Client, PutObjectCommand, ListObjectsV2Command} from '@aws-sdk/client-s3';
import {glob} from 'glob';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// Configuration from environment
const CONFIG = {
  keyId: process.env.B2_KEY_ID,
  appKey: process.env.B2_APP_KEY,
  bucket: process.env.B2_BUCKET_NAME || 'thedetailshopreno',
  endpoint: process.env.B2_ENDPOINT || 'https://s3.us-west-004.backblazeb2.com',
  region: 'us-west-004',
  inputDir: process.env.INPUT_DIR || './public/images',
  concurrency: 10,
};

// Content type mapping
const CONTENT_TYPES = {
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.json': 'application/json',
};

/**
 * Create S3 client for B2
 */
function createB2Client() {
  if (!CONFIG.keyId || !CONFIG.appKey) {
    throw new Error('B2_KEY_ID and B2_APP_KEY environment variables required');
  }

  return new S3Client({
    endpoint: CONFIG.endpoint,
    region: CONFIG.region,
    credentials: {
      accessKeyId: CONFIG.keyId,
      secretAccessKey: CONFIG.appKey,
    },
    forcePathStyle: true,
  });
}

/**
 * Calculate MD5 hash for integrity check
 */
async function calculateMD5(filePath) {
  const content = await fs.readFile(filePath);
  return crypto.createHash('md5').update(content).digest('base64');
}

/**
 * Upload a single file to B2
 */
async function uploadFile(client, filePath) {
  const relativePath = path.relative(CONFIG.inputDir, filePath);
  const key = relativePath.replace(/\\/g, '/'); // Normalize path separators

  try {
    const content = await fs.readFile(filePath);
    const contentType = CONTENT_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
    const md5 = await calculateMD5(filePath);

    const command = new PutObjectCommand({
      Bucket: CONFIG.bucket,
      Key: key,
      Body: content,
      ContentType: contentType,
      ContentMD5: md5,
      CacheControl: 'public, max-age=31536000, immutable',
    });

    await client.send(command);
    return {success: true, key, size: content.length};

  } catch (error) {
    return {error: true, key: relativePath, message: error.message};
  }
}

/**
 * Upload files in batches
 */
async function uploadInBatches(client, files, batchSize = CONFIG.concurrency) {
  const results = {
    uploaded: 0,
    failed: 0,
    totalSize: 0,
  };

  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(file => uploadFile(client, file))
    );

    for (const result of batchResults) {
      if (result.success) {
        results.uploaded++;
        results.totalSize += result.size;
        console.log(`✓ ${result.key}`);
      } else {
        results.failed++;
        console.error(`✗ ${result.key}: ${result.message}`);
      }
    }

    // Progress
    const progress = Math.round(((i + batch.length) / files.length) * 100);
    console.log(`\nProgress: ${progress}% (${i + batch.length}/${files.length})\n`);
  }

  return results;
}

/**
 * Get list of existing files in bucket
 */
async function listExistingFiles(client) {
  const existing = new Set();
  let continuationToken;

  do {
    const command = new ListObjectsV2Command({
      Bucket: CONFIG.bucket,
      ContinuationToken: continuationToken,
    });

    const response = await client.send(command);

    if (response.Contents) {
      for (const obj of response.Contents) {
        existing.add(obj.Key);
      }
    }

    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  return existing;
}

/**
 * Main entry point
 */
async function main() {
  console.log('========================================');
  console.log('B2 Image Upload');
  console.log('========================================\n');

  // Create client
  const client = createB2Client();
  console.log(`Bucket: ${CONFIG.bucket}`);
  console.log(`Endpoint: ${CONFIG.endpoint}\n`);

  // Get all files to upload
  const files = await glob(path.join(CONFIG.inputDir, '**', '*.*'));
  console.log(`Found ${files.length} files to upload\n`);

  if (files.length === 0) {
    console.log('No files found. Run the image processing pipeline first.');
    return;
  }

  // Option: Skip already uploaded files
  const skipExisting = process.argv.includes('--skip-existing');
  let filesToUpload = files;

  if (skipExisting) {
    console.log('Checking existing files in bucket...');
    const existing = await listExistingFiles(client);
    console.log(`Found ${existing.size} existing files\n`);

    filesToUpload = files.filter(f => {
      const key = path.relative(CONFIG.inputDir, f).replace(/\\/g, '/');
      return !existing.has(key);
    });

    console.log(`${filesToUpload.length} new files to upload\n`);
  }

  if (filesToUpload.length === 0) {
    console.log('All files already uploaded!');
    return;
  }

  // Upload files
  const startTime = Date.now();
  const results = await uploadInBatches(client, filesToUpload);
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  // Summary
  console.log('\n========================================');
  console.log('Upload Complete');
  console.log('========================================');
  console.log(`Uploaded: ${results.uploaded} files`);
  console.log(`Failed:   ${results.failed} files`);
  console.log(`Size:     ${(results.totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Duration: ${duration}s`);
  console.log(`\nCDN URL: https://assets.thedetailshopreno.com/`);
}

main().catch(console.error);
