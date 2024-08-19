"use client";

import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts";
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
} from "@/components/ui/chart";
import { ExpenseDetail } from "@/types/types";
import ExpenseCustomTooltip from "./ExpenseCustomTooltip";
import GetCurrentMonth from "@/utils/getCurrentMonth";

const chartConfig = {
  spent: {
    label: "Spent",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

function getAllDaysInCurrentMonth() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
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
  expenseDetail: ExpenseDetail[];
};

export function ExpenseBarChart({ expenseDetail }: Props) {
  const currentMonth = new Date();

  // Generate all days of the current month
  const allDaysInCurrentMonth = getAllDaysInCurrentMonth();

  // Merge the generated dates with the expenseDetail data
  const mergedData = allDaysInCurrentMonth.map((date) => {
    const expense = expenseDetail.find(
      (exp) => new Date(exp.date).toISOString().split("T")[0] === date,
    );
    return {
      date,
      amount: expense ? parseInt(expense.amount, 10) : 0,
    };
  });

  // Sort the merged data
  const sortedExpenseDetail = mergedData.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>
          <GetCurrentMonth month={currentMonth} />
        </CardTitle>
        <CardDescription>Your current spending in this month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[200px] w-full xl:h-[328px]"
        >
          <BarChart accessibilityLayer data={sortedExpenseDetail}>
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
                <Rectangle fill="#14b8a6" stroke="#262626" strokeWidth="2px" />
              }
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
