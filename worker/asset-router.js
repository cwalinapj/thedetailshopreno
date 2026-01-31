/**
 * Cloudflare Worker - Smart Asset Router for B2
 *
 * Routes image requests to Backblaze B2 with:
 * - Format negotiation (AVIF > WebP > JPG)
 * - Size selection based on viewport
 * - CDN caching headers
 * - Clean URL structure
 */

// B2 bucket configuration
const B2_BUCKET_URL = 'https://f004.backblazeb2.com/file/thedetailshopreno-assets';

// Cache settings
const CACHE_CONFIG = {
  images: {
    browserTTL: 60 * 60 * 24 * 365, // 1 year
    edgeTTL: 60 * 60 * 24 * 30, // 30 days
  },
};

// Available image sizes
const AVAILABLE_SIZES = [360, 640, 960, 1440, 1920];

// Available formats in preference order
const FORMAT_PREFERENCE = ['avif', 'webp', 'jpg'];

/**
 * Determine best format based on Accept header
 */
function getBestFormat(acceptHeader) {
  if (!acceptHeader) return 'jpg';

  if (acceptHeader.includes('image/avif')) return 'avif';
  if (acceptHeader.includes('image/webp')) return 'webp';
  return 'jpg';
}

/**
 * Determine best size based on viewport hint or default
 */
function getBestSize(url, viewportWidth) {
  // Check for explicit size in URL (e.g., /images/hero-640w.jpg)
  const sizeMatch = url.pathname.match(/-(\d+)w\.(avif|webp|jpe?g)$/i);
  if (sizeMatch) {
    const requestedSize = parseInt(sizeMatch[1]);
    if (AVAILABLE_SIZES.includes(requestedSize)) {
      return requestedSize;
    }
  }

  // Use viewport hint if available
  if (viewportWidth) {
    const vw = parseInt(viewportWidth);
    // Find smallest size that's >= viewport width
    for (const size of AVAILABLE_SIZES) {
      if (size >= vw) return size;
    }
    return AVAILABLE_SIZES[AVAILABLE_SIZES.length - 1];
  }

  // Default to medium size
  return 960;
}

/**
 * Handle image request
 */
async function handleImageRequest(request, url) {
  const acceptHeader = request.headers.get('Accept') || '';
  const viewportWidth = request.headers.get('Viewport-Width');
  const dpr = request.headers.get('DPR') || '1';

  // Parse the URL path
  // Expected format: /images/[path]/[name].jpg
  // Will be converted to: /[path]/[name]-[size]w.[format]
  let imagePath = url.pathname.replace(/^\/images\//, '');

  // Check if already has size suffix
  const hasSizeSuffix = /-\d+w\.(avif|webp|jpe?g)$/i.test(imagePath);

  let targetPath;
  let format;

  if (hasSizeSuffix) {
    // Extract requested format and check if we should serve different one
    const match = imagePath.match(/^(.+)-(\d+)w\.(avif|webp|jpe?g)$/i);
    if (match) {
      const [, basePath, size, requestedFormat] = match;
      format = getBestFormat(acceptHeader);

      // Only change format if Accept header indicates support
      if (format !== requestedFormat.toLowerCase()) {
        targetPath = `${basePath}-${size}w.${format}`;
      } else {
        targetPath = imagePath;
        format = requestedFormat.toLowerCase();
      }
    }
  } else {
    // No size suffix - determine best size and format
    const pathWithoutExt = imagePath.replace(/\.(jpe?g|png|gif|webp|avif)$/i, '');
    const size = getBestSize(url, viewportWidth);
    format = getBestFormat(acceptHeader);
    targetPath = `${pathWithoutExt}-${size}w.${format}`;
  }

  // Construct B2 URL
  const b2Url = `${B2_BUCKET_URL}/${targetPath}`;

  // Fetch from B2
  const response = await fetch(b2Url, {
    cf: {
      cacheTtl: CACHE_CONFIG.images.edgeTTL,
      cacheEverything: true,
    },
  });

  if (!response.ok) {
    // Fallback to original format/size if optimized version not found
    const fallbackUrl = `${B2_BUCKET_URL}/${imagePath}`;
    const fallbackResponse = await fetch(fallbackUrl);

    if (!fallbackResponse.ok) {
      return new Response('Image not found', {status: 404});
    }

    return addCacheHeaders(fallbackResponse, 'image/jpeg');
  }

  const contentType = format === 'avif' ? 'image/avif' :
                     format === 'webp' ? 'image/webp' : 'image/jpeg';

  return addCacheHeaders(response, contentType);
}

/**
 * Add appropriate cache headers
 */
function addCacheHeaders(response, contentType) {
  const headers = new Headers(response.headers);

  headers.set('Content-Type', contentType);
  headers.set('Cache-Control', `public, max-age=${CACHE_CONFIG.images.browserTTL}, immutable`);
  headers.set('Vary', 'Accept');
  headers.set('X-Content-Type-Options', 'nosniff');

  return new Response(response.body, {
    status: response.status,
    headers,
  });
}

/**
 * Main request handler
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Only handle image requests
    if (url.pathname.startsWith('/images/')) {
      return handleImageRequest(request, url);
    }

    // Pass through other requests
    return fetch(request);
  },
};
