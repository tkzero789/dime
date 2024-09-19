import FormatNumber from "@/utils/formatNumber";
import React from "react";

type Props = {
  active?: boolean;
  payload?: any[];
};

export default function LineCustomTooltip({ active, payload }: Props) {
  if (active && payload && payload.length) {
    const { currentAmount, prevAmount } = payload[0].payload;
    return (
      <div className="flex flex-col gap-1 rounded-lg border bg-white p-2 shadow-md">
        <div className="flex items-center gap-2">
          <div className="block h-3 w-3 rounded-sm bg-[#e79508]"></div>
          <p>
            Current Month:{" "}
            <span className="font-bold">
              $<FormatNumber number={currentAmount} />
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="block h-3 w-3 rounded-sm bg-[#2a9d90]"></div>
          <p>
            Last Month:{" "}
            <span className="font-bold">
              $<FormatNumber number={prevAmount} />
            </span>
          </p>
        </div>
      </div>
    );
  }

  return null;
}
