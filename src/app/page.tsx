import { Suspense } from 'react';
import { SearchInput } from '~/components/common/SearchInput/SearchInput';
import { MainContent } from '~/components/home/MainContent';
import { LayoutWithTopNav } from '~/components/layout/LayoutWithTopNav';
import { Spinner } from '~/components/ui/spinner';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <LayoutWithTopNav>
      <Suspense fallback={<div />}>
        <SearchInput />
      </Suspense>

      <Suspense fallback={<Spinner />}>
        <MainContent />
      </Suspense>
    </LayoutWithTopNav>
  );
}
