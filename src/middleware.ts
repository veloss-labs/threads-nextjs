export { auth as middleware } from '~/services/auth';

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  // matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  matcher: [
    '/((?!api|manifest.webmanifest|icons|og|assets|_next/static|_next/image|favicon.ico).*)',
  ],
};
