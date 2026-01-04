"use client";

import React from "react";
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import ExpenseCustomTooltip from "./ExpenseCustomTooltip";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "usehooks-ts";
import { BudgetExpenseData } from "@/types";
import { ArrowLeftRight } from "lucide-react";

const chartConfig = {
  spent: {
    label: "Spent",
    color: "hsl(var(--chart-outflow-main))",
  },
} satisfies ChartConfig;

function getAllDaysInMonth(year: number, month: number) {
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  const dates = [];
  for (let day = 1; day <= daysInMonth; day++) {
    dates.push(
      new Date(Date.UTC(year, month, day)).toISOString().split("T")[0],
    );
  }
  return dates;
}

type Props = {
  budgetExpenseData: BudgetExpenseData[];
};

export function ExpenseBarChart({ budgetExpenseData }: Props) {
  const [isFirstHalf, setIsFirstHalf] = React.useState<boolean>(true);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // Extract the month and year from budgetInfo
  const budgetMonth = new Date().getMonth();
  const budgetYear = new Date().getFullYear();

  const allDaysInMonth = getAllDaysInMonth(budgetYear, budgetMonth);

  React.useEffect(() => {
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 6) {
      setIsFirstHalf(false);
    }
  }, []);

  // Aggregate expenses by date
  const expenseMap = new Map<string, number>();
  budgetExpenseData.forEach((exp) => {
    const date = new Date(exp.date).toISOString().split("T")[0];
    const amount = parseInt(exp.amount, 10);
    if (expenseMap.has(date)) {
      expenseMap.set(date, expenseMap.get(date)! + amount);
    } else {
      expenseMap.set(date, amount);
    }
  });

  const mergedData = allDaysInMonth.map((date) => ({
    date,
    amount: expenseMap.get(date) || 0,
  }));

  const sortedExpenseDetail = mergedData.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const filteredData = isFirstHalf
    ? sortedExpenseDetail.slice(0, 15)
    : sortedExpenseDetail.slice(15, sortedExpenseDetail.length);

  return (
    <Card className="xl:h-full">
      <CardHeader className="flex flex-row items-center justify-between gap-4 lg:block">
        <CardTitle>Spending</CardTitle>
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden"
          onClick={() => setIsFirstHalf(!isFirstHalf)}
        >
          <ArrowLeftRight />
        </Button>
      </CardHeader>
      <CardContent className="xl:h-[calc(100%-96px)]">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[200px] w-full xl:h-full"
        >
          <BarChart
            accessibilityLayer
            data={isDesktop ? sortedExpenseDetail : filteredData}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                const date = new Date(value);
                const day = date.getUTCDate();
                return day % 2 !== 0 ? `${String(day)}` : "";
              }}
            />
            <ChartTooltip content={<ExpenseCustomTooltip />} />
            <Bar
              dataKey="amount"
              fill="var(--color-spent)"
              radius={4}
              activeBar={<Rectangle stroke="#262626" strokeWidth="1px" />}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
