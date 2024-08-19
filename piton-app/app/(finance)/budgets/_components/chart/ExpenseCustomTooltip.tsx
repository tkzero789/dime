import FormatDate from "@/utils/formatDate";
import FormatNumber from "@/utils/formatNumber";
import React from "react";

type Props = {
  active?: boolean;
  payload?: any;
  label?: string;
};

export default function ExpenseCustomTooltip({ active, payload }: Props) {
  if (active && payload && payload.length) {
    const { date, amount } = payload[0].payload;
    return (
      <div className="flex flex-col gap-1 rounded-lg border bg-white p-2 shadow-md">
        <p className="label font-normal">
          {<FormatDate shortMonthNumDate={new Date(date)} />}
        </p>
        <p className="intro text-sm font-bold">
          $<FormatNumber number={amount} />
        </p>
      </div>
    );
  }

  return null;
}
