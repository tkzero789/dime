import FormatNumber from "@/utils/formatNumber";
import FormatString from "@/utils/formatString";
import React from "react";
import { TooltipProps } from "recharts";

export default function SpendingMethodCustomTooltip({
  active,
  payload,
}: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    const getPaymentMethod = (name: string | undefined) => {
      switch (name) {
        case "cash":
          return "bg-amber-500";
        case "check":
          return "bg-sky-400";
        case "credit card":
          return "bg-pink-500";
        case "debit card":
          return "bg-sky-500";
        case "direct deposit":
          return "bg-sky-300";
        case "mobile payment":
          return "bg-pink-400";
        case "payroll card":
          return "bg-pink-300";
        case "prepaid card":
          return "bg-pink-200";
      }
      return null;
    };

    return (
      <div className="rounded border bg-white p-2 shadow-md">
        <div className="flex items-center gap-2">
          <div
            className={`block h-3 w-3 rounded-sm ${getPaymentMethod(payload[0].name)}`}
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
