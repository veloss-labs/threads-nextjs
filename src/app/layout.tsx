import '~/assets/css/globals.css';
import { env } from './env';
import { Inter as FontSans } from 'next/font/google';
import { headers } from 'next/headers';
import localFont from 'next/font/local';
import { Providers } from './providers';
import { cn } from '~/utils/utils';
import { getHeaderInDomainInfo } from '~/utils/url';
import { SITE_CONFIG } from '~/constants/constants';
import type { Metadata } from 'next';
import { auth } from '~/services/auth';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontHeading = localFont({
  src: '../assets/fonts/CalSans-SemiBold.woff2',
  variable: '--font-heading',
});

export async function generateMetadata(): Promise<Metadata> {
  const info = getHeaderInDomainInfo(headers());
  const metadataBase = new URL(info.domainUrl);
  const manifestURL = new URL(SITE_CONFIG.manifest, metadataBase);

  return {
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
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
    metadataBase,
    manifest: manifestURL,
    alternates: {
      canonical: metadataBase,
    },
    openGraph: {
      title: SITE_CONFIG.title,
      description: SITE_CONFIG.description,
      url: metadataBase.href,
      siteName: SITE_CONFIG.title,
      images: [
        {
          url: SITE_CONFIG.ogImage,
        },
      ],
      locale: 'ko_KR',
      type: 'article',
    },
  };
}

interface RoutesProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default async function Layout(props: RoutesProps) {
  const info = getHeaderInDomainInfo(headers());
  const session = await auth();
  return (
    <html lang="ko" dir="ltr" suppressHydrationWarning>
      <body
        className={cn(
          'bg-background font-sans antialiased',
          fontSans.variable,
          fontHeading.variable,
        )}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.__ENV__ = ${JSON.stringify({
              SITE_URL: env.SITE_URL,
              API_PREFIX: env.API_PREFIX,
            })};
            window.__DOMAIN_INFO__ = ${JSON.stringify(info)}`,
          }}
        />
        <Providers session={session}>
          {props.children}
          {props.modal}
        </Providers>
      </body>
    </html>
  );
}
