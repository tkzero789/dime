"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SelectSingleEventHandler } from "react-day-picker";
import { BudgetExpenseState } from "@/types";

type Props = {
  date: Date;
  handleFormChange: (
    field: keyof BudgetExpenseState,
    value: string | Date,
  ) => void;
};

export function ExpenseDatePicker({ date, handleFormChange }: Props) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const defaultMonth = date || new Date();

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
          <CalendarIcon className="ml-auto h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          initialFocus
          mode="single"
          selected={date}
          onSelect={handleOnSelect}
          defaultMonth={defaultMonth}
          showOutsideDays={false}
        />
      </PopoverContent>
    </Popover>
  );
}
