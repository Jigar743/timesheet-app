// components/timesheets/DateRangeFilter.tsx
"use client";

import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DateRangeFilter({
  range,
  onChange,
}: {
  range: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange | undefined>(range);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(range);
  }, [range]);

  const label =
    range?.from && range?.to
      ? `${format(range.from, "MMM d")} - ${format(range.to, "MMM d, yyyy")}`
      : "Date Range";

  function handleSelect(next: DateRange | undefined) {
    setDraft(next);

    if (next?.from && next?.to) {
      onChange(next);
      setOpen(false);
    }
  }

  function handleClear() {
    setDraft(undefined);
    onChange(undefined);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[220px] justify-start text-left font-normal",
            !range?.from && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {label}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={draft}
          onSelect={handleSelect}
          resetOnSelect
          numberOfMonths={2}
          captionLayout="dropdown"
          startMonth={new Date(2020, 0)}
          endMonth={new Date(2030, 11)}
        />

        <div className="flex items-center justify-between border-t px-3 py-2">
          <p className="text-xs text-gray-500">
            Selecting multiple weeks shows all overlapping weeks.
          </p>

          {draft?.from && (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-blue-600 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
