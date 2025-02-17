'use client';

import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

import { cn } from '@/utils/cn.util';

import { X } from 'lucide-react';

interface DialogComponent
  extends React.ForwardRefExoticComponent<React.ComponentProps<typeof DialogPrimitive.Root>> {
  Trigger: typeof Trigger;
  Portal: typeof Portal;
  Close: typeof Close;
  Overlay: typeof Overlay;
  Content: typeof Content;
  Header: typeof Header;
  Footer: typeof Footer;
  Title: typeof Title;
  Description: typeof Description;
}

const Dialog = DialogPrimitive.Root;

const Trigger = DialogPrimitive.Trigger;

const Portal = DialogPrimitive.Portal;

const Close = DialogPrimitive.Close;

const Overlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80',
      className,
    )}
    {...props}
  />
));
Overlay.displayName = DialogPrimitive.Overlay.displayName;

const Content = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <Portal>
    <Overlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 rounded-xl border border-secondary-800 bg-black shadow-lg duration-200',
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm text-secondary-200 opacity-70 outline-none transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-neutral-100 data-[state=open]:text-primary-500">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </Portal>
));
Content.displayName = DialogPrimitive.Content.displayName;

const Header: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 rounded-t-xl border-b border-secondary-800 bg-secondary-950/70 p-5 text-center sm:text-left',
      className,
    )}
    {...props}
  />
);
Header.displayName = 'DialogHeader';

const Footer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
);
Footer.displayName = 'DialogFooter';

const Title = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight text-white', className)}
    {...props}
  />
));
Title.displayName = DialogPrimitive.Title.displayName;

const Description = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-secondary-200', className)}
    {...props}
  />
));
Description.displayName = DialogPrimitive.Description.displayName;

(Dialog as DialogComponent).Trigger = Trigger;
(Dialog as DialogComponent).Portal = Portal;
(Dialog as DialogComponent).Close = Close;
(Dialog as DialogComponent).Content = Content;
(Dialog as DialogComponent).Overlay = Overlay;
(Dialog as DialogComponent).Header = Header;
(Dialog as DialogComponent).Footer = Footer;
(Dialog as DialogComponent).Title = Title;
(Dialog as DialogComponent).Description = Description;

export default Dialog as DialogComponent;
