"use client";

import React from "react";
import BudgetList from "./_components/budget/BudgetList";
import { db } from "@/db/dbConfig";
import { and, desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, BudgetExpenses } from "@/db/schema";
import { useUser } from "@clerk/nextjs";
import { BudgetDetail } from "@/types/types";
import { BudgetRadialChart } from "./_components/chart/BudgetRadialChart";
import { CardSkeleton } from "@/components/ui/card-skeleton";
import { Spinner } from "@/components/ui/spinner";
import BudgetNav from "./_components/nav/BudgetNav";

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

  const getBudgetList = React.useCallback(async () => {
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
  }, [currentUser, month, year]);

  React.useEffect(() => {
    if (user) {
      getBudgetList();
    }
  }, [user, getBudgetList]);

  // List of all budgets

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
    <div className="grid gap-6">
      <BudgetNav refreshData={() => getBudgetList()} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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
          <BudgetRadialChart
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
