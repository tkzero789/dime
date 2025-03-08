"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";

type Props = {
  currentYear: number;
  handleYearChange: (year: number) => void;
};

export function IncomeToggleYear({ currentYear, handleYearChange }: Props) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const yearsList = React.useMemo(() => {
    const baseYear = new Date().getUTCFullYear();
    return Array.from({ length: baseYear - 2010 + 1 }, (_, i) => baseYear - i);
  }, []);

  const handleSelect = (year: number) => {
    handleYearChange(year);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {currentYear}
          <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="grid max-h-[156px] w-auto grid-cols-3 gap-2 overflow-y-auto"
      >
        {yearsList.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className={`${item === currentYear && "bg-muted"}`}
            onClick={() => handleSelect(item)}
          >
            {item}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
