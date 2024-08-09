"use client";

import React from "react";
import CreateBudget from "./CreateBudget";
import { Skeleton } from "@/components/ui/skeleton";
import BudgetItem from "./BudgetItem";
import { BudgetDetail } from "@/types/types";

type Props = {
  budgetList: BudgetDetail[];
  getBudgetList: () => Promise<void>;
};

export default function BudgetList({ budgetList, getBudgetList }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">List of your budgets:</h2>
        <CreateBudget refreshData={() => getBudgetList()} />
      </div>
      <div className="mt-4 flex flex-col gap-4">
        {budgetList?.length > 0
          ? budgetList.map((budget) => (
              <BudgetItem key={budget.id} budget={budget} />
            ))
          : Array(6)
              .fill(null)
              .map((_, index) => (
                <Skeleton
                  key={index}
                  className="mt-4 h-28 w-full bg-gray-200"
                />
              ))}
      </div>
    </div>
  );
}
