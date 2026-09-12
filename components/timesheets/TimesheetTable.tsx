// components/timesheets/timesheets-table.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { StatusBadge } from "./StatusBadge";
import { SortableHeader } from "./SortableHeader";
import { formatDateRange } from "@/lib/format-date-range";
import {
  Timesheet,
  TimesheetStatus,
  TimesheetSortColumn,
  SortOrder,
} from "@/lib/timesheets";
import { DateRange } from "react-day-picker";

const ACTION_LABEL: Record<TimesheetStatus, string> = {
  COMPLETED: "View",
  INCOMPLETE: "Update",
  MISSING: "Create",
};

type ApiResponse = {
  data: Timesheet[];
  total: number;
  totalPages: number;
  page: number;
  perPage: number;
  sortBy: TimesheetSortColumn;
  sortOrder: SortOrder;
};

export function TimesheetsTable({
  statusFilter,
  dateRange,
}: {
  statusFilter: TimesheetStatus | "ALL";
  dateRange?: DateRange;
}) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [sortBy, setSortBy] = useState<TimesheetSortColumn>("weekNumber");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Reset to page 1 whenever filter, page size, or sort changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [statusFilter, perPage, sortBy, sortOrder, dateRange]);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        perPage: String(perPage),
        status: statusFilter,
        sortBy,
        sortOrder,
      });

      if (dateRange?.from) {
        params.set("dateFrom", dateRange.from.toISOString().slice(0, 10));
      }
      if (dateRange?.to) {
        params.set("dateTo", dateRange.to.toISOString().slice(0, 10));
      }

      const res = await fetch(`/api/timesheets?${params.toString()}`);
      const json: ApiResponse = await res.json();

      setResult(json);
      setIsLoading(false);
    }

    fetchData();
  }, [page, perPage, statusFilter, sortBy, sortOrder, dateRange]);

  function handleSort(column: TimesheetSortColumn) {
    if (sortBy === column) {
      // Toggle direction on the same column
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      // New column, default to ascending
      setSortBy(column);
      setSortOrder("asc");
    }
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <SortableHeader
              column="weekNumber"
              label="Week #"
              currentSortBy={sortBy}
              currentSortOrder={sortOrder}
              onSort={handleSort}
            />
            <SortableHeader
              column="startDate"
              label="Date"
              currentSortBy={sortBy}
              currentSortOrder={sortOrder}
              onSort={handleSort}
            />
            <SortableHeader
              column="status"
              label="Status"
              currentSortBy={sortBy}
              currentSortOrder={sortOrder}
              onSort={handleSort}
            />
            <TableHead className="bg-gray-50 text-right text-xs font-medium uppercase text-gray-500">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-sm text-gray-500"
              >
                Loading...
              </TableCell>
            </TableRow>
          )}

          {!isLoading && result?.data.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-sm text-gray-500"
              >
                No timesheets found.
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            result?.data.map((sheet) => (
              <TableRow key={sheet.id}>
                <TableCell>{sheet.weekNumber}</TableCell>
                <TableCell className="text-gray-500">
                  {formatDateRange(sheet.startDate, sheet.endDate)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={sheet.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/dashboard/timesheets/${sheet.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {ACTION_LABEL[sheet.status]}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex items-center justify-between">
        <Select
          value={String(perPage)}
          onValueChange={(value) => setPerPage(Number(value))}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 per page</SelectItem>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="20">20 per page</SelectItem>
          </SelectContent>
        </Select>

        {result && result.totalPages > 1 && (
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((p) => Math.max(1, p - 1));
                  }}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: result.totalPages }, (_, i) => i + 1).map(
                (p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      isActive={p === page}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(p);
                      }}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((p) => Math.min(result.totalPages, p + 1));
                  }}
                  className={
                    page === result.totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
