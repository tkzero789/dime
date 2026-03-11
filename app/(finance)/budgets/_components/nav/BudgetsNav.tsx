"use client";

import React from "react";
import { PiggyBank } from "lucide-react";
import AddBudget from "@/app/(finance)/budgets/_components/form/AddBudget";
import { Separator } from "@/components/ui/separator";
import { MonthPicker } from "@/app/(finance)/_components/picker/MonthPicker";

type Props = {
  currentMonth: number;
  currentYear: number;
  handleMonthChange: (month: number, year: number) => void;
};

export default function BudgetsNav({
  currentMonth,
  currentYear,
  handleMonthChange,
}: Props) {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between bg-muted pb-4 pt-8">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
          <PiggyBank className="size-4 text-primary-foreground" />
        </div>
        <h1>Budgets</h1>
      </div>
      <div className="flex items-center justify-end gap-2 md:w-auto">
        <MonthPicker
          currentMonth={currentMonth}
          currentYear={currentYear}
          onMonthChange={handleMonthChange}
        />
        <Separator orientation="vertical" className="hidden h-5 lg:block" />
        <AddBudget />
      </div>
    </div>
  );
}
