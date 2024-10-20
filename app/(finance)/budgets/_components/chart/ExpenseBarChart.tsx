"use client";

import React from "react";
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
} from "@/components/ui/chart";
import { BudgetDetail, ExpenseDetail } from "@/types/types";
import ExpenseCustomTooltip from "./ExpenseCustomTooltip";
import GetCurrentMonth from "@/utils/getCurrentMonth";
import { Button } from "@/components/ui/button";
import useWindowSize from "@/hooks/useWindowSize";

const chartConfig = {
  spent: {
    label: "Spent",
    color: "hsl(var(--chart-5))",
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
  budgetInfo: BudgetDetail[];
  expenseDetail: ExpenseDetail[];
};

export function ExpenseBarChart({ budgetInfo, expenseDetail }: Props) {
  const [isFirstHalf, setIsFirstHalf] = React.useState<boolean>(true);
  const { width } = useWindowSize();

  // Extract the month and year from budgetInfo
  const budgetMonth = budgetInfo[0]?.month ?? new Date().getMonth();
  const budgetYear = budgetInfo[0]?.year ?? new Date().getFullYear();

  const allDaysInMonth = getAllDaysInMonth(budgetYear, budgetMonth);

  React.useEffect(() => {
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 6) {
      setIsFirstHalf(false);
    }
  }, []);

  // Aggregate expenses by date
  const expenseMap = new Map<string, number>();
  expenseDetail.forEach((exp) => {
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
  const months = [
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

  return (
    <Card className="shadow-md">
      <CardHeader className="flex items-start justify-between gap-4 space-y-0 lg:block">
        <div>
          <CardTitle className="text-xl font-bold tracking-normal">
            {months[budgetInfo[0]?.month]}
          </CardTitle>
          <CardDescription>Your spending in this month</CardDescription>
        </div>
        <Button
          variant="outline"
          className="block w-full px-8 md:hidden lg:w-auto"
          onClick={() => setIsFirstHalf(!isFirstHalf)}
        >
          {isFirstHalf ? "Show Last Half" : "Show First Half"}
        </Button>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[200px] w-full xl:h-[280px]"
        >
          <BarChart
            accessibilityLayer
            data={(width ?? 0) > 767 ? sortedExpenseDetail : filteredData}
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
              activeBar={
                <Rectangle fill="#0ea5e9" stroke="#262626" strokeWidth="2px" />
              }
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
