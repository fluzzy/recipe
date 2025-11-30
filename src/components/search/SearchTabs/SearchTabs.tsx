'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SearchTabKey, SearchTabValue } from '~/constants/key';
import { cn } from '~/lib/utils';

export function SearchTabs() {
  const searchParams = useSearchParams();
  const currentParams = Object.fromEntries(searchParams.entries());
  const key = searchParams.get(SearchTabKey) || SearchTabValue.TITLE;

  const Tabs = [
    { label: '요리명', value: SearchTabValue.TITLE },
    { label: '재료', value: SearchTabValue.INGREDIENT },
    { label: '출처', value: SearchTabValue.AUTHOR },
  ];

  return (
    <nav className='mt-4 mb-6 flex'>
      {Tabs.map((tab) => {
        const newQuery = { ...currentParams };

        if (tab.value === SearchTabValue.TITLE) {
          delete newQuery[SearchTabKey];
        } else {
          newQuery[SearchTabKey] = tab.value;
        }

        return (
          <Link
            key={tab.label}
            className={cn(
              'flex h-10 flex-1 items-center justify-center font-medium transition-colors',
              'hover:bg-muted',
              tab.value === key
                ? 'border-primary text-primary border-b-2'
                : 'text-muted-foreground',
            )}
            href={{
              query: newQuery,
            }}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
