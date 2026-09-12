export type TimesheetStatus = "COMPLETED" | "INCOMPLETE" | "MISSING";

export interface Timesheet {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  status: TimesheetStatus;
}

export interface TimesheetEntry {
  id: string;
  timesheetId: string;
  date: string;
  project: string;
  workType: string;
  description: string;
  hours: number;
}
