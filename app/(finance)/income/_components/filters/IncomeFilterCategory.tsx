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
  { value: "salary", label: "Salary" },
  { value: "business", label: "Business" },
  { value: "investments", label: "Investments" },
  { value: "rental income", label: "Rental Income" },
  { value: "pensions", label: "Pensions" },
];

export default function IncomeFilterCategory({
  columnFilters,
  setColumnFilters,
}: Props) {
  const categoryObject = columnFilters.find((item) => item.id === "category");
  const categoryValues =
    (columnFilters.find((item) => item.id === "category")?.value as string[]) ||
    [];

  const handleChange = (category: string) => {
    if (!categoryObject) {
      setColumnFilters((prev) => [
        ...prev,
        {
          id: "category",
          value: [category],
        },
      ]);
    } else {
      setColumnFilters((prev) => {
        const updatedColumnFilter = prev.map((item) => {
          if (item.id === "category")
            return {
              ...item,
              value: [...categoryValues, category],
            };
          return item;
        });
        return updatedColumnFilter;
      });
    }

    if (categoryValues.includes(category)) {
      const filteredValues = categoryValues.filter((item) => item !== category);

      if (filteredValues.length === 0) {
        setColumnFilters(
          columnFilters.filter((item) => item.id !== "category"),
        );
      }

      setColumnFilters((prev) => {
        const updatedFilters = prev.map((item) => {
          if (item.id === "category")
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
              checked={categoryValues?.includes(item.value)}
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
        disabled={!columnFilters.some((item) => item.id === "category")}
        className="ml-auto w-fit"
        onClick={() =>
          setColumnFilters(
            columnFilters.filter((item) => item.id !== "category"),
          )
        }
      >
        Reset
      </Button>
    </div>
  );
}
