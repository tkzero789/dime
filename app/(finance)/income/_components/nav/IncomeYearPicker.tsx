"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

type Props = {
  currentYear: number;
  handleChangeYear: (year: number) => void;
};

export default function IncomeYearPicker({
  currentYear,
  handleChangeYear,
}: Props) {
  const isDesktop = useMediaQuery("(min-width: 1024px)", {
    initializeWithValue: false,
  });
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const yearsList = React.useMemo(() => {
    const baseYear = new Date().getUTCFullYear();
    return Array.from({ length: baseYear - 2021 + 1 }, (_, i) => baseYear - i);
  }, []);

  const handleSelect = (year: number) => {
    handleChangeYear(year);
    setIsOpen(false);
  };

  if (isDesktop) {
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
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          {currentYear}
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Income by year</DrawerTitle>
        </DrawerHeader>
        <div className="grid grid-cols-2 gap-2 px-4 pb-4">
          {yearsList.map((item, index) => (
            <Button
              key={index}
              onClick={() => handleSelect(item)}
              variant="ghost"
              className={
                currentYear === item
                  ? "bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                  : ""
              }
            >
              {item}
            </Button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
