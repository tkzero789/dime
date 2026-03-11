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

const YEARS_PER_DECADE = 10;

export function YearPicker() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedYear, setSelectedYear] = React.useState(
    new Date().getFullYear(),
  );
  const [decade, setDecade] = React.useState(
    () =>
      Math.floor(new Date().getFullYear() / YEARS_PER_DECADE) *
      YEARS_PER_DECADE,
  );

  const years = Array.from({ length: YEARS_PER_DECADE }, (_, i) => decade + i);

  const handleSelect = (year: number) => {
    setSelectedYear(year);
    setIsOpen(false);
  };

  const handleChange = (mode: "previous" | "next") => {
    if (mode === "previous") {
      setSelectedYear((year) => year - 1);
    } else if (mode === "next") {
      setSelectedYear((year) => year + 1);
    }
  };

  return (
    <ButtonGroup>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleChange("previous")}
      >
        <ChevronLeft />
      </Button>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline">{selectedYear}</Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[280px] p-3">
          <div className="mb-3 flex items-center justify-between">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setDecade((d) => d - YEARS_PER_DECADE)}
            >
              <ChevronLeft />
            </Button>
            <span className="text-sm font-medium">
              {decade} – {decade + YEARS_PER_DECADE - 1}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setDecade((d) => d + YEARS_PER_DECADE)}
            >
              <ChevronRight />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {years.map((year) => (
              <Button
                key={year}
                variant={year === selectedYear ? "default" : "ghost"}
                size="sm"
                onClick={() => handleSelect(year)}
              >
                {year}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleChange("next")}
      >
        <ChevronRight />
      </Button>
    </ButtonGroup>
  );
}
