import {
  ExpenseDetail,
  IncomeDetail,
  RecurrenceDetail,
  SingleDetail,
} from "@/types/types";
import React from "react";
import { DashboardLineChart } from "../chart/DashboardLineChart";
import DashboardAccountCard from "../account/DashboardAccountCard";

type Props = {
  spending: (ExpenseDetail | RecurrenceDetail | SingleDetail)[];
  income: IncomeDetail[];
};

export default function DashboardMainSection({ spending, income }: Props) {
  const [totalIncome, setTotalIncome] = React.useState<number>(0);
  const [currentSpend, setCurrentSpend] = React.useState<number>(0);
  const [potentialSave, setPotentialSave] = React.useState<number>(0);
  const currentMonth = new Date().getUTCMonth();

  React.useEffect(() => {
    calculate();
  }, [income, spending]);

  const calculate = () => {
    const incomeAmount = income?.reduce(
      (acc, curr) => acc + Number(curr.amount),
      0,
    );

    const currentMonthList = spending.filter((item) => {
      const itemMonth = new Date(item.date).getUTCMonth();
      return itemMonth === currentMonth;
    });

    const currentSpendingAmount = currentMonthList.reduce(
      (acc, curr) => acc + Number(curr.amount),
      0,
    );

    const savingAmount = incomeAmount - currentSpendingAmount;

    setTotalIncome(incomeAmount);
    setCurrentSpend(currentSpendingAmount);
    setPotentialSave(savingAmount);
  };
  return (
    <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="col-span-3 xl:col-span-2">
        <DashboardLineChart spending={spending} />
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
