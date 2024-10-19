import {
  BudgetDetail,
  ExpenseDetail,
  IncomeDetail,
  RecurrenceDetail,
  SingleDetail,
} from "@/types/types";
import React from "react";
import { DashboardTable } from "./DashboardTable";
import Link from "next/link";
import DashboardBudget from "./DashboardBudget";
import { CardSkeleton } from "@/components/ui/card-skeleton";

type NewExpenseDetail = ExpenseDetail & {
  category: string;
};

type Props = {
  allData: (
    | IncomeDetail
    | NewExpenseDetail
    | RecurrenceDetail
    | SingleDetail
  )[];
  budget: BudgetDetail[];
  isLoading: boolean;
};

export default function DashboardMidSection({
  allData,
  budget,
  isLoading,
}: Props) {
  return (
    <>
      <div className="mt-4 grid grid-cols-3 gap-4 xl:mt-8">
        {isLoading ? (
          <CardSkeleton
            title={true}
            titleWidth={30}
            rectangle={1}
            height={10}
            style="col-span-3 xl:col-span-2 h-fit"
          />
        ) : (
          <div className="col-span-3 h-fit rounded-lg border bg-white p-6 shadow-md xl:col-span-2">
            <h2 className="pb-4 text-xl font-bold">Latest transactions</h2>
            <DashboardTable allData={allData} />
            <Link
              href="/transaction"
              className="mt-2 block rounded-md border border-neutral-500 p-2 text-center text-sm font-medium hover:bg-neutral-200"
            >
              View all transactions
            </Link>
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
