import { Suspense } from 'react';
import SearchInput from '~/components/common/SearchInput/SearchInput';
import SearchTabs from './components/SearchTabs';

export default function SearchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Suspense fallback={<></>}>
        <SearchInput />
        <SearchTabs />
      </Suspense>
      {children}
    </>
  );
}
