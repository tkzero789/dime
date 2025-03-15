import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
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

  const keywordList = columnFilters.find((item) => {
    if (item.id === "name") return item.value;
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const keywordItems = keywordList?.value as string[];

    if (keywordItems && keywordItems.includes(keyword)) {
      console.log("duplicate");
      setKeyword("");
      return;
    } else {
      setColumnFilters(() => [
        {
          id: "name",
          value:
            columnFilters.length === 0
              ? [keyword]
              : [...(columnFilters[0]?.value as string[]), keyword],
        },
      ]);
    }

    setKeyword("");
  };

  const handleRemove = (index: number) => {
    const valueArray = columnFilters[0]?.value as string[];
    const newValueArray = valueArray.filter(
      (_, indexToRemove) => indexToRemove !== index,
    );

    if (newValueArray.length !== 0) {
      setColumnFilters(() => [
        {
          id: "name",
          value: newValueArray,
        },
      ]);
    } else {
      setColumnFilters(columnFilters.filter((item) => item.id !== "name"));
    }
  };

  console.log(columnFilters);

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <Input
          placeholder="Keyword"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          className="h-8 text-sm"
        />
      </form>
      <div className="flex flex-col gap-2">
        {(keywordList?.value as string[])?.map((item, index) => (
          <button
            key={index}
            className="flex w-fit items-center justify-start gap-2 rounded-lg text-sm hover:cursor-pointer hover:font-medium"
            onClick={() => handleRemove(index)}
          >
            <Checkbox checked={true} />
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
