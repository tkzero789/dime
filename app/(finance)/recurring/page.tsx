import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db/dbConfig";
import { and, desc, eq, getTableColumns } from "drizzle-orm";
import { Recurring_rule } from "@/db/schema";
import RecurringTable from "./_components/RecurringTable";
import AddRecurring from "./_components/AddRecurring";

export default async function RecurringPage() {
  const user = await currentUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress ?? "";

  const result = await db
    .select({ ...getTableColumns(Recurring_rule) })
    .from(Recurring_rule)
    .where(
      and(
        eq(Recurring_rule.created_by, userEmail),
        eq(Recurring_rule.is_actived, true),
      ),
    )
    .orderBy(desc(Recurring_rule.due_date));

  return (
    <div>
      <h2 className="text-2xl font-bold">Recurring</h2>
      <div className="mt-4 h-fit rounded-lg border bg-white p-6 shadow-md xl:mt-8">
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-xl font-bold">Payments list</h2>
          <div>
            <AddRecurring />
          </div>
        </div>
        <RecurringTable ruleList={result} currentUser={userEmail} />
      </div>
    </div>
  );
}
