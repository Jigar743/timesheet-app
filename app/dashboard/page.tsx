// app/dashboard/page.tsx
"use client";

import { useState } from "react";
import { DateRange } from "react-day-picker";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimesheetsTable } from "@/components/timesheets/TimesheetTable";
import { DateRangeFilter } from "@/components/timesheets/DateRangeFilter";
import { TimesheetStatus } from "@/lib/timesheets";

export default function DashboardPage() {
  const [statusFilter, setStatusFilter] = useState<TimesheetStatus | "ALL">(
    "ALL",
  );
  const [committedRange, setCommittedRange] = useState<DateRange | undefined>();

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h1 className="mb-6 text-xl font-semibold text-gray-900">
        Your Timesheets
      </h1>

      <div className="mb-6 flex gap-3">
        <DateRangeFilter range={committedRange} onChange={setCommittedRange} />

        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as TimesheetStatus | "ALL")
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="INCOMPLETE">Incomplete</SelectItem>
            <SelectItem value="MISSING">Missing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <TimesheetsTable statusFilter={statusFilter} dateRange={committedRange} />
    </div>
  );
}
