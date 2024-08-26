"use client";

import React from "react";
import { db } from "@/db/dbConfig";
import { Budgets, BudgetExpenses, Income } from "@/db/schema";
import { BudgetDetail, IncomeDetail } from "@/types/types";
import { useUser } from "@clerk/nextjs";
import { and, desc, eq, getTableColumns, gte, lte, sql } from "drizzle-orm";
import { BatchResponse } from "drizzle-orm/batch";
import GetGreeting from "@/utils/getGreeting";
import DashboardMainSection from "./_components/main/DashboardMainSection";

export default function DashboardPage() {
  const [budgetData, setBudgetData] = React.useState<BudgetDetail[]>([]);
  const [incomeData, setIncomeData] = React.useState<IncomeDetail[]>([]);

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

  const { user } = useUser();
  React.useEffect(() => {
    if (user) {
      getData();
    }
  }, [user]);

  const getData = async () => {
    try {
      const batchResponse: BatchResponse<any> = await db.batch([
        db
          .select({
            ...getTableColumns(Budgets),
            total_spend: sql`sum(${BudgetExpenses.amount})`.mapWith(Number),
            total_item: sql`count(${BudgetExpenses.id})`.mapWith(Number),
            remaining:
              sql`${Budgets.amount} - sum(${BudgetExpenses.amount})`.mapWith(
                Number,
              ),
          })
          .from(Budgets)
          .leftJoin(BudgetExpenses, eq(Budgets.id, BudgetExpenses.budget_id))
          .where(
            and(
              eq(
                Budgets.created_by,
                user?.primaryEmailAddress?.emailAddress ?? "",
              ),
              gte(Budgets.created_at, firstDayOfMonth),
              lte(Budgets.created_at, lastDayOfMonth),
            ),
          )
          .groupBy(Budgets.id)
          .orderBy(desc(Budgets.created_at)),
        db
          .select({
            ...getTableColumns(Income),
          })
          .from(Income)
          .where(
            and(
              eq(
                Income.created_by,
                user?.primaryEmailAddress?.emailAddress ?? "",
              ),
              gte(Income.date, firstDayOfMonth.toISOString()),
              lte(Income.date, lastDayOfMonth.toISOString()),
            ),
          )
          .groupBy(Income.id, Income.created_by),
      ]);
      if (batchResponse) {
        const [budgetResult, incomeResult] = batchResponse;
        setBudgetData(budgetResult);
        setIncomeData(incomeResult);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-dvh bg-[#f5f5f5] px-4 pb-20 pt-6 sm:px-20 sm:py-16">
      <h2 className="text-2xl font-bold">
        <GetGreeting />
      </h2>
      <DashboardMainSection budgetData={budgetData} incomeData={incomeData} />
    </div>
  );
}
