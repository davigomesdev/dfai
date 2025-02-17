import React from 'react';
import { cn } from '@/utils/cn.util';

type Orientation = 'horizontal' | 'vertical';

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: Orientation;
  decorative?: boolean;
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => {
    const semanticProps = decorative
      ? { role: 'none' }
      : { 'aria-orientation': orientation, role: 'separator' };
    return (
      <div
        ref={ref}
        className={cn(
          'shrink-0 bg-primary-200',
          orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
          className,
        )}
        {...semanticProps}
        data-orientation={orientation}
        {...props}
      />
    );
  },
);
Separator.displayName = 'Separator';

export default Separator;
