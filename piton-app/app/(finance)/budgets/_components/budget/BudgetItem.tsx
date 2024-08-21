import { Progress } from "@/components/ui/progress";
import { BudgetDetail } from "@/types/types";
import FormatNumber from "@/utils/formatNumber";
import Link from "next/link";
import React from "react";

type Props = {
  budget: BudgetDetail;
};

export default function BudgetItem({ budget }: Props) {
  const progressValue = (budget.totalSpend / Number(budget.amount)) * 100;
  const remainingAmount = Number(budget.amount) - Number(budget.totalSpend);
  const remainingClassName = `text-sm ${remainingAmount < 0 ? "font-bold text-red-600" : "text-medium"}`;
  const remainingText = remainingAmount < 0 ? "overspent" : "remaining";
  return (
    <Link
      href={`/budgets/` + budget?.id}
      className="flex flex-1 cursor-pointer flex-col rounded-lg border bg-white p-4 shadow-md hover:shadow-lg"
    >
      <div className="flex items-center gap-4">
        <div className="text-3xl">{budget.icon}</div>
        <div className="flex flex-col">
          <span className="font-medium">{budget.name}</span>
          <span className="font-light text-medium">{budget.category}</span>
        </div>
        <div className="ml-auto font-semibold">
          $<FormatNumber number={Number(budget.amount)} />
        </div>
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
            <span className={remainingClassName}>
              $
              <FormatNumber number={remainingAmount} /> {remainingText}
            </span>
          ) : (
            <span className="text-sm text-medium">
              $<FormatNumber number={Number(budget.amount)} /> remaining
            </span>
          )}
        </div>
        <Progress
          value={progressValue > 100 ? 100 : progressValue}
          className="h-2 [&>*]:bg-teal-600"
          max={100}
        />
      </div>
    </Link>
  );
}
