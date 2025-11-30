import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '~/lib/utils';

const textVariants = cva('', {
  variants: {
    size: {
      heading: 'text-4xl font-bold',
      subheading: 'text-2xl font-semibold',
      large: 'text-xl',
      body: 'text-base',
      caption: 'text-sm text-muted-foreground',
    },
    weight: {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    },
    fontColor: {
      foreground: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      accent: 'text-accent-foreground',
    },
  },
  defaultVariants: {
    size: 'body',
    weight: 'normal',
    align: 'left',
    fontColor: 'foreground',
  },
});

interface TextProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof textVariants> {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
}

export function Text({
  children,
  size = 'body',
  as: Component = 'p',
  fontColor = 'foreground',
  weight = 'normal',
  align = 'left',
  className,
  ...props
}: TextProps) {
  return (
    <Component
      className={cn(
        textVariants({ size, weight, align, fontColor }),
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
