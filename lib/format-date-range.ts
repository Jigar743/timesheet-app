// lib/format-date-range.ts
export function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startDay = start.getDate();
  const endDay = end.getDate();

  const sameMonth = start.getMonth() === end.getMonth();
  const year = end.getFullYear();

  const startMonthLabel = start.toLocaleString("en-US", { month: "long" });
  const endMonthLabel = end.toLocaleString("en-US", { month: "long" });

  if (sameMonth) {
    return `${startDay} - ${endDay} ${endMonthLabel}, ${year}`;
  }

  return `${startDay} ${startMonthLabel} - ${endDay} ${endMonthLabel}, ${year}`;
}