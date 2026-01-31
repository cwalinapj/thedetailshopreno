#!/usr/bin/env node
/**
 * WordPress Uploads Scraper
 *
 * Scrapes the WordPress uploads directory listing to get all image URLs
 * Since directory listing is enabled on supremexdetail.com
 */

import fs from 'fs/promises';
import path from 'path';

const BASE_URL = 'https://supremexdetail.com/wp-content/uploads';
const OUTPUT_DIR = process.env.OUTPUT_DIR || './uploads';
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

// Year directories to scan
const YEAR_DIRS = ['2018', '2021', '2023', '2024', '2025', '2026'];

/**
 * Parse directory listing HTML to extract links
 */
function parseDirectoryListing(html, baseUrl) {
  const links = [];
  // Match href attributes in anchor tags
  const hrefRegex = /href="([^"]+)"/g;
  let match;

  while ((match = hrefRegex.exec(html)) !== null) {
    const href = match[1];
    // Skip parent directory and sorting links
    if (href.startsWith('?') || href === '../' || href.startsWith('/')) {
      continue;
    }
    links.push({
      name: href.replace(/\/$/, ''),
      isDirectory: href.endsWith('/'),
      url: `${baseUrl}/${href}`.replace(/\/+/g, '/').replace(':/', '://'),
    });
  }

  return links;
}

/**
 * Fetch directory listing
 */
async function fetchDirectory(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      return [];
    }
    const html = await response.text();
    return parseDirectoryListing(html, url);
  } catch (error) {
    console.error(`Error fetching ${url}: ${error.message}`);
    return [];
  }
}

/**
 * Recursively scan directory and collect image URLs
 */
async function scanDirectory(url, relativePath = '', depth = 0) {
  if (depth > 5) return []; // Prevent infinite recursion

  const entries = await fetchDirectory(url);
  const images = [];

  for (const entry of entries) {
    const entryRelativePath = path.join(relativePath, entry.name);

    if (entry.isDirectory) {
      // Recursively scan subdirectory
      const subImages = await scanDirectory(entry.url, entryRelativePath, depth + 1);
      images.push(...subImages);
    } else {
      // Check if it's an image
      const ext = path.extname(entry.name).toLowerCase();
      if (IMAGE_EXTENSIONS.includes(ext)) {
        // Skip WordPress thumbnail variants
        if (/-\d+x\d+\.(jpg|jpeg|png|gif|webp)$/i.test(entry.name)) {
          continue;
        }
        images.push({
          url: entry.url,
          relativePath: entryRelativePath,
          name: entry.name,
        });
      }
    }
  }

  return images;
}

/**
 * Download a single image
 */
async function downloadImage(image, outputDir) {
  const outputPath = path.join(outputDir, image.relativePath);
  const outputDirPath = path.dirname(outputPath);

  try {
    // Check if already downloaded
    try {
      await fs.access(outputPath);
      return { skipped: true, path: image.relativePath };
    } catch {
      // File doesn't exist, proceed with download
    }

    // Create directory
    await fs.mkdir(outputDirPath, { recursive: true });

    // Download
    const response = await fetch(image.url);
    if (!response.ok) {
      return { error: true, path: image.relativePath, message: `HTTP ${response.status}` };
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    await fs.writeFile(outputPath, buffer);

    return { success: true, path: image.relativePath, size: buffer.length };
  } catch (error) {
    return { error: true, path: image.relativePath, message: error.message };
  }
}

/**
 * Download images in batches
 */
async function downloadInBatches(images, outputDir, batchSize = 5) {
  const results = {
    downloaded: 0,
    skipped: 0,
    failed: 0,
    totalSize: 0,
  };

  for (let i = 0; i < images.length; i += batchSize) {
    const batch = images.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(img => downloadImage(img, outputDir))
    );

    for (const result of batchResults) {
      if (result.success) {
        results.downloaded++;
        results.totalSize += result.size;
        console.log(`✓ ${result.path}`);
      } else if (result.skipped) {
        results.skipped++;
      } else {
        results.failed++;
        console.error(`✗ ${result.path}: ${result.message}`);
      }
    }

    // Progress
    const progress = Math.round(((i + batch.length) / images.length) * 100);
    console.log(`\nProgress: ${progress}% (${i + batch.length}/${images.length})\n`);

    // Small delay to be polite to the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
}

/**
 * Main entry point
 */
async function main() {
  const listOnly = process.argv.includes('--list-only');
  const outputFile = process.argv.includes('--output')
    ? process.argv[process.argv.indexOf('--output') + 1]
    : null;

  console.log('========================================');
  console.log('WordPress Uploads Scraper');
  console.log('========================================\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Output: ${listOnly ? 'List only' : OUTPUT_DIR}\n`);

  // Scan all year directories
  const allImages = [];

  for (const year of YEAR_DIRS) {
    const yearUrl = `${BASE_URL}/${year}/`;
    console.log(`Scanning ${year}...`);
    const images = await scanDirectory(yearUrl, year);
    console.log(`  Found ${images.length} images\n`);
    allImages.push(...images);
  }

  console.log(`\nTotal: ${allImages.length} images found\n`);

  // Save URL list
  if (outputFile || listOnly) {
    const urlList = allImages.map(img => img.url).join('\n');
    const listPath = outputFile || './image-urls.txt';
    await fs.writeFile(listPath, urlList);
    console.log(`URL list saved to ${listPath}`);
  }

  if (listOnly) {
    return;
  }

  // Download images
  console.log('\nStarting downloads...\n');
  const startTime = Date.now();
  const results = await downloadInBatches(allImages, OUTPUT_DIR);
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  // Summary
  console.log('\n========================================');
  console.log('Download Complete');
  console.log('========================================');
  console.log(`Downloaded: ${results.downloaded} images`);
  console.log(`Skipped:    ${results.skipped} images (already exist)`);
  console.log(`Failed:     ${results.failed} images`);
  console.log(`Total size: ${(results.totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Duration:   ${duration}s`);
}

main().catch(console.error);
