"use client";

import * as React from "react";
import { Cell, Label, Pie, PieChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import {
  ExpenseDetailWithCategory,
  RecurrenceDetail,
  SingleDetail,
} from "@/types";
import { Button } from "@/components/ui/button";
import SpendingBreakdown from "../spending/SpendingBreakdown";
import SpendingComparison from "../spending/SpendingComparison";
import SpendingPieCustomTooltip from "./SpendingPieCustomTooltip";
import { SpendingMethodPieChart } from "./SpendingMethodPieChart";

export const description = "A donut chart with text";

const chartConfig: { [key: string]: { label: string; color?: string } } = {
  spending: {
    label: "Spending",
  },
  budget_expense: {
    label: "Budget Expense",
    color: "#0ea5e9",
  },
  bill_and_utilities: {
    label: "Bill and Utilities",
    color: "#f9a8d4",
  },
  credit_card_payment: {
    label: "Credit Card Payment",
    color: "#fde68a",
  },
  car_payment: {
    label: "Car Payment",
    color: "#fcd34d",
  },
  insurance: {
    label: "Insurance",
    color: "#fbbf24",
  },
  loan: {
    label: "Loan",
    color: "#f59e0b",
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
    color: "#7dd3fc",
  },
} satisfies ChartConfig;

const chartConfigMethod: { [key: string]: { label: string; color?: string } } =
  {
    spending: {
      label: "Payment Method",
    },
    cash: {
      label: "Cash",
      color: "#f59e0b",
    },
    check: {
      label: "Check",
      color: "#38bdf8",
    },
    credit_card: {
      label: "Credit Card",
      color: "#ec4899",
    },
    debit_card: {
      label: "Debit Card",
      color: "#0ea5e9",
    },
    direct_deposit: {
      label: "Direct Deposit",
      color: "#93c5fd",
    },
    mobile_payment: {
      label: "Mobile Payment",
      color: "#f472b6",
    },
    payroll_card: {
      label: "Payroll Card",
      color: "#f9a8d4",
    },
    prepaid_card: {
      label: "Prepaid Card",
      color: "#fbcfe8",
    },
  } satisfies ChartConfig;

type AggregatedExpenseCategory = {
  category: string;
  amount: number;
  fill: string;
};

type AggregatedExpenseMethod = {
  payment_method: string;
  amount: number;
  fill: string;
};

type Props = {
  spendingData: (ExpenseDetailWithCategory | RecurrenceDetail | SingleDetail)[];
};

// Function to normalize category & payment method names in label
const normalizeLabel = (label: string) => {
  return label.toLowerCase().replace(/ /g, "_");
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
  const aggregatedDataCategory = Object.values(
    filteredSpendingData.reduce<Record<string, AggregatedExpenseCategory>>(
      (acc, data) => {
        const category = normalizeLabel(data.category);
        if (!acc[category]) {
          acc[category] = {
            ...data,
            amount: 0,
            fill: chartConfig[category]?.color || "#38bdf8",
          };
        }
        acc[category].amount += Number(data.amount);
        return acc;
      },
      {} as {
        [key: string]: ExpenseDetailWithCategory & {
          amount: number;
          fill: string;
        };
      },
    ),
  ).sort((a, b) => b.amount - a.amount);

  // Aggregate data by payment method
  const aggregatedDataMethod = Object.values(
    filteredSpendingData.reduce<Record<string, AggregatedExpenseMethod>>(
      (acc, data) => {
        const method = normalizeLabel(data.payment_method);
        if (!acc[method]) {
          acc[method] = {
            ...data,
            amount: 0,
            fill: chartConfigMethod[method]?.color || "#999999",
          };
        }
        acc[method].amount += Number(data.amount);
        return acc;
      },
      {} as {
        [key: string]: ExpenseDetailWithCategory & {
          amount: number;
          fill: string;
        };
      },
    ),
  ).sort((a, b) => b.amount - a.amount);

  const spendingByMonth = React.useMemo(() => {
    return filteredSpendingData.reduce(
      (acc, curr) => acc + Number(curr.amount),
      0,
    );
  }, [filteredSpendingData]);

  return (
    <div className="mt-4 grid grid-cols-4 gap-4 xl:mt-8">
      <Card className="col-span-4 flex flex-col rounded-lg border bg-white shadow-md xl:col-span-2 2xl:col-span-1">
        <CardHeader className="flex flex-col gap-y-4 space-y-0">
          <div className="flex items-start justify-between lg:flex-row lg:items-center">
            <CardTitle className="text-xl font-bold tracking-normal">
              Expenses
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSwitch(!isSwitch)}
            >
              {isSwitch ? "Show last month" : "Show current month"}
            </Button>
          </div>
          {spendingByMonth > 0 && (
            <SpendingComparison spendingData={spendingData} />
          )}
        </CardHeader>
        <CardContent className="flex-1 pb-6">
          {spendingByMonth > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square h-[220px]"
            >
              <PieChart>
                <ChartTooltip content={<SpendingPieCustomTooltip />} />
                <Pie
                  data={aggregatedDataCategory}
                  dataKey="amount"
                  nameKey="category"
                  innerRadius={70}
                  outerRadius={100}
                  strokeWidth={5}
                >
                  {aggregatedDataCategory.map((entry, index) => (
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
                              className={`fill-foreground font-bold ${spendingByMonth > 10000 ? "text-xl" : "text-2xl"}`}
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
          ) : (
            <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-neutral-400 text-sm xl:h-[220px]">
              No data for this month
            </div>
          )}
        </CardContent>
      </Card>
      <SpendingMethodPieChart
        aggregatedDataMethod={aggregatedDataMethod}
        chartConfigMethod={chartConfigMethod}
        spendingByMonth={spendingByMonth}
      />
      <SpendingBreakdown
        aggregatedDataCategory={aggregatedDataCategory}
        isSwitch={isSwitch}
      />
    </div>
  );
}
