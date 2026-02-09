"use client";

import React from "react";

import { useDesktop } from "@/hooks/use-desktop";
import AddTransaction from "@/app/(finance)/transactions/_components/form/AddTransaction";
import EditBudget from "@/app/(finance)/budgets/_components/form/EditBudget";

import { FormatString } from "@/lib/utils";
import { TRANSACTION_CATEGORIES } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import { BudgetData } from "@/types";

type Props = {
  budget: BudgetData;
};

export default function BudgetDetailNav({ budget }: Props) {
  const isDesktop = useDesktop();
  const iconCategory = TRANSACTION_CATEGORIES.expense.find(
    (icon) => icon.value === budget.category,
  );
  const Icon = iconCategory?.icon;

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between bg-muted pb-4 pt-8">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
          {Icon && <Icon className="size-4 text-primary-foreground" />}
        </div>
        <h1>
          <FormatString text={budget.category} split="_" />
        </h1>
      </div>
      <div className="flex items-center justify-end gap-2 md:w-auto">
        <EditBudget budgetData={budget} />
        <Separator orientation="vertical" className="hidden h-5 lg:block" />
        {isDesktop && <AddTransaction />}
      </div>
    </div>
  );
}
