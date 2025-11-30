import { Suspense } from 'react';
import { Spinner } from '~/components/ui/spinner';
import { SearchQueryKey, SearchTabKey } from '~/constants/key';
import SearchItems from './components/SearchItems';

export type SearchParams = Promise<{
  [SearchQueryKey]: string;
  [SearchTabKey]?: string;
}>;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense fallback={<Spinner />}>
      <SearchItems searchParams={searchParams} />
    </Suspense>
  );
}
