import React from "react";
import IncomeList from "./_components/IncomeList";
import { db } from "@/db/dbConfig";
import { Income } from "@/db/schema";
import { eq, getTableColumns } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

export default async function IncomePage() {
  const user = await currentUser();
  const result = await db
    .select({
      ...getTableColumns(Income),
    })
    .from(Income)
    .where(
      eq(Income.created_by, user?.primaryEmailAddress?.emailAddress ?? ""),
    );

  return (
    <div className="min-h-dvh bg-[#f5f5f5] px-4 pb-20 pt-6 sm:px-20 sm:py-16">
      <h2 className="text-2xl font-bold">Income</h2>
      <IncomeList incomeList={result} />
    </div>
  );
}
