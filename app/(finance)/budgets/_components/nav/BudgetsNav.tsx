"use client";

import React, { Dispatch, SetStateAction } from "react";
import CreateBudget from "../mutations/CreateBudget";
import { Separator } from "@/components/ui/separator";
import BudgetsDatePicker from "./BudgetsDatePicker";

type Props = {
  date: { from: string; to: string };
  setDate: Dispatch<SetStateAction<{ from: string; to: string }>>;
};

export default function BudgetsNav({ date, setDate }: Props) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white px-6 py-4 shadow-card-shadow">
      <h1 className="text-xl font-semibold">Budgets</h1>
      <div className="flex w-full items-center justify-end gap-4 md:w-auto">
        <BudgetsDatePicker date={date} setDate={setDate} />
        <Separator orientation="vertical" className="hidden h-5 lg:block" />
        <CreateBudget />
      </div>
    </div>
  );
}
