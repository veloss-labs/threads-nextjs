import createJiti from 'jiti';
const jiti = createJiti(new URL(import.meta.url).pathname);

// Import env here to validate during build. Using jiti we can import .ts files :)
jiti('./src/app/env');

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Next Config Options
 * @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    taint: true,
    serverActions: {
      bodySizeLimit: '5mb',
    },
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  poweredByHeader: false,
  compress: true,
  compiler: {
    removeConsole: isProduction
      ? {
          exclude: ['error', 'debug'],
        }
      : false,
  },
  headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default config;
