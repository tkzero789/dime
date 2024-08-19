"use client";

import React, { Suspense } from "react";
import { db } from "@/db/dbConfig";
import { Budgets, Expenses } from "@/db/schema";
import { BudgetDetail } from "@/types/types";
import { useUser } from "@clerk/nextjs";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";

export default function DashboardPage() {
  const [budgetList, setBudgetList] = React.useState<BudgetDetail[]>([]);

  const { user } = useUser();
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

      setBudgetList(result);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="min-h-dvh bg-[#f5f5f5] px-14 py-16">
      <h2 className="text-2xl font-bold">Hi, {user?.firstName}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">Chart</div>
        <div>Other content</div>
      </div>
    </div>
  );
}
