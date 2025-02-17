import React from 'react';
import { cn } from '@/utils/cn.util';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'flex h-11 w-full rounded-lg border border-secondary-400 bg-transparent px-3 py-1 text-white transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-secondary-200 placeholder:text-secondary-600 focus-visible:border-primary-500/50 focus-visible:bg-primary-500/10 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className,
        )}
        type={type}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export default Input;
