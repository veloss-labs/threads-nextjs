import { NextResponse, NextRequest } from 'next/server';
import logger from '~/utils/logger';

export async function middleware(request: NextRequest) {
  // '/middleware-rewrite' or '/middleware-rewrite/'
  if (request.nextUrl.pathname.match(/^\/middleware-rewrite(\/)?$/)) {
    const { nextUrl: url } = request;
    url.searchParams.set('rewritten', 'true');
    return NextResponse.rewrite(url);
  }

  if (request.nextUrl.pathname.match(/^\/middleware-redirect(\/)?$/)) {
    return NextResponse.redirect(
      new URL('/middleware-redirect-destination', request.url),
    );
  }

  if (request.nextUrl.pathname.match(/^\/middleware-set-header(\/)?$/)) {
    // Clone the request headers and set a new header `x-hello-from-middleware1`
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-hello-from-middleware1', 'hello');

    // You can also set request headers in NextResponse.rewrite
    const response = NextResponse.next({
      request: {
        // New request headers
        headers: requestHeaders,
      },
    });

    response.headers.set('x-hello-from-middleware2', 'hello');
    return response;
  }

  // '/middleware-geolocation' or '/middleware-geolocation/'
  if (request.nextUrl.pathname.match(/^\/middleware-geolocation(\/)?$/)) {
    const { nextUrl: url, geo } = request;
    const country = geo?.country || 'US';
    const city = geo?.city || 'San Francisco';
    const region = geo?.region || 'CA';

    url.searchParams.set('country', country);
    url.searchParams.set('city', city);
    url.searchParams.set('region', region);

    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/middleware-rewrite',
    '/middleware-redirect',
    '/middleware-set-header',
    '/middleware-fetch',
    '/middleware-geolocation',
  ],
};
