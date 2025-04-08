"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, ChevronUp } from "lucide-react";

type Props = {
  currentYear: number;
  handleChangeYear: (year: number) => void;
};

export default function IncomeYearToggle({
  currentYear,
  handleChangeYear,
}: Props) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const yearsList = React.useMemo(() => {
    const baseYear = new Date().getUTCFullYear();
    return Array.from({ length: baseYear - 2010 + 1 }, (_, i) => baseYear - i);
  }, []);

  const handleSelect = (year: number) => {
    handleChangeYear(year);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {currentYear}
          {isOpen ? <ChevronUp /> : <ChevronDown />}
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
