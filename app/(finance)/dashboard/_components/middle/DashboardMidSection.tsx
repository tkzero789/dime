import {
  BudgetData,
  ExpenseDetailWithCategory,
  IncomeData,
  RecurrenceDetail,
  SingleDetail,
} from "@/types";
import React from "react";
import { DashboardTable } from "./DashboardTable";
import Link from "next/link";
import DashboardBudget from "./DashboardBudget";
import { CardSkeleton } from "@/components/ui/card-skeleton";
import { Button } from "@/components/ui/button";

type Props = {
  allData: (
    | IncomeData
    | ExpenseDetailWithCategory
    | RecurrenceDetail
    | SingleDetail
  )[];
  budget: BudgetData[];
  isLoading: boolean;
};

export default function DashboardMidSection({
  allData,
  budget,
  isLoading,
}: Props) {
  return (
    <>
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
          <div className="col-span-3 h-fit rounded-xl bg-white p-6 shadow-card-shadow xl:col-span-2">
            <h2 className="pb-4 text-xl font-bold">Latest transactions</h2>
            <DashboardTable allData={allData} />
            <Button asChild variant="outline" className="w-full">
              <Link href="/transaction">View all transactions</Link>
            </Button>
          </div>
        )}

        {isLoading ? (
          <CardSkeleton
            title={true}
            titleWidth={50}
            rectangle={1}
            height={10}
            style="col-span-3 xl:col-span-1"
          />
        ) : (
          <DashboardBudget budget={budget} />
        )}
      </div>
    </>
  );
}
