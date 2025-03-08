import FormatNumber from "@/utils/formatNumber";
import React from "react";

type Props = {
  active?: boolean;
  payload?: { payload: { month: string; income: number; spending: number } }[];
  label?: string;
};

export default function SpendingBarCustomTooltip({ active, payload }: Props) {
  if (active && payload && payload.length) {
    return (
      <div className="flex flex-col gap-1 rounded-lg border bg-white p-2 shadow-md">
        <p className="font-bold">{payload[0].payload.month.split(" ")[0]}</p>
        <div className="flex items-center gap-2">
          <div className="block h-3 w-3 rounded-sm bg-chart-inflow"></div>
          <p>
            Income:{" "}
            <span className="font-bold">
              $<FormatNumber number={payload[0].payload.income} />
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-chart-outflow-comparative block h-3 w-3 rounded-sm"></div>
          <p>
            Spending:{" "}
            <span className="font-bold">
              $<FormatNumber number={payload[1].payload.spending} />
            </span>
          </p>
        </div>
      </div>
    );
  }

  return null;
}
