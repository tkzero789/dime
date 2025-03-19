import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ColumnFiltersState } from "@tanstack/react-table";
import React, { Dispatch, SetStateAction } from "react";

type Props = {
  columnFilters: ColumnFiltersState;
  setColumnFilter: Dispatch<SetStateAction<ColumnFiltersState>>;
};

const categoryOptions = [
  { value: "cash", label: "Cash" },
  { value: "check", label: "Check" },
  { value: "direct deposit", label: "Direct Deposit" },
  {
    value: "mobile payment",
    label: "Mobile Payment (Paypal, CashApp, Zelle, etc.)",
  },
  { value: "payroll card", label: "Payroll Card" },
];

export default function IncomeTableFilterPaymentMethod({
  columnFilters,
  setColumnFilter,
}: Props) {
  const paymentMethodObject = columnFilters.find(
    (item) => item.id === "payment_method",
  );
  const paymentMethodValues =
    (columnFilters.find((item) => item.id === "payment_method")
      ?.value as string[]) || [];

  const handleChange = (method: string) => {
    if (!paymentMethodObject) {
      setColumnFilter((prev) => [
        ...prev,
        {
          id: "payment_method",
          value: [method],
        },
      ]);
    } else {
      setColumnFilter((prev) => {
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
        setColumnFilter(
          columnFilters.filter((item) => item.id !== "payment_method"),
        );
      }

      setColumnFilter((prev) => {
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
    <div className="flex flex-col gap-2">
      {categoryOptions.map((item) => (
        <div
          key={item.value}
          className="group flex w-fit items-center gap-2 hover:cursor-pointer"
        >
          <Checkbox
            id={item.value}
            checked={paymentMethodValues?.includes(item.value)}
            onCheckedChange={() => handleChange(item.value)}
          />
          <Label
            htmlFor={item.value}
            className="text-sm font-normal group-hover:cursor-pointer group-hover:font-medium"
          >
            {item.label}
          </Label>
        </div>
      ))}
    </div>
  );
}
