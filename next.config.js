// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
const { withSentryConfig } = require('@sentry/nextjs');

const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const partytown = require('@builder.io/partytown/utils');
const withPlugins = require('next-compose-plugins');

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
          exclude: ['error', 'debug'],
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
  webpack: (config, { isServer }) => {
    // Add the new plugin to the existing webpack plugins
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: partytown.libDirPath(),
            to: path.join(__dirname, "public", "~partytown"),
          },
        ],
      }),
    );
    
    return config;
  },
};

module.exports = withSentryConfig(
  withPlugins([], nextConfig),
  { silent: true },
  { hideSourcemaps: true },
);
