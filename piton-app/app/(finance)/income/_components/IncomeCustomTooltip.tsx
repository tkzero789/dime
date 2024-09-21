import FormatNumber from "@/utils/formatNumber";
import React from "react";

type Props = {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
};

export default function IncomeCustomTooltip({ active, payload, label }: Props) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-white p-2 shadow-md">
        <div className="flex items-center gap-2">
          <div className="block h-3 w-3 rounded-sm bg-[#2a9d90]"></div>
          <p className="font-bold">{`${label}`}</p>
        </div>
        <p>
          Income:{" "}
          <span className="font-bold">
            $<FormatNumber number={payload[0].value} />
          </span>
        </p>
      </div>
    );
  }

  return null;
}
