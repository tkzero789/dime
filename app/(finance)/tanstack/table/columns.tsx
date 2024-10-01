"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, CircleChevronRight } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import FormatDate from "@/utils/formatDate";
import FormatString from "@/utils/formatString";
import DeleteSingle from "./DeleteSingle";

export type Transaction = {
  id: string;
  date: string;
  name: string;
  category: string;
  payment_method: string;
  amount: string;
};

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
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open more options</span>
              <CircleChevronRight
                className="h-5 w-5"
                color="#757373"
                fill="#ebebeb"
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="p-1">
              {transaction.category === "single payment" && (
                <DeleteSingle singleId={transaction.id} />
              )}
            </div>
          </PopoverContent>
        </Popover>
      );
    },
  },
];
