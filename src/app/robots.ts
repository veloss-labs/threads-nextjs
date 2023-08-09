import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export default function robots(): MetadataRoute.Robots {
  const headersList = headers();
  const host = headersList.get('X-Forwarded-Host') ?? headersList.get('host');
  const protocol =
    headersList.get('X-Forwarded-Proto') ?? host?.includes('localhost')
      ? 'http'
      : 'https';

  const baseUrl = `${protocol}://${host}`;

  return {
    rules: [
      {
        userAgent: '*',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
