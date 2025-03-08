"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import "@/css/calendar.css";
import { SelectSingleEventHandler } from "react-day-picker";
import { IncomeState } from "@/types";

type Props = {
  date: Date;
  handleFormChange: (field: keyof IncomeState, value: string | Date) => void;
};

export function IncomeDatePicker({ date, handleFormChange }: Props) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const currentDate = new Date();
  const fromMonth = new Date(1900, 0);
  const toMonth = new Date(currentDate.getFullYear(), currentDate.getMonth());

  const handleOnSelect: SelectSingleEventHandler = (date) => {
    if (date) {
      handleFormChange("date", date);
    }
    setIsOpen(false);
  };
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-12 rounded-lg px-3 text-base font-normal",
            !date && "text-muted-foreground",
          )}
        >
          {date ? format(date, "PPP") : <span>Date</span>}
          <CalendarIcon className="ml-auto h-5 w-5" strokeWidth={1.5} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleOnSelect}
          initialFocus
          disableNavigation={false}
          showOutsideDays={false}
          fromMonth={fromMonth}
          toMonth={toMonth}
        />
      </PopoverContent>
    </Popover>
  );
}
