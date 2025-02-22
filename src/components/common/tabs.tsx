import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/utils/cn.util';

interface TabsComponent
  extends React.ForwardRefExoticComponent<React.ComponentProps<typeof TabsPrimitive.Root>> {
  List: typeof List;
  Trigger: typeof Trigger;
  Content: typeof Content;
}

const Tabs = TabsPrimitive.Root;

const List = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn('inline-flex h-9 items-center justify-center gap-2 rounded-lg p-1', className)}
    {...props}
  />
));
List.displayName = TabsPrimitive.List.displayName;

const Trigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap rounded-lg border border-secondary-500/50 px-3 py-1 text-sm font-medium text-secondary-200 ring-offset-secondary-500 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-secondary-500 data-[state=active]:bg-secondary-500/20 data-[state=active]:text-white data-[state=active]:shadow',
      className,
    )}
    {...props}
  />
));
Trigger.displayName = TabsPrimitive.Trigger.displayName;

const Content = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'ring-offset-background focus-visible:ring-ring mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      className,
    )}
    {...props}
  />
));
Content.displayName = TabsPrimitive.Content.displayName;

(Tabs as TabsComponent).List = List;
(Tabs as TabsComponent).Trigger = Trigger;
(Tabs as TabsComponent).Content = Content;

export default Tabs as TabsComponent;
