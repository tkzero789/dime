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
import {
  BudgetDetail,
  ExpenseDetail,
  IncomeDetail,
  RecurrenceDetail,
  SingleDetail,
} from "@/types/types";
import { useUser } from "@clerk/nextjs";
import { and, desc, eq, getTableColumns, gte, lte, sql } from "drizzle-orm";
import { BatchResponse } from "drizzle-orm/batch";
import GetGreeting from "@/utils/getGreeting";
import DashboardTopSection from "./_components/top/DashboardTopSection";
import DashboardMidSection from "./_components/middle/DashboardMidSection";

type NewExpenseDetail = ExpenseDetail & {
  category: string;
};

export default function DashboardPage() {
  const [income, setIncome] = React.useState<IncomeDetail[]>([]);
  const [spending, setSpending] = React.useState<
    (NewExpenseDetail | RecurrenceDetail | SingleDetail)[]
  >([]);
  const [budget, setBudget] = React.useState<BudgetDetail[]>([]);
  const [allData, setAllData] = React.useState<
    (IncomeDetail | NewExpenseDetail | RecurrenceDetail | SingleDetail)[]
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
              gte(Budgets.created_at, new Date(firstDayOfMonth)),
              lte(Budgets.created_at, new Date(lastDayOfMonth)),
            ),
          )
          .groupBy(Budgets.id)
          .orderBy(desc(Budgets.created_at)),
      ]);
      if (batchResponse) {
        let [
          incomeResult,
          expenseResult,
          recurringResult,
          singleResult,
          budgetResult,
        ] = batchResponse;
        setIncome(incomeResult);

        // Add category property to each object in expenseResult
        expenseResult = expenseResult.map((row: ExpenseDetail) => ({
          ...row,
          category: "Budget Expense",
        }));

        const combineSpending = [
          ...expenseResult,
          ...recurringResult,
          ...singleResult,
        ].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

        setSpending(combineSpending);

        setBudget(budgetResult);

        setAllData([...incomeResult, ...combineSpending]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="sm:py-18 min-h-dvh w-dvw bg-[#f5f5f5] px-2 pb-20 pt-6 md:w-full md:px-4 xl:px-20">
      <h2 className="text-2xl font-bold">
        <GetGreeting />
      </h2>
      <DashboardTopSection spending={spending} income={income} />
      <DashboardMidSection allData={allData} budget={budget} />
    </div>
  );
}
