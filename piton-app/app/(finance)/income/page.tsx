import React from "react";
import IncomeList from "./_components/IncomeList";
import { db } from "@/db/dbConfig";
import { Income } from "@/db/schema";
import { and, desc, eq, getTableColumns, gte, lte } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { IncomeBarChart } from "./_components/IncomeBarChart";

export default async function IncomePage() {
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
    .select({
      ...getTableColumns(Income),
    })
    .from(Income)
    .where(
      and(
        eq(Income.created_by, user?.primaryEmailAddress?.emailAddress ?? ""),
        gte(Income.date, firstDayOfMonth.toISOString()),
        lte(Income.date, lastDayOfMonth.toISOString()),
      ),
    )
    .orderBy(desc(Income.date));

  return (
    <div className="min-h-dvh bg-[#f5f5f5] px-4 pb-20 pt-6 sm:px-20 sm:py-16">
      <h2 className="text-2xl font-bold">Income</h2>
      <IncomeBarChart incomeList={result} />
      <IncomeList incomeList={result} />
    </div>
  );
}
