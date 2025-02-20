"use client";

import React from "react";
import { db } from "@/db/dbConfig";
import {
  Budgets,
  BudgetExpenses,
  Income,
  Recurrence,
  Single,
  Accounts,
} from "@/db/schema";
import {
  AccountDetail,
  BudgetDetail,
  ExpenseDetailWithCategory,
  IncomeDetail,
  RecurrenceDetail,
  SingleDetail,
} from "@/types/types";
import { useUser } from "@clerk/nextjs";
import { and, desc, eq, getTableColumns, gte, lte, sql } from "drizzle-orm";
import DashboardTopSection from "./_components/top/DashboardTopSection";
import DashboardMidSection from "./_components/middle/DashboardMidSection";
import DashboardNav from "./_components/nav/DashboardNav";

export default function DashboardPage() {
  const [accounts, setAccounts] = React.useState<AccountDetail[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [income, setIncome] = React.useState<IncomeDetail[]>([]);
  const [spending, setSpending] = React.useState<
    (ExpenseDetailWithCategory | RecurrenceDetail | SingleDetail)[]
  >([]);
  const [budget, setBudget] = React.useState<BudgetDetail[]>([]);
  const [allData, setAllData] = React.useState<
    (
      | IncomeDetail
      | ExpenseDetailWithCategory
      | RecurrenceDetail
      | SingleDetail
    )[]
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
        // Accounts
        const accountDataReponse = await db
          .select({
            ...getTableColumns(Accounts),
          })
          .from(Accounts)
          .where(
            and(
              eq(Accounts.created_by, currentUser || ""),
              eq(Accounts.is_actived, true),
            ),
          );

        if (accountDataReponse) setAccounts(accountDataReponse);

        // Spending Data
        const batchResponse = await db.batch([
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
            // eslint-disable-next-line prefer-const
            incomeResult,
            expenseResult,
            // eslint-disable-next-line prefer-const
            recurringResult,
            // eslint-disable-next-line prefer-const
            singleResult,
            // eslint-disable-next-line prefer-const
            budgetResult,
          ] = batchResponse;
          setIncome(incomeResult);

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

          setBudget(budgetResult);

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
    <div className="grid gap-6">
      <DashboardNav />
      <DashboardTopSection
        accounts={accounts}
        spending={spending}
        isLoading={isLoading}
      />
      <DashboardMidSection
        allData={allData}
        budget={budget}
        isLoading={isLoading}
      />
    </div>
  );
}
