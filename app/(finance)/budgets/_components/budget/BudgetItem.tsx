import { Progress } from "@/components/ui/progress";
import { BudgetDetail } from "@/types/types";
import FormatNumber from "@/utils/formatNumber";
import Link from "next/link";
import React from "react";

type Props = {
  budget: BudgetDetail;
};

export default function BudgetItem({ budget }: Props) {
  const progressValue = (budget.total_spend / Number(budget.amount)) * 100;
  const remainingAmount = Number(budget.amount) - Number(budget.total_spend);
  const remainingClassName = `text-sm ${remainingAmount < 0 ? "font-bold text-red-600" : "text-secondary-foreground"}`;
  const remainingText = remainingAmount < 0 ? "overspent" : "remaining";
  return (
    <Link
      href={`/budgets/` + budget?.id}
      className="flex flex-1 cursor-pointer flex-col rounded-2xl bg-white p-4 shadow-card-shadow transition-all hover:shadow-card-hover"
    >
      <div className="flex items-center gap-4">
        <div className="text-3xl">{budget.icon}</div>
        <div className="flex flex-col">
          <span className="font-medium">{budget.name}</span>
          <span className="text-sm font-light text-secondary-foreground">
            {budget.category}
          </span>
        </div>
        <div className="ml-auto font-semibold">
          $<FormatNumber number={Number(budget.amount)} />
        </div>
      </div>
      <div className="flex flex-col gap-2 pt-6">
        <div className="flex items-center justify-between">
          {budget.total_spend ? (
            <span className="text-sm text-secondary-foreground">
              $
              {budget.total_spend % 1 == 0
                ? budget.total_spend.toFixed(0)
                : budget.total_spend.toFixed(2)}{" "}
              spent
            </span>
          ) : (
            <span className="text-sm text-secondary-foreground">$0 spent</span>
          )}
          {budget.total_spend ? (
            <span className={remainingClassName}>
              $
              <FormatNumber number={remainingAmount} /> {remainingText}
            </span>
          ) : (
            <span className="text-sm text-secondary-foreground">
              $<FormatNumber number={Number(budget.amount)} /> remaining
            </span>
          )}
        </div>
        <Progress
          value={progressValue > 100 ? 100 : progressValue}
          className="h-2 [&>*]:bg-primary"
          max={100}
        />
      </div>
    </Link>
  );
}
