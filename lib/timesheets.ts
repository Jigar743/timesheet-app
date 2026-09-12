// lib/timesheets.ts
import { getJsonDatabase } from "./db";

export type TimesheetStatus = "COMPLETED" | "INCOMPLETE" | "MISSING";

export type Timesheet = {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  status: TimesheetStatus;
};

export type TimesheetSortColumn = "weekNumber" | "startDate" | "status";
export type SortOrder = "asc" | "desc";

export async function getTimesheets() {
  const db = await getJsonDatabase<Timesheet[]>("timesheets.json", []);

  return db.data;
}

function compareTimesheets(
  a: Timesheet,
  b: Timesheet,
  sortBy: TimesheetSortColumn,
) {
  switch (sortBy) {
    case "weekNumber":
      return a.weekNumber - b.weekNumber;
    case "startDate":
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    case "status":
      return a.status.localeCompare(b.status);
    default:
      return 0;
  }
}

export async function getTimesheetById(id: string) {
  const timesheets = await getTimesheets();

  return timesheets.find((t) => t.id === id) ?? null;
}

export async function updateTimesheetStatus(
  id: string,
  status: TimesheetStatus,
) {
  const db = await getJsonDatabase<Timesheet[]>("timesheets.json", []);

  const timesheet = db.data.find((t) => t.id === id);
  if (!timesheet) return null;

  timesheet.status = status;
  await db.write();

  return timesheet;
}

export async function getTimesheetsPaginated({
  page = 1,
  perPage = 5,
  status,
  sortBy = "weekNumber",
  sortOrder = "asc",
  dateFrom,
  dateTo,
}: {
  page?: number;
  perPage?: number;
  status?: TimesheetStatus | "ALL";
  sortBy?: TimesheetSortColumn;
  sortOrder?: SortOrder;
  dateFrom?: string;
  dateTo?: string;
}) {
  let timesheets = await getTimesheets();

  if (status && status !== "ALL") {
    timesheets = timesheets.filter((t) => t.status === status);
  }

  if (dateFrom && dateTo) {
    const rangeStart = new Date(dateFrom).getTime();
    const rangeEnd = new Date(dateTo).getTime();

    timesheets = timesheets.filter((t) => {
      const weekStart = new Date(t.startDate).getTime();
      const weekEnd = new Date(t.endDate).getTime();

      // Overlap check: week overlaps range if it starts before range ends
      // AND ends after range starts
      return weekStart <= rangeEnd && weekEnd >= rangeStart;
    });
  }

  timesheets = [...timesheets].sort((a, b) => {
    const result = compareTimesheets(a, b, sortBy);
    return sortOrder === "asc" ? result : -result;
  });

  const total = timesheets.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const data = timesheets.slice(start, start + perPage);

  return { data, total, totalPages, page, perPage, sortBy, sortOrder };
}
