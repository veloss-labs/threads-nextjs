import '~/assets/css/globals.css';
import { PreloadResources } from '~/libs/react/preload';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

export const metadata = {
  metadataBase: new URL('http://localhost:3000'),
  manifest: '/manifest.json',
  themeColor: '#0F172A',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  alternates: {
    canonical: '/',
  },
  other: {
    'msapplication-TileColor': '#ffffff',
  },
};

const inter = Inter({ subsets: ['latin'] });

interface RoutesProps {
  children: React.ReactNode;
}

export default function Layout({ children }: RoutesProps) {
  return (
    <Providers>
      <html lang="en">
        <PreloadResources />
        {/* <body className={`${inter.className} bg-dark-1`}>{children}</body> */}
        <body className={`${inter.className}`}>{children}</body>
      </html>
    </Providers>
  );
}
