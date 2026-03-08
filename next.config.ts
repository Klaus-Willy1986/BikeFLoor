import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'cdn-jupiter.metropolis.co.uk',
      },
      {
        protocol: 'https',
        hostname: 'cdn.s2api.it',
      },
      {
        protocol: 'https',
        hostname: 'bassobikes.com',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
