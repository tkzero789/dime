"use client";

import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts";

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
import { IncomeDetail } from "@/types/types";
const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
  { month: "July", desktop: 186 },
  { month: "August", desktop: 305 },
  { month: "September", desktop: 237 },
  { month: "October", desktop: 73 },
  { month: "November", desktop: 209 },
  { month: "December", desktop: 214 },
];

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

function aggregateIncomeByMonth(incomeList: IncomeDetail[]) {
  const monthlyIncome = Array(12)
    .fill(0)
    .map((_, index) => ({
      month: new Date(0, index).toLocaleString("default", { month: "short" }),
      amount: 0,
    }));

  incomeList.forEach(({ amount, date }) => {
    const monthIndex = new Date(date).getMonth();
    monthlyIncome[monthIndex].amount += parseFloat(amount);
  });

  return monthlyIncome;
}

type Props = {
  incomeList: IncomeDetail[];
};

export function IncomeBarChart({ incomeList }: Props) {
  const aggregatedData = aggregateIncomeByMonth(incomeList);
  return (
    <Card className="mt-8 rounded-lg border shadow-md">
      <CardHeader>
        <CardTitle>Bar Chart</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[200px] w-full xl:h-[280px]"
        >
          <BarChart accessibilityLayer data={aggregatedData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="amount"
              fill="var(--color-income)"
              radius={8}
              activeBar={
                <Rectangle fill="#14b8a6" stroke="#262626" strokeWidth="2px" />
              }
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
