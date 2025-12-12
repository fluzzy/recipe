import { NextRequest, NextResponse } from 'next/server';

const defaultLocale = 'kr';

function getLocale(request: NextRequest): string {
  // Accept-Language 헤더에서 언어 감지
  const acceptLanguage = request.headers.get('accept-language');

  if (!acceptLanguage) {
    return defaultLocale;
  }

  // 간단한 언어 매칭: en으로 시작하면 en, 그 외는 kr
  const languages = acceptLanguage
    .split(',')
    .map((lang) => lang.split(';')[0].trim().toLowerCase());

  // en이 포함되어 있으면 en 반환
  if (languages.some((lang) => lang.startsWith('en'))) {
    return 'en';
  }

  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /kr/ 또는 /kr로 접근하면 /로 리다이렉트 (kr은 기본 경로)
  if (pathname.startsWith('/kr/') || pathname === '/kr') {
    const newPath = pathname.replace(/^\/kr/, '') || '/';
    request.nextUrl.pathname = newPath;
    return NextResponse.redirect(request.nextUrl);
  }

  // /en/ 또는 /en으로 접근하면 그대로 진행
  if (pathname.startsWith('/en/') || pathname === '/en') {
    return NextResponse.next();
  }

  // locale이 없는 경우 감지하여 처리
  const locale = getLocale(request);

  if (locale === 'kr') {
    // kr은 내부적으로 /kr/로 rewrite (URL은 변경되지 않음)
    request.nextUrl.pathname = `/kr${pathname === '/' ? '' : pathname}`;
    return NextResponse.rewrite(request.nextUrl);
  }

  // en인 경우 /en/ 경로로 리다이렉트
  request.nextUrl.pathname = `/en${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*/opengraph-image|.*\\..*).*)'],
};
