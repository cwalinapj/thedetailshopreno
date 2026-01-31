import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,

  // Required for next-intl compatibility with Turbopack
  turbopack: {},

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.thedetailshopreno.com',
        pathname: '/**',
      },
    ],
  },

  env: {
    NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID || '',
    NEXT_PUBLIC_GA4_ID: process.env.NEXT_PUBLIC_GA4_ID || '',
    NEXT_PUBLIC_HUBSPOT_PORTAL_ID: process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID || '',
    NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN: process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN || '',
    NEXT_PUBLIC_PHONE_NUMBER: '+17754405342',
    NEXT_PUBLIC_SITE_URL: 'https://thedetailshopreno.com',
    NEXT_PUBLIC_CDN_URL: 'https://assets.thedetailshopreno.com',
  },
};

export default withNextIntl(nextConfig);
