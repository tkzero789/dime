"use client";

import React, { Dispatch, SetStateAction } from "react";
import { format, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import useWindowSize from "@/hooks/useWindowSize";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type Props = {
  setSortOption: Dispatch<SetStateAction<string>>;
  sorting: SortingState;
  setSorting: Dispatch<SetStateAction<SortingState>>;
  columnFilters: ColumnFiltersState;
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
};

export function IncomeFilterDate({
  setSortOption,
  sorting,
  setSorting,
  columnFilters,
  setColumnFilters,
}: Props) {
  const { width } = useWindowSize();
  const dateObject = columnFilters.find((item) => item.id === "date");
  const dateValue = columnFilters.find((item) => item.id === "date")
    ?.value as DateRange;

  const [date, setDate] = React.useState<DateRange | undefined>(
    dateValue || {
      from: startOfDay(new Date()),
      to: undefined,
    },
  );

  const handleChange = (date: DateRange | undefined) => {
    setDate(date);

    if (!dateObject) {
      setColumnFilters((prev) => [
        ...prev,
        {
          id: "date",
          value: date,
        },
      ]);
    } else {
      setColumnFilters((prev) => {
        const updatedColumnFilter = prev.map((item) => {
          if (item.id === "date") return { ...item, value: date };
          return item;
        });
        return updatedColumnFilter;
      });
    }

    if (date === undefined || date?.to === undefined) {
      setColumnFilters(columnFilters.filter((item) => item.id !== "date"));
    }
  };

  const handleSort = () => {
    setSorting(() => [
      {
        id: "date",
        desc: false,
      },
    ]);

    if (sorting[0]?.id === "date") {
      setSorting([]);
    }
  };

  const handleResetDate = () => {
    setDate({
      from: startOfDay(new Date()),
      to: undefined,
    });
    setSortOption("");
    setSorting([]);
    setColumnFilters(columnFilters.filter((item) => item.id !== "date"));
  };

  return (
    <div className="flex flex-col gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "h-12 justify-start font-normal lg:h-10",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>From - To</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="range"
            selected={date}
            onSelect={handleChange}
            initialFocus
            showOutsideDays={false}
            defaultMonth={date?.from}
            numberOfMonths={(width ?? 0) > 767 ? 2 : 1}
          />
        </PopoverContent>
      </Popover>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Switch
            checked={
              sorting.length !== 0 &&
              sorting.some((sortObject) => sortObject.id === "date")
            }
            onCheckedChange={() => {
              setSortOption("");
              handleSort();
            }}
          />
          <Label className="text-sm">Ascending</Label>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={
            !(
              columnFilters.some((item) => item.id === "date") ||
              sorting.some((item) => item.id === "date")
            )
          }
          onClick={handleResetDate}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
