// components/timesheets/sortable-header.tsx
"use client";

import { ArrowUp, ArrowDown, ChevronsUpDown } from "lucide-react";

import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { TimesheetSortColumn, SortOrder } from "@/lib/timesheets";

export function SortableHeader({
  column,
  label,
  currentSortBy,
  currentSortOrder,
  onSort,
  className,
}: {
  column: TimesheetSortColumn;
  label: string;
  currentSortBy: TimesheetSortColumn;
  currentSortOrder: SortOrder;
  onSort: (column: TimesheetSortColumn) => void;
  className?: string;
}) {
  const isActive = currentSortBy === column;

  return (
    <TableHead className={cn("bg-gray-50 select-none", className)}>
      <button
        type="button"
        onClick={() => onSort(column)}
        className={cn(
          "flex items-center gap-1 text-xs font-medium uppercase",
          isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-700",
        )}
      >
        {label}

        {isActive ? (
          currentSortOrder === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5 text-gray-900" strokeWidth={2.5} />
          ) : (
            <ArrowDown
              className="h-3.5 w-3.5 text-gray-900"
              strokeWidth={2.5}
            />
          )
        ) : (
          <ChevronsUpDown className="h-3.5 w-3.5 text-gray-400" />
        )}
      </button>
    </TableHead>
  );
}
