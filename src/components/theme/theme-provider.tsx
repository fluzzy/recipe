'use client';

import { StackTheme } from '@stackframe/stack';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import * as React from 'react';

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <StackTheme>{children}</StackTheme>
    </NextThemesProvider>
  );
}
