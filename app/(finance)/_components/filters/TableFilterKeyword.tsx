import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ColumnFiltersState } from "@tanstack/react-table";
import React, { Dispatch, SetStateAction } from "react";

type Props = {
  columnId: string;
  placeholder: string;
  columnFilters: ColumnFiltersState;
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
};

export default function TableFilterKeyword({
  columnId,
  placeholder,
  columnFilters,
  setColumnFilters,
}: Props) {
  const [keyword, setKeyword] = React.useState<string>("");

  const keywordObject = columnFilters.find((item) => item.id === columnId);
  const keywordValues =
    (columnFilters.find((item) => item.id === columnId)?.value as string[]) ||
    [];

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
          id: columnId,
          value: [keyword],
        },
      ]);
    } else {
      setColumnFilters((prev) => {
        const updatedColumnFilter = prev.map((item) => {
          if (item.id === columnId)
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
      setColumnFilters(columnFilters.filter((item) => item.id !== columnId));
    }

    setColumnFilters((prev) => {
      const updatedColumnFilters = prev.map((item) => {
        if (item.id === columnId)
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
            placeholder={placeholder}
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </form>
        {keywordValues.length !== 0 && (
          <div className="flex flex-col gap-4 lg:gap-2">
            <div className="text-base lg:text-sm">
              Anything matching (case insensitive):
            </div>
            <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-2">
              {keywordValues?.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    "group flex h-12 w-full items-center gap-2 rounded-lg border px-4 hover:cursor-pointer lg:h-9",
                    keywordValues?.includes(item) &&
                      "border-primary bg-primary/10",
                  )}
                >
                  <Checkbox
                    id={index.toString()}
                    checked={keywordValues?.includes(item)}
                    onCheckedChange={() => handleRemove(index)}
                    className={cn(
                      "size-5 lg:size-4",
                      keywordValues?.includes(item) && "border-primary",
                    )}
                  />
                  <Label
                    htmlFor={index.toString()}
                    className="w-full text-base font-normal group-hover:cursor-pointer lg:text-sm lg:group-hover:font-medium"
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
