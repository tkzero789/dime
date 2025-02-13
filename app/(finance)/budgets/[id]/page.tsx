"use client";

import React from "react";
import { db } from "@/db/dbConfig";
import { Budgets, BudgetExpenses } from "@/db/schema";
import { useUser } from "@clerk/nextjs";
import { and, desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Skeleton } from "@/components/ui/skeleton";
import { BudgetDetail, ExpenseDetail } from "@/types/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditBudget from "@/app/(finance)/budgets/_components/budget/EditBudget";
import BudgetItem from "@/app/(finance)/budgets/_components/budget/BudgetItem";
import AddExpense from "@/app/(finance)/budgets/_components/expense/AddExpense";
import { ExpenseBarChart } from "@/app/(finance)/budgets/_components/chart/ExpenseBarChart";
import { BudgetByIdRadicalChart } from "@/app/(finance)/budgets/_components/chart/BudgetByIdRadicalChart";
import DeleteBudget from "../_components/budget/DeleteBudget";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CircleEllipsis, CirclePlus } from "lucide-react";
import Link from "next/link";
import ExpenseTable from "../_components/expense/ExpenseTable";
import { CardSkeleton } from "@/components/ui/card-skeleton";

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

  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  // All expenses in the budget
  const getExpenseDetail = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await db
        .select()
        .from(BudgetExpenses)
        .where(
          and(
            eq(BudgetExpenses.created_by, currentUser ?? ""),
            eq(BudgetExpenses.budget_id, params.id),
          ),
        )
        .orderBy(desc(BudgetExpenses.date));

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
        ...getTableColumns(Budgets),
        total_spend: sql`sum(${BudgetExpenses.amount})`.mapWith(Number),
        total_item: sql`count(${BudgetExpenses.id})`.mapWith(Number),
        remaining:
          sql`${Budgets.amount} - sum(${BudgetExpenses.amount})`.mapWith(
            Number,
          ),
      })
      .from(Budgets)
      .leftJoin(BudgetExpenses, eq(Budgets.id, BudgetExpenses.budget_id))
      .where(
        and(
          eq(Budgets.created_by, currentUser ?? ""),
          eq(Budgets.id, params.id),
        ),
      )
      .groupBy(Budgets.id);

    if (result) {
      setBudgetInfo(result);
      getExpenseDetail();
    }
  }, [currentUser, getExpenseDetail, params.id]);

  React.useEffect(() => {
    if (user) {
      getBudgetInfo();
    }
  }, [user, getBudgetInfo]);

  return (
    <div className="min-h-dvh w-dvw bg-[#f5f5f5] px-2 pb-20 pt-6 md:w-full md:px-4 2xl:px-20">
      <div className="flex items-center justify-between">
        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href="/budgets"
            className="group flex flex-col items-center justify-center"
          >
            <span className="rounded-md bg-gray-200 group-hover:bg-gray-300">
              <ChevronLeft
                strokeWidth={2}
                className="h-8 w-8"
                color="#555353"
              />
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-4xl">{budgetInfo[0]?.icon}</span>
            <div>
              <h2 className="text-2xl font-bold">{budgetInfo[0]?.name}</h2>
              <span className="font-light text-medium">
                {budgetInfo[0]?.category}
              </span>
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-bold lg:hidden">Budget detail</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="secondary"
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
                refreshData={getBudgetInfo}
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
        <div className="order-last col-span-3 xl:order-first xl:col-span-2 xl:h-full">
          <ExpenseBarChart
            budgetInfo={budgetInfo}
            expenseDetail={expenseDetail}
          />
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
                    <span className="font-semibold text-medium">
                      Add expense
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="flex h-dvh flex-col gap-8 sm:h-auto">
                  <DialogHeader>
                    <DialogTitle className="text-center">
                      Add New Expense
                    </DialogTitle>
                    <DialogDescription className="flex flex-col gap-4 pt-4">
                      <AddExpense
                        paramId={params.id}
                        currentUser={currentUser || "default"}
                        refreshData={() => getBudgetInfo()}
                        setOpen={setOpen}
                      />
                    </DialogDescription>
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
        <div className="hidden xl:flex xl:flex-col xl:gap-4 xl:rounded-lg xl:border xl:bg-white xl:p-6 xl:shadow-md">
          <AddExpense
            paramId={params.id}
            currentUser={currentUser || "default"}
            refreshData={() => getBudgetInfo()}
            setOpen={setOpen}
          />
        </div>
      </div>
    </div>
  );
}
