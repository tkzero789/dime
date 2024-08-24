import { BudgetDetail, IncomeDetail } from "@/types/types";
import React from "react";
import { DashboardAreaChart } from "../chart/DashboardAreaChart";
import DashboardAccountCard from "../account/DashboardAccountCard";

type Props = {
  budgetData: BudgetDetail[];
  incomeData: IncomeDetail[];
};

export default function DashboardMainSection({
  budgetData,
  incomeData,
}: Props) {
  const [totalIncome, setTotalIncome] = React.useState<number>(0);
  const [currentSpend, setCurrentSpend] = React.useState<number>(0);
  const [potentialSave, setPotentialSave] = React.useState<number>(0);

  React.useEffect(() => {
    calculate();
  }, [incomeData, budgetData]);

  const calculate = () => {
    const incomeAmount = incomeData?.reduce(
      (acc, curr) => acc + Number(curr.amount),
      0,
    );

    const spendingAmount = budgetData?.reduce(
      (acc, curr) => acc + curr.total_spend,
      0,
    );

    const savingAmount = incomeAmount - spendingAmount;

    setTotalIncome(incomeAmount);
    setCurrentSpend(spendingAmount);
    setPotentialSave(savingAmount);
  };
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="col-span-3 xl:col-span-2">
        {" "}
        <DashboardAreaChart budgetData={budgetData} />
      </div>
      <div className="col-span-3 xl:col-span-1">
        <DashboardAccountCard
          totalIncome={totalIncome}
          currentSpend={currentSpend}
          potentialSave={potentialSave}
        />
      </div>
    </div>
  );
}
