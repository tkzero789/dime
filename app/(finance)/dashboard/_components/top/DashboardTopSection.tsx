import {
  ExpenseDetail,
  IncomeDetail,
  RecurrenceDetail,
  SingleDetail,
} from "@/types/types";
import React from "react";
import { DashboardLineChart } from "../chart/DashboardLineChart";
import { CardSkeleton } from "@/components/ui/card-skeleton";
import DashboardFinanceOverview from "./DashboardFinanceOverview";

type Props = {
  spending: (ExpenseDetail | RecurrenceDetail | SingleDetail)[];
  income: IncomeDetail[];
  isLoading: boolean;
};

export default function DashboardTopSection({
  spending,
  income,
  isLoading,
}: Props) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="col-span-3 xl:col-span-2">
        {isLoading ? (
          <CardSkeleton
            title={true}
            titleWidth={30}
            rectangle={1}
            height={26}
          />
        ) : (
          <DashboardLineChart spending={spending} income={income} />
        )}
      </div>
      <div className="col-span-3 xl:col-span-1">
        {isLoading ? (
          <CardSkeleton
            title={true}
            titleWidth={40}
            rectangle={1}
            height={26}
          />
        ) : (
          <DashboardFinanceOverview />
        )}
      </div>
    </div>
  );
}
