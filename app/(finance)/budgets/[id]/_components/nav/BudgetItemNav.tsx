"use client";

import React from "react";
import EditBudget from "../../../_components/mutations/EditBudget";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import { AccountData, BudgetData } from "@/types";
import DeleteBudget from "../../../_components/mutations/DeleteBudget";
import { Separator } from "@/components/ui/separator";
import AddBudgetExpense from "../mutations/AddBudgetExpense";

type Props = {
  budgetData: BudgetData | undefined;
  accountData: AccountData[];
};

export default function BudgetItemNav({ budgetData, accountData }: Props) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-card-shadow">
      <div className="flex items-center justify-between">
        <div className="hidden items-center gap-2 lg:flex">
          <div className="text-xl">{budgetData?.emoji}</div>
          <h1 className="text-xl font-semibold">{budgetData?.category}</h1>
        </div>
        <div className="flex w-full items-center justify-between gap-4 lg:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Settings2 />
                Manage budget
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-1">
              <EditBudget budgetData={budgetData} />
              <DeleteBudget budgetId={budgetData?.id} />
            </PopoverContent>
          </Popover>
          <Separator orientation="vertical" className="hidden h-5 lg:block" />
          <AddBudgetExpense
            budgetId={budgetData?.id}
            budgetCategory={budgetData?.category}
            accountData={accountData}
          />
        </div>
      </div>
    </div>
  );
}
