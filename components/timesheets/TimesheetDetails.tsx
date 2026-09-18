// components/timesheets/TimesheetDetails.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

import { formatDateRange } from "@/lib/format-date-range";
import { TimesheetEntry } from "@/lib/entries";
import { Timesheet } from "@/types/timesheets";
import { cn } from "@/lib/utils";
import { EntryFormModal, EntryFormValues } from "./EntryFormModal";
import { toast } from "sonner";

const WEEKLY_HOURS_TARGET = 40;

function getDaysInRange(start: string, end: string) {
  const days: string[] = [];
  const current = new Date(start);
  const last = new Date(end);

  while (current <= last) {
    days.push(current.toISOString().slice(0, 10));
    current.setDate(current.getDate() + 1);
  }

  return days;
}

function formatDayLabel(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function TimesheetDetail({
  timesheet,
  initialEntries,
}: {
  timesheet: Timesheet;
  initialEntries: TimesheetEntry[];
}) {
  const router = useRouter();

  const [entries, setEntries] = useState(initialEntries);
  const [status, setStatus] = useState(timesheet.status);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimesheetEntry | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<EntryFormValues>({
    date: "",
    project: "",
    workType: "",
    description: "",
    hours: 0,
  });

  const isReadOnly = status === "COMPLETED";
  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);
  const progressPct = Math.min(
    100,
    Math.round((totalHours / WEEKLY_HOURS_TARGET) * 100),
  );

  const days = useMemo(
    () => getDaysInRange(timesheet.startDate, timesheet.endDate),
    [timesheet.startDate, timesheet.endDate],
  );

  const entriesByDay = useMemo(() => {
    const map = new Map<string, TimesheetEntry[]>();
    for (const day of days) map.set(day, []);
    for (const entry of entries) {
      const list = map.get(entry.date);
      if (list) list.push(entry);
      else map.set(entry.date, [entry]);
    }
    return map;
  }, [days, entries]);

  function openCreateDialog(date: string) {
    setEditingEntry(null);
    setForm({ date, project: "", workType: "", description: "", hours: 0 });
    setError("");
    setDialogOpen(true);
  }

  function openEditDialog(entry: TimesheetEntry) {
    setEditingEntry(entry);
    setForm({
      date: entry.date,
      project: entry.project,
      workType: entry.workType,
      description: entry.description,
      hours: entry.hours,
    });
    setError("");
    setDialogOpen(true);
  }

  async function handleSubmit() {
    if (
      !form.project ||
      !form.workType ||
      !form.description ||
      form.hours <= 0
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const url = editingEntry
        ? `/api/timesheets/${timesheet.id}/entries/${editingEntry.id}`
        : `/api/timesheets/${timesheet.id}/entries`;

      const res = await fetch(url, {
        method: editingEntry ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error("Something went wrong.");
        setError(json.error ?? "Something went wrong.");
        return;
      }

      if (editingEntry) {
        toast.success("Entry updated successfully!");
        setEntries((prev) =>
          prev.map((e) => (e.id === editingEntry.id ? json.entry : e)),
        );
      } else {
        toast.success("Entry created successfully!");
        setEntries((prev) => [...prev, json.entry]);
      }

      if (json.timesheet) setStatus(json.timesheet.status);

      setDialogOpen(false);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(entryId: string) {
    const res = await fetch(
      `/api/timesheets/${timesheet.id}/entries/${entryId}`,
      { method: "DELETE" },
    );

    const json = await res.json();
    if (!res.ok) {
      toast.error("Failed to delete entry.");
      return;
    }

    toast.success("Entry deleted successfully!");
    setEntries((prev) => prev.filter((e) => e.id !== entryId));
    if (json.timesheet) setStatus(json.timesheet.status);
    router.refresh();
  }

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      {/* Header with progress */}
      <div className="mb-1 flex items-start justify-between">
        <h1 className="text-lg font-semibold text-gray-900">
          This week&apos;s timesheet
        </h1>

        <div className="w-40 text-right">
          <span className="text-xs text-gray-500">
            {totalHours}/{WEEKLY_HOURS_TARGET} hrs
          </span>
          <Progress value={progressPct} className="mt-1 h-1.5" color="orange" />
        </div>
      </div>

      <p className="mb-6 text-sm text-gray-500">
        {formatDateRange(timesheet.startDate, timesheet.endDate)}
      </p>

      {isReadOnly && (
        <p className="mb-4 rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-500">
          This timesheet is completed and can no longer be edited.
        </p>
      )}

      {/* Day groups */}
      <div className="space-y-6">
        {days.map((day) => {
          const dayEntries = entriesByDay.get(day) ?? [];

          return (
            <div key={day}>
              <p className="mb-2 text-sm font-medium text-gray-900">
                {formatDayLabel(day)}
              </p>

              <div className="space-y-2">
                {dayEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between rounded-md border px-4 py-2.5"
                  >
                    <span className="text-sm text-gray-700">
                      {entry.description || entry.workType}
                    </span>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">
                        {entry.hours} hrs
                      </span>

                      <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                        {entry.project}
                      </span>

                      {!isReadOnly && (
                        <DropdownMenu>
                          <DropdownMenuTrigger className="text-gray-400 hover:text-gray-700">
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => openEditDialog(entry)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(entry.id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                ))}

                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => openCreateDialog(day)}
                    className={cn(
                      "flex w-full items-center justify-center gap-1 rounded-md border border-dashed py-2.5 text-sm text-blue-600",
                      "hover:border-blue-300 hover:bg-blue-50",
                    )}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add new task
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <EntryFormModal
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        values={form}
        onChange={setForm}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={error}
        isEditing={!!editingEntry}
      />
    </div>
  );
}
