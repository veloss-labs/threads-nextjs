import { env } from '../../env.mjs';
import '~/assets/css/globals.css';
import { PreloadResources } from '~/libs/react/preload';
import { ApiService } from '~/api/client';
import { RootProviders } from '~/libs/providers/root';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  ApiService.setBaseUrl(env.NEXT_PUBLIC_API_HOST);
  return (
    <html lang="en">
      <PreloadResources />
      <link
        rel="search"
        href="/opensearch.xml"
        type="application/opensearchdescription+xml"
        title="Hashnode"
      />
      <RootProviders>
        <body>
          <script
            dangerouslySetInnerHTML={{
              __html: `window.ENV = ${JSON.stringify({
                API_BASE_URL: env.NEXT_PUBLIC_API_HOST,
              })}`,
            }}
          />
          {children}
        </body>
      </RootProviders>
    </html>
  );
}
