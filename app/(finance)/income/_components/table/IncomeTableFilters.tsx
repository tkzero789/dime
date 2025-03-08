import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ListFilter } from "lucide-react";

export default function IncomeTableFilters() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <ListFilter />
          Filters
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80">
        <div>Check</div>
      </PopoverContent>
    </Popover>
  );
}
