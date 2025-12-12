export const PAGE_ROUTES = {
  MAIN: '/',
  SIGN_IN: '/signin',
  SIGN_UP: '/signup',
  UPLOAD_RECIPE: '/upload',
  UPLOAD_AUTHOR: '/upload/author',
  SEARCH: '/search',
  RECIPE: '/recipe',
  AUTHOR: '/author',
} as const;

type Locale = 'kr' | 'en';

/**
 * locale을 고려한 경로를 생성합니다.
 * kr은 기본 경로(/), en은 /en/ 경로를 반환합니다.
 */
export function getLocalizedRoute(
  route: string,
  locale: Locale = 'kr',
): string {
  if (locale === 'kr') {
    return route;
  }
  return `/en${route === '/' ? '' : route}`;
}
