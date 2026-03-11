"use client";

import React, { Dispatch, SetStateAction } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Filter, RotateCw, X } from "lucide-react";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import TableFilterCheckbox from "@/app/(finance)/_components/table/TableFilterCheckbox";
import TableFilterAmount from "@/app/(finance)/_components/table/TableFilterAmount";
import { TableFilterDate } from "@/app/(finance)/_components/table/TableFilterDate";
import { useDesktop } from "@/hooks/use-desktop";
import TableFilterKeyword from "@/app/(finance)/_components/table/TableFilterKeyword";
import { TRANSACTION_CATEGORIES } from "@/lib/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  { id: "payment_source", title: "Payment source" },
  { id: "amount", title: "Amount" },
];

export default function TransactionsFilters({
  sortOption,
  setSortOption,
  sorting,
  setSorting,
  columnFilters,
  setColumnFilters,
}: Props) {
  const isDesktop = useDesktop();
  const allCategories = [
    ...TRANSACTION_CATEGORIES.expense,
    ...TRANSACTION_CATEGORIES.income,
  ].map((item) => ({
    label: item.label,
    value: item.value,
  }));
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [filterOption, setFilterOption] = React.useState<string>("date");

  const [mobileFilterOption, setMobileFilterOption] = React.useState<{
    id: string;
    title: string;
  }>({
    id: "",
    title: "",
  });

  const handleResetFilters = () => {
    setSortOption("");
    setSorting([]);
    setColumnFilters([]);
  };

  const displayFilterOption = (optionId: string) => {
    switch (optionId) {
      case "date":
        return (
          <TableFilterDate
            columnId="date"
            setSortOption={setSortOption}
            sorting={sorting}
            setSorting={setSorting}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
          />
        );
      case "name":
        return (
          <TableFilterKeyword
            columnId="name"
            placeholder="Enter name"
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
          />
        );
      case "category":
        return (
          <TableFilterCheckbox
            columnId="category"
            filterList={allCategories}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
          />
        );
      case "payment_method":
        return (
          <TableFilterCheckbox
            columnId="payment_method"
            filterList={[
              { label: "Cash", value: "cash" },
              { label: "Check", value: "check" },
              { label: "Direct Deposit", value: "direct deposit" },
              { label: "Mobile Payment", value: "mobile payment" },
              { label: "Payroll Card", value: "payroll card" },
            ]}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
          />
        );
      case "amount":
        return (
          <TableFilterAmount
            columnId="amount"
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

  if (isDesktop) {
    return (
      <div className="hidden flex-wrap items-center gap-4 lg:flex">
        <TooltipProvider>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <Tooltip>
              <PopoverTrigger asChild>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "data-[state=open]:bg-muted data-[state=open]:hover:border-border data-[state=open]:hover:text-foreground",
                      (columnFilters.length !== 0 || sorting.length !== 0) &&
                        "border-primary text-primary hover:bg-primary/10 data-[state=open]:bg-primary/10 data-[state=open]:hover:border-primary data-[state=open]:hover:bg-primary/20 data-[state=open]:hover:text-primary",
                    )}
                  >
                    <Filter />
                  </Button>
                </TooltipTrigger>
              </PopoverTrigger>
              <TooltipContent>
                <p>Filters</p>
              </TooltipContent>
            </Tooltip>
            <PopoverContent align="end" className="flex flex-col p-0">
              <div className="flex gap-1 border-b p-2">
                {options.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    size="sm"
                    className={cn(
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
                        "bg-primary/10",
                      columnFilters.length !== 0 &&
                        item.id === filterOption &&
                        columnFilters.some(
                          (filterObject) => filterObject.id === filterOption,
                        ) &&
                        "bg-primary/10",
                    )}
                    onClick={() => setFilterOption(item.id)}
                  >
                    {item.title}
                  </Button>
                ))}
              </div>
              <div className="max-h-72 overflow-y-auto p-2">
                {displayFilterOption(filterOption)}
              </div>
            </PopoverContent>
          </Popover>
        </TooltipProvider>
      </div>
    );
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size={isDesktop ? "default" : "icon"}
          className={cn(
            "lg:hidden",
            (columnFilters.length !== 0 || sorting.length !== 0) &&
              "border-primary bg-primary/10 text-primary hover:bg-primary/20",
          )}
        >
          <Filter /> <span className="hidden lg:block">Filters</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-0 overflow-hidden">
        <DialogHeader showDialogClose={false}>
          {mobileFilterOption.id !== "" ? (
            <Button
              variant="subtle"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileFilterOption({ id: "", title: "" })}
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
            {mobileFilterOption.id !== ""
              ? mobileFilterOption.title
              : "Filters"}
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
                setMobileFilterOption({ id: item.id, title: item.title });
              }}
            >
              {item.title}
            </Button>
          ))}

          <div
            className={cn(
              "absolute inset-0 z-10 overflow-y-auto bg-background p-4 transition-all",
              mobileFilterOption.id !== ""
                ? "visible translate-x-0"
                : "invisible translate-x-full",
            )}
          >
            {displayFilterOption(mobileFilterOption.id)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
