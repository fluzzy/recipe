import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['kr', 'en'],
  defaultLocale: 'kr',
  // 기본 로케일(kr)은 경로 접두사 없이 `/`로 노출, 다른 로케일만 `/en`처럼 접두사 사용
  localePrefix: 'as-needed',
});

export type Locale = (typeof routing.locales)[number];
export type LangParams = Promise<{ lang: string }>;
