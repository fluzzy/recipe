import { StackProvider } from '@stackframe/stack';
import type { ReactNode } from 'react';
import { stackServerApp } from '~/stack';

export default function HandlerLayout({ children }: { children: ReactNode }) {
  return <StackProvider app={stackServerApp}>{children}</StackProvider>;
}
