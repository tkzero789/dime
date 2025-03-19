import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ColumnFiltersState } from "@tanstack/react-table";
import React, { Dispatch, SetStateAction } from "react";

type Props = {
  columnFilters: ColumnFiltersState;
  setColumnFilter: Dispatch<SetStateAction<ColumnFiltersState>>;
};

const categoryOptions = [
  { value: "salary", label: "Salary" },
  { value: "business", label: "Business" },
  { value: "investments", label: "Investments" },
  { value: "rental income", label: "Rental Income" },
  { value: "pensions", label: "Pensions" },
];

export default function IncomeTableFilterCategory({
  columnFilters,
  setColumnFilter,
}: Props) {
  const categoryObject = columnFilters.find((item) => item.id === "category");
  const categoryValues =
    (columnFilters.find((item) => item.id === "category")?.value as string[]) ||
    [];

  const handleChange = (category: string) => {
    if (!categoryObject) {
      setColumnFilter((prev) => [
        ...prev,
        {
          id: "category",
          value: [category],
        },
      ]);
    } else {
      setColumnFilter((prev) => {
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
        setColumnFilter(columnFilters.filter((item) => item.id !== "category"));
      }

      setColumnFilter((prev) => {
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
    <div className="flex flex-col gap-2">
      {categoryOptions.map((item) => (
        <div
          key={item.value}
          className="group flex w-fit items-center gap-2 hover:cursor-pointer"
        >
          <Checkbox
            id={item.value}
            checked={categoryValues?.includes(item.value)}
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
