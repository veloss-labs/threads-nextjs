import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export default async function sitemap(): Promise<
  Promise<Promise<MetadataRoute.Sitemap>>
> {
  const headersList = headers();
  const host = headersList.get('X-Forwarded-Host') ?? headersList.get('host');
  const protocol =
    headersList.get('X-Forwarded-Proto') ?? host?.includes('localhost')
      ? 'http'
      : 'https';

  const baseUrl = `${protocol}://${host}`;

  const routesMap = [''].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routesMap];
}
