"use client";

import React from "react";
import { db } from "@/db/dbConfig";
import { Budgets, Expenses } from "@/db/schema";
import { BudgetDetail } from "@/types/types";
import { useUser } from "@clerk/nextjs";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import CardInfo from "./_components/CardInfo";

export default function Dashboard() {
  const [budgetList, setBudgetList] = React.useState<BudgetDetail[]>([]);

  const { user } = useUser();

  React.useEffect(() => {
    user && getBudgetList();
  }, [user]);

  const getBudgetList = async () => {
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
  };
  return (
    <div className="h-[calc(100vh-64px)] bg-[#f8f8f8] p-8">
      <h2 className="text-lg font-semibold">Hi, {user?.firstName}</h2>
      <CardInfo budgetList={budgetList} />
      <div className="grid grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">Chart</div>
        <div>Other content</div>
      </div>
    </div>
  );
}
