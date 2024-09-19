import { ExpenseDetail, RecurrenceDetail, SingleDetail } from "@/types/types";
import FormatDate from "@/utils/formatDate";
import FormatNumber from "@/utils/formatNumber";
import FormatString from "@/utils/formatString";
import React from "react";
import DashboardUpcomingBill from "./DashboardUpcomingBill";
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
    <div className="mt-8 grid grid-cols-3 gap-4">
      <div className="col-span-3 rounded-lg border bg-white p-6 shadow-md xl:col-span-2">
        <h2 className="pb-4 text-xl font-bold">Latest transaction</h2>
        <div className="grid grid-cols-[90px_1fr_200px_180px_100px] gap-2 rounded-lg bg-neutral-200 py-2 text-sm font-semibold text-medium">
          <div className="text-center">Date</div>
          <div className="pl-4">Name</div>
          <div className="text-start">Category</div>
          <div className="text-start">Payment Method</div>
          <div className="text-center">Amount</div>
        </div>
        {spending
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
          ?.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[90px_1fr_200px_180px_100px] items-center gap-2 rounded-md border-b py-2 pt-2 text-sm font-medium"
            >
              <div className="text-center">
                <FormatDate numMonthNumDateUTC={new Date(item.date)} />
              </div>
              <div className="truncate pl-4">{item.name}</div>
              <div
                className={`flex w-fit items-center justify-center rounded-full bg-opacity-50 px-2 py-1 text-start text-[13px] font-semibold ${getCategory(item.category)}`}
              >
                <FormatString text={item.category} />
              </div>
              <div className="text-start">
                <FormatString text={item.payment_method} />
              </div>
              <div className="text-center font-semibold">
                $<FormatNumber number={Number(item.amount)} />
              </div>
            </div>
          ))}
        <Link
          href="/transaction"
          className="mt-4 flex items-center justify-center rounded-lg border border-neutral-500 p-2 font-semibold text-medium hover:bg-neutral-100"
        >
          View all transactions
        </Link>
      </div>
      <DashboardUpcomingBill spending={spending} getCategory={getCategory} />
    </div>
  );
}
