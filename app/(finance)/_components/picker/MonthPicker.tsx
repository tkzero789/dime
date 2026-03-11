"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ButtonGroup } from "@/components/ui/button-group";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

type MonthPickerProps = {
  currentMonth: number;
  currentYear: number;
  onMonthChange: (month: number, year: number) => void;
};

export function MonthPicker({
  currentMonth,
  currentYear,
  onMonthChange,
}: MonthPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [popoverYear, setPopoverYear] = React.useState(currentYear);

  React.useEffect(() => {
    setPopoverYear(currentYear);
  }, [currentYear]);

  const handleSelect = (monthIndex: number) => {
    onMonthChange(monthIndex, popoverYear);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      onMonthChange(11, currentYear - 1);
    } else {
      onMonthChange(currentMonth - 1, currentYear);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      onMonthChange(0, currentYear + 1);
    } else {
      onMonthChange(currentMonth + 1, currentYear);
    }
  };

  return (
    <ButtonGroup>
      <Button variant="outline" size="icon" onClick={handlePrevMonth}>
        <ChevronLeft />
      </Button>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-9 text-base lg:text-sm">
            {MONTHS[currentMonth]} {currentYear}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="center" className="w-[280px] p-3">
          <div className="mb-3 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setPopoverYear((y) => y - 1)}
            >
              <ChevronLeft />
            </Button>
            <span className="text-sm font-medium">{popoverYear}</span>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setPopoverYear((y) => y + 1)}
            >
              <ChevronRight />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {MONTHS.map((month, index) => (
              <Button
                key={month}
                variant={
                  index === currentMonth && popoverYear === currentYear
                    ? "default"
                    : "ghost"
                }
                size="sm"
                onClick={() => handleSelect(index)}
              >
                {month}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <Button variant="outline" size="icon" onClick={handleNextMonth}>
        <ChevronRight />
      </Button>
    </ButtonGroup>
  );
}
