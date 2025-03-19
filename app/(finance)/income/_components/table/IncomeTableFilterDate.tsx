"use client";

import * as React from "react";
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
import { ColumnFiltersState } from "@tanstack/react-table";

type Props = {
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
};

export function IncomeTableFilterDate({
  columnFilters,
  setColumnFilters,
}: Props) {
  const dateObject = columnFilters.find((item) => item.id === "date");
  const dateValue = columnFilters.find((item) => item.id === "date")
    ?.value as DateRange;

  const [date, setDate] = React.useState<DateRange | undefined>(
    dateValue || {
      from: startOfDay(new Date()),
      to: "",
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

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "justify-start font-normal",
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
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
