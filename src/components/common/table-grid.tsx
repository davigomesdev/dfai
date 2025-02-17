import React from 'react';
import { cn } from '@/utils/cn.util';

interface TableGridComponent
  extends React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement>> {
  Header: typeof Header;
  HeaderRow: typeof HeaderRow;
  HeaderCell: typeof HeaderCell;
  Body: typeof Body;
  BodyRow: typeof BodyRow;
  BodyCell: typeof BodyCell;
}

const TableGrid = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('scrollbar-thin overflow-x-auto', className)} {...props}>
      <table className="w-full rounded-md">{children}</table>
    </div>
  ),
);
TableGrid.displayName = 'TableGrid';

const Header = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead className={cn('group px-6', className)} {...props} ref={ref} />
));
Header.displayName = 'TableGridHeader';

const HeaderRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  (props, ref) => <tr {...props} ref={ref} />,
);
HeaderRow.displayName = 'TableGridHeaderRow';

const HeaderCell = React.forwardRef<
  HTMLTableCellElement,
  React.HTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    className={cn(
      'p-4 px-2 text-left text-xs font-semibold text-neutral-400 first:pl-6 last:pr-6',
      className,
    )}
    {...props}
    ref={ref}
  />
));
HeaderCell.displayName = 'TableGridHeaderCell';

const Body = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody className={cn('table-body overflow-y-scroll', className)} {...props} ref={ref} />
));
Body.displayName = 'TableGridBody';

const BodyRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => <tr className={cn('group', className)} {...props} ref={ref} />,
);
BodyRow.displayName = 'TableGridBodyRow';

const BodyCell = React.forwardRef<HTMLTableCellElement, React.HTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      className={cn('bg-secondary-950/50 p-4 text-sm font-normal text-white', className)}
      {...props}
      ref={ref}
    />
  ),
);
BodyCell.displayName = 'TableGridBodyCell';

(TableGrid as TableGridComponent).Header = Header;
(TableGrid as TableGridComponent).HeaderRow = HeaderRow;
(TableGrid as TableGridComponent).HeaderCell = HeaderCell;
(TableGrid as TableGridComponent).Body = Body;
(TableGrid as TableGridComponent).BodyRow = BodyRow;
(TableGrid as TableGridComponent).BodyCell = BodyCell;

export default TableGrid as TableGridComponent;
