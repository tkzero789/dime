"use client";

import { useQuery } from "@tanstack/react-query";
import { getBudgetData } from "@/lib/api/budgets";
import { queryKeys } from "@/lib/queryKeys";
import BudgetItem from "./BudgetItem";
import { LoaderCircle } from "lucide-react";

export default function BudgetList() {
  const { data: budgets, isLoading } = useQuery({
    queryKey: queryKeys.budgets.all(),
    queryFn: () => getBudgetData(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!budgets || budgets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No budgets yet</p>
        <p className="text-sm text-muted-foreground">
          Click &quot;Add budget&quot; to create your first budget
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {budgets.map((budget) => (
        <BudgetItem key={budget.id} budget={budget} />
      ))}
    </div>
  );
}
