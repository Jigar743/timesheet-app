// components/timesheets/status-badge.tsx
import { cn } from "@/lib/utils";
import { TimesheetStatus } from "@/lib/timesheets";

const STATUS_STYLES: Record<TimesheetStatus, string> = {
  COMPLETED: "bg-green-100 text-green-700",
  INCOMPLETE: "bg-yellow-100 text-yellow-700",
  MISSING: "bg-red-100 text-red-700",
};

export function StatusBadge({ status }: { status: TimesheetStatus }) {
  return (
    <span
      className={cn(
        "rounded px-2 py-0.5 text-xs font-medium",
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}