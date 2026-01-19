"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronUp } from "lucide-react";

type Props = {
  currentYear: number;
  handleYearChange: (year: number) => void;
};

export default function SpendingYearPicker({
  currentYear,
  handleYearChange,
}: Props) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const yearsList = React.useMemo(() => {
    const baseYear = new Date().getUTCFullYear();
    return Array.from({ length: baseYear - 2021 + 1 }, (_, i) => baseYear - i);
  }, []);

  const handleSelect = (year: number) => {
    handleYearChange(year);
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
      <DropdownMenuContent
        align="end"
        className="grid max-h-[156px] grid-cols-3 gap-2 overflow-y-auto"
      >
        {yearsList.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => handleSelect(item)}
            className={
              currentYear === item
                ? "bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                : ""
            }
          >
            {item}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
