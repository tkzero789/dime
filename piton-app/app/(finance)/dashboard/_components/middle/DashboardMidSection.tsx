import { ExpenseDetail, RecurrenceDetail, SingleDetail } from "@/types/types";
import React from "react";
import DashboardUpcomingBill from "./DashboardUpcomingBill";
import { DashboardTable } from "./DashboardTable";
import Link from "next/link";

type NewExpenseDetail = ExpenseDetail & {
  category: string;
};

type Props = {
  spending: (NewExpenseDetail | RecurrenceDetail | SingleDetail)[];
};

export default function DashboardMidSection({ spending }: Props) {
  const getCategory = (category: string) => {
    if (
      ["car payment", "credit card payment", "insurance", "loan"].includes(
        category,
      )
    ) {
      return "bg-sky-300 text-sky-700";
    } else if (
      ["Budget Expense", "monthly subscription", "single payment"].includes(
        category,
      )
    ) {
      return "bg-teal-300 text-teal-700";
    } else if (["mortgage", "rent", "bill and utilities"].includes(category)) {
      return "bg-pink-300 text-pink-700";
    } else {
      return "bg-amber-300 text-amber-700";
    }
  };
  return (
    <>
      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="col-span-3 rounded-lg border bg-white p-4 shadow-md xl:col-span-2">
          <h2 className="pb-4 text-xl font-bold">Latest transaction</h2>
          <DashboardTable spending={spending} />
          <Link
            href="/transaction"
            className="mt-2 block rounded-md border border-neutral-500 p-2 text-center text-sm font-medium hover:bg-neutral-200"
          >
            View all transactions
          </Link>
        </div>
        <DashboardUpcomingBill spending={spending} getCategory={getCategory} />
      </div>
    </>
  );
}
