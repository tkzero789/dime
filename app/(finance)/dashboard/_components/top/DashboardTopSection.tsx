import {
  AccountDetail,
  ExpenseDetail,
  RecurrenceDetail,
  SingleDetail,
} from "@/types/types";
import React from "react";
import { DashboardLineChart } from "../chart/DashboardLineChart";
import { CardSkeleton } from "@/components/ui/card-skeleton";
import DashboardAccount from "./DashboardAccount";

type Props = {
  accounts: AccountDetail[];
  spending: (ExpenseDetail | RecurrenceDetail | SingleDetail)[];
  isLoading: boolean;
};

export default function DashboardTopSection({
  accounts,
  spending,
  isLoading,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="col-span-3 xl:col-span-2">
        {isLoading ? (
          <CardSkeleton
            title={true}
            titleWidth={30}
            rectangle={1}
            height={26}
          />
        ) : (
          <DashboardLineChart spending={spending} />
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
          <DashboardAccount accounts={accounts} />
        )}
      </div>
    </div>
  );
}
