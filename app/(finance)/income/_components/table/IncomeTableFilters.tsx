import React, { Dispatch, SetStateAction } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  ChevronFirst,
  ChevronLast,
  ChevronRight,
  Equal,
  Filter,
} from "lucide-react";
import IncomeTableFilterName from "./IncomeTableFilterName";
import IncomeTableFilterCategory from "./IncomeTableFilterCategory";
import IncomeTableFilterPaymentMethod from "./IncomeTableFilterPaymentMethod";
import IncomeTableFilterAmount from "./IncomeTableFilterAmount";
import { ColumnFiltersState } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { IncomeTableFilterDate } from "./IncomeTableFilterDate";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import FormatString from "@/utils/formatString";
import useWindowSize from "@/hooks/useWindowSize";

type Props = {
  columnFilters: ColumnFiltersState;
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
};

const options = [
  { id: "date", option: "Date" },
  { id: "name", option: "Name" },
  { id: "category", option: "Category" },
  { id: "payment_method", option: "Payment method" },
  { id: "amount", option: "Amount" },
];

export default function IncomeTableFilters({
  columnFilters,
  setColumnFilters,
}: Props) {
  const { width } = useWindowSize();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [filterOption, setFilterOption] = React.useState<string>("date");

  const handleDisplayFilterOption = (optionId: string) => {
    switch (optionId) {
      case "date":
        return (
          <IncomeTableFilterDate
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
          />
        );
      case "name":
        return (
          <IncomeTableFilterName
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
          />
        );
      case "category":
        return (
          <IncomeTableFilterCategory
            columnFilters={columnFilters}
            setColumnFilter={setColumnFilters}
          />
        );
      case "payment_method":
        return (
          <IncomeTableFilterPaymentMethod
            columnFilters={columnFilters}
            setColumnFilter={setColumnFilters}
          />
        );
      case "amount":
        return (
          <IncomeTableFilterAmount
            columnFilters={columnFilters}
            setColumnFilter={setColumnFilters}
          />
        );
      default:
        return null;
    }
  };

  const handleCheckId = (
    filterId: string,
    filterValue:
      | string
      | number
      | DateRange
      | { value: number; operation: string },
  ) => {
    switch (filterId) {
      case "date":
        const dateValue = filterValue as DateRange;
        if (dateValue.from && dateValue.to) {
          return (
            <div>
              {format(dateValue.from, "MMM d, yyyy")} -{" "}
              {format(dateValue.to, "MMM d, yyyy")}
            </div>
          );
        }
      case "name":
        const nameValue = filterValue as string;
        return (
          <div>
            {nameValue.length === 1
              ? nameValue[0]
              : `Name (${nameValue.length})`}
          </div>
        );
      case "category":
        const categoryValue = filterValue as string;
        return (
          <div>
            {categoryValue.length === 1 ? (
              <FormatString text={categoryValue[0]} />
            ) : (
              `Category (${categoryValue.length})`
            )}
          </div>
        );
      case "payment_method":
        const methodValue = filterValue as string;
        return (
          <div>
            {methodValue.length === 1 ? (
              <FormatString text={methodValue[0]} />
            ) : (
              `Payment method (${methodValue.length})`
            )}
          </div>
        );
      case "amount":
        const amountValue = filterValue as { value: number; operation: string };
        return (
          <div className="flex items-center gap-2">
            {amountValue.operation === "equal" ? (
              <Equal />
            ) : amountValue.operation === "less than or equal" ? (
              <ChevronFirst />
            ) : (
              <ChevronLast />
            )}
            ${amountValue.value}
          </div>
        );

      default:
        return null;
    }
  };

  console.log(columnFilters);

  return (
    <div className="hidden items-center gap-4 lg:flex">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`${columnFilters.length !== 0 && "bg-muted hover:bg-secondary"}`}
          >
            <Filter />
            Filters
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="flex w-auto p-0">
          <div className="flex w-[202px] flex-col gap-1 border-r p-4">
            {options.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={cn(
                  "justify-between",
                  filterOption === item.id && "bg-muted",
                )}
                onClick={() => setFilterOption(item.id)}
              >
                {item.option}
                {filterOption === item.id && <ChevronRight />}
              </Button>
            ))}
          </div>
          <div className="w-[20rem] p-4">
            {handleDisplayFilterOption(filterOption)}
          </div>
        </PopoverContent>
      </Popover>
      {columnFilters.map((item, index) => (
        <Popover key={item.id}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-primary bg-primary/10 text-primary hover:bg-primary/15"
              onClick={() => setFilterOption(item.id)}
            >
              {handleCheckId(
                item.id,
                item.value as string | number | DateRange,
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align={`${index === 4 ? ((width ?? 0) < 1280 ? "end" : "start") : "start"}`}
            className="p-4"
          >
            {handleDisplayFilterOption(filterOption)}
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
}
