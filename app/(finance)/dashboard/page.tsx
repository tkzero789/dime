"use client";

import React from "react";
import { db } from "@/db/dbConfig";
import { budget, budget_expense, income } from "@/db/schema";
import { BudgetExpenseData, IncomeData } from "@/types";
import { useUser } from "@clerk/nextjs";
import { and, eq, getTableColumns, gte, lte } from "drizzle-orm";
import DashboardTopSection from "./_components/top/DashboardTopSection";
import DashboardMidSection from "./_components/middle/DashboardMidSection";
import DashboardNav from "./_components/nav/DashboardNav";

export default function DashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [incomeData, setIncomeData] = React.useState<IncomeData[]>([]);
  const [spending, setSpending] = React.useState<BudgetExpenseData[]>([]);
  const [allData, setAllData] = React.useState<
    (IncomeData | BudgetExpenseData)[]
  >([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const { user } = useUser();
  const currentUser = user?.primaryEmailAddress?.emailAddress;
  const currentMonth = new Date().getUTCMonth();
  const currentYear = new Date().getUTCFullYear();
  const firstDayOfPrevMonth = new Date(
    Date.UTC(currentYear, currentMonth - 1, 1),
  ).toISOString();
  const firstDayOfMonth = new Date(
    Date.UTC(currentYear, currentMonth, 1),
  ).toISOString();
  const lastDayOfMonth = new Date(
    Date.UTC(currentYear, currentMonth + 1, 0),
  ).toISOString();

  React.useEffect(() => {
    const getData = async () => {
      try {
        // Spending Data
        const batchResponse = await db.batch([
          db
            .select({
              ...getTableColumns(income),
            })
            .from(income)
            .where(
              and(
                eq(income.created_by, currentUser ?? ""),
                gte(income.date, firstDayOfMonth),
                lte(income.date, lastDayOfMonth),
              ),
            ),
          db
            .select({
              ...getTableColumns(budget_expense),
              budget_category: budget.category,
              budget_emoji: budget.emoji,
            })
            .from(budget_expense)
            .leftJoin(budget, eq(budget.id, budget_expense.budget_id))
            .where(
              and(
                eq(budget_expense.created_by, currentUser ?? ""),
                gte(budget_expense.date, firstDayOfPrevMonth),
                lte(budget_expense.date, lastDayOfMonth),
              ),
            ),
        ]);
        if (batchResponse) {
          const [incomeData, budgetExpenseData] = batchResponse;
          setIncomeData(incomeData);

          const allSpending = budgetExpenseData.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          );

          const processedSpending = allSpending.map((item) => ({
            ...item,
            budget_category: item.budget_category ?? undefined,
            budget_emoji: item.budget_emoji ?? undefined,
          }));

          setSpending(processedSpending);

          const combinedData = [...incomeData, ...processedSpending];
          setAllData(combinedData);
        }
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };

    if (user) {
      getData();
    }
  }, [
    user,
    currentUser,
    currentMonth,
    currentYear,
    firstDayOfMonth,
    firstDayOfPrevMonth,
    lastDayOfMonth,
  ]);

  return (
    <div className="flex flex-col gap-6">
      <DashboardNav />
      <DashboardTopSection spending={spending} isLoading={isLoading} />
      <DashboardMidSection allData={allData} isLoading={isLoading} />
    </div>
  );
}
