import { BudgetData } from "@/types";
import React from "react";
import DashboardBudgetItem from "./DashboardBudgetItem";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
  budget: BudgetData[];
};

export default function DashboardBudget({ budget }: Props) {
  const currentMonth = new Date().getUTCMonth();
  const currentYear = new Date().getUTCFullYear();

  return (
    <div className="col-span-3 flex flex-col gap-4 rounded-xl bg-white p-6 shadow-card-shadow xl:col-span-1">
      <h2 className="text-xl font-bold">Budgets</h2>
      <div className="flex h-auto max-h-[489px] flex-1 flex-col gap-2 overflow-y-auto">
        {budget?.length > 0 ? (
          budget
            .filter(
              (item) =>
                item.month === currentMonth && item.year === currentYear,
            )
            .map((item) => <DashboardBudgetItem key={item.id} budget={item} />)
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
      <Button asChild variant="outline">
        <Link href="/budgets">View all budgets</Link>
      </Button>
    </div>
  );
}
