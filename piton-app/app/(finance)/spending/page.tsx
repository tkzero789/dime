import React from "react";
import SpendingSearch from "./_components/search/SpendingSearch";
import BudgetExpense from "./_components/transaction/AllTransaction";

export default function SpendingPage() {
  return (
    <div className="min-h-dvh bg-[#f5f5f5] px-4 py-6 sm:px-20 sm:py-16">
      <h2 className="text-2xl font-bold">Spending</h2>
      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <SpendingSearch />
          <BudgetExpense />
        </div>
        <div>Chart</div>
      </div>
    </div>
  );
}
