#!/bin/bash

# Supreme X / The Detail Shop Reno - Build & Deploy Script
# =========================================================

echo "🚗 Starting Supreme X deployment..."
echo ""

# Navigate to project folder
cd ~/supremex || { echo "❌ Error: Could not find ~/supremex folder"; exit 1; }

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf .next
rm -rf out

# Build the project
echo "🔨 Building Next.js project..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi

echo ""
echo "✅ Build successful!"
echo ""

# Deploy to Cloudflare Pages
echo "☁️  Deploying to Cloudflare Pages..."
npx wrangler pages deploy out --project-name=thedetailshopreno

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment complete!"
    echo "🌐 Site: https://thedetailshopreno.com"
else
    echo ""
    echo "❌ Deployment failed! Please check the errors above."
    exit 1
fi
