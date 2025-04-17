"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import BudgetItem from "@/app/(finance)/budgets/_components/mutations/BudgetItem";
import { ExpenseBarChart } from "@/app/(finance)/budgets/[id]/_components/chart/ExpenseBarChart";
import { BudgetByIdRadialChart } from "@/app/(finance)/budgets/[id]/_components/chart/BudgetByIdRadialChart";
import { CardSkeleton } from "@/components/ui/card-skeleton";
import ExpenseTable from "./_components/table/ExpenseTable";
import BudgetItemNav from "./_components/nav/BudgetItemNav";
import { useQuery } from "@tanstack/react-query";
import { getAccountData } from "@/lib/api/accounts";
import { getBudgetExpenseData } from "@/lib/api/budgets/expenses";
import { getBudgetItemData } from "@/lib/api/budgets";
import { queryKeys } from "@/lib/queryKeys";

type Props = {
  params: {
    id: string;
  };
};

export default function BudgetByIdPage({ params }: Props) {
  const { data: budgetData } = useQuery({
    queryKey: queryKeys.budgets.byId(params.id),
    queryFn: () => getBudgetItemData(params.id),
  });

  const { data: budgetExpenseData, isLoading } = useQuery({
    queryKey: queryKeys.budgetExpenses.byBudgetId(params.id),
    queryFn: () => getBudgetExpenseData(params.id),
  });

  const { data: accountData } = useQuery({
    queryKey: queryKeys.accounts.all(),
    queryFn: getAccountData,
  });

  return (
    <div className="flex flex-col gap-6">
      <BudgetItemNav budgetData={budgetData} accountData={accountData ?? []} />
      <div className="grid grid-cols-3 gap-6">
        <div className="order-last col-span-3 xl:order-first xl:col-span-2 xl:h-full">
          <ExpenseBarChart
            budgetExpenseData={
              Array.isArray(budgetExpenseData) ? budgetExpenseData : []
            }
          />
        </div>
        <div className="col-span-3 xl:col-span-1">
          <BudgetByIdRadialChart budgetData={budgetData} />
          {budgetData ? (
            <div className="lg:hidden">
              <BudgetItem budget={budgetData} />
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
          budgetExpenseData={
            Array.isArray(budgetExpenseData) ? budgetExpenseData : []
          }
          accountData={accountData || []}
        />
      )}
    </div>
  );
}
