"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import FormatDate from "@/utils/formatDate";
import FormatString from "@/utils/formatString";
import ViewTransaction from "./ViewTransaction";
import {
  ExpenseDetail,
  IncomeDetail,
  RecurrenceDetail,
  SingleDetail,
} from "@/types/types";

type NewExpenseDetail = ExpenseDetail & {
  category: string;
};

export type Transaction =
  | NewExpenseDetail
  | IncomeDetail
  | RecurrenceDetail
  | SingleDetail;

const getCategory = (category: string) => {
  if (
    ["car payment", "credit card payment", "insurance", "loan"].includes(
      category,
    )
  ) {
    return "bg-amber-300 text-amber-700";
  } else if (
    [undefined, "monthly subscription", "single payment"].includes(category)
  ) {
    return "bg-sky-300 text-sky-700";
  } else if (["mortgage", "rent", "bill and utilities"].includes(category)) {
    return "bg-pink-300 text-pink-700";
  } else {
    return "bg-teal-300 text-teal-700";
  }
};

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = (
        <FormatDate numMonthNumDateUTC={new Date(row.getValue("date"))} />
      );
      return <div>{date}</div>;
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const categoryValue = row.getValue("category");
      const category: React.ReactNode =
        typeof categoryValue === "string" ? (
          <FormatString text={categoryValue} />
        ) : (
          "Budget Expense"
        );
      return (
        <div
          className={`flex w-fit items-center justify-center rounded-full bg-opacity-50 px-2 py-1 ${getCategory(row.getValue("category"))}`}
        >
          <div className="text-[13px]">{category}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "payment_method",
    header: "Payment method",
    cell: ({ row }) => {
      const method = <FormatString text={row.getValue("payment_method")} />;
      return <div>{method}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="justify-end px-0 text-sm font-semibold text-medium"
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const transaction = row.original;
      return <ViewTransaction transactionDetail={transaction} />;
    },
  },
];
