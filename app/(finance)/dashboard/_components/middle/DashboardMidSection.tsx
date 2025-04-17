import { BudgetExpenseData, IncomeData } from "@/types";
import React from "react";
import { DashboardTable } from "./DashboardTable";
import DashboardBudget from "./DashboardBudget";
import { CardSkeleton } from "@/components/ui/card-skeleton";

type Props = {
  allData: (IncomeData | BudgetExpenseData)[];
  isLoading: boolean;
};

export default function DashboardMidSection({ allData, isLoading }: Props) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {isLoading ? (
        <CardSkeleton
          title={true}
          titleWidth={30}
          rectangle={1}
          height={10}
          style="col-span-3 xl:col-span-2 h-fit"
        />
      ) : (
        <DashboardTable allData={allData} />
      )}
      <DashboardBudget />
    </div>
  );
}
