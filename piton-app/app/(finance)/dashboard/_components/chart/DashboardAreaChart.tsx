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
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ExpenseDetail, RecurrenceDetail, SingleDetail } from "@/types/types";
import GetCurrentMonth from "@/utils/getCurrentMonth";

export const description = "A multiple line chart";

const chartConfig = {
  current: {
    label: "Current",
    color: "hsl(var(--chart-1))",
  },
  prev: {
    label: "Prev",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type Props = {
  spending: (ExpenseDetail | RecurrenceDetail | SingleDetail)[];
};

export function DashboardAreaChart({ spending }: Props) {
  const currentMonth = new Date().getUTCMonth();
  const prevMonth = new Date();
  prevMonth.setUTCMonth(currentMonth - 1);
  const currentYear = new Date().getUTCFullYear();

  // Generate an array of all dates for the current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getUTCDate();
  const allDates = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    return new Date(Date.UTC(currentYear, currentMonth, day))
      .toISOString()
      .split("T")[0];
  });

  const currentSpendingList = spending.filter((item) => {
    const itemMonth = new Date(item.date).getUTCMonth();
    return itemMonth === currentMonth;
  });

  const prevSpendingList = spending.filter((item) => {
    const itemMonth = new Date(item.date).getUTCMonth();
    return itemMonth !== currentMonth;
  });

  const mergedSpendingList = allDates.map((date) => {
    const currentItems: (ExpenseDetail | RecurrenceDetail | SingleDetail)[] =
      currentSpendingList.filter((item) => item.date === date);
    const prevItems: (ExpenseDetail | RecurrenceDetail | SingleDetail)[] =
      prevSpendingList.filter((item) => {
        const itemDate = new Date(item.date);
        return (
          itemDate.getUTCDate() === new Date(date).getUTCDate() &&
          itemDate.getUTCMonth() !== currentMonth
        );
      });

    const currentAmount = currentItems
      ? currentItems.reduce((sum, item) => sum + Number(item.amount), 0)
      : 0;
    const prevAmount = prevItems
      ? prevItems.reduce((sum, item) => sum + Number(item.amount), 0)
      : 0;

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
        <CardTitle>
          <GetCurrentMonth monthYear={new Date()} />
        </CardTitle>
        <CardDescription>
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
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value);
                const day = date.getUTCDate();
                return day % 2 !== 0 ? `${String(day)}` : "";
              }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
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
