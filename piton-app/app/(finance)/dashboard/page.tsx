"use client";

import React from "react";
import { db } from "@/db/dbConfig";
import {
  Budgets,
  BudgetExpenses,
  Income,
  Recurrence,
  Single,
} from "@/db/schema";
import { ExpenseDetail, IncomeDetail, RecurrenceDetail } from "@/types/types";
import { useUser } from "@clerk/nextjs";
import { and, desc, eq, getTableColumns, gte, lte, sql } from "drizzle-orm";
import { BatchResponse } from "drizzle-orm/batch";
import GetGreeting from "@/utils/getGreeting";
import DashboardMainSection from "./_components/main/DashboardMainSection";

export default function DashboardPage() {
  const [income, setIncome] = React.useState<IncomeDetail[]>([]);
  const [spending, setSpending] = React.useState<
    (ExpenseDetail | RecurrenceDetail)[]
  >([]);

  const { user } = useUser();
  const currentUser = user?.primaryEmailAddress?.emailAddress;
  React.useEffect(() => {
    if (user) {
      getData();
    }
  }, [user]);

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

  const getData = async () => {
    try {
      const batchResponse: BatchResponse<any> = await db.batch([
        db
          .select({
            ...getTableColumns(Income),
          })
          .from(Income)
          .where(
            and(
              eq(Income.created_by, currentUser ?? ""),
              gte(Income.date, firstDayOfMonth),
              lte(Income.date, lastDayOfMonth),
            ),
          ),
        db
          .select({
            ...getTableColumns(BudgetExpenses),
          })
          .from(BudgetExpenses)
          .where(
            and(
              eq(BudgetExpenses.created_by, currentUser ?? ""),
              gte(BudgetExpenses.date, firstDayOfPrevMonth),
              lte(BudgetExpenses.date, lastDayOfMonth),
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
        const [incomeResult, budgetResult, recurringResult, singleResult] =
          batchResponse;
        setIncome(incomeResult);

        const combineSpending = [
          ...budgetResult,
          ...recurringResult,
          ...singleResult,
        ].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

        setSpending(combineSpending);
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
      <DashboardMainSection spending={spending} income={income} />
    </div>
  );
}
