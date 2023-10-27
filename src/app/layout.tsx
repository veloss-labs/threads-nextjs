import '~/assets/css/globals.css';
import { PreloadResources } from '~/libs/react/preload';
import { Inter as FontSans } from 'next/font/google';
import localFont from 'next/font/local';
import { Providers } from './providers';
import { cn } from '~/utils/utils';
import { SITE_CONFIG } from '~/constants/constants';
import type { Metadata } from 'next';
import { isUndefined } from '~/utils/assertion';

const url = new URL('http://localhost:3000');

export const metadata: Metadata = {
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  keywords: [
    'Next.js',
    'React',
    'Tailwind CSS',
    'Server Components',
    'Radix UI',
  ],
  icons: {
    icon: SITE_CONFIG.favicon,
    apple: SITE_CONFIG.apple57x57,
    other: [
      {
        url: SITE_CONFIG.apple180x180,
        sizes: '180x180',
      },
      {
        url: SITE_CONFIG.apple256x256,
        sizes: '256x256',
      },
    ],
  },
  metadataBase: url,
  manifest: '/manifest.json',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    url: url.href,
    siteName: SITE_CONFIG.title,
    images: [
      {
        url: SITE_CONFIG.ogImage,
      },
    ],
    locale: 'en_US',
    type: 'article',
  },
};

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

// Font files can be colocated inside of `pages`
const fontHeading = localFont({
  src: '../assets/fonts/CalSans-SemiBold.woff2',
  variable: '--font-heading',
});

interface RoutesProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function Layout(props: RoutesProps) {
  return (
    <Providers>
      <html lang="ko" dir="ltr">
        <PreloadResources />
        <head>
          <meta
            name="viewport"
            content="width=device-width,initial-scale=1,maximum-scale=2,shrink-to-fit=no"
          />
          <meta
            name="referrer"
            content="origin-when-cross-origin"
            id="meta_referrer"
          />
          <meta name="color-scheme" content="light" />
          <meta name="theme-color" content="#FFFFFF" />
        </head>
        <body
          className={cn(
            'min-h-screen bg-background font-sans antialiased',
            fontSans.variable,
            fontHeading.variable,
          )}
        >
          {props.children}
        </body>
        {props.modal}
      </html>
    </Providers>
  );
}
