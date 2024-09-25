import { CalendarDays } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function DashboardSeeUpcoming() {
  return (
    <Link
      href="/recurring"
      className="block rounded-lg border bg-white p-6 shadow-md hover:shadow-lg"
    >
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-teal-200 bg-opacity-50 p-3">
          <CalendarDays className="h-6 w-6 stroke-teal-700" />
        </div>
        <div>
          <h2 className="text-xl font-bold">View Upcoming Bill</h2>
          <p className="text-sm text-medium">Check your next payment details</p>
        </div>
      </div>
    </Link>
  );
}
