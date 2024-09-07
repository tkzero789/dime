"use client";

import React from "react";
import TransactionSearch from "./_components/search/TransactionSearch";
import AllTransactionList from "./_components/list/AllTransactionList";
import { useUser } from "@clerk/nextjs";
import { BudgetExpenses, Income, Recurrence, Single } from "@/db/schema";
import { eq, getTableColumns } from "drizzle-orm";
import { db } from "@/db/dbConfig";
import {
  ExpenseDetail,
  IncomeDetail,
  RecurrenceDetail,
  SingleDetail,
} from "@/types/types";
import { BatchResponse } from "drizzle-orm/batch";

type NewExpenseDetail = ExpenseDetail & {
  category: string;
  type: string;
};

type NewIncomeDetail = IncomeDetail & {
  type: string;
};

type NewRecurrenceDetail = RecurrenceDetail & {
  type: string;
};

type NewSingleDetail = SingleDetail & {
  type: string;
};

export default function TransactionPage() {
  const { user } = useUser();
  const currentUser = user?.primaryEmailAddress?.emailAddress;

  const [transaction, setTransaction] = React.useState<
    (
      | NewExpenseDetail
      | NewIncomeDetail
      | NewRecurrenceDetail
      | NewSingleDetail
    )[]
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
        db
          .select({ ...getTableColumns(Single) })
          .from(Single)
          .where(eq(Single.created_by, currentUser ?? "")),
      ]);

      if (batchResponse) {
        let [expenseResult, incomeResult, recurringResult, singleResult] =
          batchResponse;
        // Add category prop to each row in expenseResult
        expenseResult = expenseResult.map((row: ExpenseDetail) => ({
          ...row,
          category: "Budget Expense",
          type: "Budget Expense",
        })) as NewExpenseDetail[];
        // Add type prop to each row in incomeResull, recurringResult and single
        incomeResult = incomeResult.map((row: IncomeDetail) => ({
          ...row,
          type: "Income",
        })) as NewIncomeDetail[];
        recurringResult = recurringResult.map((row: RecurrenceDetail) => ({
          ...row,
          type: "Recurring",
        })) as NewRecurrenceDetail[];
        singleResult = singleResult.map((row: SingleDetail) => ({
          ...row,
          type: "Single",
        })) as NewSingleDetail;

        const combinedResults = [
          ...expenseResult,
          ...incomeResult,
          ...recurringResult,
          ...singleResult,
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
        <AllTransactionList transaction={transaction} refreshData={getData} />
      </div>
    </div>
  );
}
