import FormatNumber from "@/utils/formatNumber";
import FormatString from "@/utils/formatString";
import React from "react";
import { TooltipProps } from "recharts";

export default function SpendingPieCustomTooltip({
  active,
  payload,
}: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    const getCategory = (name: string | undefined) => {
      switch (name) {
        case "Budget Expense":
          return "bg-teal-500";
        case "single payment":
          return "bg-teal-400";
        case "monthly subscription":
          return "bg-teal-300";
        case "loan":
          return "bg-sky-500";
        case "insurance":
          return "bg-sky-400";
        case "car payment":
          return "bg-sky-300";
        case "credit card payment":
          return "bg-sky-200";
        case "mortgage":
          return "bg-pink-500";
        case "rent":
          return "bg-pink-400";
        case "bill and utilities":
          return "bg-pink-300";
      }
      return null;
    };

    return (
      <div className="rounded border bg-white p-2 shadow-md">
        <div className="flex items-center gap-2">
          <div
            className={`block h-3 w-3 rounded-sm ${getCategory(payload[0].name)}`}
          ></div>
          <div className="flex gap-1">
            <p>
              <FormatString text={payload[0].name ?? ""} />:
            </p>
            <span className="font-bold">
              $<FormatNumber number={payload[0].value ?? 0} />
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
