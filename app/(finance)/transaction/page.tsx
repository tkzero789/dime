import React from "react";
import { columns, Transaction } from "./table/columns";
import { db } from "@/db/dbConfig";
import { eq, getTableColumns } from "drizzle-orm";
import { budget_expense, income, Recurrence, Single } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { TransactionTable } from "./table/TransactionTable";

async function getData(): Promise<Transaction[]> {
  const user = await currentUser();
  const onlineUser = user?.primaryEmailAddress?.emailAddress ?? "";
  const batchResponse = await db.batch([
    db
      .select({ ...getTableColumns(income) })
      .from(income)
      .where(eq(income.created_by, onlineUser)),
    db
      .select({ ...getTableColumns(budget_expense) })
      .from(budget_expense)
      .where(eq(budget_expense.created_by, onlineUser)),
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
    ...batchResponse[1].map((expense) => ({
      ...expense,
      category: "budget expense",
    })),
    ...batchResponse[2],
    ...batchResponse[3],
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return transactions;
}

export default async function TransactionPage() {
  const data = await getData();
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">Transaction Table</h2>
      <TransactionTable columns={columns} data={data} />
    </div>
  );
}
