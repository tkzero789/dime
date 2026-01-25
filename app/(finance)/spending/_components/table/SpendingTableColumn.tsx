import { AccountData, TransactionData } from "@/types";
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
import { DateRange } from "react-day-picker";
import FormatNumber from "@/utils/formatNumber";
import FormatString from "@/utils/formatString";
import { cn } from "@/lib/utils";
import DeleteTransaction from "@/app/(finance)/_components/transaction/DeleteTransaction";
import EditTransaction from "@/app/(finance)/_components/transaction/EditTransaction";
import {
  TRANSACTION_CATEGORIES,
  TransactionCategoryItem,
} from "@/lib/constants";

export const SpendingTableColumns: ColumnDef<TransactionData>[] = [
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
  {
    accessorKey: "name",
    header: "Name",
    filterFn: (row, columnId, filterValue) => {
      if (Array.isArray(filterValue)) {
        const cellValue = String(row.getValue(columnId)).toLowerCase();

        return filterValue.some((filter) =>
          cellValue.includes(filter.toLowerCase()),
        );
      }

      const cellValue = String(row.getValue(columnId))
        .toLowerCase()
        .replace(/\s+/g, "");
      const searchValue = String(filterValue).toLowerCase().replace(/\s+/g, "");
      return cellValue.includes(searchValue);
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("category") as TransactionCategoryItem;

      const allCategories = [
        ...TRANSACTION_CATEGORIES.expense,
        ...TRANSACTION_CATEGORIES.income,
      ];

      const matchingCategory = allCategories.find(
        (item) => item.value === category.value,
      );

      const Icon = matchingCategory?.icon;

      return (
        <div className="flex w-fit items-center gap-2 rounded-sm bg-sky-200 px-2 py-0.5 text-sky-800">
          {Icon && <Icon className="size-5" />} {category.label}
        </div>
      );
    },
    filterFn: (row, columnId, filterValue: string[]) => {
      const category = row.getValue(columnId) as TransactionCategoryItem;
      return filterValue.includes(category.value);
    },
  },
  {
    accessorKey: "payment_source",
    header: "Account",
    cell: ({ row }) => {
      const paymentSource: AccountData = row.getValue("payment_source");
      return (
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "size-2 rounded-full bg-gradient-to-br",
              paymentSource.color,
            )}
          ></div>
          <FormatString text={paymentSource.name} />
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
          -$
          <FormatNumber number={amount} />
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
          <PopoverContent align="end" className="flex w-40 flex-col p-0">
            <div className="p-1">
              <EditTransaction transactionData={rowIncomeData} />
              <DeleteTransaction transactionId={rowIncomeData.id} />
            </div>
          </PopoverContent>
        </Popover>
      );
    },
  },
];
