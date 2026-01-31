#!/bin/bash
# Run the full image pipeline

export PATH=/opt/homebrew/bin:$PATH
cd /Users/root1/Origin_OS/thedetailshopreno

echo "Starting Sharp image processing..."
echo "Input: /Users/root1/supremexdetail-com-20260130-161939-mgqmstec8t7h/uploads"
echo "Output: ./public/images"

INPUT_DIR=/Users/root1/supremexdetail-com-20260130-161939-mgqmstec8t7h/uploads \
OUTPUT_DIR=./public/images \
node scripts/process-images.mjs

echo ""
echo "Processing complete! Now uploading to B2..."

node scripts/upload-to-b2.mjs

echo ""
echo "Pipeline complete!"
