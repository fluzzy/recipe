import { Suspense } from 'react';
import ProfileHeader from '~/components/common/Header/ProfileHeader';
import SearchInput from '~/components/common/SearchInput/SearchInput';
import { Spinner } from '~/components/ui/spinner';
import MainContent from './src/components/MainContent';

export const revalidate = 86400;

export default function Home() {
  return (
    <>
      <ProfileHeader />
      <Suspense fallback={<div />}>
        <SearchInput />
      </Suspense>

      <Suspense fallback={<Spinner />}>
        <MainContent />
      </Suspense>
    </>
  );
}
