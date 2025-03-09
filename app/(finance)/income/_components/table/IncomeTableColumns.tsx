import { IncomeData } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import FormatNumber from "@/utils/formatNumber";
import FormatString from "@/utils/formatString";
import EditIncome from "../EditIncome";
import DeleteIncome from "../DeleteIncome";

export const IncomeTableColumns: ColumnDef<IncomeData>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      const formattedDate = format(parseISO(date), "MMM dd");
      return <div>{formattedDate}</div>;
    },
  },
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      return (
        <div>
          💵 <FormatString text={category} />
        </div>
      );
    },
  },
  {
    accessorKey: "payment_method",
    header: "Payment method",
    cell: ({ row }) => {
      const paymentMethod = row.getValue("payment_method") as string;
      return (
        <div>
          <FormatString text={paymentMethod} />
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      return (
        <div className="text-right">
          $<FormatNumber number={amount} />
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const rowData = row.original;

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <Ellipsis />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex w-40 flex-col px-0 py-0">
            <div className="flex items-center justify-center border-b px-3 py-2 text-sm font-semibold">
              Actions
            </div>
            <div className="p-1">
              <EditIncome incomeData={rowData} />
              <DeleteIncome incomeId={rowData.id} />
            </div>
          </PopoverContent>
        </Popover>
      );
    },
  },
];
