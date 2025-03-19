import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColumnFiltersState } from "@tanstack/react-table";
import React, { Dispatch, SetStateAction } from "react";

type Props = {
  columnFilters: ColumnFiltersState;
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
};

export default function IncomeTableFilterName({
  columnFilters,
  setColumnFilters,
}: Props) {
  const [keyword, setKeyword] = React.useState<string>("");

  const keywordObject = columnFilters.find((item) => item.id === "name");
  const keywordValues =
    (columnFilters.find((item) => item.id === "name")?.value as string[]) || [];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (keywordValues.includes(keyword) || keyword.trim() === "") {
      setKeyword("");
      return;
    }

    if (!keywordObject) {
      setColumnFilters((prev) => [
        ...prev,
        {
          id: "name",
          value: [keyword],
        },
      ]);
    } else {
      setColumnFilters((prev) => {
        const updatedColumnFilter = prev.map((item) => {
          if (item.id === "name")
            return {
              ...item,
              value: [...keywordValues, keyword],
            };
          return item;
        });
        return updatedColumnFilter;
      });
    }

    setKeyword("");
  };

  const handleRemove = (index: number) => {
    const filteredValues = keywordValues.filter(
      (_, indexToRemove) => indexToRemove !== index,
    );

    if (filteredValues.length === 0) {
      setColumnFilters(columnFilters.filter((item) => item.id !== "name"));
    }

    setColumnFilters((prev) => {
      const updatedColumnFilters = prev.map((item) => {
        if (item.id === "name")
          return {
            ...item,
            value: filteredValues,
          };
        return item;
      });
      return updatedColumnFilters;
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <Input
          placeholder="Enter name"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          className="h-10 text-sm"
        />
      </form>
      <div className="flex flex-col gap-2">
        {keywordValues?.map((item, index) => (
          <div
            key={index}
            className="group flex w-fit items-center gap-2 hover:cursor-pointer"
          >
            <Checkbox
              id={index.toString()}
              checked={true}
              onCheckedChange={() => handleRemove(index)}
            />
            <Label
              htmlFor={index.toString()}
              className="text-sm font-normal group-hover:cursor-pointer group-hover:font-medium"
            >
              {item}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
