"use client";

import React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { ExpenseDetail, RecurrenceDetail, SingleDetail } from "@/types/types";
import GetCurrentMonth from "@/utils/getCurrentMonth";
import LineCustomTooltip from "./LineCustomTooltip";
import useWindowSize from "@/hooks/useWindowSize";

export const description = "A multiple line chart";

const chartConfig = {
  current: {
    label: "Current",
    color: "hsl(var(--chart-2))",
  },
  prev: {
    label: "Prev",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

type Props = {
  spending: (ExpenseDetail | RecurrenceDetail | SingleDetail)[];
};

export function DashboardLineChart({ spending }: Props) {
  const { width } = useWindowSize();
  const currentMonth = new Date().getUTCMonth();
  const prevMonth = new Date();
  prevMonth.setUTCMonth(currentMonth - 1);
  const currentYear = new Date().getUTCFullYear();

  // Generate an array of all dates for the current month
  const allDates = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    return new Date(Date.UTC(currentYear, currentMonth, day))
      .toISOString()
      .split("T")[0];
  });

  const currentSpendingList = spending?.filter((item) => {
    const itemMonth = new Date(item.date).getUTCMonth();
    return itemMonth === currentMonth;
  });

  const prevSpendingList = spending?.filter((item) => {
    const itemMonth = new Date(item.date).getUTCMonth();
    return itemMonth !== currentMonth;
  });

  let lastCurrentAmount = 0;
  let lastPrevAmount = 0;
  const addedItemsSet = new Set<string>();

  const mergedSpendingList = allDates.map((date) => {
    const currentItems: (ExpenseDetail | RecurrenceDetail | SingleDetail)[] =
      currentSpendingList.filter((item) => item.date === date);

    const prevItems: (ExpenseDetail | RecurrenceDetail | SingleDetail)[] =
      prevSpendingList.filter((item) => {
        const itemDate = new Date(item.date);
        const isSameDate =
          itemDate.getUTCDate() === new Date(date).getUTCDate();
        const isLastDayOfPrevMonth =
          new Date(date).getUTCMonth() === (currentMonth + 1) % 12 &&
          new Date(date).getUTCFullYear() ===
            (currentMonth === 11 ? currentYear + 1 : currentYear);

        const shouldAddItem =
          (isSameDate || isLastDayOfPrevMonth) && !addedItemsSet.has(item.id);

        if (shouldAddItem) {
          addedItemsSet.add(item.id);
        }
        return shouldAddItem;
      });

    const currentAmount = currentItems
      ? currentItems.reduce(
          (sum, item) => sum + Number(item.amount),
          lastCurrentAmount,
        )
      : lastCurrentAmount;

    const prevAmount = prevItems
      ? prevItems.reduce(
          (sum, item) => sum + Number(item.amount),
          lastPrevAmount,
        )
      : lastPrevAmount;

    lastCurrentAmount = currentAmount;
    lastPrevAmount = prevAmount;

    return {
      date,
      currentAmount,
      prevAmount,
    };
  });

  const newSpendingList = mergedSpendingList.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return (
    <Card className="rounded-lg border shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold tracking-normal">
          <GetCurrentMonth monthYear={new Date()} />
        </CardTitle>
        <CardDescription className="text-medium">
          Daily spending trends for{" "}
          <span>{prevMonth.toLocaleString("en-US", { month: "long" })}</span>{" "}
          vs. <GetCurrentMonth month={new Date()} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={newSpendingList}
            margin={{
              left: 12,
              right: 12,
              top: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            {(width ?? 0) > 767 && (
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value, index) => {
                  const date = new Date(value);
                  const day = date.getUTCDate();
                  const isLastDate = index === newSpendingList.length - 1;
                  return isLastDate
                    ? ""
                    : day % 2 !== 0
                      ? `${String(day)}`
                      : "";
                }}
              />
            )}

            <ChartTooltip content={<LineCustomTooltip />} />
            <Line
              dataKey="currentAmount"
              type="monotone"
              stroke="var(--color-current)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="prevAmount"
              type="monotone"
              stroke="var(--color-prev)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
