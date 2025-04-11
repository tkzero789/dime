"use client";

import React from "react";
import { db } from "@/db/dbConfig";
import { Recurrence, Single, budget_expense, income } from "@/db/schema";
import {
  ExpenseDetailWithCategory,
  IncomeData,
  RecurrenceDetail,
  SingleDetail,
} from "@/types";
import { useUser } from "@clerk/nextjs";
import { and, eq, getTableColumns, gte, lte } from "drizzle-orm";
import DashboardTopSection from "./_components/top/DashboardTopSection";
import DashboardMidSection from "./_components/middle/DashboardMidSection";
import DashboardNav from "./_components/nav/DashboardNav";

export default function DashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [incomeData, setIncomeData] = React.useState<IncomeData[]>([]);
  const [spending, setSpending] = React.useState<
    (ExpenseDetailWithCategory | RecurrenceDetail | SingleDetail)[]
  >([]);
  const [allData, setAllData] = React.useState<
    (IncomeData | ExpenseDetailWithCategory | RecurrenceDetail | SingleDetail)[]
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
            })
            .from(budget_expense)
            .where(
              and(
                eq(budget_expense.created_by, currentUser ?? ""),
                gte(budget_expense.date, firstDayOfPrevMonth),
                lte(budget_expense.date, lastDayOfMonth),
              ),
            ),
          db
            .select({ ...getTableColumns(Recurrence) })
            .from(Recurrence)
            .where(
              and(
                eq(Recurrence.created_by, currentUser ?? ""),
                gte(Recurrence.date, firstDayOfPrevMonth),
                lte(Recurrence.date, lastDayOfMonth),
              ),
            ),
          db
            .select({ ...getTableColumns(Single) })
            .from(Single)
            .where(
              and(
                eq(Single.created_by, currentUser ?? ""),
                gte(Single.date, firstDayOfPrevMonth),
                lte(Single.date, lastDayOfMonth),
              ),
            ),
        ]);
        if (batchResponse) {
          let [
            // eslint-disable-next-line prefer-const
            incomeResult,
            expenseResult,
            // eslint-disable-next-line prefer-const
            recurringResult,
            // eslint-disable-next-line prefer-const
            singleResult,
          ] = batchResponse;
          setIncomeData(incomeResult);

          // Add category property to each object in expenseResult
          expenseResult = expenseResult.map((row) => ({
            ...row,
            category: "Budget Expense",
          }));

          const combineSpending: (
            | ExpenseDetailWithCategory
            | RecurrenceDetail
            | SingleDetail
          )[] = [
            ...expenseResult.map((expense) => ({
              ...expense,
              category: "Budget Expense",
            })),
            ...recurringResult,
            ...singleResult,
          ].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          );

          setSpending(combineSpending);

          const combinedData = [...incomeResult, ...combineSpending];
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
