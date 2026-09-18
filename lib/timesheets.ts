// lib/timesheets.ts
import { prisma } from "./db";
import type { Prisma, Timesheet as PrismaTimesheet } from "../generated/prisma";
import { TimesheetStatus as PrismaStatus } from "../generated/prisma";

export type TimesheetStatus = "COMPLETED" | "INCOMPLETE" | "MISSING";
export type TimesheetSortColumn = "weekNumber" | "startDate" | "status";
export type SortOrder = "asc" | "desc";

export async function getTimesheetById(id: string) {
  const t = await prisma.timesheet.findUnique({ where: { id } });
  return t ? serializeTimesheet(t) : null;
}

export async function updateTimesheetStatus(
  id: string,
  status: TimesheetStatus,
) {
  const t = await prisma.timesheet.update({
    where: { id },
    data: { status: status as PrismaStatus },
  });
  return serializeTimesheet(t);
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
  const where: Prisma.TimesheetWhereInput = {};

  if (status && status !== "ALL") {
    where.status = status;
  }

  if (dateFrom && dateTo) {
    where.startDate = { lte: new Date(dateTo) };
    where.endDate = { gte: new Date(dateFrom) };
  }

  const total = await prisma.timesheet.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const rows = await prisma.timesheet.findMany({
    where,
    orderBy: { [sortBy]: sortOrder },
    skip: (page - 1) * perPage,
    take: perPage,
  });

  return {
    data: rows.map(serializeTimesheet),
    total,
    totalPages,
    page,
    perPage,
    sortBy,
    sortOrder,
  };
}

function serializeTimesheet(t: PrismaTimesheet) {
  return {
    id: t.id,
    weekNumber: t.weekNumber,
    startDate: t.startDate.toISOString().slice(0, 10),
    endDate: t.endDate.toISOString().slice(0, 10),
    status: t.status as TimesheetStatus,
  };
}
