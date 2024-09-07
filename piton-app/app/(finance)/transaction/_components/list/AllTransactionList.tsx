import React from "react";
import {
  ExpenseDetail,
  IncomeDetail,
  RecurrenceDetail,
  SingleDetail,
} from "@/types/types";
import FormatDate from "@/utils/formatDate";
import FormatNumber from "@/utils/formatNumber";
import FormatString from "@/utils/formatString";
import AddTransaction from "./AddTransaction";
import ViewTransaction from "./ViewTransaction";

type NewExpenseDetail = ExpenseDetail & {
  category: string;
  type: string;
};

type NewIncomeDetail = IncomeDetail & {
  type: string;
};

type NewRecurrenceDetail = RecurrenceDetail & {
  type: string;
};

type NewSingleDetail = SingleDetail & {
  type: string;
};

type Props = {
  transaction: (
    | NewExpenseDetail
    | NewIncomeDetail
    | NewRecurrenceDetail
    | NewSingleDetail
  )[];
  refreshData: () => void;
};

export default function AllTransactionList({
  transaction,
  refreshData,
}: Props) {
  return (
    <div className="mt-8 h-fit w-full flex-1 rounded-lg border bg-white p-4 shadow-md">
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-xl font-bold">Latest transactions</h2>
        <AddTransaction refreshData={refreshData} />
      </div>

      <div className="grid grid-cols-[90px_1fr_200px_180px_120px_100px] gap-2 rounded-lg bg-neutral-200 py-2 text-sm font-semibold text-medium">
        <div className="text-center">Date</div>
        <div className="pl-4">Name</div>
        <div className="text-start">Category</div>
        <div className="text-start">Method</div>
        <div className="text-end">Amount</div>
      </div>
      {transaction?.map((item) => (
        <div
          key={item.id}
          className="grid grid-cols-[90px_1fr_200px_180px_120px_100px] gap-2 rounded-md border-b py-2 pt-2 text-sm font-medium"
        >
          <div className="text-center">
            <FormatDate numMonthNumDateUTC={new Date(item.date)} />
          </div>
          <div className="pl-4">{item.name}</div>
          <div className="text-start">
            <FormatString text={item.category} />
          </div>
          <div className="text-start">
            <FormatString text={item.payment_method} />
          </div>
          <div
            className={`text-end font-semibold ${["salary", "business", "investments", "rental income", "pensions"].includes(item.category) && "text-green-700"}`}
          >
            {[
              "salary",
              "business",
              "investments",
              "rental income",
              "pensions",
            ].includes(item.category)
              ? "$"
              : "-$"}
            <FormatNumber number={Number(item.amount)} />
          </div>
          <ViewTransaction transactionDetail={item} refreshData={refreshData} />
        </div>
      ))}
    </div>
  );
}
