"use client";

import React from "react";

import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { IncomeDetail } from "@/types";
import useWindowSize from "@/hooks/useWindowSize";
import IncomeCustomTooltip from "./IncomeCustomTooltip";
import { Button } from "@/components/ui/button";

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-inflow))",
  },
} satisfies ChartConfig;

function aggregateIncomeByMonth(incomeList: IncomeDetail[]) {
  const monthlyIncome = Array(12)
    .fill(0)
    .map((_, index) => ({
      month: new Date(0, index).toLocaleString("default", { month: "short" }),
      year: new Date().toLocaleString("default", { year: "numeric" }),
      amount: 0,
    }));

  incomeList.forEach(({ amount, date }) => {
    const parsedDate = new Date(
      Date.UTC(
        parseInt(date.slice(0, 4)), // year
        parseInt(date.slice(5, 7)) - 1, // month (0-based index)
        parseInt(date.slice(8, 10)), // day
      ),
    );
    const monthIndex = parsedDate.getUTCMonth();
    monthlyIncome[monthIndex].amount += parseFloat(amount);
  });

  return monthlyIncome;
}

type Props = {
  incomeData: IncomeDetail[];
};

export function IncomeBarChart({ incomeData }: Props) {
  const [isFirstHalf, setIsFirstHalf] = React.useState<boolean>(true);
  const { width } = useWindowSize();
  const aggregatedData = aggregateIncomeByMonth(incomeData);

  React.useEffect(() => {
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 6) {
      setIsFirstHalf(false);
    }
  }, []);

  const filteredData = isFirstHalf
    ? aggregatedData.slice(0, 6)
    : aggregatedData.slice(6, 12);

  return (
    <Card className="col-span-3 xl:col-span-2">
      <CardHeader className="flex items-start justify-between gap-4 space-y-0 lg:flex-row lg:items-center">
        <CardTitle>Monthly Earnings</CardTitle>

        <Button
          variant="outline"
          size="sm"
          className="block w-full md:hidden"
          onClick={() => setIsFirstHalf(!isFirstHalf)}
        >
          {isFirstHalf ? "Show July to December" : "Show January to June"}
        </Button>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[200px] w-full xl:h-[280px]"
        >
          <BarChart
            accessibilityLayer
            data={(width ?? 0) > 767 ? aggregatedData : filteredData}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<IncomeCustomTooltip />} />
            <Bar
              dataKey="amount"
              fill="var(--color-income)"
              radius={4}
              activeBar={
                <Rectangle
                  stroke="#262626"
                  strokeWidth="1px"
                  cursor="pointer"
                />
              }
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
