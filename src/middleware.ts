import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};

const publicRoutes = ['/signin', '/signup'];

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  const hostname = req.headers.get('host');

  const searchParams = req.nextUrl.searchParams.toString();
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ''
  }`;

  // rewrites for app pages
  if (
    hostname === 'localhost:3000' ||
    hostname == process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ) {
    const session = await getToken({ req });
    if (!session && !publicRoutes.includes(path)) {
      return NextResponse.redirect(new URL('/signin', req.url));
    } else if (session && publicRoutes.includes(path)) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.rewrite(req.url);
  }

  // rewrite everything else to `/[domain]/[slug] dynamic route
  return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
}
