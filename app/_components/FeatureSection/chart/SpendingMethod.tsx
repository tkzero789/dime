"use client";

import * as React from "react";

import { Label, Pie, PieChart } from "recharts";

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { motion } from "framer-motion";
import SpendingMethodCustomTooltip from "@/app/(finance)/spending/_components/chart/SpendingMethodCustomTooltip";
import "@/css/chart.css";

export const description = "A donut chart with text";

const chartData = [
  { paymentMethod: "cash", amount: 610, fill: "#f59e0b" },
  { paymentMethod: "check", amount: 820.45, fill: "#38bdf8" },
  { paymentMethod: "credit card", amount: 363.63, fill: "#ec4899" },
  { paymentMethod: "debit card", amount: 2042.11, fill: "#0ea5e9" },
];

const chartConfig = {
  cash: {
    label: "Cash",
  },
  check: {
    label: "Check",
    color: "#38bdf8",
  },
  credit_card: {
    label: "Credit Card",
    color: "#0ea5e9",
  },
  debit: {
    label: "Debit",
    color: "#fbbf24",
  },
} satisfies ChartConfig;

const slideInAnimationVariants = {
  initial: {
    x: -100,
  },
  animate: {
    x: 0,
    transition: {
      duration: 0.4,
      delay: 0.2,
    },
  },
};

export function SpendingMethod() {
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
      className="absolute right-[20px] top-[70px] w-1/2"
    >
      <Card className="rounded-lg border bg-white">
        <CardHeader className="flex flex-col gap-y-4 space-y-0">
          <div className="flex items-start justify-between lg:flex-row lg:items-center">
            <CardTitle className="text-base font-bold tracking-tight xl:text-lg">
              Payment Method
            </CardTitle>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger className="rounded-full hover:bg-muted">
                  <Info className="h-5 w-5 stroke-[1.5] text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    This chart shows your spending across different payment
                    methods
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardDescription className="text-center text-xs font-medium text-secondary-foreground xl:text-sm">
            Most used -{" "}
            <span className="font-bold text-foreground">Debit Card</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-6">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[120px] xl:max-h-[180px]"
          >
            <PieChart>
              <ChartTooltip content={<SpendingMethodCustomTooltip />} />
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
