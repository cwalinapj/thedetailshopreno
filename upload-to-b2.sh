#!/bin/bash
# Upload all processed images to Backblaze B2
# Run this from Terminal on your Mac

cd "$(dirname "$0")"

export B2_KEY_ID=0041a6b6f22f14d0000000002
export B2_APP_KEY=K004p9IMzmEhHqdC1mXOraIevgTwhlg
export B2_BUCKET_NAME=thedetailshopreno
export B2_ENDPOINT=https://s3.us-west-004.backblazeb2.com

echo "=========================================="
echo "Uploading images to Backblaze B2"
echo "=========================================="
echo ""
echo "Bucket: $B2_BUCKET_NAME"
echo "Found $(find public/images -type f | wc -l | tr -d ' ') files"
echo ""

node scripts/upload-to-b2.mjs

echo ""
echo "Upload complete!"
