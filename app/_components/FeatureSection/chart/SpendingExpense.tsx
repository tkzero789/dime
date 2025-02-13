"use client";

import * as React from "react";

import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import SpendingPieCustomTooltip from "@/app/(finance)/spending/_components/chart/SpendingPieCustomTooltip";
import { motion } from "framer-motion";
import "@/css/chart.css";

export const description = "A donut chart with text";

const chartData = [
  { paymentMethod: "single payment", amount: 752.57, fill: "#38bdf8" },
  { paymentMethod: "Budget Expense", amount: 700.13, fill: "#0ea5e9" },
  { paymentMethod: "insurance", amount: 604.25, fill: "#fbbf24" },
  { paymentMethod: "car payment", amount: 505, fill: "#fcd34d" },
  { paymentMethod: "bill and utilities", amount: 253.79, fill: "#f9a8d4" },
  { paymentMethod: "credit card payment", amount: 200, fill: "#fde68a" },
  { paymentMethod: "mortgage", amount: 820.45, fill: "#ec4899" },
];

const chartConfig = {
  expense: {
    label: "Expense",
  },
  single_payment: {
    label: "Single Payment",
    color: "#38bdf8",
  },
  budget_expense: {
    label: "Budget Expense",
    color: "#0ea5e9",
  },
  insurance: {
    label: "Insurance",
    color: "#fbbf24",
  },
  car_payment: {
    label: "Car Payment",
    color: "#fcd34d",
  },
  bill_and_utilities: {
    label: "Bill and Utilities",
    color: "#f9a8d4",
  },
  credit_card_payment: {
    label: "Credit Card Payment",
    color: "#fde68a",
  },
  mortgage: {
    label: "Mortgage",
    color: "#ec4899",
  },
} satisfies ChartConfig;

const slideInAnimationVariants = {
  initial: {
    x: 100,
  },
  animate: {
    x: 0,
    transition: {
      duration: 0.4,
      delay: 0.2,
    },
  },
};

export function SpendingExpense() {
  const totalAmount = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.amount, 0);
  }, []);

  const getRadius = (radiusType: string) => {
    const root = document.documentElement;
    return getComputedStyle(root).getPropertyValue(`--${radiusType}-radius`);
  };

  return (
    <motion.div
      variants={slideInAnimationVariants}
      initial="initial"
      whileInView="animate"
      viewport={{
        once: true,
      }}
      className="w-1/2"
    >
      <Card className="rounded-lg border bg-white">
        <CardHeader className="flex flex-col gap-y-4 space-y-0">
          <div className="flex items-start justify-between lg:flex-row lg:items-center">
            <CardTitle className="text-base font-bold tracking-tight xl:text-lg">
              Expenses
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="h-[26px] px-1 text-[8px] xl:h-[36px] xl:px-3 xl:text-sm"
            >
              Show last month
            </Button>
          </div>
          <p className="text-center text-xs font-medium text-medium xl:text-sm">
            Spend <span className="font-bold text-dark">$135</span> less than
            last month
          </p>
        </CardHeader>
        <CardContent className="flex-1 pb-6">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[120px] xl:max-h-[180px]"
          >
            <PieChart>
              <ChartTooltip content={<SpendingPieCustomTooltip />} />
              <Pie
                className="pie"
                data={chartData}
                dataKey="amount"
                nameKey="paymentMethod"
                innerRadius={parseInt(getRadius("inner"))}
                outerRadius={parseInt(getRadius("outer"))}
                strokeWidth={5}
              >
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
                            className="fill-foreground text-lg font-bold xl:text-xl"
                          >
                            ${totalAmount.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Total spent
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
    </motion.div>
  );
}
