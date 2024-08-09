import { BudgetDetail } from "@/types/types";
import Link from "next/link";
import React from "react";

type Props = {
  budget: BudgetDetail;
};

export default function BudgetItem({ budget }: Props) {
  const progressValue = (budget.totalSpend / Number(budget.amount)) * 100;
  return (
    <Link
      href={`/dashboard/budgets/` + budget?.id}
      className="block cursor-pointer rounded-md border border-gray-300 bg-gray-50 p-4 hover:bg-gray-100 hover:shadow-md"
    >
      <div>
        <div className="flex items-center gap-4">
          <div className="text-3xl">{budget.icon}</div>
          <div className="flex flex-col">
            <span className="font-medium">{budget.name}</span>
            <span>{budget.totalItem ? budget.totalItem : 0} items</span>
          </div>
          <div className="ml-auto font-semibold">${budget.amount}</div>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-medium">
            ${budget.totalSpend ? budget.totalSpend : 0}
          </span>
          <span className="text-sm text-medium">
            ${(Number(budget.amount) - Number(budget.totalSpend)).toFixed(2)}{" "}
            remaining
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-300">
          <div
            style={{ width: `${progressValue}%` }}
            className="h-2 rounded-full bg-orange-600"
          ></div>
        </div>
      </div>
    </Link>
  );
}
