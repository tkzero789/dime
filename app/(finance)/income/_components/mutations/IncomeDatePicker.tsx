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
          className="h-9 justify-between rounded-lg px-3 font-normal"
        >
          {format(date, "PPP")}
          <CalendarIcon />
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
