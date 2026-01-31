#!/usr/bin/env node
/**
 * WPRESS File Extractor
 *
 * The wpress format from All-in-One WP Migration uses a custom binary format:
 * - 255 bytes: filename (null-padded)
 * - 14 bytes: file size (decimal string, null-padded)
 * - 12 bytes: mtime (decimal string, null-padded)
 * - N bytes: file content
 * Repeated for each file, ends with two null headers
 */

import fs from 'fs';
import path from 'path';

const HEADER_SIZE = 255 + 14 + 12; // 281 bytes total header per file

async function extractWpress(wpressPath, outputDir) {
  console.log(`Extracting: ${wpressPath}`);
  console.log(`Output to: ${outputDir}`);

  const fd = fs.openSync(wpressPath, 'r');
  const stats = fs.fstatSync(fd);
  const fileSize = stats.size;

  let position = 0;
  let fileCount = 0;
  let extractedCount = 0;
  const headerBuffer = Buffer.alloc(HEADER_SIZE);

  while (position < fileSize - HEADER_SIZE) {
    // Read header
    fs.readSync(fd, headerBuffer, 0, HEADER_SIZE, position);
    position += HEADER_SIZE;

    // Parse filename (first 255 bytes, null-terminated)
    let filenameEnd = headerBuffer.indexOf(0);
    if (filenameEnd === -1) filenameEnd = 255;
    const filename = headerBuffer.slice(0, filenameEnd).toString('utf8');

    // Check for end marker (empty filename)
    if (!filename || filename.length === 0) {
      console.log('Reached end of archive');
      break;
    }

    // Parse file size (14 bytes starting at position 255)
    const sizeStr = headerBuffer.slice(255, 255 + 14).toString('utf8').replace(/\0/g, '').trim();
    const contentSize = parseInt(sizeStr, 10);

    if (isNaN(contentSize) || contentSize < 0) {
      console.log(`Invalid size for ${filename}: ${sizeStr}`);
      break;
    }

    fileCount++;

    // Only extract files from wp-content/uploads (images we need)
    const isUpload = filename.includes('wp-content/uploads/') &&
                     /\.(jpg|jpeg|png|gif|webp)$/i.test(filename) &&
                     !/-\d+x\d+\.(jpg|jpeg|png|gif|webp)$/i.test(filename); // Skip thumbnails

    if (isUpload) {
      // Create output path
      const outputPath = path.join(outputDir, filename);
      const outputDirPath = path.dirname(outputPath);

      // Create directory
      fs.mkdirSync(outputDirPath, { recursive: true });

      // Read and write file content
      const contentBuffer = Buffer.alloc(contentSize);
      fs.readSync(fd, contentBuffer, 0, contentSize, position);
      fs.writeFileSync(outputPath, contentBuffer);

      extractedCount++;
      if (extractedCount % 100 === 0) {
        console.log(`Extracted ${extractedCount} images...`);
      }
    }

    // Move position past file content
    position += contentSize;

    // Progress every 1000 files
    if (fileCount % 1000 === 0) {
      const pct = Math.round((position / fileSize) * 100);
      console.log(`Progress: ${pct}% (${fileCount} files scanned, ${extractedCount} images extracted)`);
    }
  }

  fs.closeSync(fd);

  console.log(`\nDone! Scanned ${fileCount} files, extracted ${extractedCount} images`);
  return extractedCount;
}

// Main
const wpressFile = process.argv[2] || '/Users/root1/Downloads/supremexdetail-com-20260130-161939-mgqmstec8t7h.wpress';
const outputDir = process.argv[3] || '/Users/root1/wp-extract';

extractWpress(wpressFile, outputDir).catch(console.error);
