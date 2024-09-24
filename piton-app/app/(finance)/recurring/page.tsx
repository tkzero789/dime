import React from "react";
import { db } from "@/db/dbConfig";
import { and, desc, eq, getTableColumns, gte, lte } from "drizzle-orm";
import { Recurrence } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import RecurringTable from "./_components/RecurringTable";
import GetCurrentMonth from "@/utils/getCurrentMonth";
import AddRecurring from "./_components/AddRecurring";
import UpcomingRecurring from "./_components/UpcomingRecurring";

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
    <div className="sm:py-18 min-h-dvh w-dvw bg-[#f5f5f5] px-4 pb-20 pt-6 md:w-full xl:px-20">
      <h2 className="text-2xl font-bold">Recurring</h2>
      <UpcomingRecurring recurringList={result} />
      <div className="mt-4 h-fit rounded-lg border bg-white p-6 shadow-md xl:mt-8">
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-xl font-bold">Payments list</h2>
          <AddRecurring />
        </div>
        <RecurringTable recurringList={result} />
      </div>
    </div>
  );
}
