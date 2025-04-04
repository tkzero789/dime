import React, { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import IncomeFilterName from "./IncomeFilterName";
import IncomeFilterCategory from "./IncomeFilterCategory";
import IncomeFilterPayment from "./IncomeFilterPayment";
import IncomeFilterAmount from "./IncomeFilterAmount";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Filter, RotateCw, X } from "lucide-react";
import { IncomeFilterDate } from "./IncomeFilterDate";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

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

export default function MobileIncomeFilters({
  sortOption,
  setSortOption,
  sorting,
  setSorting,
  columnFilters,
  setColumnFilters,
}: Props) {
  const [filterOption, setFilterOption] = React.useState<{
    id: string;
    title: string;
  }>({
    id: "",
    title: "",
  });

  const handleDisplayFilterOption = (optionId: string) => {
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

  const handleResetFilters = () => {
    setSortOption("");
    setSorting([]);
    setColumnFilters([]);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={`lg:hidden ${(columnFilters.length !== 0 || sorting.length !== 0) && "border-primary bg-primary/10 text-primary hover:bg-primary/20"}`}
        >
          <Filter /> Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-0 overflow-hidden">
        <DialogHeader showDialogClose={false}>
          {filterOption.id !== "" ? (
            <Button
              variant="subtle"
              size="icon"
              className="lg:hidden"
              onClick={() => setFilterOption({ id: "", title: "" })}
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Go back</span>
            </Button>
          ) : (
            <DialogClose asChild>
              <Button variant="subtle" size="icon">
                <X className="h-6 w-6" />

                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          )}
          <DialogTitle>
            {filterOption.id !== "" ? filterOption.title : "Filters"}
          </DialogTitle>
          <Button variant="subtle" size="icon" onClick={handleResetFilters}>
            <RotateCw />
          </Button>
        </DialogHeader>
        <div className="relative flex h-full flex-col">
          {options.map((item) => (
            <Button
              key={item.id}
              variant="outline"
              className={cn(
                "h-14 justify-start rounded-none border-b border-l-0 border-r-0 border-t-0 px-6 text-base",
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
              )}
              onClick={() => {
                setFilterOption({ id: item.id, title: item.title });
              }}
            >
              {item.title}
            </Button>
          ))}

          <div
            className={cn(
              "absolute inset-0 z-10 overflow-y-auto bg-white p-6 transition-all",
              filterOption.id !== ""
                ? "visible translate-x-0"
                : "invisible translate-x-full",
            )}
          >
            {handleDisplayFilterOption(filterOption.id)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
