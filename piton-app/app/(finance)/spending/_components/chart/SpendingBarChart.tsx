"use client";

import React from "react";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import SpendingBarCustomTooltip from "./SpendingBarCustomTooltip";

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-5))",
  },
  spending: {
    label: "Spending",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type Props = {
  finalData: {
    month: string;
    income: number;
    spending: number;
  }[];
};

const allMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function mergeDataWithAllMonths(finalData: Props["finalData"]) {
  const dataMap = new Map(
    finalData.map((item) => [item.month.split(" ")[0], item]),
  );
  return allMonths.map(
    (month) => dataMap.get(month) || { month, income: 0, spending: 0 },
  );
}

export function SpendingBarChart({ finalData }: Props) {
  const [isFirstHalf, setIsFirstHalf] = React.useState<boolean>(true);

  React.useEffect(() => {
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 6) {
      setIsFirstHalf(false);
    }
  }, []);

  const mergedData = mergeDataWithAllMonths(finalData);
  const filteredData = isFirstHalf
    ? mergedData.slice(0, 6)
    : mergedData.slice(6, 12);

  return (
    <Card className="mt-8 rounded-lg border shadow-md">
      <CardHeader className="flex items-start justify-between gap-4 space-y-0 lg:flex-row lg:items-center">
        <CardTitle className="text-xl font-bold tracking-normal">
          Income and Expenditure
        </CardTitle>
        <Button
          variant="ghost"
          className="w-full px-8 lg:w-auto"
          onClick={() => setIsFirstHalf(!isFirstHalf)}
        >
          {isFirstHalf ? "Show July to December" : "Show January to June"}
        </Button>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[200px] w-full xl:h-[220px]"
        >
          <BarChart accessibilityLayer data={filteredData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<SpendingBarCustomTooltip />} />
            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
            <Bar dataKey="spending" fill="var(--color-spending)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
