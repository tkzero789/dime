"use client";

import { BudgetData } from "@/types";
import { TRANSACTION_CATEGORIES } from "@/lib/constants";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

type Props = {
  budget: BudgetData;
};

export default function BudgetItem({ budget }: Props) {
  // Find the matching category to get icon and label
  const categoryInfo = TRANSACTION_CATEGORIES.expense.find(
    (cat) => cat.value === budget.category,
  );

  const Icon = categoryInfo?.icon;
  const categoryLabel = categoryInfo?.label || budget.category;

  const percentage = parseFloat(budget.percentage);
  const isOverBudget = percentage > 100;
  const totalSpent = parseFloat(budget.total_spent);
  const remaining = parseFloat(budget.remaining);
  const budgetAmount = parseFloat(budget.amount);

  // Calculate circle progress (circumference-based)
  const circleRadius = 24;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset =
    circleCircumference -
    (Math.min(percentage, 100) / 100) * circleCircumference;

  return (
    <Link href={`/budgets/${budget.id}`}>
      <Card className="cursor-pointer border border-transparent p-4 transition-colors hover:border-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="flex w-full items-center gap-2">
            {Icon && (
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="size-5 text-primary" />
              </div>
            )}
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold">{categoryLabel}</h3>
              <div className="flex items-center gap-2">
                <p className="text-xs capitalize text-secondary-foreground">
                  {budget.period}
                </p>
                <Separator orientation="vertical" className="h-2" />
                <p className="text-xs text-secondary-foreground">
                  {format(parseISO(budget.start_date), "MMM d")}
                  {budget.end_date &&
                    ` - ${format(parseISO(budget.end_date), "MMM d")}`}
                </p>
              </div>
            </div>
            {/* Circular Progress */}
            <div className="relative ml-auto flex-shrink-0">
              <svg width="60" height="60" className="rotate-[-90deg]">
                {/* Background circle */}
                <circle
                  cx="30"
                  cy="30"
                  r={circleRadius}
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="4"
                />
                {/* Progress circle */}
                <circle
                  cx="30"
                  cy="30"
                  r={circleRadius}
                  fill="none"
                  stroke={
                    isOverBudget
                      ? "hsl(var(--destructive))"
                      : "hsl(var(--primary))"
                  }
                  strokeWidth="4"
                  strokeDasharray={circleCircumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>
              {/* Percentage */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className={cn(
                    "text-sm font-medium",
                    isOverBudget ? "text-destructive" : "text-foreground",
                  )}
                >
                  {percentage.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
          <div className="flex w-full items-center justify-between">
            <span
              className={cn(
                "text-sm font-medium",
                isOverBudget ? "text-destructive" : "text-secondary-foreground",
              )}
            >
              {isOverBudget
                ? `$${parseFloat(Math.abs(remaining).toFixed(2))} over`
                : `$${parseFloat(remaining.toFixed(2))} left`}
            </span>
            <span className="text-sm font-medium">
              ${parseFloat(totalSpent.toFixed(2))} / $
              {parseFloat(budgetAmount.toFixed(2))}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
