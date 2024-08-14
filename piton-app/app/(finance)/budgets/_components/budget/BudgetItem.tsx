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
      href={`/budgets/` + budget?.id}
      className="flex h-fit cursor-pointer flex-col rounded-lg bg-white p-4 shadow-md hover:shadow-lg"
    >
      <div className="flex items-center gap-4">
        <div className="text-3xl">{budget.icon}</div>
        <div className="flex flex-col">
          <span className="font-medium">{budget.name}</span>
          <span className="font-light text-medium">{budget.category}</span>
        </div>
        <div className="ml-auto font-semibold">${parseInt(budget.amount)}</div>
      </div>
      <div className="flex flex-col gap-2 pt-6">
        <div className="flex items-center justify-between">
          {budget.totalSpend ? (
            <span className="text-sm text-medium">
              $
              {budget.totalSpend % 1 == 0
                ? budget.totalSpend.toFixed(0)
                : budget.totalSpend.toFixed(2)}{" "}
              spent
            </span>
          ) : (
            <span className="text-sm text-medium">$0 spent</span>
          )}
          {budget.totalSpend ? (
            <span className="text-sm text-medium">
              $
              {(Number(budget.amount) - Number(budget.totalSpend)) % 1 === 0
                ? (Number(budget.amount) - Number(budget.totalSpend)).toFixed(0)
                : (Number(budget.amount) - Number(budget.totalSpend)).toFixed(
                    2,
                  )}{" "}
              remaining
            </span>
          ) : (
            <span className="text-sm text-medium">
              ${Number(budget.amount)} remaining
            </span>
          )}
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
