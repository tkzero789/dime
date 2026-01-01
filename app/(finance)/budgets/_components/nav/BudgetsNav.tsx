"use client";

import React, { Dispatch, SetStateAction } from "react";
import CreateBudget from "../mutations/CreateBudget";
import { Separator } from "@/components/ui/separator";
import BudgetsDatePicker from "./BudgetsDatePicker";
import { PiggyBank } from "lucide-react";

type Props = {
  date: { from: string; to: string };
  setDate: Dispatch<SetStateAction<{ from: string; to: string }>>;
};

export default function BudgetsNav({ date, setDate }: Props) {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between bg-muted py-4">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
          <PiggyBank className="size-4 text-primary-foreground" />
        </div>
        <h1>Budgets</h1>
      </div>
      <div className="flex w-full items-center justify-end gap-4 md:w-auto">
        <BudgetsDatePicker date={date} setDate={setDate} />
        <Separator orientation="vertical" className="hidden h-5 lg:block" />
        <CreateBudget />
      </div>
    </div>
  );
}
