"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getBudgetData } from "@/lib/api/budgets";
import { getTransactionData } from "@/lib/api/transactions";
import { queryKeys } from "@/lib/queryKeys";
import { CardSkeleton } from "@/components/ui/card-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import BudgetDetailNav from "../_components/nav/BudgetDetailNav";
import BudgetSpendingChart from "../_components/chart/BudgetSpendingChart";
import TransactionsTable from "../../transactions/_components/table/TransactionsTable";
import { TransactionsTableColumns } from "../../transactions/_components/table/TransactionsTableColumn";
import { FormatString } from "@/lib/utils";
import { format, parseISO } from "date-fns";

type Props = {
  params: {
    id: string;
  };
};

export default function BudgetDetailPage({ params }: Props) {
  const budgetId = params.id;

  // Fetch all budgets
  const { data: budgets, isLoading: isBudgetsLoading } = useQuery({
    queryKey: queryKeys.budgets.all(),
    queryFn: () => getBudgetData(),
  });

  // Find the specific budget
  const budget = React.useMemo(
    () => budgets?.find((b) => b.id === budgetId),
    [budgets, budgetId],
  );

  // Fetch transactions for budget's date range
  const { data: transactions, isLoading: isTransactionsLoading } = useQuery({
    queryKey: [
      "budget-transactions",
      budget?.id,
      budget?.start_date,
      budget?.end_date,
    ],
    queryFn: () =>
      getTransactionData({
        startDate: budget!.start_date,
        endDate: budget!.end_date || new Date().toISOString().split("T")[0],
      }),
    enabled: !!budget,
  });

  // Filter transactions by budget's category and type
  const budgetTransactions = React.useMemo(() => {
    if (!transactions || !budget) return [];
    return transactions.filter(
      (t) => t.type === "expense" && t.category.value === budget.category,
    );
  }, [transactions, budget]);

  const isLoading = isBudgetsLoading || isTransactionsLoading;

  // Budget not found
  if (!isLoading && !budget) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <Card className="p-8 text-center">
          <h2 className="mb-2 text-2xl font-bold">Budget Not Found</h2>
          <p className="mb-6 text-muted-foreground">
            The budget you&apos;re looking for doesn&apos;t exist or has been
            deleted.
          </p>
          <Link href="/budgets">
            <Button>
              <ArrowLeft className="mr-2 size-4" />
              Back to Budgets
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <>
      {budget && <BudgetDetailNav budget={budget} />}
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 lg:grid-cols-3">
          {budget && (
            <Card className="col-span-full lg:col-span-1">
              <CardHeader>
                <CardTitle>Detail</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-1 flex-col text-sm">
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-secondary-foreground">Period:</span>
                    <span className="font-bold">
                      <FormatString text={budget.period} />
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t py-2">
                    <span className="text-secondary-foreground">Duration:</span>
                    <span className="font-bold">
                      {format(parseISO(budget.start_date), "MMM d")}
                      {budget.end_date &&
                        ` - ${format(parseISO(budget.end_date), "MMM d")}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t py-2">
                    <span className="text-secondary-foreground">Budget:</span>
                    <span className="font-bold">
                      ${parseFloat(budget.amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t py-2">
                    <span className="text-secondary-foreground">Spent:</span>
                    <span className="font-bold">
                      ${parseFloat(budget.total_spent)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t pt-2">
                    <span className="text-secondary-foreground">
                      Remaining:
                    </span>
                    <span className="font-bold">
                      ${parseFloat(budget.remaining)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Spending Chart*/}
          {isLoading ? (
            <CardSkeleton
              title={true}
              titleWidth={20}
              rectangle={1}
              height={16}
              style="w-full"
            />
          ) : (
            budget && (
              <BudgetSpendingChart
                budget={budget}
                budgetTransactions={budgetTransactions}
              />
            )
          )}
        </div>

        {isLoading ? (
          <CardSkeleton
            title={true}
            titleWidth={20}
            rectangle={1}
            height={16}
          />
        ) : (
          <TransactionsTable
            data={budgetTransactions}
            columns={TransactionsTableColumns}
          />
        )}
      </div>
    </>
  );
}
