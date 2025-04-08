"use client";

import React from "react";
import { db } from "@/db/dbConfig";
import { budget, budget_expense } from "@/db/schema";
import { useUser } from "@clerk/nextjs";
import { and, desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Skeleton } from "@/components/ui/skeleton";
import { BudgetData, ExpenseData } from "@/types";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import BudgetItem from "@/app/(finance)/budgets/_components/budget/BudgetItem";

import { ExpenseBarChart } from "@/app/(finance)/budgets/_components/chart/ExpenseBarChart";
import { BudgetByIdRadialChart } from "@/app/(finance)/budgets/_components/chart/BudgetByIdRadialChart";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { CardSkeleton } from "@/components/ui/card-skeleton";
import ExpenseTable from "./components/ExpenseTable";
import BudgetItemNav from "./components/BudgetItemNav";

type Props = {
  params: {
    id: string;
  };
};

export default function BudgetByIdPage({ params }: Props) {
  const { user } = useUser();
  const currentUser = user?.primaryEmailAddress?.emailAddress;

  const [budgetData, setBudgetData] = React.useState<BudgetData[]>([]);
  const [expenseDetail, setExpenseDetail] = React.useState<ExpenseData[]>([]);

  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  // All expenses in the budget
  const getExpenseDetail = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await db
        .select()
        .from(budget_expense)
        .where(
          and(
            eq(budget_expense.created_by, currentUser ?? ""),
            eq(budget_expense.budget_id, params.id),
          ),
        )
        .orderBy(desc(budget_expense.date));

      setExpenseDetail(result);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }, [currentUser, params.id]);

  // Budget info
  const getBudgetInfo = React.useCallback(async () => {
    const result = await db
      .select({
        ...getTableColumns(budget),
        total_spend: sql`sum(${budget_expense.amount})`.mapWith(Number),
        total_item: sql`count(${budget_expense.id})`.mapWith(Number),
        remaining:
          sql`${budget.amount} - sum(${budget_expense.amount})`.mapWith(Number),
      })
      .from(budget)
      .leftJoin(budget_expense, eq(budget.id, budget_expense.budget_id))
      .where(
        and(eq(budget.created_by, currentUser ?? ""), eq(budget.id, params.id)),
      )
      .groupBy(budget.id);

    if (result) {
      setBudgetData(result);
      getExpenseDetail();
    }
  }, [currentUser, getExpenseDetail, params.id]);

  React.useEffect(() => {
    if (user) {
      getBudgetInfo();
    }
  }, [user, getBudgetInfo]);

  return (
    <div>
      <BudgetItemNav
        paramsId={params.id}
        budgetData={budgetData}
        currentUser={currentUser || "default"}
        refreshData={getBudgetInfo}
      />
      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="order-last col-span-3 xl:order-first xl:col-span-2 xl:h-full">
          <ExpenseBarChart
            budgetInfo={budgetData}
            expenseDetail={expenseDetail}
          />
        </div>
        <div className="col-span-3 xl:col-span-1">
          <BudgetByIdRadialChart budget={budgetData} />

          {budgetData.length > 0 ? (
            <div className="lg:hidden">
              <BudgetItem budget={budgetData[0]} />
            </div>
          ) : (
            <Skeleton className="h-28 bg-gray-200 lg:hidden" />
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 xl:mt-8">
        {isLoading ? (
          <CardSkeleton
            rectangle={1}
            height={10}
            style="col-span-3 lg:col-span-3 xl:col-span-2 h-fit"
          />
        ) : (
          <div className="col-span-3 h-fit rounded-lg border bg-white p-6 shadow-md lg:col-span-3 xl:col-span-2">
            <div className="flex items-center justify-between pb-4 xl:hidden">
              <h2 className="text-xl font-bold">Expense list</h2>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2"
                  >
                    <CirclePlus strokeWidth={1.75} color="#555353" />
                    <span className="font-semibold text-secondary-foreground">
                      Add expense
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="flex h-dvh flex-col gap-8 sm:h-auto">
                  <DialogHeader>
                    <DialogTitle className="text-center">
                      Add New Expense
                    </DialogTitle>
                    <DialogDescription className="flex flex-col gap-4 pt-4"></DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
            <ExpenseTable
              expenseDetail={expenseDetail}
              currentUser={currentUser || "default"}
              refreshData={() => getBudgetInfo()}
            />
          </div>
        )}
      </div>
    </div>
  );
}
