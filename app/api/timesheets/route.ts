// app/api/timesheets/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import {
  getTimesheetsPaginated,
  TimesheetStatus,
  TimesheetSortColumn,
  SortOrder,
} from "@/lib/timesheets";

const VALID_SORT_COLUMNS: TimesheetSortColumn[] = [
  "weekNumber",
  "startDate",
  "status",
];

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;

  const page = Number(searchParams.get("page") ?? "1");
  const perPage = Number(searchParams.get("perPage") ?? "5");
  const status = (searchParams.get("status") ?? "ALL") as
    | TimesheetStatus
    | "ALL";

  const rawSortBy = searchParams.get("sortBy") ?? "weekNumber";
  const sortBy = VALID_SORT_COLUMNS.includes(rawSortBy as TimesheetSortColumn)
    ? (rawSortBy as TimesheetSortColumn)
    : "weekNumber";

  const rawSortOrder = searchParams.get("sortOrder") ?? "asc";
  const sortOrder: SortOrder = rawSortOrder === "desc" ? "desc" : "asc";

  const dateFrom = searchParams.get("dateFrom") ?? undefined;
  const dateTo = searchParams.get("dateTo") ?? undefined;

  const result = await getTimesheetsPaginated({
    page,
    perPage,
    status,
    sortBy,
    sortOrder,
    dateFrom,
    dateTo,
  });

  return NextResponse.json(result);
}
