import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.includes('.') ||
    pathname.startsWith('/handler')
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/en/') || pathname === '/en') {
    return NextResponse.next();
  }

  if (pathname.startsWith('/kr/') || pathname === '/kr') {
    const newPath = pathname.replace(/^\/kr/, '') || '/';
    const url = request.nextUrl.clone();
    url.pathname = newPath;
    return NextResponse.redirect(url);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/kr${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|handler|.*\\..*).*)',
  ],
};
