import React, { Dispatch, SetStateAction } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronRight, Filter } from "lucide-react";
import IncomeTableFilterName from "./IncomeTableFilterName";
import IncomeTableFilterCategory from "./IncomeTableFilterCategory";
import IncomeTableFilterPaymentMethod from "./IncomeTableFilterPaymentMethod";
import IncomeTableFilterAmount from "./IncomeTableFilterAmount";
import { ColumnFiltersState } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

type Props = {
  columnFilters: ColumnFiltersState;
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
};

const options = [
  { option: "Date" },
  { option: "Name" },
  { option: "Category" },
  { option: "Payment method" },
  { option: "Amount" },
];

export default function IncomeTableFilters({
  columnFilters,
  setColumnFilters,
}: Props) {
  const [filterOption, setFilterOption] = React.useState<string>("");

  const displayFilterContent = (option: string) => {
    switch (option) {
      case "Date":
        return <div>Date</div>;
      case "Name":
        return (
          <IncomeTableFilterName
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
          />
        );
      case "Category":
        return <IncomeTableFilterCategory />;
      case "Payment method":
        return <IncomeTableFilterPaymentMethod />;
      case "Amount":
        return <IncomeTableFilterAmount />;
      default:
        return null;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter />
          Filters
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="flex w-auto p-0">
        <div className="flex w-[202px] flex-col gap-1 border-r p-4">
          {options.map((item) => (
            <Button
              key={item.option}
              variant="ghost"
              size="sm"
              className={cn(
                "justify-between",
                filterOption === item.option && "bg-muted",
              )}
              onClick={() => setFilterOption(item.option)}
            >
              {item.option}
              {filterOption === item.option && <ChevronRight />}
            </Button>
          ))}
        </div>
        <div className="p-4">{displayFilterContent(filterOption)}</div>
      </PopoverContent>
    </Popover>
  );
}
