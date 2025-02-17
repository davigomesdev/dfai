import React from 'react';
import { cn } from '@/utils/cn.util';

interface DataGridComponent
  extends React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement>> {
  Header: typeof Header;
  HeaderCell: typeof HeaderCell;
  Body: typeof Body;
  BodyRow: typeof BodyRow;
  BodyCell: typeof BodyCell;
}

const DataGrid = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('scrollbar-thin', className)} {...props} />
  ),
);
DataGrid.displayName = 'DataGrid';

const Header = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <header className={cn('group grid bg-black px-6 py-2', className)} {...props} ref={ref} />
  ),
);
Header.displayName = 'DataGridHeader';

const HeaderCell = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      className={cn('text-xs font-semibold text-secondary-200', className)}
      {...props}
      ref={ref}
    />
  ),
);
HeaderCell.displayName = 'DataGridHeaderCell';

const Body = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div className={cn('w-full space-y-4', className)} {...props} ref={ref} />
  ),
);
Body.displayName = 'DataGridBody';

const BodyRow = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      className={cn(
        'group grid w-full rounded-lg border border-secondary-800 bg-secondary-950/50 p-4 transition-colors',
        className,
      )}
      {...props}
      ref={ref}
    />
  ),
);
BodyRow.displayName = 'DataGridBodyRow';

const BodyCell = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div className={cn('text-sm font-light text-white', className)} {...props} ref={ref} />
  ),
);
BodyCell.displayName = 'DataGridBodyCell';

(DataGrid as DataGridComponent).Header = Header;
(DataGrid as DataGridComponent).HeaderCell = HeaderCell;
(DataGrid as DataGridComponent).Body = Body;
(DataGrid as DataGridComponent).BodyRow = BodyRow;
(DataGrid as DataGridComponent).BodyCell = BodyCell;

export default DataGrid as DataGridComponent;
