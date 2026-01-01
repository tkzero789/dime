"use client";

import React from "react";
import AddIncome from "../mutations/AddIncome";
import { Separator } from "@/components/ui/separator";
import IncomeYearPicker from "./IncomeYearPicker";
import { Landmark } from "lucide-react";

type Props = {
  currentYear: number;
  handleChangeYear: (year: number) => void;
};

export default function IncomeNav({ currentYear, handleChangeYear }: Props) {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between bg-muted py-4">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
          <Landmark className="size-4 text-primary-foreground" />
        </div>
        <h1>Income</h1>
      </div>
      <div className="flex w-full items-center justify-end gap-4 md:w-auto">
        <IncomeYearPicker
          currentYear={currentYear}
          handleChangeYear={handleChangeYear}
        />
        <Separator orientation="vertical" className="hidden h-5 lg:block" />
        <AddIncome />
      </div>
    </div>
  );
}
