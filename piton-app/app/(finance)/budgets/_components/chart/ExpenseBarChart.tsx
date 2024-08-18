"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ExpenseDetail } from "@/types/types";
import ExpenseCustomTooltip from "./ExpenseCustomTooltip";

const chartConfig = {
  spent: {
    label: "Spent",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type Props = {
  expenseDetail: ExpenseDetail[];
};

type AggregatedExpenseDetail = Omit<ExpenseDetail, "amount"> & {
  amount: number;
  dayOfMonth: number;
};

export function ExpenseBarChart({ expenseDetail }: Props) {
  // Get current year and month
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  // Generate all dates for the current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const allDates = Array.from({ length: daysInMonth }, (_, i) => ({
    dayOfMonth: i + 1,
    amount: 0,
    createdAt: new Date(currentYear, currentMonth, i + 1).toISOString(),
  }));

  // Aggregate amounts by date
  const aggregatedExpenseDetail = expenseDetail.reduce(
    (acc, curr) => {
      const date = new Date(curr.createdAt).toISOString().split("T")[0]; // Get date part only
      if (!acc[date]) {
        acc[date] = {
          ...curr,
          amount: 0,
          dayOfMonth: new Date(curr.createdAt).getDate(),
        } as AggregatedExpenseDetail;
      }
      acc[date].amount += Number(curr.amount);
      return acc;
    },
    {} as Record<string, AggregatedExpenseDetail>,
  );

  // Merge aggregated data with all dates
  const mergedData = allDates.map((date) => ({
    ...date,
    ...aggregatedExpenseDetail[date.createdAt.split("T")[0]],
  }));

  // Sort the merged data
  const sortedExpenseDetail = mergedData.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Bar Chart</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={sortedExpenseDetail}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="dayOfMonth"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                return value === 1 || value % 5 === 0 ? value.toString() : "";
              }}
            />
            <ChartTooltip cursor={false} content={<ExpenseCustomTooltip />} />
            <Bar dataKey="amount" fill="var(--color-spent)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
