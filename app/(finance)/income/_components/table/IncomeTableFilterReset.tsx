import React, { Dispatch, SetStateAction } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import { ColumnFiltersState } from "@tanstack/react-table";

type Props = {
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
};

export default function IncomeTableFilterReset({ setColumnFilters }: Props) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setColumnFilters([])}
          >
            <RotateCw />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Reset table</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
