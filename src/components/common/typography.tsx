import React from 'react';
import { cn } from '@/utils/cn.util';

const H1 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h1
      ref={ref}
      {...props}
      className={cn(
        'scroll-m-20 text-4xl font-extrabold tracking-tight text-white lg:text-5xl',
        className,
      )}
    />
  ),
);
H1.displayName = 'H1';

const H2 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      {...props}
      className={cn(
        'scroll-m-20 text-3xl font-semibold tracking-tight text-white first:mt-0',
        className,
      )}
    />
  ),
);
H2.displayName = 'H2';

const H3 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      {...props}
      className={cn('scroll-m-20 text-2xl font-semibold tracking-tight text-white', className)}
    />
  ),
);
H3.displayName = 'H3';

const H4 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h4
      ref={ref}
      {...props}
      className={cn('scroll-m-20 text-xl font-semibold tracking-tight text-white', className)}
    />
  ),
);
H4.displayName = 'H4';

const P = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} {...props} className={cn('font-light text-white', className)} />
  ),
);
P.displayName = 'P';

const Blockquote = React.forwardRef<
  HTMLQuoteElement,
  React.BlockquoteHTMLAttributes<HTMLQuoteElement>
>(({ className, ...props }, ref) => (
  <blockquote ref={ref} {...props} className={cn('mt-6 border-l-2 pl-6 italic', className)} />
));
Blockquote.displayName = 'Blockquote';

const Typography = {
  H1,
  H2,
  H3,
  H4,
  P,
  Blockquote,
};

export default Typography;
