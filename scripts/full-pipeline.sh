#!/bin/bash
# Full Image Pipeline Script
# Run this after your WordPress backup finishes downloading

set -e

echo "=========================================="
echo "The Detail Shop Reno - Image Pipeline"
echo "=========================================="

# Check for backup file
BACKUP_FILE="${1:-$HOME/Downloads/supremexdetail-com-*.wpress}"

if ! ls $BACKUP_FILE 1> /dev/null 2>&1; then
    echo "❌ Backup file not found!"
    echo "Usage: ./scripts/full-pipeline.sh /path/to/backup.wpress"
    exit 1
fi

BACKUP_FILE=$(ls $BACKUP_FILE | head -1)
echo "📦 Found backup: $BACKUP_FILE"

# Create working directories
WORK_DIR="$(pwd)/../wp-extract"
mkdir -p "$WORK_DIR"
mkdir -p "./public/images"

# Step 1: Extract backup (wpress is a gzipped archive)
echo ""
echo "📂 Step 1: Extracting backup..."
cd "$WORK_DIR"

# wpress files are actually just tar archives with a different structure
# The uploads folder is at: wp-content/uploads/

if command -v 7z &> /dev/null; then
    7z x -y "$BACKUP_FILE"
elif command -v unzip &> /dev/null; then
    unzip -o "$BACKUP_FILE" || true
else
    # Try as a tar archive (some wpress files are tar)
    tar -xf "$BACKUP_FILE" 2>/dev/null || {
        echo "Trying alternative extraction..."
        # wpress is a custom format - let's just copy and rename
        cp "$BACKUP_FILE" backup.zip
        unzip -o backup.zip || true
    }
fi

# Find the uploads directory
UPLOADS_DIR=$(find . -type d -name "uploads" | head -1)
if [ -z "$UPLOADS_DIR" ]; then
    echo "Looking for wp-content/uploads pattern..."
    UPLOADS_DIR=$(find . -path "*/wp-content/uploads" -type d | head -1)
fi

if [ -z "$UPLOADS_DIR" ]; then
    echo "❌ Could not find uploads directory in backup"
    echo "Contents of extract directory:"
    ls -la
    exit 1
fi

echo "✅ Found uploads at: $UPLOADS_DIR"

# Step 2: Process images with Sharp
echo ""
echo "📸 Step 2: Processing images with Sharp..."
cd -
INPUT_DIR="$WORK_DIR/$UPLOADS_DIR" OUTPUT_DIR="./public/images" node scripts/process-images.mjs

# Step 3: Generate sitemap
echo ""
echo "🗺️  Step 3: Generating sitemap..."
node scripts/generate-sitemap.mjs

# Step 4: Upload to B2
echo ""
echo "☁️  Step 4: Uploading to Backblaze B2..."
node scripts/upload-to-b2.mjs

echo ""
echo "=========================================="
echo "✅ Pipeline Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Deploy site: npm run vercel:deploy"
echo "2. Configure DNS for thedetailshopreno.com"
echo "3. Set up GTM container"
