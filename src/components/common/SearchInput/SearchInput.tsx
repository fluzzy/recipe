'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { SearchQueryKey } from '~/constants/key';
import { PAGE_ROUTES } from '~/constants/route';
import { searchSchema, SearchValue } from '~/utils/validation/search';

export function SearchInput() {
  const t = useTranslations('search');
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<SearchValue>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      [SearchQueryKey]: searchParams.get(SearchQueryKey) || '',
    },
  });

  function onSubmit(data: SearchValue) {
    router.push(
      `${PAGE_ROUTES.SEARCH}?${SearchQueryKey}=${encodeURIComponent(data[SearchQueryKey])}`,
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='relative w-full'>
        <FormField
          control={form.control}
          name={SearchQueryKey}
          render={({ field }) => (
            <FormItem>
              <div className='absolute top-1/2 left-1.5 -translate-y-1/2 transform'>
                <Search size={18} className='text-muted-foreground' />
              </div>
              <FormControl>
                <Input
                  className='h-12 pl-8'
                  placeholder={t('inputPlaceholder')}
                  data-testid='search-input'
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
