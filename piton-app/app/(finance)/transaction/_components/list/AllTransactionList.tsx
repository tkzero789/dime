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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";

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
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  currentMonth: number;
  currentYear: number;
};

export default function AllTransactionList({
  transaction,
  refreshData,
  handlePrevMonth,
  handleNextMonth,
  currentMonth,
  currentYear,
}: Props) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const latestYear = new Date().getFullYear();
  const latestMonth = new Date().getMonth();

  const hideNextMonthButton =
    latestYear === currentYear && latestMonth === currentMonth;

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
      return "bg-amber-300 text-amber-700";
    } else {
      return "bg-pink-300 text-pink-700";
    }
  };

  console.log(transaction);

  return (
    <div className="mt-8 h-fit w-full flex-1 rounded-lg border bg-white p-4 shadow-md">
      <div className="flex items-center gap-12 pb-4">
        <div className="flex w-16 gap-4">
          <button
            onClick={handlePrevMonth}
            className="flex items-center justify-center rounded-sm bg-gray-200 hover:bg-gray-300"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={handleNextMonth}
            className={`flex items-center justify-center rounded-sm bg-gray-200 hover:bg-gray-300 ${hideNextMonthButton && "hidden"}`}
          >
            <ChevronRight />
          </button>
        </div>
        <h2 className="text-xl font-bold">
          {monthNames[currentMonth]} {currentYear}
        </h2>

        <AddTransaction refreshData={refreshData} />
      </div>

      <div className="grid grid-cols-[90px_1fr_200px_180px_120px_100px] gap-2 rounded-lg bg-neutral-200 py-2 text-sm font-semibold text-medium">
        <div className="text-center">Date</div>
        <div className="pl-4">Name</div>
        <div className="text-start">Category</div>
        <div className="text-start">Payment Method</div>
        <div className="text-end">Amount</div>
      </div>
      {transaction?.map((item) => (
        <div
          key={item.id}
          className="grid grid-cols-[90px_1fr_200px_180px_120px_100px] items-center gap-2 rounded-md border-b py-2 pt-2 text-sm font-medium"
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
          <div
            className={`text-end font-semibold ${item.type === "Income" && "text-green-700"}`}
          >
            {item.type === "Income" ? "$" : "-$"}
            <FormatNumber number={Number(item.amount)} />
          </div>
          <ViewTransaction transactionDetail={item} refreshData={refreshData} />
        </div>
      ))}
    </div>
  );
}
