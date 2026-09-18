// app/dashboard/timesheets/[weekId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { TimesheetDetail } from "@/components/timesheets/TimesheetDetails";
import { Timesheet } from "@/types/timesheets";
import { TimesheetEntry } from "@/lib/entries";

export default function TimesheetDetailPage() {
  const params = useParams<{ weekId: string }>();
  const router = useRouter();

  const [timesheet, setTimesheet] = useState<Timesheet | null>(null);
  const [entries, setEntries] = useState<TimesheetEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setNotFoundError(false);

      const res = await fetch(`/api/timesheets/${params.weekId}/entries`);

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (res.status === 404) {
        setNotFoundError(true);
        setIsLoading(false);
        return;
      }

      const json = await res.json();
      setTimesheet(json.timesheet);
      setEntries(json.entries);
      setIsLoading(false);
    }

    fetchData();
  }, [params.weekId, router]);

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-white p-6 text-sm text-gray-500 shadow-sm">
        Loading...
      </div>
    );
  }

  if (notFoundError || !timesheet) {
    return (
      <div className="rounded-lg border bg-white p-6 text-sm text-gray-500 shadow-sm">
        Timesheet not found.
      </div>
    );
  }

  return <TimesheetDetail timesheet={timesheet} initialEntries={entries} />;
}
