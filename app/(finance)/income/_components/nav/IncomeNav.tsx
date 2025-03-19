"use client";

import React from "react";
import AddIncome from "../AddIncome";
import { Separator } from "@/components/ui/separator";
import IncomeToggleYear from "./IncomeToggleYear";

type Props = {
  currentYear: number;
  handleYearChange: (year: number) => void;
};

export default function IncomeNav({ currentYear, handleYearChange }: Props) {
  return (
    <div className="flex items-center justify-between gap-6 rounded-xl bg-white px-6 py-4 shadow-card-shadow">
      <h1 className="hidden text-xl font-semibold md:block">Income</h1>
      <div className="flex w-full items-center justify-between gap-4 md:w-auto md:justify-normal">
        <IncomeToggleYear
          currentYear={currentYear}
          handleYearChange={handleYearChange}
        />
        <Separator orientation="vertical" className="hidden h-5 md:block" />
        <AddIncome />
      </div>
    </div>
  );
}
