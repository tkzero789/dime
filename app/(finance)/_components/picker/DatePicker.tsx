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
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type Props<TField> = {
  date: Date | undefined;
  label?: string;
  field: keyof TField;
  handleFormChange: (field: keyof TField, value: string | Date) => void;
};

export function DatePicker<TField>({
  date,
  label,
  field,
  handleFormChange,
}: Props<TField>) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const defaultMonth = date || new Date();

  const handleOnSelect: SelectSingleEventHandler = (selectedDate) => {
    if (selectedDate) {
      handleFormChange(field, selectedDate);
    }
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-12 justify-between text-base lg:h-9 lg:text-sm",
            date ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {date ? format(date, "MMM dd, yyyy") : label}
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
          formatters={{
            formatCaption: (date) => format(date, "MMM yyyy"),
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
