"use client";

import { db } from "@/db/dbConfig";
import { BudgetExpenses } from "@/db/schema";
import { ExpenseDetail } from "@/types/types";
import FormatDate from "@/utils/formatDate";
import FormatNumber from "@/utils/formatNumber";
import FormatString from "@/utils/formatString";
import GetCurrentMonth from "@/utils/getCurrentMonth";
import { useUser } from "@clerk/nextjs";
import { and, desc, eq, getTableColumns } from "drizzle-orm";
import React from "react";

export default function AllTransaction() {
  const { user } = useUser();
  const [expense, setExpense] = React.useState<ExpenseDetail[]>([]);

  React.useEffect(() => {
    user && getAllExpenses();
  }, [user]);

  const getAllExpenses = async () => {
    const result = await db
      .select({ ...getTableColumns(BudgetExpenses) })
      .from(BudgetExpenses)
      .where(
        eq(
          BudgetExpenses.created_by,
          user?.primaryEmailAddress?.emailAddress ?? "",
        ),
      )
      .orderBy(desc(BudgetExpenses.date));
    if (result) {
      console.log(result);
      setExpense(result);
    }
  };

  return (
    <div className="mt-8 h-fit w-full flex-1 rounded-lg border bg-white p-4 shadow-md">
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-xl font-bold">Latest transactions</h2>
      </div>

      <div className="grid grid-cols-[90px_1fr_180px_120px_80px_60px] gap-2 rounded-lg bg-neutral-200 py-2 text-sm font-semibold text-medium">
        <div className="text-center">Date</div>
        <div className="pl-4">Name</div>
        <div className="text-start">Method</div>
        <div className="text-end">Amount</div>
      </div>
      {expense?.map((item) => (
        <div
          key={item.id}
          className="grid grid-cols-[90px_1fr_180px_120px_80px_60px] gap-2 rounded-md border-b py-2 pt-2 text-sm font-medium"
        >
          <div className="text-center">
            <FormatDate numMonthNumDateUTC={new Date(item.date)} />
          </div>
          <div className="pl-4">{item.name}</div>
          <div className="text-start">
            <FormatString text={item.payment_method} />
          </div>
          <div className="text-end">
            <FormatNumber number={Number(item.amount)} />
          </div>
        </div>
      ))}
    </div>
  );
}
