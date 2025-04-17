import React from "react";
import DashboardBudgetItem from "./DashboardBudgetItem";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getBudgetData } from "@/lib/api/budgets";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { CardSkeleton } from "@/components/ui/card-skeleton";
import { queryKeys } from "@/lib/queryKeys";

export default function DashboardBudget() {
  const date = {
    from: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    to: format(endOfMonth(new Date()), "yyyy-MM-dd"),
  };

  const { data: budgetData, isLoading } = useQuery({
    queryKey: queryKeys.budgets.byDateRange(date.from, date.to),
    queryFn: () =>
      getBudgetData({
        startDate: date.from,
        endDate: date.to,
      }),
  });

  if (isLoading) {
    return (
      <CardSkeleton
        title={true}
        titleWidth={50}
        rectangle={1}
        height={10}
        style="col-span-3 xl:col-span-1"
      />
    );
  }

  return (
    <div className="col-span-3 flex flex-col gap-4 rounded-xl bg-white p-6 shadow-card-shadow xl:col-span-1">
      <h2 className="text-xl font-bold">Budgets</h2>
      <div className="flex h-auto max-h-[489px] flex-1 flex-col gap-2 overflow-y-auto">
        {budgetData?.map((item) => (
          <DashboardBudgetItem key={item.id} budget={item} />
        ))}
      </div>
      <Button asChild variant="outline">
        <Link href="/budgets">View all budgets</Link>
      </Button>
    </div>
  );
}
