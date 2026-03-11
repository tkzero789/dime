"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getBudgetData } from "@/lib/api/budgets";
import { queryKeys } from "@/lib/queryKeys";
import { LoaderCircle } from "lucide-react";
import BudgetItem from "./list/BudgetItem";
import BudgetsNav from "./nav/BudgetsNav";

type Props = {
  searchParams: {
    startDate: string;
    endDate: string;
  };
};

function getMonthDateRange(month: number, year: number) {
  const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month + 1, 0).getDate();
  const endDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  return { startDate, endDate };
}

export default function BudgetsContent({ searchParams }: Props) {
  const router = useRouter();

  const [currentMonth, setCurrentMonth] = React.useState<number>(() => {
    if (searchParams.startDate) {
      return new Date(searchParams.startDate).getUTCMonth();
    }
    return new Date().getMonth();
  });

  const [currentYear, setCurrentYear] = React.useState<number>(() => {
    if (searchParams.startDate) {
      return new Date(searchParams.startDate).getUTCFullYear();
    }
    return new Date().getFullYear();
  });

  const { startDate, endDate } = getMonthDateRange(currentMonth, currentYear);

  const { data: budgets, isLoading } = useQuery({
    queryKey: queryKeys.budgets.byDateRange(startDate, endDate),
    queryFn: () => getBudgetData({ startDate, endDate }),
  });

  const handleMonthChange = (month: number, year: number) => {
    setCurrentMonth(month);
    setCurrentYear(year);
    const { startDate: newStart, endDate: newEnd } = getMonthDateRange(
      month,
      year,
    );
    router.replace(`/budgets?startDate=${newStart}&endDate=${newEnd}`);
  };

  if (isLoading) {
    return (
      <>
        <BudgetsNav
          currentMonth={currentMonth}
          currentYear={currentYear}
          handleMonthChange={handleMonthChange}
        />
        <div className="flex items-center justify-center py-12">
          <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
        </div>
      </>
    );
  }

  return (
    <>
      <BudgetsNav
        currentMonth={currentMonth}
        currentYear={currentYear}
        handleMonthChange={handleMonthChange}
      />
      {!budgets || budgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">No budgets yet</p>
          <p className="text-sm text-muted-foreground">
            Click &quot;Add budget&quot; to create your first budget
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => (
            <BudgetItem key={budget.id} budget={budget} />
          ))}
        </div>
      )}
    </>
  );
}
