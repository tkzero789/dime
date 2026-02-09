"use client";

import React from "react";
import { ChevronLeft, ChevronRight, PiggyBank } from "lucide-react";
import AddBudget from "@/app/(finance)/budgets/_components/form/AddBudget";
import { Separator } from "@/components/ui/separator";
import { useDesktop } from "@/hooks/use-desktop";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { YearPicker } from "@/app/(finance)/_components/picker/YearPicker";

export default function BudgetsNav() {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between bg-muted pb-4 pt-8">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
          <PiggyBank className="size-4 text-primary-foreground" />
        </div>
        <h1>Budgets</h1>
      </div>
      <div className="flex items-center justify-end gap-2 md:w-auto">
        <ButtonGroup>
          <Button variant="outline" size="icon">
            <ChevronLeft />
          </Button>
          <YearPicker />
          <Button variant="outline" size="icon">
            <ChevronRight />
          </Button>
        </ButtonGroup>
        <Separator orientation="vertical" className="hidden h-5 lg:block" />
        <AddBudget />
      </div>
    </div>
  );
}
