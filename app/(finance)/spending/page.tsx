"use client";

import React from "react";
import { SpendingBarChart } from "./_components/chart/SpendingBarChart";
import { useUser } from "@clerk/nextjs";
import {
  ExpenseDetailWithCategory,
  IncomeDetail,
  RecurrenceDetail,
  SingleDetail,
} from "@/types";
import { db } from "@/db/dbConfig";
import { eq, getTableColumns } from "drizzle-orm";
import { BudgetExpenses, Income, Recurrence, Single } from "@/db/schema";
import { SpendingPieChart } from "./_components/chart/SpendingPieChart";

export default function SpendingPage() {
  const { user } = useUser();
  const currentUser = user?.primaryEmailAddress?.emailAddress;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [incomeData, setIncomeData] = React.useState<IncomeDetail[]>([]);
  const [spendingData, setSpendingData] = React.useState<
    (ExpenseDetailWithCategory | RecurrenceDetail | SingleDetail)[]
  >([]);
  const [finalData, setFinalData] = React.useState<
    { month: string; income: number; spending: number }[]
  >([]);

  const calculate = React.useCallback(
    (
      incomeData: IncomeDetail[],
      spendingData: (
        | ExpenseDetailWithCategory
        | RecurrenceDetail
        | SingleDetail
      )[],
    ) => {
      const incomeByMonth = groupByMonth(incomeData);
      const spendingByMonth = groupByMonth(spendingData);

      const allMonths = new Set([
        ...Object.keys(incomeByMonth),
        ...Object.keys(spendingByMonth),
      ]);

      const finalData = Array.from(allMonths).map((month) => ({
        month,
        income: incomeByMonth[month]
          ? incomeByMonth[month].reduce((acc, curr) => acc + curr.amount, 0)
          : 0,
        spending: spendingByMonth[month]
          ? spendingByMonth[month].reduce((acc, curr) => acc + curr.amount, 0)
          : 0,
      }));

      setFinalData(finalData);
    },
    [],
  );

  const getData = React.useCallback(async () => {
    try {
      const batchResponse = await db.batch([
        db
          .select({ ...getTableColumns(Income) })
          .from(Income)
          .where(eq(Income.created_by, currentUser ?? "")),
        db
          .select({
            ...getTableColumns(BudgetExpenses),
          })
          .from(BudgetExpenses)
          .where(eq(BudgetExpenses.created_by, currentUser ?? "")),
        db
          .select({ ...getTableColumns(Recurrence) })
          .from(Recurrence)
          .where(eq(Recurrence.created_by, currentUser ?? "")),
        db
          .select({ ...getTableColumns(Single) })
          .from(Single)
          .where(eq(Single.created_by, currentUser ?? "")),
      ]);

      if (batchResponse) {
        // eslint-disable-next-line prefer-const
        let [incomeResult, expenseResult, recurringResult, singleResult] =
          batchResponse;

        setIncomeData(incomeResult);

        // Add category property to each row in expenseResult
        expenseResult = expenseResult.map((row) => ({
          ...row,
          category: "Budget Expense",
        }));

        const totalSpending: (
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
        ];
        setSpendingData(totalSpending);

        // Calculate spending
        calculate(incomeResult, totalSpending);
      }
    } catch (error) {
      console.log(error);
    }
  }, [currentUser, calculate]);

  React.useEffect(() => {
    if (user) {
      getData();
    }
  }, [user, getData]);

  const groupByMonth = (data: { date: string; amount: string }[]) => {
    return data.reduce(
      (acc, curr) => {
        const month = new Date(curr.date).toLocaleString("default", {
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        });
        if (!acc[month]) {
          acc[month] = [];
        }
        acc[month].push({
          ...curr,
          amount: Number(curr.amount),
        });
        return acc;
      },
      {} as { [key: string]: { date: string; amount: number }[] },
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Spending</h2>
      <SpendingBarChart finalData={finalData} />
      <SpendingPieChart spendingData={spendingData} />
    </div>
  );
}
