import React from 'react';
import { cn } from '@/utils/cn.util';

const Wrapper = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      className={cn('mx-auto h-full w-full max-w-screen-xl px-4 md:px-20', className)}
    />
  ),
);

export default Wrapper;
