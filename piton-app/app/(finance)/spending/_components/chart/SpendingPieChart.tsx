"use client";

import * as React from "react";
import { Cell, Label, Pie, PieChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ExpenseDetail, RecurrenceDetail, SingleDetail } from "@/types/types";
import { Button } from "@/components/ui/button";
import SpendingBreakdown from "../spending/SpendingBreakdown";
import SpendingComparison from "../spending/SpendingComparison";

export const description = "A donut chart with text";

const chartConfig: { [key: string]: { label: string; color?: string } } = {
  spending: {
    label: "Spending",
  },
  budget_expense: {
    label: "Budget Expense",
    color: "#14b8a6",
  },
  bill_and_utilities: {
    label: "Bill and Utilities",
    color: "#f9a8d4",
  },
  credit_card_payment: {
    label: "Credit Card Payment",
    color: "#bae6fd",
  },
  car_payment: {
    label: "Car Payment",
    color: "#7dd3fc",
  },
  insurance: {
    label: "Insurance",
    color: "#38bdf8",
  },
  loan: {
    label: "Loan",
    color: "#0ea5e9",
  },
  mortgage: {
    label: "Mortgage",
    color: "#ec4899",
  },
  rent: {
    label: "Rent",
    color: "#f472b6",
  },
  monthly_subscription: {
    label: "Monthly Subscription",
    color: "#5eead4",
  },
} satisfies ChartConfig;

type NewExpenseDetail = ExpenseDetail & {
  category: string;
};

type AggregatedExpenseDetail = {
  category: string;
  amount: number;
  fill: string;
};

type Props = {
  spendingData: (NewExpenseDetail | RecurrenceDetail | SingleDetail)[];
};

// Function to normalize category names
const normalizeCategory = (category: string) => {
  return category.toLowerCase().replace(/ /g, "_");
};

export function SpendingPieChart({ spendingData }: Props) {
  const [isSwitch, setIsSwitch] = React.useState<boolean>(true);

  const currentDate = new Date();
  const currentMonth = currentDate.getUTCMonth();
  const currentYear = currentDate.getUTCFullYear();

  const previousMonthDate = new Date(currentYear, currentMonth - 1);
  const previousMonth = previousMonthDate.getUTCMonth();
  const previousMonthYear = previousMonthDate.getUTCFullYear();

  const filteredSpendingData = spendingData?.filter((data) => {
    const dataDate = new Date(data.date);
    const dataMonth = dataDate.getUTCMonth();
    const dataYear = dataDate.getUTCFullYear();

    if (isSwitch) {
      return dataMonth === currentMonth && dataYear === currentYear;
    } else {
      return dataMonth === previousMonth && dataYear === previousMonthYear;
    }
  });

  // Aggregate data by category
  const aggregatedData = Object.values(
    filteredSpendingData.reduce<Record<string, AggregatedExpenseDetail>>(
      (acc, data) => {
        const category = normalizeCategory(data.category);
        if (!acc[category]) {
          acc[category] = {
            ...data,
            amount: 0,
            fill: chartConfig[category]?.color || "#2dd4bf",
          };
        }
        acc[category].amount += Number(data.amount);
        return acc;
      },
      {} as {
        [key: string]: NewExpenseDetail & { amount: number; fill: string };
      },
    ),
  ).sort((a, b) => b.amount - a.amount);

  const spendingByMonth = React.useMemo(() => {
    return filteredSpendingData.reduce(
      (acc, curr) => acc + Number(curr.amount),
      0,
    );
  }, [aggregatedData]);

  console.log(aggregatedData);

  return (
    <div className="mt-8 grid grid-cols-3 gap-4">
      <Card className="col-span-3 flex flex-col rounded-lg border shadow-md xl:col-span-2">
        <CardHeader className="flex flex-col gap-y-4 space-y-0">
          <div className="flex items-start justify-between gap-4 lg:flex-row lg:items-center">
            <CardTitle className="text-xl font-bold tracking-normal">
              Summary
            </CardTitle>
            <Button variant="ghost" onClick={() => setIsSwitch(!isSwitch)}>
              {isSwitch ? "Show last month" : "Show current month"}
            </Button>
          </div>
          <SpendingComparison spendingData={spendingData} />
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[500px]"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={aggregatedData}
                dataKey="amount"
                nameKey="category"
                innerRadius={60}
                outerRadius={150}
                strokeWidth={5}
              >
                {aggregatedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className={`fill-foreground font-bold ${spendingByMonth > 10000 ? "text-xl" : "text-3xl"}`}
                          >
                            ${spendingByMonth.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Total Spent
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <SpendingBreakdown aggregatedData={aggregatedData} />
    </div>
  );
}
