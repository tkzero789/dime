import useWindowSize from "@/hooks/useWindowSize";
import FormatNumber from "@/utils/formatNumber";
import React from "react";

type Props = {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
};

export default function IncomeCustomTooltip({ active, payload, label }: Props) {
  const { width } = useWindowSize();

  const formatLabel = (label: string) => {
    const monthIndex = parseInt(label, 10);
    return new Date(0, monthIndex).toLocaleDateString("default", {
      month: "short",
    });
  };

  const displayLabel = (width ?? 0) < 768 ? formatLabel(label ?? "") : label;

  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-white p-2 shadow-md">
        <div className="flex items-center gap-2">
          <div className="block h-3 w-3 rounded-sm bg-[#2a9d90]"></div>
          <p className="font-bold">{`${displayLabel}`}</p>
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
