"use client";

import React from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TransactionData, BudgetData } from "@/types";
import { format, parseISO, eachDayOfInterval } from "date-fns";
import { useDesktop } from "@/hooks/use-desktop";
import { FormatString } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const chartConfig = {
  spending: {
    label: "Daily Spending",
    color: "hsl(var(--chart-outflow-main))",
  },
} satisfies ChartConfig;

type Props = {
  budget: BudgetData;
  budgetTransactions: TransactionData[];
};

export default function BudgetSpendingChart({
  budget,
  budgetTransactions,
}: Props) {
  const isDesktop = useDesktop();

  // Generate all dates in the budget period and map transaction data
  const chartData = React.useMemo(() => {
    const startDate = parseISO(budget.start_date);
    const endDate = budget.end_date ? parseISO(budget.end_date) : new Date();

    // Generate all dates in the range
    const allDates = eachDayOfInterval({ start: startDate, end: endDate });

    // Create a map of transaction amounts by date
    const transactionMap = new Map<string, number>();
    budgetTransactions.forEach((txn) => {
      const existing = transactionMap.get(txn.date) || 0;
      transactionMap.set(txn.date, existing + parseFloat(txn.amount));
    });

    // Map all dates with spending (0 if no transactions)
    return allDates.map((date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      return {
        date: dateStr,
        spending: transactionMap.get(dateStr) || 0,
      };
    });
  }, [budgetTransactions, budget]);

  // Calculate minimum width for mobile
  const minWidth = React.useMemo(() => {
    return chartData.length * 30;
  }, [chartData.length]);

  return (
    <Card className="col-span-full min-w-0 lg:col-span-2">
      <CardHeader>
        <CardTitle>Spending</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={isDesktop ? "" : "overflow-x-auto"}>
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[200px] w-full"
            style={
              isDesktop
                ? undefined
                : { minWidth: `${minWidth}px`, width: "100%" }
            }
          >
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  const date = parseISO(value);
                  const day = date.getDate();
                  // Only show even days
                  return day % 2 === 0 ? format(date, "d") : "";
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `$${value}`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      if (!value || typeof value !== "string") return "";
                      try {
                        const date = parseISO(value);
                        if (isNaN(date.getTime())) return "";
                        return format(date, "MMM d, yyyy");
                      } catch {
                        return "";
                      }
                    }}
                    formatter={(value) => {
                      return `$${Number(value).toFixed(2)}`;
                    }}
                  />
                }
              />
              <Bar
                dataKey="spending"
                fill="var(--color-spending)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
