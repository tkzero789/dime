"use client";

import React from "react";
import BudgetList from "./_components/budget/BudgetList";
import { BudgetRadialChart } from "./_components/chart/BudgetRadialChart";
import { endOfMonth, startOfMonth } from "date-fns";
import { LoaderCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getBudgetData } from "@/lib/api/budgets";
import { format } from "date-fns";
import BudgetsNav from "./_components/nav/BudgetsNav";

type Props = {
  searchParams: {
    startDate: string;
    endDate: string;
  };
};

export default function BudgetsPage({ searchParams }: Props) {
  const firstOfMonth = startOfMonth(new Date());
  const lastOfMonth = endOfMonth(new Date());
  const [date, setDate] = React.useState(() => {
    if (searchParams.startDate && searchParams.endDate) {
      return {
        from: searchParams.startDate,
        to: searchParams.endDate,
      };
    }
    return {
      from: format(firstOfMonth, "yyyy-MM-dd"),
      to: format(lastOfMonth, "yyyy-MM-dd"),
    };
  });

  const { data: budgetData, isLoading } = useQuery({
    queryKey: ["budgets", date.from, date.to],
    queryFn: () =>
      getBudgetData({
        startDate: date.from,
        endDate: date.to,
      }),
  });

  return (
    <div className="grid gap-6">
      <BudgetsNav date={date} setDate={setDate} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {isLoading ? (
          <div className="order-last col-span-3 flex items-center justify-center p-6 xl:order-first xl:col-span-2 xl:grid-cols-2">
            <LoaderCircle className="animate-spin text-primary" />
          </div>
        ) : (
          <BudgetList budgetData={budgetData || []} />
        )}
        <BudgetRadialChart date={date.from} budgetData={budgetData || []} />
      </div>
    </div>
  );
}
