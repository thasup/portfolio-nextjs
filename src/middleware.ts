import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'th'],
  defaultLocale: 'en',
  localePrefix: 'as-needed'
});

export const config = {
  // Match only internationalized pathnames, ignore api, _next, static assets etc
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
