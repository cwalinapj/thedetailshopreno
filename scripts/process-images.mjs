#!/usr/bin/env node
/**
 * Image Processing Pipeline
 *
 * Processes WordPress uploads into optimized responsive images:
 * - Multiple sizes: 360w, 640w, 960w, 1440w, 1920w
 * - Multiple formats: AVIF, WebP, JPG
 * - Organized output for CDN deployment to B2/Cloudflare
 */

import sharp from 'sharp';
import {glob} from 'glob';
import path from 'path';
import fs from 'fs/promises';

// Configuration
const CONFIG = {
  inputDir: process.env.INPUT_DIR || './uploads',
  outputDir: process.env.OUTPUT_DIR || './public/images',
  sizes: [360, 640, 960, 1440, 1920],
  formats: ['avif', 'webp', 'jpg'],
  quality: {
    avif: 65,
    webp: 80,
    jpg: 85,
  },
  // Skip files smaller than this (likely already optimized)
  minFileSize: 10 * 1024, // 10KB
  // Max concurrent operations
  concurrency: 4,
};

// Image extensions to process
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

/**
 * Get all image files from input directory
 */
async function getImageFiles() {
  const patterns = IMAGE_EXTENSIONS.map(ext =>
    path.join(CONFIG.inputDir, '**', `*${ext}`)
  );

  const files = [];
  for (const pattern of patterns) {
    const matches = await glob(pattern, {nocase: true});
    files.push(...matches);
  }

  // Filter out WordPress thumbnail variants (already have -NxN in name)
  return files.filter(f => !/-\d+x\d+\.(jpg|jpeg|png|webp|gif)$/i.test(f));
}

/**
 * Process a single image into all sizes and formats
 */
async function processImage(inputPath) {
  const relativePath = path.relative(CONFIG.inputDir, inputPath);
  const parsedPath = path.parse(relativePath);
  const baseName = parsedPath.name;
  const outputSubDir = parsedPath.dir;

  try {
    const stats = await fs.stat(inputPath);
    if (stats.size < CONFIG.minFileSize) {
      console.log(`Skipping ${relativePath} (too small)`);
      return {skipped: true, path: relativePath};
    }

    const image = sharp(inputPath);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      console.log(`Skipping ${relativePath} (no dimensions)`);
      return {skipped: true, path: relativePath};
    }

    const results = [];

    // Process each size
    for (const width of CONFIG.sizes) {
      // Skip if original is smaller
      if (metadata.width < width) continue;

      const outputBaseName = `${baseName}-${width}w`;
      const outputDirPath = path.join(CONFIG.outputDir, outputSubDir);

      // Ensure output directory exists
      await fs.mkdir(outputDirPath, {recursive: true});

      // Create resized image
      const resized = sharp(inputPath)
        .resize(width, null, {
          withoutEnlargement: true,
          fit: 'inside',
        });

      // Output each format
      for (const format of CONFIG.formats) {
        const outputFileName = `${outputBaseName}.${format}`;
        const outputPath = path.join(outputDirPath, outputFileName);

        let processor = resized.clone();

        switch (format) {
          case 'avif':
            processor = processor.avif({
              quality: CONFIG.quality.avif,
              effort: 4,
            });
            break;
          case 'webp':
            processor = processor.webp({
              quality: CONFIG.quality.webp,
              effort: 4,
            });
            break;
          case 'jpg':
            processor = processor.jpeg({
              quality: CONFIG.quality.jpg,
              progressive: true,
              mozjpeg: true,
            });
            break;
        }

        await processor.toFile(outputPath);
        results.push({width, format, path: outputPath});
      }
    }

    console.log(`✓ Processed ${relativePath} -> ${results.length} variants`);
    return {success: true, path: relativePath, variants: results.length};

  } catch (error) {
    console.error(`✗ Error processing ${relativePath}:`, error.message);
    return {error: true, path: relativePath, message: error.message};
  }
}

/**
 * Process images in batches for memory efficiency
 */
async function processInBatches(files, batchSize = CONFIG.concurrency) {
  const results = {
    processed: 0,
    skipped: 0,
    errors: 0,
    variants: 0,
  };

  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processImage));

    for (const result of batchResults) {
      if (result.success) {
        results.processed++;
        results.variants += result.variants;
      } else if (result.skipped) {
        results.skipped++;
      } else {
        results.errors++;
      }
    }

    // Progress update
    const progress = Math.round(((i + batch.length) / files.length) * 100);
    console.log(`\nProgress: ${progress}% (${i + batch.length}/${files.length})\n`);
  }

  return results;
}

/**
 * Generate image manifest for CDN deployment
 */
async function generateManifest(outputDir) {
  const files = await glob(path.join(outputDir, '**', '*.*'));

  const manifest = {
    generated: new Date().toISOString(),
    baseUrl: 'https://assets.thedetailshopreno.com',
    images: {},
  };

  for (const file of files) {
    const relativePath = path.relative(outputDir, file);
    const parsed = path.parse(relativePath);

    // Extract base name and size from filename (e.g., "hero-1920w.avif")
    const match = parsed.name.match(/^(.+)-(\d+)w$/);
    if (!match) continue;

    const [, baseName, width] = match;
    const imageKey = path.join(parsed.dir, baseName);

    if (!manifest.images[imageKey]) {
      manifest.images[imageKey] = {
        sizes: {},
      };
    }

    if (!manifest.images[imageKey].sizes[width]) {
      manifest.images[imageKey].sizes[width] = {};
    }

    manifest.images[imageKey].sizes[width][parsed.ext.slice(1)] = relativePath;
  }

  await fs.writeFile(
    path.join(outputDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  console.log(`\nManifest generated: ${Object.keys(manifest.images).length} images`);
}

/**
 * Main entry point
 */
async function main() {
  console.log('========================================');
  console.log('Image Processing Pipeline');
  console.log('========================================\n');
  console.log(`Input:  ${CONFIG.inputDir}`);
  console.log(`Output: ${CONFIG.outputDir}`);
  console.log(`Sizes:  ${CONFIG.sizes.join(', ')}`);
  console.log(`Formats: ${CONFIG.formats.join(', ')}\n`);

  // Get all image files
  const files = await getImageFiles();
  console.log(`Found ${files.length} images to process\n`);

  if (files.length === 0) {
    console.log('No images found. Check your input directory.');
    return;
  }

  // Process images
  const startTime = Date.now();
  const results = await processInBatches(files);
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  // Generate manifest
  await generateManifest(CONFIG.outputDir);

  // Summary
  console.log('\n========================================');
  console.log('Processing Complete');
  console.log('========================================');
  console.log(`Processed: ${results.processed} images`);
  console.log(`Skipped:   ${results.skipped} images`);
  console.log(`Errors:    ${results.errors} images`);
  console.log(`Variants:  ${results.variants} total files`);
  console.log(`Duration:  ${duration}s`);
}

main().catch(console.error);
