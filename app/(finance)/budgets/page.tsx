"use client";

import React from "react";
import BudgetList from "./_components/budget/BudgetList";
import { BudgetRadialChart } from "./_components/chart/BudgetRadialChart";
import {
  addMonths,
  endOfMonth,
  startOfDay,
  startOfMonth,
  subMonths,
} from "date-fns";
import { LoaderCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getBudgetData } from "@/lib/api/budgets";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { convertToLocalDate } from "@/utils/convertToLocalDate";
import BudgetsNav from "./_components/nav/BudgetsNav";

type Props = {
  searchParams: {
    startDate: string;
    endDate: string;
  };
};

export default function BudgetsPage({ searchParams }: Props) {
  const router = useRouter();
  const firstOfMonth = startOfDay(startOfMonth(new Date()));
  const lastOfMonth = startOfDay(endOfMonth(new Date()));
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

  const handlePreviousMonth = () => {
    const dateObject = convertToLocalDate(date.from);
    const previousMonth = subMonths(dateObject, 1);
    setDate({
      from: format(startOfDay(startOfMonth(previousMonth)), "yyyy-MM-dd"),
      to: format(startOfDay(endOfMonth(previousMonth)), "yyyy-MM-dd"),
    });
    router.replace(
      `/budgets?startDate=${format(startOfDay(startOfMonth(previousMonth)), "yyyy-MM-dd")}&endDate=${format(startOfDay(endOfMonth(previousMonth)), "yyyy-MM-dd")}`,
    );
  };

  const handleNextMonth = () => {
    const dateObject = convertToLocalDate(date.from);
    const nextMonth = addMonths(dateObject, 1);
    setDate({
      from: format(startOfDay(startOfMonth(nextMonth)), "yyyy-MM-dd"),
      to: format(startOfDay(endOfMonth(nextMonth)), "yyyy-MM-dd"),
    });
    router.replace(
      `/budgets?startDate=${format(startOfDay(startOfMonth(nextMonth)), "yyyy-MM-dd")}&endDate=${format(startOfDay(endOfMonth(nextMonth)), "yyyy-MM-dd")}`,
    );
  };

  return (
    <div className="grid gap-6">
      <BudgetsNav />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {isLoading ? (
          <div className="order-last col-span-3 flex items-center justify-center p-6 xl:order-first xl:col-span-2 xl:grid-cols-2">
            <LoaderCircle className="animate-spin text-primary" />
          </div>
        ) : (
          <BudgetList budgetData={budgetData || []} />
        )}
        <BudgetRadialChart
          date={date.from}
          budgetData={budgetData || []}
          handlePreviousMonth={handlePreviousMonth}
          handleNextMonth={handleNextMonth}
        />
      </div>
    </div>
  );
}
