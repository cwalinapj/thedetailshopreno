#!/usr/bin/env node
/**
 * Sitemap Generator
 *
 * Generates XML sitemaps for:
 * - Main sitemap index
 * - Per-language sitemaps (en, es)
 * - Image sitemap for CDN assets
 */

import fs from 'fs/promises';
import path from 'path';

const SITE_URL = 'https://thedetailshopreno.com';
const OUTPUT_DIR = './public';
const LOCALES = ['en', 'es'];
const DEFAULT_LOCALE = 'en';

// Define all pages
const PAGES = [
  {path: '/', priority: 1.0, changefreq: 'weekly'},
  {path: '/services/', priority: 0.9, changefreq: 'monthly'},
  {path: '/portfolio/', priority: 0.8, changefreq: 'weekly'},
  {path: '/about/', priority: 0.7, changefreq: 'monthly'},
  {path: '/contact/', priority: 0.8, changefreq: 'monthly'},
];

/**
 * Generate URL entry with hreflang alternates
 */
function generateUrlEntry(page, locale) {
  const localePath = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  const url = `${SITE_URL}${localePath}${page.path}`;
  const lastmod = new Date().toISOString().split('T')[0];

  // Generate hreflang links
  const hreflangs = LOCALES.map(loc => {
    const locPath = loc === DEFAULT_LOCALE ? '' : `/${loc}`;
    return `    <xhtml:link rel="alternate" hreflang="${loc}" href="${SITE_URL}${locPath}${page.path}"/>`;
  }).join('\n');

  // Add x-default
  const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${page.path}"/>`;

  return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
${hreflangs}
${xDefault}
  </url>`;
}

/**
 * Generate language-specific sitemap
 */
function generateLanguageSitemap(locale) {
  const urls = PAGES.map(page => generateUrlEntry(page, locale)).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;
}

/**
 * Generate sitemap index
 */
function generateSitemapIndex() {
  const lastmod = new Date().toISOString();

  const sitemaps = LOCALES.map(locale => {
    return `  <sitemap>
    <loc>${SITE_URL}/sitemap-${locale}.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`;
  }).join('\n');

  // Add image sitemap
  const imageSitemap = `  <sitemap>
    <loc>${SITE_URL}/sitemap-images.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps}
${imageSitemap}
</sitemapindex>`;
}

/**
 * Generate image sitemap (placeholder - will be populated by image pipeline)
 */
function generateImageSitemap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <!-- Image URLs will be added by the image processing pipeline -->
</urlset>`;
}

/**
 * Generate robots.txt
 */
function generateRobotsTxt() {
  return `# Robots.txt for thedetailshopreno.com

User-agent: *
Allow: /

# Sitemaps
Sitemap: ${SITE_URL}/sitemap.xml

# Disallow admin and private paths
Disallow: /api/
Disallow: /_next/
`;
}

/**
 * Main function
 */
async function main() {
  console.log('Generating sitemaps...\n');

  // Ensure output directory exists
  await fs.mkdir(OUTPUT_DIR, {recursive: true});

  // Generate sitemap index
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'sitemap.xml'),
    generateSitemapIndex()
  );
  console.log('✓ Generated sitemap.xml (index)');

  // Generate language-specific sitemaps
  for (const locale of LOCALES) {
    await fs.writeFile(
      path.join(OUTPUT_DIR, `sitemap-${locale}.xml`),
      generateLanguageSitemap(locale)
    );
    console.log(`✓ Generated sitemap-${locale}.xml`);
  }

  // Generate image sitemap
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'sitemap-images.xml'),
    generateImageSitemap()
  );
  console.log('✓ Generated sitemap-images.xml');

  // Generate robots.txt
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'robots.txt'),
    generateRobotsTxt()
  );
  console.log('✓ Generated robots.txt');

  console.log('\nSitemap generation complete!');
}

main().catch(console.error);
