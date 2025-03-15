"use client";

import React from "react";
import CreateBudget from "../budget/CreateBudget";
import { Separator } from "@/components/ui/separator";

type Props = {
  refreshData: () => void;
};

export default function BudgetNav({ refreshData }: Props) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-card-shadow">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">Budgets</div>
        <Separator orientation="vertical" className="hidden h-5 md:block" />
        <CreateBudget refreshData={refreshData} />
      </div>
    </div>
  );
}
