// lib/entries.ts
import { getJsonDatabase } from "./db";
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

export async function getEntriesDb() {
  return getJsonDatabase<TimesheetEntry[]>("entries.json", []);
}

export async function getEntriesByTimesheetId(timesheetId: string) {
  const db = await getEntriesDb();

  return db.data
    .filter((entry) => entry.timesheetId === timesheetId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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
  const db = await getEntriesDb();

  const entry: TimesheetEntry = {
    id: `entry-${Date.now()}`,
    timesheetId,
    ...input,
  };

  db.data.push(entry);
  await db.write();

  return entry;
}

export async function updateEntry(
  entryId: string,
  input: Partial<Omit<TimesheetEntry, "id" | "timesheetId">>,
) {
  const db = await getEntriesDb();

  const entry = db.data.find((e) => e.id === entryId);
  if (!entry) return null;

  Object.assign(entry, input);
  await db.write();

  return entry;
}

export async function deleteEntry(entryId: string) {
  const db = await getEntriesDb();

  const index = db.data.findIndex((e) => e.id === entryId);
  if (index === -1) return false;

  db.data.splice(index, 1);
  await db.write();

  return true;
}
