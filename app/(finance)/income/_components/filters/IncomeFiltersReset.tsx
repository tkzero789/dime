import React, { Dispatch, SetStateAction } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";

type Props = {
  setSortOption: Dispatch<SetStateAction<string>>;
  setSorting: Dispatch<SetStateAction<SortingState>>;
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
};

export default function IncomeFiltersReset({
  setSortOption,
  setSorting,
  setColumnFilters,
}: Props) {
  const handleResetFilters = () => {
    setSortOption("");
    setSorting([]);
    setColumnFilters([]);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={handleResetFilters}
            className="hidden lg:flex"
          >
            <RotateCw />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Reset filters</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
