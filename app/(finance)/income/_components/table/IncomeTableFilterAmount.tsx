import React, { Dispatch, SetStateAction } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { ChevronFirst, ChevronLast, Equal } from "lucide-react";
import { ColumnFiltersState } from "@tanstack/react-table";

type Props = {
  columnFilters: ColumnFiltersState;
  setColumnFilter: Dispatch<SetStateAction<ColumnFiltersState>>;
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

export default function IncomeTableFilterAmount({
  columnFilters,
  setColumnFilter,
}: Props) {
  const amountObject = columnFilters.find((item) => item.id === "amount");
  const amountValue = columnFilters.find((item) => item.id === "amount")
    ?.value as { value: number; operation: string } | undefined;

  const [selectedOperation, setSelectedOperation] = React.useState<string>(
    amountValue?.operation || "equal",
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = Number(e.target.value);

    if (!amountObject) {
      setColumnFilter((prev) => [
        ...prev,
        {
          id: "amount",
          value: { value: formattedValue, operation: selectedOperation },
        },
      ]);
    }

    setColumnFilter((prev) => {
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
      setColumnFilter(columnFilters.filter((item) => item.id !== "amount"));
    }
  };

  const handleOperationChange = (operation: string) => {
    setSelectedOperation(operation);

    if (amountValue?.value) {
      setColumnFilter((prev) => {
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

  console.log(columnFilters);

  return (
    <Accordion
      type="single"
      defaultValue="equal"
      value={selectedOperation}
      onValueChange={handleOperationChange}
      className="flex flex-col gap-1"
    >
      {options.map((item) => (
        <AccordionItem
          key={item.value}
          value={item.value}
          className="border-0 hover:no-underline"
        >
          <AccordionTrigger className="h-9 rounded-md px-3 py-0 text-sm font-normal hover:bg-muted hover:no-underline data-[state=open]:bg-muted">
            {item.label}
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-1">
            <div className="mt-2 flex items-center rounded-lg border">
              <div className="h-full px-3">
                <item.icon className="h-4 w-4 stroke-[1.5]" />
              </div>

              <Input
                type="number"
                placeholder="Enter amount"
                value={amountValue?.value}
                onChange={handleChange}
                className="h-10 rounded-none border-b-0 border-l border-r-0 border-t-0 bg-transparent py-0 text-sm focus-visible:ring-0"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
