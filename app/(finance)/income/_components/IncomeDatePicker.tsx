"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SelectSingleEventHandler } from "react-day-picker";
import { IncomeState } from "@/types";
import { format } from "date-fns";

type Props = {
  date: Date;
  handleFormChange: (field: keyof IncomeState, value: string | Date) => void;
};

export function IncomeDatePicker({ date, handleFormChange }: Props) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const defaultMonth = date || new Date();
  const currentDate = new Date();
  const fromMonth = new Date(2010, 0);
  const toMonth = new Date(
    currentDate.getUTCFullYear(),
    currentDate.getUTCMonth(),
  );

  const handleOnSelect: SelectSingleEventHandler = (selectedDate) => {
    if (selectedDate) {
      handleFormChange("date", selectedDate);
    }
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-12 justify-between rounded-lg px-3 text-base font-normal"
        >
          {format(date, "PPP")}
          <CalendarIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleOnSelect}
          defaultMonth={defaultMonth}
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
