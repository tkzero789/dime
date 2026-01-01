"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronUp } from "lucide-react";

type Props = {
  currentYear: number;
  handleChangeYear: (year: number) => void;
};

export default function IncomeYearPicker({
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {currentYear}
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Income By Year</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="grid max-h-[156px] grid-cols-3 gap-2 overflow-y-auto">
          {yearsList.map((item, index) => (
            <DropdownMenuItem
              key={index}
              onClick={() => handleSelect(item)}
              className={
                currentYear === item ? "bg-primary text-primary-foreground" : ""
              }
            >
              {item}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
