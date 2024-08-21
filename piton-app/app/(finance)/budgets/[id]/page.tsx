"use client";

import React from "react";
import { db } from "@/db/dbConfig";
import { Budgets, Expenses } from "@/db/schema";
import { useUser } from "@clerk/nextjs";
import { and, desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Skeleton } from "@/components/ui/skeleton";
import { BudgetDetail, ExpenseDetail } from "@/types/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import EditBudget from "@/app/(finance)/budgets/_components/budget/EditBudget";
import BudgetItem from "@/app/(finance)/budgets/_components/budget/BudgetItem";
import AddExpense from "@/app/(finance)/budgets/_components/expense/AddExpense";
import ExpenseList from "@/app/(finance)/budgets/_components/expense/ExpenseList";
import { ExpenseBarChart } from "@/app/(finance)/budgets/_components/chart/ExpenseBarChart";
import { BudgetByIdRadicalChart } from "@/app/(finance)/budgets/_components/chart/BudgetByIdRadicalChart";
import DeleteBudget from "../_components/budget/DeleteBudget";
import { Button } from "@/components/ui/button";
import { CircleEllipsis } from "lucide-react";

type Props = {
  params: {
    id: string;
  };
};

export default function BudgetByIdPage({ params }: Props) {
  const { user } = useUser();
  const currentUser = user?.primaryEmailAddress?.emailAddress;

  const [budgetInfo, setBudgetInfo] = React.useState<BudgetDetail[]>([]);
  const [expenseDetail, setExpenseDetail] = React.useState<ExpenseDetail[]>([]);

  React.useEffect(() => {
    user && getBudgetInfo();
  }, [user]);

  // Budget info
  const getBudgetInfo = async () => {
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
        remaining: sql`${Budgets.amount} - sum(${Expenses.amount})`.mapWith(
          Number,
        ),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(
        and(
          eq(Budgets.createdBy, currentUser ?? ""),
          eq(Budgets.id, params.id),
        ),
      )
      .groupBy(Budgets.id);

    if (result) {
      setBudgetInfo(result);
      getExpenseDetail();
    }
  };

  // All expenses in the budget
  const getExpenseDetail = async () => {
    const result = await db
      .select()
      .from(Expenses)
      .where(
        and(
          eq(Expenses.createdBy, currentUser ?? ""),
          eq(Expenses.budgetId, params.id),
        ),
      )
      .orderBy(desc(Expenses.date));

    setExpenseDetail(result);
  };

  return (
    <div className="min-h-dvh bg-[#f5f5f5] px-4 py-6 sm:px-14 sm:py-16">
      <div className="flex items-center justify-between">
        <div className="hidden lg:block">
          <h2 className="text-2xl font-bold">
            {budgetInfo[0]?.icon} {budgetInfo[0]?.name}
          </h2>
          <span className="font-light text-medium">
            {budgetInfo[0]?.category}
          </span>
        </div>
        <h2 className="text-2xl font-bold lg:hidden">Budget detail</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="group flex items-center justify-center gap-2"
            >
              <CircleEllipsis
                strokeWidth={1.75}
                className="rounded-full group-hover:bg-teal-700 group-hover:stroke-white"
              />
              <span className="font-bold group-hover:text-teal-700">
                Manage budget
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex w-44 flex-col px-0 py-0">
            <div className="p-1">
              <EditBudget
                budgetInfo={budgetInfo}
                currentUser={currentUser || "default"}
                refreshData={() => getBudgetInfo()}
              />
              <DeleteBudget
                currentUser={currentUser || "default"}
                paramsId={params.id}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="order-last col-span-3 lg:order-first xl:col-span-2">
          <ExpenseBarChart expenseDetail={expenseDetail} />
        </div>
        <div className="col-span-3 xl:col-span-1">
          <BudgetByIdRadicalChart budget={budgetInfo} />

          {budgetInfo.length > 0 ? (
            <div className="lg:hidden">
              <BudgetItem budget={budgetInfo[0]} />
            </div>
          ) : (
            <Skeleton className="h-28 bg-gray-200 lg:hidden" />
          )}
        </div>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-4">
        <ExpenseList
          expenseDetail={expenseDetail}
          currentUser={currentUser || "default"}
          refreshData={() => getBudgetInfo()}
        />
        <div className="hidden xl:block">
          <AddExpense
            paramId={params.id}
            currentUser={currentUser || "default"}
            refreshData={() => getBudgetInfo()}
          />
        </div>
      </div>
    </div>
  );
}
