"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import FormatString from "@/utils/formatString";
import { Info } from "lucide-react";
import SpendingMethodCustomTooltip from "./SpendingMethodCustomTooltip";

export const description = "A donut chart with text";

type AggregatedExpenseMethod = {
  payment_method: string;
  amount: number;
  fill: string;
};

type Props = {
  aggregatedDataMethod: AggregatedExpenseMethod[];
  chartConfigMethod: { [key: string]: { label: string; color?: string } };
  spendingByMonth: number;
};

export function SpendingMethodPieChart({
  aggregatedDataMethod,
  chartConfigMethod,
  spendingByMonth,
}: Props) {
  const highestSpending = aggregatedDataMethod.reduce(
    (prev, curr) => (prev.amount > curr.amount ? prev : curr),
    { payment_method: "", amount: 0, fill: "" },
  );

  return (
    <Card className="col-span-4 flex flex-col rounded-lg border bg-white shadow-md xl:col-span-2 2xl:col-span-1">
      <CardHeader className="flex flex-col gap-y-4 space-y-0">
        <div className="flex items-start justify-between lg:flex-row lg:items-center">
          <CardTitle className="text-xl font-bold tracking-normal">
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
        {spendingByMonth > 0 && (
          <CardDescription className="text-center text-sm font-medium text-secondary-foreground">
            Most used -{" "}
            <span className="font-bold text-foreground">
              <FormatString text={highestSpending.payment_method} />
            </span>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-1 pb-6">
        {spendingByMonth > 0 ? (
          <ChartContainer
            config={chartConfigMethod}
            className="mx-auto aspect-square h-[220px]"
          >
            <PieChart>
              <ChartTooltip content={<SpendingMethodCustomTooltip />} />
              <Pie
                data={aggregatedDataMethod}
                dataKey="amount"
                nameKey="payment_method"
                innerRadius={70}
                outerRadius={100}
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
                            className={`fill-foreground font-bold ${spendingByMonth > 10000 ? "text-xl" : "text-2xl"}`}
                          >
                            ${spendingByMonth.toLocaleString()}
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
        ) : (
          <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-neutral-400 text-sm xl:h-[220px]">
            No data for this month
          </div>
        )}
      </CardContent>
    </Card>
  );
}
