import '~/assets/css/globals.css';
import { PreloadResources } from '~/libs/react/preload';
import { Inter as FontSans } from 'next/font/google';
import localFont from 'next/font/local';
import { Providers } from './providers';
import { cn } from '~/utils/utils';
import { SITE_CONFIG } from '~/constants/constants';
import type { Metadata } from 'next';

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
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  icons: {
    icon: SITE_CONFIG.favicon,
    apple: [
      {
        url: SITE_CONFIG.apple57x57,
        sizes: '57x57',
      },
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
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 2,
  },
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
}

export default function Layout({ children }: RoutesProps) {
  return (
    <Providers>
      <html lang="ko" dir="ltr">
        <PreloadResources />
        <body
          className={cn(
            'min-h-screen bg-background font-sans antialiased',
            fontSans.variable,
            fontHeading.variable,
          )}
        >
          {children}
        </body>
      </html>
    </Providers>
  );
}
