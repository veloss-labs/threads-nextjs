/* eslint-disable @typescript-eslint/restrict-template-expressions */
interface InternalUrl {
  /** "http://localhost:3000" */
  origin: string;
  /** "localhost:3000" */
  host: string;
  /** "/api/auth" */
  path: string;
  /** "http://localhost:3000/api/auth" */
  base: string;
  /** "http://localhost:3000/api/auth" */
  toString: () => string;
}

/** Returns an `URL` like object to make requests/redirects from server-side */
export function parseUrl(url?: string | URL): InternalUrl {
  const defaultUrl = new URL('http://localhost:3000/api/auth');

  if (url && !url.toString().startsWith('http')) {
    // eslint-disable-next-line no-param-reassign
    url = `https://${url}`;
  }

  const _url = new URL(url ?? defaultUrl);
  const path = (
    _url.pathname === '/' ? defaultUrl.pathname : _url.pathname
  ).replace(/\/$/, '');

  const base = `${_url.origin}${path}`;

  return {
    origin: _url.origin,
    host: _url.host,
    path,
    base,
    toString: () => base,
  };
}

export function getLocationInDomainInfo(location: Location) {
  const host = location.host;
  const isLocalhost = host.includes('localhost');
  const protocol = isLocalhost ? 'http' : 'https';
  return {
    host,
    protocol,
    isLocalhost,
    domainUrl: `${protocol}://${host}`,
  };
}

export function getRequestInDomainInfo(request: Request) {
  return getHeaderInDomainInfo(request.headers);
}

export function getHeaderInDomainInfo(headers: Headers | Readonly<Headers>) {
  const host =
    headers.get('X-Forwarded-Host') ??
    headers.get('Origin') ??
    headers.get('host');

  if (!host) {
    throw new Error('Could not determine domain URL.');
  }

  const isLocalhost = host.includes('localhost');
  const protocol = isLocalhost ? 'http' : 'https';
  return {
    host,
    protocol,
    isLocalhost,
    domainUrl: `${protocol}://${host}`,
  };
}
