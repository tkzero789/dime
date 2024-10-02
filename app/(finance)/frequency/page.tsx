import React from "react";
import FrequencyTable from "./_components/FrequencyTable";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db/dbConfig";
import { and, eq, getTableColumns } from "drizzle-orm";
import AddFrequencyRule from "./_components/AddFrequencyRule";
import { Recurring_rule } from "@/db/schema";

export default async function FrequencyPage() {
  const user = await currentUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress ?? "";

  const result = await db
    .select({ ...getTableColumns(Recurring_rule) })
    .from(Recurring_rule)
    .where(
      and(
        eq(Recurring_rule.created_by, userEmail),
        eq(Recurring_rule.isActive, true),
      ),
    );

  return (
    <div className="sm:py-18 min-h-dvh w-dvw bg-[#f5f5f5] px-2 pb-20 pt-6 md:w-full md:px-4 xl:px-20">
      <h2 className="text-2xl font-bold">Frequency</h2>
      <div className="mt-4 h-fit rounded-lg border bg-white p-6 shadow-md xl:mt-8">
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-xl font-bold">Payments list</h2>
          <div>
            <AddFrequencyRule />
          </div>
        </div>
        <FrequencyTable ruleList={result} currentUser={userEmail} />
      </div>
    </div>
  );
}
