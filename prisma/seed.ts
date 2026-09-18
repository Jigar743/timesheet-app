import usersData from "../data/users.json";
import timesheetsData from "../data/timesheets.json";
import entriesData from "../data/entries.json";

import { TimesheetStatus } from "../generated/prisma";
import { prisma } from "../lib/db";

async function main() {
  console.log("Starting seed...");

  // Users
  for (const user of usersData) {
    await prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: {},
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });
  }

  console.log("Users seeded.");

  // Timesheets
  for (const sheet of timesheetsData) {
    await prisma.timesheet.upsert({
      where: {
        id: sheet.id,
      },
      update: {},
      create: {
        id: sheet.id,
        weekNumber: sheet.weekNumber,
        startDate: new Date(sheet.startDate),
        endDate: new Date(sheet.endDate),
        status: sheet.status as TimesheetStatus,
      },
    });
  }

  console.log("Timesheets seeded.");

  // Timesheet entries
  for (const entry of entriesData) {
    await prisma.timesheetEntry.upsert({
      where: {
        id: entry.id,
      },
      update: {},
      create: {
        id: entry.id,
        timesheetId: entry.timesheetId,
        date: new Date(entry.date),
        project: entry.project,
        workType: entry.workType,
        description: entry.description,
        hours: entry.hours,
      },
    });
  }

  console.log("Timesheet entries seeded.");
  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error("Seed failed:");
    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
