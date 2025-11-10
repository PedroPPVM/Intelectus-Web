'use client';

import { TableHead } from '@/components/ui/table';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface SortableTableHeaderProps<T> {
  column: keyof T;
  label: string;
  sorting: {
    column: keyof T | null;
    direction: 'asc' | 'desc' | null;
  };
  onSort: (column: keyof T) => void;
  className?: string;
}

export function SortableTableHeader<T>({
  column,
  label,
  sorting,
  onSort,
  className = 'border-r font-semibold',
}: SortableTableHeaderProps<T>) {
  const getSortIcon = () => {
    if (sorting.column !== column) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sorting.direction === 'asc' ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <TableHead
      className={`${className} cursor-pointer hover:bg-muted/70 transition-colors select-none`}
      onClick={() => onSort(column)}
    >
      <div className="flex items-center">
        {label}
        {getSortIcon()}
      </div>
    </TableHead>
  );
}

