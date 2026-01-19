"use client";

import React from "react";

import { Wallet } from "lucide-react";
import AddTransaction from "@/app/(finance)/_components/AddTransaction";
import { Separator } from "@/components/ui/separator";
import SpendingYearPicker from "./SpendingYearPicker";

type Props = {
  currentYear: number;
  handleYearChange: (year: number) => void;
};

export default function SpendingNav({ currentYear, handleYearChange }: Props) {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between bg-muted pb-4 pt-8">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
          <Wallet className="size-4 text-primary-foreground" />
        </div>
        <h1>Spending</h1>
      </div>
      <div className="flex w-full items-center justify-end gap-2 md:w-auto">
        <SpendingYearPicker
          currentYear={currentYear}
          handleYearChange={handleYearChange}
        />
        <Separator orientation="vertical" className="hidden h-5 lg:block" />
        <AddTransaction />
      </div>
    </div>
  );
}
