"use client";

import React from "react";
import TransactionSearch from "./_components/search/TransactionSearch";
import AllTransactionList from "./_components/list/AllTransactionList";
import { useUser } from "@clerk/nextjs";
import { BudgetExpenses, Income, Recurrence } from "@/db/schema";
import { desc, eq, getTableColumns } from "drizzle-orm";
import { db } from "@/db/dbConfig";
import { ExpenseDetail, IncomeDetail, RecurrenceDetail } from "@/types/types";
import { BatchResponse } from "drizzle-orm/batch";

export default function TransactionPage() {
  const { user } = useUser();
  const currentUser = user?.primaryEmailAddress?.emailAddress;

  const [transaction, setTransaction] = React.useState<
    (ExpenseDetail | IncomeDetail | RecurrenceDetail)[]
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

        const combinedResults = [
          ...expenseResult,
          ...incomeResult,
          ...recurringResult,
        ].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        setTransaction(combinedResults);
      }
    } catch (error) {
      console.log(error);
    }
  }, [currentUser]);

  return (
    <div className="min-h-dvh bg-[#f5f5f5] px-4 py-6 sm:px-20 sm:py-16">
      <h2 className="text-2xl font-bold">Transaction</h2>
      <div className="mx-auto mt-8 max-w-7xl">
        <TransactionSearch />
        <AllTransactionList transaction={transaction} />
      </div>
    </div>
  );
}
