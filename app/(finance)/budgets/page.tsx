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

export default function BudgetsPage() {
  const { user } = useUser();
  const [budgetList, setBudgetList] = React.useState<BudgetDetail[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    user && getBudgetList();
  }, [user]);

  // List of all budgets
  const getBudgetList = async () => {
    setIsLoading(true);
    try {
      const currentDate = new Date();
      const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );
      const lastDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
      );

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
            eq(
              Budgets.created_by,
              user?.primaryEmailAddress?.emailAddress ?? "",
            ),
            gte(Budgets.created_at, firstDayOfMonth),
            lte(Budgets.created_at, lastDayOfMonth),
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

  return (
    <div className="sm:py-18 min-h-dvh w-dvw bg-[#f5f5f5] px-2 pb-20 pt-6 md:w-full md:px-4 xl:px-20">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Budgets list</h2>
        <CreateBudget refreshData={() => getBudgetList()} />
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {isLoading ? (
          <div className="order-last col-span-3 grid h-fit grid-cols-1 gap-y-2 xl:order-first xl:col-span-2 xl:grid-cols-2 xl:gap-4">
            {Array(6)
              .fill(null)
              .map((_, index) => (
                <Skeleton
                  key={index}
                  className="mt-4 h-28 w-full bg-gray-200"
                />
              ))}
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
          <BudgetRadicalChart budgetList={budgetList} />
        )}
      </div>
    </div>
  );
}
