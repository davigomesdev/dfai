import React from 'react';

import { cn } from '@/utils/cn.util';
import { cva, VariantProps } from 'class-variance-authority';

import { Slot } from '@radix-ui/react-slot';

export const buttonVariants = cva(
  'font-rigid-square font-bold inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary-500 text-secondary-950 hover:bg-primary-500/90',
        destructive: 'bg-red-500 text-white hover:bg-red-500/90',
        outline: 'border text-white bg-primary-500/20 border-primary-500 hover:bg-primary-500/30',
        outlineSecondary:
          'border text-white bg-secondary-500/20 hover:text-white border-secondary-500 hover:bg-secondary-500/30',
        secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80',
        ghost: 'hover:bg-neutral-100 hover:text-neutral-900',
        link: 'text-neutral-900 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-10 px-8',
        icon: 'h-9 w-9 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
    );
  },
);
Button.displayName = 'Button';

export default Button;
