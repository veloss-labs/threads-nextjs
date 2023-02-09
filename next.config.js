// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
const { withSentryConfig } = require('@sentry/nextjs');

const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const partytown = require('@builder.io/partytown/utils');
const withPWA = require('next-pwa');

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Next Config Options
 * @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        hostname: '**.unsplash.com',
      },
    ],
  },
  compiler: {
    removeConsole: isProduction
      ? {
          exclude: ['error'],
        }
      : false,
  },
  trailingSlash: true,
  // * 이용자에게 제공되는 헤더에 nextjs 로 개발되었음을 노출하지 않습니다.
  poweredByHeader: false,
  // https://nextjs.org/docs/basic-features/built-in-css-support#sass-support
  sassOptions: {
    // scss module 설정
    includePaths: [path.resolve(__dirname, 'node_modules')],
  },
  // * Next.js는 렌더링 된 콘텐츠와 정적 파일을 압축하기 위해 gzip 압축을 제공합니다.
  // https://nextjs.org/docs/api-reference/next.config.js/compression
  compress: true,
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
  webpack: (config) => {
    // Add the new plugin to the existing webpack plugins
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: partytown.libDirPath(),
            to: path.join(__dirname, 'public', '~partytown'),
          },
        ],
      }),
    );

    return config;
  },
};

const _nextConfig = withPWA({
  dest: 'public',
  cacheOnFrontEndNav: true,
  disable: !isProduction,
})(nextConfig);

module.exports = withSentryConfig(
  _nextConfig,
  { silent: true },
  { hideSourcemaps: true },
);
