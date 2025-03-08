"use client";

import React from "react";
import AddIncome from "../AddIncome";
import { Separator } from "@/components/ui/separator";
import { IncomeToggleYear } from "../chart/IncomeToggleYear";

type Props = {
  currentYear: number;
  handleYearChange: (year: number) => void;
};

export default function IncomeNav({ currentYear, handleYearChange }: Props) {
  return (
    <div className="flex items-center justify-between gap-6 rounded-xl bg-white px-6 py-4 shadow-card-shadow">
      <h1 className="text-xl font-semibold">Income</h1>
      <div className="flex items-center gap-4">
        <IncomeToggleYear
          currentYear={currentYear}
          handleYearChange={handleYearChange}
        />
        <Separator orientation="vertical" className="h-5" />
        <AddIncome />
      </div>
    </div>
  );
}
