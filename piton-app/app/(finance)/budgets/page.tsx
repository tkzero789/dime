"use client";

import React from "react";
import BudgetList from "./_components/budget/BudgetList";
import { db } from "@/db/dbConfig";
import { and, desc, eq, getTableColumns, gte, lte, sql } from "drizzle-orm";
import { Budgets, BudgetExpenses } from "@/db/schema";
import { useUser } from "@clerk/nextjs";
import { BudgetDetail } from "@/types/types";

export default function BudgetsPage() {
  const { user } = useUser();
  const [budgetList, setBudgetList] = React.useState<BudgetDetail[]>([]);

  React.useEffect(() => {
    user && getBudgetList();
  }, [user]);

  // List of all budgets
  const getBudgetList = async () => {
    try {
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

      const result = await db
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
        .orderBy(desc(Budgets.created_at));

      if (result) {
        setBudgetList(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="sm:py-18 min-h-dvh bg-[#f5f5f5] px-4 pb-20 pt-6 sm:px-20">
      <BudgetList budgetList={budgetList} getBudgetList={getBudgetList} />
    </div>
  );
}
