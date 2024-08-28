import React from "react";
import { db } from "@/db/dbConfig";
import { and, desc, eq, getTableColumns, gte, lte } from "drizzle-orm";
import { Recurrence } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import RecurringList from "./_components/RecurringList";

export default async function RecurringPage() {
  const currentDate = new Date();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  );

  const user = await currentUser();
  const result = await db
    .select({ ...getTableColumns(Recurrence) })
    .from(Recurrence)
    .where(
      and(
        eq(
          Recurrence.created_by,
          user?.primaryEmailAddress?.emailAddress ?? "",
        ),
        gte(Recurrence.date, firstDayOfMonth.toISOString()),
        lte(Recurrence.date, lastDayOfMonth.toISOString()),
      ),
    )
    .orderBy(desc(Recurrence.date));
  return (
    <div className="min-h-dvh bg-[#f5f5f5] px-4 py-6 sm:px-20 sm:py-16">
      <h2 className="text-2xl font-bold">Recurring</h2>
      <RecurringList recurringList={result} />
    </div>
  );
}
