"use client";

import React from "react";
import EditBudget from "../../_components/budget/EditBudget";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import { BudgetData } from "@/types";
import DeleteBudget from "../../_components/budget/DeleteBudget";
import { Separator } from "@/components/ui/separator";
import AddExpense from "./AddExpense";
import { useMediaQuery } from "usehooks-ts";

type Props = {
  paramsId: string;
  budgetData: BudgetData[];
  currentUser: string | undefined;
  refreshData: () => void;
};

export default function BudgetItemNav({
  paramsId,
  budgetData,
  currentUser,
  refreshData,
}: Props) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  return (
    <div className="rounded-xl bg-white p-4 shadow-card-shadow">
      <div className="flex items-center justify-between">
        <div className="hidden items-center gap-2 lg:flex">
          <div className="text-xl">{budgetData[0]?.emoji}</div>
          <h1 className="text-xl font-semibold">{budgetData[0]?.category}</h1>
        </div>
        <div className="flex w-full items-center justify-between gap-4 md:w-auto md:justify-normal">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Settings2 />
                Manage budget
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align={isDesktop ? "end" : "start"}
              className="w-40 p-1"
            >
              <EditBudget budgetData={budgetData} />
              <DeleteBudget paramsId={paramsId} />
            </PopoverContent>
          </Popover>
          <Separator orientation="vertical" className="hidden h-5 md:block" />
          <AddExpense
            paramsId={paramsId}
            currentUser={currentUser}
            refreshData={refreshData}
          />
        </div>
      </div>
    </div>
  );
}
