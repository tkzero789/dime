import FormatDate from "@/utils/formatDate";
import FormatNumber from "@/utils/formatNumber";
import React from "react";

type Props = {
  active?: boolean;
  payload?: { payload: { date: string; amount: number } }[];
  label?: string;
};

export default function ExpenseCustomTooltip({ active, payload }: Props) {
  if (active && payload && payload.length) {
    const { date, amount } = payload[0].payload;
    return (
      <div className="flex flex-col gap-1 rounded-lg border bg-white p-2 shadow-md">
        <p className="font-bold">
          {<FormatDate shortMonthNumDateUTC={new Date(date)} />}
        </p>
        <div className="flex items-center gap-2">
          <div className="bg-chart-outflow-main block h-3 w-3 rounded-sm"></div>
          <p>
            Amount:{" "}
            <span className="font-bold">
              $<FormatNumber number={amount} />
            </span>
          </p>
        </div>
      </div>
    );
  }

  return null;
}
