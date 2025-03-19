import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ColumnFiltersState } from "@tanstack/react-table";
import { ArrowRight } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";

type Props = {
  columnFilters: ColumnFiltersState;
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
};

export default function IncomeTableSearch({
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

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl">
      <Input
        placeholder="Search by name"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="h-10 w-full pr-12"
      />
      <Button
        size="icon"
        type="submit"
        className={cn(
          "absolute right-3 top-1/2 hidden size-6 -translate-y-1/2 rounded-full",
          keyword && "flex",
        )}
      >
        <ArrowRight className="!size-4" />
      </Button>
    </form>
  );
}
