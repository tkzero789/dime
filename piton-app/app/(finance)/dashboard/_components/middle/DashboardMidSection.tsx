import { ExpenseDetail, RecurrenceDetail, SingleDetail } from "@/types/types";
import FormatDate from "@/utils/formatDate";
import FormatNumber from "@/utils/formatNumber";
import FormatString from "@/utils/formatString";
import React from "react";
import DashboardUpcomingBill from "./DashboardUpcomingBill";
import Link from "next/link";
import { TestTable } from "./TestTable";

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
        <div className="col-span-3 xl:col-span-2">
          <TestTable spending={spending} />
        </div>
        <DashboardUpcomingBill spending={spending} getCategory={getCategory} />
      </div>
    </>
  );
}
