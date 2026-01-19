import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ColumnFiltersState } from "@tanstack/react-table";
import React, { Dispatch, SetStateAction } from "react";

type Props = {
  columnId: string;
  filterList: {
    label: string;
    value: string;
  }[];
  columnFilters: ColumnFiltersState;
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
};

export default function TableFilterCheckbox({
  columnId,
  filterList,
  columnFilters,
  setColumnFilters,
}: Props) {
  const categoryObject = columnFilters.find((item) => item.id === columnId);
  const categoryValues =
    (columnFilters.find((item) => item.id === columnId)?.value as string[]) ||
    [];

  const handleChange = (category: string) => {
    if (!categoryObject) {
      setColumnFilters((prev) => [
        ...prev,
        {
          id: columnId,
          value: [category],
        },
      ]);
    } else {
      setColumnFilters((prev) => {
        const updatedColumnFilter = prev.map((item) => {
          if (item.id === columnId)
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
        setColumnFilters(columnFilters.filter((item) => item.id !== columnId));
      }

      setColumnFilters((prev) => {
        const updatedFilters = prev.map((item) => {
          if (item.id === columnId)
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
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-2">
        {filterList.map((item) => (
          <div
            key={item.value}
            className={cn(
              "group flex h-12 w-full items-center gap-2 rounded-lg border px-4 hover:cursor-pointer lg:h-9",
              categoryValues?.includes(item.value) &&
                "border-primary bg-primary/10",
            )}
          >
            <Checkbox
              id={item.value}
              checked={categoryValues?.includes(item.value)}
              onCheckedChange={() => handleChange(item.value)}
              className={cn(
                "size-5 lg:size-4",
                categoryValues?.includes(item.value) && "border-primary",
              )}
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
        disabled={!columnFilters.some((item) => item.id === columnId)}
        className="ml-auto w-fit"
        onClick={() =>
          setColumnFilters(columnFilters.filter((item) => item.id !== columnId))
        }
      >
        Reset
      </Button>
    </div>
  );
}
