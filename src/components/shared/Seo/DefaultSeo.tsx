import React, { useMemo } from 'react';
import { DefaultSeo as NextDefaultSeo } from 'next-seo';
import { siteURL } from '~/constants/env';

import type { DefaultSeoProps } from 'next-seo';

export const Title = 'SST NextJS Template';
export const Description = 'Build your next project with NextJS';
export const Author = 'SST NextJS Template';

const _NEXT_ANDROID_SPLASH_SCREEN = {
  ref: 'icon',
  media: {
    'android-launchericon-512-512': '512x512',
    'android-launchericon-192-192': '192x192',
    'android-launchericon-144-144': '144x144',
    'android-launchericon-96-96': '96x96',
    'android-launchericon-72-72': '72x72',
    'android-launchericon-48-48': '48x48',
  },
};

const _NEXT_APPLE_SPLASH_SCREEN = {
  ref: 'apple-touch-startup-image',
  media: {
    iPhone_14_Pro_Max_portrait:
      '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
    iPhone_14_Pro_portrait:
      '(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
    iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_portrait:
      '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
    iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_portrait:
      '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
    iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_portrait:
      '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
    iPhone_11_Pro_Max__iPhone_XS_Max_portrait:
      '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
    iPhone_11__iPhone_XR_portrait:
      '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
    iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_portrait:
      '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
    'iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_portrait':
      '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
    '4__iPhone_SE__iPod_touch_5th_generation_and_later_portrait':
      '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
    '12.9__iPad_Pro_portrait':
      '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
    '11__iPad_Pro__10.5__iPad_Pro_portrait':
      '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
    '10.9__iPad_Air_portrait':
      '(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
    '10.5__iPad_Air_portrait':
      '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
    '10.2__iPad_portrait':
      '(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
    '9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_portrait':
      '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
    '8.3__iPad_Mini_portrait':
      '(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
  },
};

const DefaultSeo = () => {
  const _APPLE_ICONS = useMemo(
    () =>
      Object.keys(_NEXT_APPLE_SPLASH_SCREEN.media).map((key) => {
        return {
          rel: _NEXT_APPLE_SPLASH_SCREEN.ref,
          media:
            _NEXT_APPLE_SPLASH_SCREEN.media[
              key as keyof typeof _NEXT_APPLE_SPLASH_SCREEN.media
            ],
          href: `/icon/ios/${key}.png`,
        };
      }),
    [],
  );

  const _ANDROID_ICONS = useMemo(
    () =>
      Object.keys(_NEXT_ANDROID_SPLASH_SCREEN.media).map((key) => {
        return {
          rel: _NEXT_ANDROID_SPLASH_SCREEN.ref,
          media:
            _NEXT_ANDROID_SPLASH_SCREEN.media[
              key as keyof typeof _NEXT_ANDROID_SPLASH_SCREEN.media
            ],
          href: `/icon/android/${key}.png`,
        };
      }),
    [],
  );

  const SEO_CONSTANTS: DefaultSeoProps = useMemo(
    () => ({
      title: Title,
      canonical: siteURL,
      description: Description,
      additionalLinkTags: [
        {
          rel: 'shortcut icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
        },
        {
          rel: 'manifest',
          href: '/manifest.json',
        },
        {
          rel: 'preload',
          type: 'image/svg+xml',
          as: 'image',
          href: '/images/vercel.svg',
        },
        {
          rel: 'preload',
          type: 'image/svg+xml',
          as: 'image',
          href: '/images/thirteen.svg',
        },
        {
          rel: 'preload',
          type: 'image/svg+xml',
          as: 'image',
          href: '/images/next.svg',
        },
        ..._ANDROID_ICONS,
        ..._APPLE_ICONS,
      ],
      openGraph: {
        url: siteURL,
        title: Title,
        description: Description,
        site_name: Title,
        type: 'website',
        images: [
          {
            url: '/images/og-image.png',
            alt: Title,
          },
        ],
      },
      twitter: {
        handle: `@${Title}`,
        site: `@${Title}`,
        cardType: 'summary_large_image',
      },
      additionalMetaTags: [
        {
          name: 'author',
          content: Author,
        },
        {
          name: 'theme-color',
          content: '#ffffff',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0',
        },
        {
          name: 'keywords',
          content: 'SST, NextJS, Template, React, TypeScript, JavaScript',
        },
      ],
    }),
    [],
  );

  return <NextDefaultSeo {...SEO_CONSTANTS} />;
};

export default DefaultSeo;
