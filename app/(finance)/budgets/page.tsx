import React from "react";
import BudgetsNav from "./_components/nav/BudgetsNav";
import BudgetList from "./_components/list/BudgetList";

export default function BudgetPage() {
  return (
    <>
      <BudgetsNav />
      <div className="pb-8">
        <BudgetList />
      </div>
    </>
  );
}
