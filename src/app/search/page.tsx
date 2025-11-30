import { Suspense } from 'react';
import SearchInput from '~/components/common/SearchInput/SearchInput';
import LayoutWithTopNav from '~/components/layout/LayoutWithTopNav';
import SearchItems from '~/components/search/SearchItems';
import SearchTabs from '~/components/search/SearchTabs';
import { Spinner } from '~/components/ui/spinner';
import { SearchQueryKey, SearchTabKey } from '~/constants/key';

export const revalidate = 604800;

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
    <LayoutWithTopNav>
      <Suspense fallback={<></>}>
        <SearchInput />
        <SearchTabs />
      </Suspense>

      <Suspense fallback={<Spinner />}>
        <SearchItems searchParams={searchParams} />
      </Suspense>
    </LayoutWithTopNav>
  );
}
