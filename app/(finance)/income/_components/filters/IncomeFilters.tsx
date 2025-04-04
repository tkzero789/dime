import React, { Dispatch, SetStateAction } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { IncomeFilterDate } from "./IncomeFilterDate";
import IncomeFilterName from "./IncomeFilterName";
import IncomeFilterCategory from "./IncomeFilterCategory";
import IncomeFilterPayment from "./IncomeFilterPayment";
import IncomeFilterAmount from "./IncomeFilterAmount";

type Props = {
  sortOption: string;
  setSortOption: Dispatch<SetStateAction<string>>;
  sorting: SortingState;
  setSorting: Dispatch<SetStateAction<SortingState>>;
  columnFilters: ColumnFiltersState;
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
};

const options = [
  { id: "date", title: "Date" },
  { id: "name", title: "Name" },
  { id: "category", title: "Category" },
  { id: "payment_method", title: "Payment method" },
  { id: "amount", title: "Amount" },
];

export default function IncomeFilters({
  sortOption,
  setSortOption,
  sorting,
  setSorting,
  columnFilters,
  setColumnFilters,
}: Props) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [filterOption, setFilterOption] = React.useState<string>("date");

  const displayFilterOption = (optionId: string) => {
    switch (optionId) {
      case "date":
        return (
          <IncomeFilterDate
            setSortOption={setSortOption}
            sorting={sorting}
            setSorting={setSorting}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
          />
        );
      case "name":
        return (
          <IncomeFilterName
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
          />
        );
      case "category":
        return (
          <IncomeFilterCategory
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
          />
        );
      case "payment_method":
        return (
          <IncomeFilterPayment
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
          />
        );
      case "amount":
        return (
          <IncomeFilterAmount
            sortOption={sortOption}
            setSortOption={setSortOption}
            sorting={sorting}
            setSorting={setSorting}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
          />
        );
      default:
        return null;
    }
  };

  console.log(sortOption);

  return (
    <div className="hidden flex-wrap items-center gap-4 lg:flex">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "data-[state=open]:bg-muted",
              (columnFilters.length !== 0 || sorting.length !== 0) &&
                "border-primary bg-primary/10 text-primary hover:bg-primary/20 data-[state=open]:bg-primary/20",
            )}
          >
            <Filter />
            Filters
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="flex w-auto flex-col p-0">
          <div className="flex gap-1 border-b p-4">
            {options.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={cn(
                  "group relative",
                  item.id === filterOption && "bg-muted",
                  sorting.map(
                    (sortObject) =>
                      sortObject.id === item.id &&
                      "text-primary hover:bg-primary/10",
                  ),
                  columnFilters.map(
                    (filterObject) =>
                      filterObject.id === item.id &&
                      "text-primary hover:bg-primary/10",
                  ),
                  sorting.length !== 0 &&
                    item.id === filterOption &&
                    sorting.some(
                      (sortObject) => sortObject.id === filterOption,
                    ) &&
                    "bg-primary/10 hover:bg-primary/20",
                  columnFilters.length !== 0 &&
                    item.id === filterOption &&
                    columnFilters.some(
                      (filterObject) => filterObject.id === filterOption,
                    ) &&
                    "bg-primary/10 hover:bg-primary/20",
                )}
                onClick={() => setFilterOption(item.id)}
              >
                {item.title}
              </Button>
            ))}
          </div>
          <div className="max-h-72 overflow-y-auto p-4">
            {displayFilterOption(filterOption)}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
