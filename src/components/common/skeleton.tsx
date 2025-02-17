import React from 'react';
import { cn } from '@/utils/cn.util';

const Skeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('animate-pulse rounded-md bg-secondary-800/50', className)}
      {...props}
    />
  ),
);

export default Skeleton;
