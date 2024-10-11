"use client";

import React from "react";
import BudgetItem from "./BudgetItem";
import { BudgetDetail } from "@/types/types";
import { Banknote } from "lucide-react";

type Props = {
  budgetList: BudgetDetail[];
};

export default function BudgetList({ budgetList }: Props) {
  return (
    <div className="order-last col-span-3 grid h-fit grid-cols-1 gap-y-2 xl:order-first xl:col-span-2 xl:grid-cols-2 xl:gap-4">
      {budgetList?.length > 0 ? (
        budgetList.map((budget) => (
          <BudgetItem key={budget.id} budget={budget} />
        ))
      ) : (
        <div className="col-span-3 flex w-full flex-col items-center justify-center px-6 pb-6 pt-0 text-center lg:pb-6 lg:pt-6">
          <div className="relative h-40 w-40">
            <Banknote
              className="h-full w-full"
              strokeWidth="0.75"
              color="#b0aeae"
            />
            <span className="absolute left-1/2 top-1/2 h-1 w-11/12 translate-x-[-50%] translate-y-[-50%] rotate-[30deg] rounded-full bg-[#b0aeae]"></span>
          </div>
          <div>
            <span className="block w-full text-xl font-bold">
              Empty Budget List
            </span>
            <span className="font-medium text-medium">
              Add a budget to start saving and tracking
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
