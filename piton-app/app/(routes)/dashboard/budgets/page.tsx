"use client";

import React from "react";
import BudgetList from "./_components/BudgetList";
import { db } from "@/db/dbConfig";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
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
      const result = await db
        .select({
          ...getTableColumns(Budgets),
          totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
          totalItem: sql`count(${Expenses.id})`.mapWith(Number),
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(
          eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress ?? ""),
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
    <div className="h-[calc(100vh-64px)] bg-[#f8f8f8] p-8">
      <BudgetList budgetList={budgetList} getBudgetList={getBudgetList} />
    </div>
  );
}
