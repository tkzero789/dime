import FormatDate from "@/utils/formatDate";
import FormatNumber from "@/utils/formatNumber";
import React from "react";

type Props = {
  active?: boolean;
  payload?: { value: number; payload: { date: string } }[];
};

export default function LineCustomTooltip({ active, payload }: Props) {
  if (active && payload && payload.length) {
    const date = payload[0].payload.date;

    const dateOnChart = new Date(
      Date.UTC(new Date(date).getUTCFullYear(), new Date(date).getUTCMonth()),
    );

    const currentDate = new Date(
      Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth()),
    );

    const isSameDate =
      dateOnChart.getUTCFullYear() === currentDate.getUTCFullYear() &&
      dateOnChart.getUTCMonth() === currentDate.getUTCMonth();

    return (
      <div className="flex flex-col gap-1 rounded-lg border bg-white p-2 shadow-md">
        <p className="font-bold">
          {isSameDate ? (
            <FormatDate shortMonthNumDateUTC={new Date(date)} />
          ) : (
            " "
          )}
        </p>
        <div className="flex items-center gap-2">
          <div className="block h-3 w-3 rounded-sm bg-chart-outflow"></div>
          <p>
            Current Month:{" "}
            <span className="font-bold">
              $<FormatNumber number={payload[0].value} />
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-chart-outflow-blue block h-3 w-3 rounded-sm"></div>
          <p>
            Last Month:{" "}
            <span className="font-bold">
              $<FormatNumber number={payload[1].value} />
            </span>
          </p>
        </div>
      </div>
    );
  }

  return null;
}
