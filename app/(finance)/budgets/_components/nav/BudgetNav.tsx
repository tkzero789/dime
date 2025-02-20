"use client";

import React from "react";
import CreateBudget from "../budget/CreateBudget";

type Props = {
  refreshData: () => void;
};

export default function BudgetNav({ refreshData }: Props) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-card-shadow">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">Budgets</div>
        <CreateBudget refreshData={refreshData} />
      </div>
    </div>
  );
}
