import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ColumnFiltersState } from "@tanstack/react-table";
import React, { Dispatch, SetStateAction } from "react";

type Props = {
  columnFilters: ColumnFiltersState;
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
};

const categoryOptions = [
  { value: "cash", label: "Cash" },
  { value: "check", label: "Check" },
  { value: "direct deposit", label: "Direct Deposit" },
  {
    value: "mobile payment",
    label: "Mobile Payment",
  },
  { value: "payroll card", label: "Payroll Card" },
];

export default function IncomeFilterPayment({
  columnFilters,
  setColumnFilters,
}: Props) {
  const paymentMethodObject = columnFilters.find(
    (item) => item.id === "payment_method",
  );
  const paymentMethodValues =
    (columnFilters.find((item) => item.id === "payment_method")
      ?.value as string[]) || [];

  const handleChange = (method: string) => {
    if (!paymentMethodObject) {
      setColumnFilters((prev) => [
        ...prev,
        {
          id: "payment_method",
          value: [method],
        },
      ]);
    } else {
      setColumnFilters((prev) => {
        const updatedColumnFilter = prev.map((item) => {
          if (item.id === "payment_method")
            return {
              ...item,
              value: [...paymentMethodValues, method],
            };
          return item;
        });
        return updatedColumnFilter;
      });
    }

    if (paymentMethodValues.includes(method)) {
      const filteredValues = paymentMethodValues.filter(
        (item) => item !== method,
      );

      if (filteredValues.length === 0) {
        setColumnFilters(
          columnFilters.filter((item) => item.id !== "payment_method"),
        );
      }

      setColumnFilters((prev) => {
        const updatedFilters = prev.map((item) => {
          if (item.id === "payment_method")
            return {
              ...item,
              value: filteredValues,
            };
          return item;
        });
        return updatedFilters;
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:gap-2">
        {categoryOptions.map((item) => (
          <div
            key={item.value}
            className="group flex h-12 w-full items-center gap-2 rounded-lg border px-4 hover:cursor-pointer lg:h-auto lg:w-fit lg:rounded-none lg:border-0 lg:px-0"
          >
            <Checkbox
              id={item.value}
              checked={paymentMethodValues?.includes(item.value)}
              onCheckedChange={() => handleChange(item.value)}
              className="size-5 lg:size-4"
            />
            <Label
              htmlFor={item.value}
              className="w-full text-base font-normal group-hover:cursor-pointer lg:text-sm lg:group-hover:font-medium"
            >
              {item.label}
            </Label>
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        disabled={!columnFilters.some((item) => item.id === "payment_method")}
        className="ml-auto w-fit"
        onClick={() =>
          setColumnFilters(
            columnFilters.filter((item) => item.id !== "payment_method"),
          )
        }
      >
        Reset
      </Button>
    </div>
  );
}
