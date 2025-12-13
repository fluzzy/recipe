'use client';

import { useLocale } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { usePathname, useRouter } from '~/i18n/navigation';

const locales = [
  { label: 'English', value: 'en' },
  { label: '한국어', value: 'kr' },
  // TS가 locale 값을 정확히 추론하도록 상수 단언
] as const;

type LocaleOption = (typeof locales)[number]['value'];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as LocaleOption;

  const handleChange = (nextLocale: LocaleOption) => {
    if (nextLocale === currentLocale) {
      return;
    }

    // 현재 internal pathname을 기준으로 locale을 교체
    router.replace(pathname, { locale: nextLocale });
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
