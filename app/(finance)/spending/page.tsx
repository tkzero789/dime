"use client";

import React from "react";
import { SpendingBarChart } from "./_components/chart/SpendingBarChart";
import { useUser } from "@clerk/nextjs";
import {
  ExpenseDetail,
  IncomeDetail,
  RecurrenceDetail,
  SingleDetail,
} from "@/types/types";
import { BatchResponse } from "drizzle-orm/batch";
import { db } from "@/db/dbConfig";
import { eq, getTableColumns } from "drizzle-orm";
import { BudgetExpenses, Income, Recurrence, Single } from "@/db/schema";
import { SpendingPieChart } from "./_components/chart/SpendingPieChart";
import { SpendingMethodPieChart } from "./_components/chart/SpendingMethodPieChart";

type NewExpenseDetail = ExpenseDetail & {
  category: string;
};

export default function SpendingPage() {
  const { user } = useUser();
  const currentUser = user?.primaryEmailAddress?.emailAddress;

  const [incomeData, setIncomeData] = React.useState<IncomeDetail[]>([]);
  const [spendingData, setSpendingData] = React.useState<
    (NewExpenseDetail | RecurrenceDetail | SingleDetail)[]
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
        let [incomeResult, expenseResult, recurringResult, singleResult] =
          batchResponse;

        setIncomeData(incomeResult);

        // Add category property to each row in expenseResult
        expenseResult = expenseResult.map((row: NewExpenseDetail) => ({
          ...row,
          category: "Budget Expense",
        }));

        const totalSpending = [
          ...expenseResult,
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
  }, [currentUser]);

  const calculate = (
    incomeData: IncomeDetail[],
    spendingData: (NewExpenseDetail | RecurrenceDetail | SingleDetail)[],
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
  };

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
    <div className="sm:py-18 min-h-dvh w-dvw bg-[#f5f5f5] px-2 pb-20 pt-6 md:w-full md:px-4 xl:px-20">
      <h2 className="text-2xl font-bold">Spending</h2>
      <SpendingBarChart finalData={finalData} />
      <SpendingPieChart spendingData={spendingData} />
    </div>
  );
}
