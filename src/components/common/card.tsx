import React from 'react';
import { cn } from '@/utils/cn.util';

interface CardComponent
  extends React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement>> {
  Header: typeof Header;
  Title: typeof Title;
  Description: typeof Description;
  Content: typeof Content;
  Footer: typeof Footer;
}

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-xl border border-secondary-800 bg-secondary-950/50 text-white',
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

const Header = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 rounded-t-xl p-6', className)}
      {...props}
    />
  ),
);
Header.displayName = 'CardHeader';

const Title = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  ),
);
Title.displayName = 'CardTitle';

const Description = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm text-secondary-200', className)} {...props} />
  ),
);
Description.displayName = 'CardDescription';

const Content = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  ),
);
Content.displayName = 'CardContent';

const Footer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center rounded-b-xl p-6 pt-0', className)}
      {...props}
    />
  ),
);
Footer.displayName = 'CardFooter';

(Card as CardComponent).Header = Header;
(Card as CardComponent).Title = Title;
(Card as CardComponent).Description = Description;
(Card as CardComponent).Content = Content;
(Card as CardComponent).Footer = Footer;

export default Card as CardComponent;
