#!/bin/bash

# Generate responsive image variants for package images
# Requires: ImageMagick (brew install imagemagick)
# Outputs: AVIF, WebP, JPG at 320w, 480w, 640w

INPUT_DIR="$1"
OUTPUT_DIR="$2"

if [ -z "$INPUT_DIR" ] || [ -z "$OUTPUT_DIR" ]; then
  echo "Usage: ./generate-responsive-images.sh <input_dir> <output_dir>"
  echo "Example: ./generate-responsive-images.sh ./originals ./public/images/packages"
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

SIZES=(320 480 640)

for img in "$INPUT_DIR"/*.{jpg,jpeg,png,JPG,JPEG,PNG} 2>/dev/null; do
  [ -f "$img" ] || continue
  
  filename=$(basename "$img")
  name="${filename%.*}"
  
  echo "Processing: $name"
  
  for size in "${SIZES[@]}"; do
    # Generate JPG
    convert "$img" -resize "${size}x" -quality 85 "$OUTPUT_DIR/${name}-${size}w.jpg"
    
    # Generate WebP
    convert "$img" -resize "${size}x" -quality 80 "$OUTPUT_DIR/${name}-${size}w.webp"
    
    # Generate AVIF (if supported)
    if command -v magick &> /dev/null; then
      magick "$img" -resize "${size}x" -quality 75 "$OUTPUT_DIR/${name}-${size}w.avif" 2>/dev/null || echo "  AVIF not supported for $name"
    fi
    
    echo "  Created ${size}w variants"
  done
done

echo ""
echo "Done! Upload the contents of $OUTPUT_DIR to your CDN at:"
echo "https://assets.thedetailshopreno.com/images/packages/"
