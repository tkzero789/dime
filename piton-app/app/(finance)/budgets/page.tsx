"use client";

import React from "react";
import BudgetList from "./_components/budget/BudgetList";
import { db } from "@/db/dbConfig";
import { and, desc, eq, getTableColumns, gte, lte, sql } from "drizzle-orm";
import { Budgets, Expenses } from "@/db/schema";
import { useUser } from "@clerk/nextjs";
import { BudgetDetail } from "@/types/types";

export default function BudgetsPage() {
  const { user } = useUser();
  const [budgetList, setBudgetList] = React.useState<BudgetDetail[]>([]);

  React.useEffect(() => {
    user && getBudgetList();
  }, [user]);

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
          totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
          totalItem: sql`count(${Expenses.id})`.mapWith(Number),
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(
          and(
            eq(
              Budgets.createdBy,
              user?.primaryEmailAddress?.emailAddress ?? "",
            ),
            gte(Budgets.createdAt, firstDayOfMonth),
            lte(Budgets.createdAt, lastDayOfMonth),
          ),
        )
        .groupBy(Budgets.id)
        .orderBy(desc(Budgets.createdAt));

      if (result) {
        setBudgetList(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-dvh bg-[#f5f5f5] px-14 py-16">
      <BudgetList budgetList={budgetList} getBudgetList={getBudgetList} />
    </div>
  );
}
