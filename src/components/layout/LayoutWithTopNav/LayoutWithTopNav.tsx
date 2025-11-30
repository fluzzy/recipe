import { ReactNode } from 'react';
import { ProfileHeader } from '~/components/common/Header/ProfileHeader';

interface LayoutWithTopNavProps {
  children: ReactNode;
}

export async function LayoutWithTopNav({ children }: LayoutWithTopNavProps) {
  return (
    <>
      <ProfileHeader />
      {children}
    </>
  );
}
