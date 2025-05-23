import { BudgetExpenseData, RecurrenceDetail, SingleDetail } from "@/types";
import React from "react";
import DashboardAccounts from "./DashboardAccounts";
import { DashboardLineChart } from "../chart/DashboardLineChart";
import { CardSkeleton } from "@/components/ui/card-skeleton";

type Props = {
  spending: (BudgetExpenseData | RecurrenceDetail | SingleDetail)[];
  isLoading: boolean;
};

export default function DashboardTopSection({ spending, isLoading }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="col-span-3 xl:col-span-2">
        {isLoading ? (
          <CardSkeleton
            title={true}
            titleWidth={30}
            rectangle={1}
            height={18}
          />
        ) : (
          <DashboardLineChart spending={spending} />
        )}
      </div>
      <div className="col-span-3 xl:col-span-1">
        <DashboardAccounts />
      </div>
    </div>
  );
}
