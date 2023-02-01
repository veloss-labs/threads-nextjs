const path = require('path');
// const { withSentryConfig } = require('@sentry/nextjs');
const withPlugins = require('next-compose-plugins');

const isProduction = process.env.NODE_ENV === 'production';

// /**
//  * Sentry Config Options
//  * @type {import('@sentry/nextjs').SentryWebpackPluginOptions}
//  */
// const sentryOptions = {
//   // Your existing module.exports
//   sentry: {
//     // Use `hidden-source-map` rather than `source-map` as the Webpack `devtool`
//     // for client-side builds. (This will be the default starting in
//     // `@sentry/nextjs` version 8.0.0.) See
//     // https://webpack.js.org/configuration/devtool/ and
//     // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map
//     // for more information.
//     hideSourceMaps: true,
//   },
// };

// const SentryWebpackPluginOptions = {
//   silent: true,
// };

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
          exclude: ['error', 'warn', 'info'],
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
};

module.exports = withPlugins([], nextConfig);
