"use client";

import React from "react";
import { SpendingBarChart } from "./_components/chart/SpendingBarChart";
import { useUser } from "@clerk/nextjs";
import { ExpenseDetail, IncomeDetail, RecurrenceDetail } from "@/types/types";
import { BatchResponse } from "drizzle-orm/batch";
import { db } from "@/db/dbConfig";
import { eq, getTableColumns } from "drizzle-orm";
import { BudgetExpenses, Income, Recurrence } from "@/db/schema";

export default function SpendingPage() {
  const { user } = useUser();
  const currentUser = user?.primaryEmailAddress?.emailAddress;

  const [incomeData, setIncomeData] = React.useState<IncomeDetail[]>([]);
  const [spendingData, setSpendingData] = React.useState<
    (ExpenseDetail | RecurrenceDetail)[]
  >([]);
  const [finalData, setFinalData] = React.useState<
    { month: string; income: number; spending: number }[]
  >([]);

  React.useEffect(() => {
    user && getData();
  }, [user]);

  const getData = React.useCallback(async () => {
    try {
      const batchResponse: BatchResponse<any> = await db.batch([
        db
          .select({
            ...getTableColumns(BudgetExpenses),
          })
          .from(BudgetExpenses)
          .where(eq(BudgetExpenses.created_by, currentUser ?? "")),
        db
          .select({ ...getTableColumns(Income) })
          .from(Income)
          .where(eq(Income.created_by, currentUser ?? "")),
        db
          .select({ ...getTableColumns(Recurrence) })
          .from(Recurrence)
          .where(eq(Recurrence.created_by, currentUser ?? "")),
      ]);

      if (batchResponse) {
        let [expenseResult, incomeResult, recurringResult] = batchResponse;
        // Add category property to each row in expenseResult
        expenseResult = expenseResult.map((row: ExpenseDetail) => ({
          ...row,
          category: "Budget Expense",
        }));

        setIncomeData(incomeResult);

        const totalSpending = [...expenseResult, ...recurringResult];
        setSpendingData(totalSpending);

        // Call calculate after setting data
        calculate(incomeResult, totalSpending);
      }
    } catch (error) {
      console.log(error);
    }
  }, [currentUser]);

  const calculate = (
    incomeData: IncomeDetail[],
    spendingData: (ExpenseDetail | RecurrenceDetail)[],
  ) => {
    const incomeByMonth = groupByMonth(incomeData);
    const spendingByMonth = groupByMonth(spendingData);

    const finalData = Object.keys(incomeByMonth).map((month) => ({
      month,
      income: incomeByMonth[month]
        ? incomeByMonth[month].reduce((acc, curr) => acc + curr.amount, 0)
        : 0,
      spending: spendingByMonth[month]
        ? spendingByMonth[month].reduce((acc, curr) => acc + curr.amount, 0)
        : 0,
    }));

    setFinalData(finalData);
  };

  const groupByMonth = (data: { date: string; amount: string }[]) => {
    return data.reduce(
      (acc, curr) => {
        const month = new Date(curr.date).toLocaleString("default", {
          month: "long",
          year: "numeric",
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

  console.log(finalData);

  return (
    <div className="min-h-dvh bg-[#f5f5f5] px-4 py-6 sm:px-20 sm:py-16">
      <h2 className="text-2xl font-bold">Spending</h2>
      <SpendingBarChart />
    </div>
  );
}
