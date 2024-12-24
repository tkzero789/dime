"use client";

import React from "react";
import BudgetList from "./_components/budget/BudgetList";
import { db } from "@/db/dbConfig";
import { and, desc, eq, getTableColumns, gte, lte, sql } from "drizzle-orm";
import { Budgets, BudgetExpenses } from "@/db/schema";
import { useUser } from "@clerk/nextjs";
import { BudgetDetail } from "@/types/types";
import CreateBudget from "./_components/budget/CreateBudget";
import { BudgetRadicalChart } from "./_components/chart/BudgetRadicalChart";
import { CardSkeleton } from "@/components/ui/card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function BudgetsPage() {
  const { user } = useUser();
  const currentUser = user?.primaryEmailAddress?.emailAddress ?? "";
  const [budgetList, setBudgetList] = React.useState<BudgetDetail[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const currentDate = new Date();
  const monthSelected = currentDate.getUTCMonth();
  const yearSelected = currentDate.getUTCFullYear();

  const [month, setMonth] = React.useState<number>(monthSelected);
  const [year, setYear] = React.useState<number>(yearSelected);

  React.useEffect(() => {
    user && getBudgetList();
  }, [user, month, year]);

  // List of all budgets
  const getBudgetList = async () => {
    setIsLoading(true);
    try {
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
            eq(Budgets.created_by, currentUser),
            eq(Budgets.month, month),
            eq(Budgets.year, year),
          ),
        )
        .groupBy(Budgets.id)
        .orderBy(desc(Budgets.created_at));

      if (result) {
        setBudgetList(result);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const handlePreviousMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <div className="sm:py-18 min-h-dvh w-dvw bg-[#f5f5f5] px-2 pb-20 pt-6 md:w-full md:px-4 xl:px-20">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Budgets List</h2>
        <CreateBudget refreshData={() => getBudgetList()} />
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {isLoading ? (
          <div className="order-last col-span-3 flex items-center justify-center p-6 xl:order-first xl:col-span-2 xl:grid-cols-2">
            <Spinner size={36} />
          </div>
        ) : (
          <BudgetList budgetList={budgetList} />
        )}
        {isLoading ? (
          <CardSkeleton
            title={true}
            titleWidth={100}
            rectangle={2}
            height={12}
            style="col-span-3 xl:col-span-1"
          />
        ) : (
          <BudgetRadicalChart
            budgetList={budgetList}
            handlePreviousMonth={handlePreviousMonth}
            handleNextMonth={handleNextMonth}
            month={month}
            year={year}
          />
        )}
      </div>
    </div>
  );
}
