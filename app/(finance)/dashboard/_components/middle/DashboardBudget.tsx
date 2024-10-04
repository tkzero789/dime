import { BudgetDetail } from "@/types/types";
import React from "react";
import DashboardBudgetItem from "./DashboardBudgetItem";
import Link from "next/link";
import { CardSkeleton } from "@/components/ui/card-skeleton";

type Props = {
  budget: BudgetDetail[];
};

export default function DashboardBudget({ budget }: Props) {
  return (
    <div className="col-span-3 flex flex-col gap-4 rounded-lg border bg-white p-6 shadow-md xl:col-span-1">
      <h2 className="text-xl font-bold">This month's budgets</h2>
      <div className="flex h-auto max-h-[489px] flex-1 flex-col gap-2 overflow-y-auto">
        {budget?.length > 0 ? (
          budget.map((item) => (
            <DashboardBudgetItem key={item.id} budget={item} />
          ))
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div>No budgets have been added yet.</div>
            <div>
              Click{" "}
              <Link
                href="/budgets"
                className="font-medium text-blue-600 underline hover:text-blue-800"
              >
                Here
              </Link>{" "}
              to create your first budget
            </div>
          </div>
        )}
      </div>
      <Link
        href="/budgets"
        className="mt-auto block rounded-md border border-neutral-500 p-2 text-center text-sm font-medium hover:bg-neutral-200"
      >
        View all budgets
      </Link>
    </div>
  );
}
