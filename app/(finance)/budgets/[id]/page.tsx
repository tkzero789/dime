"use client";

import React from "react";
import { db } from "@/db/dbConfig";
import { budget, budget_expense } from "@/db/schema";
import { useUser } from "@clerk/nextjs";
import { and, desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Skeleton } from "@/components/ui/skeleton";
import { BudgetData, BudgetExpenseData } from "@/types";
import BudgetItem from "@/app/(finance)/budgets/_components/mutations/BudgetItem";
import { ExpenseBarChart } from "@/app/(finance)/budgets/[id]/_components/chart/ExpenseBarChart";
import { BudgetByIdRadialChart } from "@/app/(finance)/budgets/[id]/_components/chart/BudgetByIdRadialChart";
import { CardSkeleton } from "@/components/ui/card-skeleton";
import ExpenseTable from "./_components/table/ExpenseTable";
import BudgetItemNav from "./_components/nav/BudgetItemNav";
import { useQuery } from "@tanstack/react-query";
import { getAccountData } from "@/lib/api/accounts";

type Props = {
  params: {
    id: string;
  };
};

export default function BudgetByIdPage({ params }: Props) {
  const { user } = useUser();
  const currentUser = user?.primaryEmailAddress?.emailAddress;

  const [budgetData, setBudgetData] = React.useState<BudgetData[]>([]);
  const [expenseDetail, setExpenseDetail] = React.useState<BudgetExpenseData[]>(
    [],
  );

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

  const { data: accountData } = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccountData,
  });

  return (
    <div className="flex flex-col gap-6">
      <BudgetItemNav budgetData={budgetData} accountData={accountData || []} />
      <div className="grid grid-cols-3 gap-6">
        <div className="order-last col-span-3 xl:order-first xl:col-span-2 xl:h-full">
          <ExpenseBarChart expenseDetail={expenseDetail} />
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
      {isLoading ? (
        <CardSkeleton
          rectangle={1}
          height={10}
          style="col-span-3 lg:col-span-3 xl:col-span-2 h-fit"
        />
      ) : (
        <ExpenseTable
          expenseDetail={expenseDetail}
          currentUser={currentUser || "default"}
          refreshData={() => getBudgetInfo()}
          accountData={accountData || []}
        />
      )}
    </div>
  );
}
