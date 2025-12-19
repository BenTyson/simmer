import type { NextConfig } from 'next';
import { withPlausibleProxy } from 'next-plausible';

const nextConfig: NextConfig = {
  // Standalone output for Railway deployment
  output: 'standalone',

  // Image configuration
  images: {
    // We don't scrape images, but might use placeholders
    unoptimized: true,
  },

  // Environment variables exposed to browser
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.RAILWAY_PUBLIC_DOMAIN
      ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ];
  },

  // Redirects (if needed later)
  async redirects() {
    return [];
  },
};

export default withPlausibleProxy()(nextConfig);
