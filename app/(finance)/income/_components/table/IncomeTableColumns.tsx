import { IncomeData } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { format, parseISO, startOfDay } from "date-fns";
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
import { DateRange } from "react-day-picker";

export const IncomeTableColumns: ColumnDef<IncomeData>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      const formattedDate = format(parseISO(date), "MMM dd");
      return <div>{formattedDate}</div>;
    },
    filterFn: (row, columnId, filterValue: DateRange | undefined) => {
      const cellValue = row.getValue(columnId) as string;
      const rowDate = startOfDay(parseISO(cellValue));

      return (
        rowDate >= startOfDay(filterValue?.from as string | number | Date) &&
        rowDate <= startOfDay(filterValue?.to as string | number | Date)
      );
    },
  },
  { accessorKey: "name", header: "Name", filterFn: "arrIncludesSome" },
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
    filterFn: "arrIncludesSome",
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
    filterFn: "arrIncludesSome",
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
    filterFn: (row, columnId, filterValue) => {
      const cellValue = row.getValue(columnId) as number;
      const { value, operation } = filterValue as {
        value: number;
        operation: string;
      };

      switch (operation) {
        case "equal":
          return Number(cellValue) === value;
        case "less than or equal":
          return Number(cellValue) <= value;
        case "greater than or equal":
          return Number(cellValue) >= value;
        default:
          return true;
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const rowIncomeData = row.original;

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="data-[state=open]:bg-muted"
            >
              <Ellipsis />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="flex w-40 flex-col px-0 py-0">
            <div className="flex items-center justify-center border-b px-3 py-2 text-sm font-semibold">
              Actions
            </div>
            <div className="p-1">
              <EditIncome incomeData={rowIncomeData} />
              <DeleteIncome incomeId={rowIncomeData.id} />
            </div>
          </PopoverContent>
        </Popover>
      );
    },
  },
];
