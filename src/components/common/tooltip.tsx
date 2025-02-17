'use client';

import React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '@/utils/cn.util';

interface TooltipComponent
  extends React.ForwardRefExoticComponent<React.ComponentProps<typeof TooltipPrimitive.Root>> {
  Provider: typeof Provider;
  Trigger: typeof Trigger;
  Content: typeof Content;
}

const Provider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const Trigger = TooltipPrimitive.Trigger;

const Content = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      className={cn(
        'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 overflow-hidden rounded-xl border border-primary-700 bg-primary-700 p-4 text-xs text-white',
        className,
      )}
      sideOffset={sideOffset}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
Content.displayName = TooltipPrimitive.Content.displayName;

(Tooltip as TooltipComponent).Provider = Provider;
(Tooltip as TooltipComponent).Trigger = Trigger;
(Tooltip as TooltipComponent).Content = Content;

export default Tooltip as TooltipComponent;
