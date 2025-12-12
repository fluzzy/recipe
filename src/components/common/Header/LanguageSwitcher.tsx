'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

const locales = [
  { label: 'English', value: 'en' },
  { label: '한국어', value: 'kr' },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname() || '/';

  const segments = pathname.split('/').filter(Boolean);
  const currentLocale = segments[0] === 'en' ? 'en' : 'kr';
  const pathWithoutLocale =
    `/${(currentLocale === 'en' ? segments.slice(1) : segments).join('/')}` ||
    '/';

  const handleChange = (nextLocale: string) => {
    if (nextLocale === currentLocale) {
      return;
    }

    const nextPath =
      nextLocale === 'en'
        ? `/en${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`
        : pathWithoutLocale === '/' || pathWithoutLocale === ''
          ? '/'
          : pathWithoutLocale;

    router.push(nextPath);
  };

  return (
    <Select value={currentLocale} onValueChange={handleChange}>
      <SelectTrigger
        aria-label='Select language'
        className='h-8 w-[120px] gap-1 px-3 text-[13px]'
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent align='end'>
        {locales.map(({ label, value }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
