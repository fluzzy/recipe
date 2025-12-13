import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Next.js 16: proxy.ts에서 프록시 함수를 export 한다.
export const proxy = createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  // - … the ones starting with `/handler` (Stack Auth routes)
  matcher: ['/((?!api|_next|_vercel|handler|.*\\..*).*)'],
};
