import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColumnFiltersState } from "@tanstack/react-table";
import React, { Dispatch, SetStateAction } from "react";

type Props = {
  columnFilters: ColumnFiltersState;
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
};

export default function IncomeFilterName({
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
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Input
            placeholder="Enter name"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            className="h-12 text-sm lg:h-10"
          />
        </form>
        {keywordValues.length !== 0 && (
          <div className="flex flex-col gap-4 lg:gap-2">
            <div className="text-base lg:text-sm">
              Anything matching (case insensitive):
            </div>
            <div className="flex flex-col gap-4 lg:gap-2">
              {keywordValues?.map((item, index) => (
                <div
                  key={index}
                  className="group flex w-fit items-center gap-2 hover:cursor-pointer"
                >
                  <Checkbox
                    id={index.toString()}
                    checked={true}
                    onCheckedChange={() => handleRemove(index)}
                    className="size-5 lg:size-4"
                  />
                  <Label
                    htmlFor={index.toString()}
                    className="text-base font-normal group-hover:cursor-pointer group-hover:font-medium lg:text-sm"
                  >
                    {item}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        disabled={!columnFilters.some((item) => item.id === "name")}
        className="ml-auto w-fit"
        onClick={() =>
          setColumnFilters(columnFilters.filter((item) => item.id !== "name"))
        }
      >
        Reset
      </Button>
    </div>
  );
}
