"use client";

import React from "react";
import AddIncome from "../mutations/AddIncome";
import { Separator } from "@/components/ui/separator";
import IncomeYearToggle from "./IncomeYearToggle";

type Props = {
  currentYear: number;
  handleChangeYear: (year: number) => void;
};

export default function IncomeNav({ currentYear, handleChangeYear }: Props) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white px-6 py-4 shadow-card-shadow">
      <h1 className="text-xl font-semibold">Income</h1>
      <div className="flex w-full items-center justify-end gap-4 md:w-auto">
        <IncomeYearToggle
          currentYear={currentYear}
          handleChangeYear={handleChangeYear}
        />
        <Separator orientation="vertical" className="hidden h-5 lg:block" />
        <AddIncome />
      </div>
    </div>
  );
}
