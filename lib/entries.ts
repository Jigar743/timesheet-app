// lib/entries.ts
import { prisma } from "./db";
import type { TimesheetEntry as PrismaTimesheetEntry } from "../generated/prisma";
import { TimesheetStatus } from "./timesheets";

export type TimesheetEntry = {
  id: string;
  timesheetId: string;
  date: string;
  project: string;
  workType: string;
  description: string;
  hours: number;
};

const COMPLETED_HOURS_THRESHOLD = 40;

export async function getEntriesByTimesheetId(timesheetId: string) {
  const rows = await prisma.timesheetEntry.findMany({
    where: { timesheetId },
    orderBy: { date: "asc" },
  });
  return rows.map(serializeEntry);
}

export function computeStatus(entries: TimesheetEntry[]): TimesheetStatus {
  if (entries.length === 0) return "MISSING";
  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);
  return totalHours >= COMPLETED_HOURS_THRESHOLD ? "COMPLETED" : "INCOMPLETE";
}

export async function createEntry(
  timesheetId: string,
  input: Omit<TimesheetEntry, "id" | "timesheetId">,
) {
  const entry = await prisma.timesheetEntry.create({
    data: {
      timesheetId,
      date: new Date(input.date),
      project: input.project,
      workType: input.workType,
      description: input.description,
      hours: input.hours,
    },
  });
  return serializeEntry(entry);
}

export async function updateEntry(
  entryId: string,
  input: Partial<Omit<TimesheetEntry, "id" | "timesheetId">>,
) {
  try {
    const entry = await prisma.timesheetEntry.update({
      where: { id: entryId },
      data: {
        ...(input.date && { date: new Date(input.date) }),
        ...(input.project && { project: input.project }),
        ...(input.workType && { workType: input.workType }),
        ...(input.description !== undefined && {
          description: input.description,
        }),
        ...(input.hours !== undefined && { hours: input.hours }),
      },
    });
    return serializeEntry(entry);
  } catch {
    return null;
  }
}

export async function deleteEntry(entryId: string) {
  try {
    await prisma.timesheetEntry.delete({ where: { id: entryId } });
    return true;
  } catch {
    return false;
  }
}

function serializeEntry(e: PrismaTimesheetEntry): TimesheetEntry {
  return {
    id: e.id,
    timesheetId: e.timesheetId,
    date: e.date.toISOString().slice(0, 10),
    project: e.project,
    workType: e.workType,
    description: e.description,
    hours: e.hours,
  };
}
