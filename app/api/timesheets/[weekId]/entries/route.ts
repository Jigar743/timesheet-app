// app/api/timesheets/[weekId]/entries/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getTimesheetById, updateTimesheetStatus } from "@/lib/timesheets";
import {
  getEntriesByTimesheetId,
  createEntry,
  computeStatus,
} from "@/lib/entries";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ weekId: string }> },
) {
  const { weekId } = await params;

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const timesheet = await getTimesheetById(weekId);
  if (!timesheet) {
    return NextResponse.json({ error: "Timesheet not found" }, { status: 404 });
  }

  const entries = await getEntriesByTimesheetId(weekId);

  return NextResponse.json({ timesheet, entries });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ weekId: string }> },
) {
  const { weekId } = await params;

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const timesheet = await getTimesheetById(weekId);
  if (!timesheet) {
    return NextResponse.json({ error: "Timesheet not found" }, { status: 404 });
  }

  if (timesheet.status === "COMPLETED") {
    return NextResponse.json(
      { error: "Cannot add entries to a completed timesheet" },
      { status: 403 },
    );
  }

  const body = await request.json();
  const { date, project, workType, description, hours } = body;

  if (!date || !project || !workType || !hours) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const entry = await createEntry(weekId, {
    date,
    project,
    workType,
    description: description ?? "",
    hours: Number(hours),
  });

  const entries = await getEntriesByTimesheetId(weekId);
  const newStatus = computeStatus(entries);
  const updatedTimesheet = await updateTimesheetStatus(weekId, newStatus);

  return NextResponse.json({ entry, timesheet: updatedTimesheet });
}
