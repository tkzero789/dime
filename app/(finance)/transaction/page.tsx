import React from "react";
import { columns, Transaction } from "./table/columns";
import { db } from "@/db/dbConfig";
import { eq, getTableColumns } from "drizzle-orm";
import { BudgetExpenses, Income, Recurrence, Single } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { BatchResponse } from "drizzle-orm/batch";
import { TransactionTable } from "./table/TransactionTable";

async function getData(): Promise<Transaction[]> {
  const user = await currentUser();
  const onlineUser = user?.primaryEmailAddress?.emailAddress ?? "";
  const batchResponse: BatchResponse<any> = await db.batch([
    db
      .select({ ...getTableColumns(Income) })
      .from(Income)
      .where(eq(Income.created_by, onlineUser)),
    db
      .select({ ...getTableColumns(BudgetExpenses) })
      .from(BudgetExpenses)
      .where(eq(BudgetExpenses.created_by, onlineUser)),
    db
      .select({ ...getTableColumns(Recurrence) })
      .from(Recurrence)
      .where(eq(Recurrence.created_by, onlineUser)),
    db
      .select({ ...getTableColumns(Single) })
      .from(Single)
      .where(eq(Single.created_by, onlineUser)),
  ]);

  const transactions = [
    ...batchResponse[0],
    ...batchResponse[1],
    ...batchResponse[2],
    ...batchResponse[3],
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return transactions;
}

export default async function TransactionPage() {
  const data = await getData();
  return (
    <div className="sm:py-18 min-h-dvh w-dvw bg-[#f5f5f5] px-2 pb-20 pt-6 md:w-full md:px-4 xl:px-20">
      <h2 className="text-2xl font-bold">Transaction Table</h2>
      <TransactionTable columns={columns} data={data} />
    </div>
  );
}
