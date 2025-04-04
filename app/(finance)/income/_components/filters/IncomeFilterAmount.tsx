import React, { Dispatch, SetStateAction } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ChevronFirst, ChevronLast, Equal } from "lucide-react";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

type Props = {
  sortOption: string;
  setSortOption: Dispatch<SetStateAction<string>>;
  sorting: SortingState;
  setSorting: Dispatch<SetStateAction<SortingState>>;
  columnFilters: ColumnFiltersState;
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
};

const options = [
  {
    value: "equal",
    label: "Equal",
    icon: Equal,
  },
  {
    value: "less than or equal",
    label: "Less than or equal",
    icon: ChevronFirst,
  },
  {
    value: "greater than or equal",
    label: "Greater than or equal",
    icon: ChevronLast,
  },
];

export default function IncomeFilterAmount({
  sortOption,
  setSortOption,
  sorting,
  setSorting,
  columnFilters,
  setColumnFilters,
}: Props) {
  const amountObject = columnFilters.find((item) => item.id === "amount");
  const amountValue = columnFilters.find((item) => item.id === "amount")
    ?.value as { value: string; operation: string };

  const [amount, setAmount] = React.useState<string>("");
  const [selectedOperation, setSelectedOperation] = React.useState<string>(
    amountValue?.operation || "equal",
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = Number(e.target.value);

    if (!amountObject) {
      setColumnFilters((prev) => [
        ...prev,
        {
          id: "amount",
          value: { value: formattedValue, operation: selectedOperation },
        },
      ]);
    }

    setColumnFilters((prev) => {
      const updatedColumnFilter = prev.map((item) => {
        if (item.id === "amount")
          return {
            ...item,
            value: { value: formattedValue, operation: selectedOperation },
          };
        return item;
      });
      return updatedColumnFilter;
    });

    if (formattedValue === 0) {
      setColumnFilters(columnFilters.filter((item) => item.id !== "amount"));
    }
  };

  const handleOperationChange = (operation: string) => {
    setSelectedOperation(operation);

    if (amountValue?.value) {
      setColumnFilters((prev) => {
        const updatedColumnFilter = prev.map((item) => {
          if (item.id === "amount")
            return {
              ...item,
              value: { value: amountValue.value, operation: operation },
            };
          return item;
        });
        return updatedColumnFilter;
      });
    }
  };

  const handleSort = (value: string) => {
    setSorting(() => [
      {
        id: "amount",
        desc: value === "ascending" ? false : true,
      },
    ]);

    if (value === "default") {
      setSorting([]);
    }
  };

  const handleResetAmount = () => {
    setSortOption("");
    setAmount("");
    setSorting([]);
    setColumnFilters(columnFilters.filter((item) => item.id !== "amount"));
  };

  return (
    <div className="flex flex-col gap-4">
      <Accordion
        type="single"
        defaultValue="equal"
        value={selectedOperation}
        onValueChange={handleOperationChange}
        className="flex flex-col gap-3 lg:gap-1"
      >
        {options.map((item) => (
          <AccordionItem
            key={item.value}
            value={item.value}
            className="border-0 hover:no-underline"
          >
            <AccordionTrigger className="h-11 rounded-md px-3 py-0 text-base font-normal hover:bg-muted hover:no-underline data-[state=open]:bg-muted lg:h-9 lg:text-sm">
              {item.label}
            </AccordionTrigger>
            <AccordionContent className="pb-1 lg:px-3">
              <div className="mt-2 flex items-center rounded-lg border">
                <div className="h-full px-3">
                  <item.icon className="h-4 w-4 stroke-[1.5]" />
                </div>

                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amountValue?.value ? amountValue.value : amount}
                  onChange={handleChange}
                  className="rounded-none border-b-0 border-l border-r-0 border-t-0 bg-transparent py-0 text-sm focus-visible:ring-0 lg:h-10"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="flex items-center justify-between">
        <Select
          value={sortOption}
          onValueChange={(value) => {
            setSortOption(value === "default" ? "" : value);
            handleSort(value);
          }}
        >
          <SelectTrigger className="h-9 w-36 text-sm">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ascending">Ascending</SelectItem>
            <SelectItem value="descending">Descending</SelectItem>
            {sortOption && <SelectItem value="default">Default</SelectItem>}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          disabled={
            !(
              columnFilters.some((item) => item.id === "amount") ||
              sorting.some((item) => item.id === "amount")
            )
          }
          onClick={handleResetAmount}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
