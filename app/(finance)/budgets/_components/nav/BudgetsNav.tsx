"use client";

import React from "react";
import CreateBudget from "../budget/CreateBudget";

export default function BudgetsNav() {
  return (
    <div className="rounded-xl bg-white p-4 shadow-card-shadow">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">Budgets</div>
        <CreateBudget />
      </div>
    </div>
  );
}
