import { Suspense } from 'react';
import SearchInput from '~/components/common/SearchInput/SearchInput';
import MainContent from '~/components/home/MainContent';
import { Spinner } from '~/components/ui/spinner';

export const revalidate = 86400;

export default function Home() {
  return (
    <>
      <Suspense fallback={<div />}>
        <SearchInput />
      </Suspense>

      <Suspense fallback={<Spinner />}>
        <MainContent />
      </Suspense>
    </>
  );
}
