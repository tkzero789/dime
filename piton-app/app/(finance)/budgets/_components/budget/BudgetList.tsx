"use client";

import React from "react";
import CreateBudget from "./CreateBudget";
import { Skeleton } from "@/components/ui/skeleton";
import BudgetItem from "./BudgetItem";
import { BudgetDetail } from "@/types/types";
import { BudgetRadicalChart } from "@/app/(finance)/budgets/_components/chart/BudgetRadicalChart";

type Props = {
  budgetList: BudgetDetail[];
  getBudgetList: () => Promise<void>;
};

export default function BudgetList({ budgetList, getBudgetList }: Props) {
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Budgets list</h2>
        <CreateBudget refreshData={() => getBudgetList()} />
      </div>
      <div className="mt-8 grid grid-cols-1 gap-y-2 lg:grid-cols-3 lg:gap-4">
        <div className="order-last col-span-3 grid h-fit grid-cols-1 gap-y-2 xl:order-first xl:col-span-2 xl:grid-cols-2 xl:gap-4">
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
        <div className="col-span-3 xl:col-span-1">
          <BudgetRadicalChart budgetList={budgetList} />
        </div>
      </div>
    </>
  );
}
