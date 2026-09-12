import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getTimesheetById, updateTimesheetStatus } from "@/lib/timesheets";
import {
  getEntriesByTimesheetId,
  updateEntry,
  deleteEntry,
  computeStatus,
} from "@/lib/entries";

async function assertEditable(weekId: string) {
  const timesheet = await getTimesheetById(weekId);

  if (!timesheet) {
    return {
      error: NextResponse.json(
        { error: "Timesheet not found" },
        { status: 404 },
      ),
    };
  }

  if (timesheet.status === "COMPLETED") {
    return {
      error: NextResponse.json(
        { error: "Cannot modify a completed timesheet" },
        { status: 403 },
      ),
    };
  }

  return { timesheet };
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ weekId: string; entryId: string }> },
) {
  const { weekId, entryId } = await params;

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const check = await assertEditable(weekId);
  if (check.error) return check.error;

  const body = await request.json();
  const updated = await updateEntry(entryId, {
    date: body.date,
    project: body.project,
    workType: body.workType,
    description: body.description,
    hours: body.hours !== undefined ? Number(body.hours) : undefined,
  });

  if (!updated) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  const entries = await getEntriesByTimesheetId(weekId);
  const newStatus = computeStatus(entries);
  const updatedTimesheet = await updateTimesheetStatus(weekId, newStatus);

  return NextResponse.json({ entry: updated, timesheet: updatedTimesheet });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ weekId: string; entryId: string }> },
) {
  const { weekId, entryId } = await params;

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const check = await assertEditable(weekId);
  if (check.error) return check.error;

  const success = await deleteEntry(entryId);
  if (!success) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  const entries = await getEntriesByTimesheetId(weekId);
  const newStatus = computeStatus(entries);
  const updatedTimesheet = await updateTimesheetStatus(weekId, newStatus);

  return NextResponse.json({ success: true, timesheet: updatedTimesheet });
}