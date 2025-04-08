"use client";

import React from "react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import {
  Card,
  CardContent,
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
import { BudgetData } from "@/types";
import FormatNumber from "@/utils/formatNumber";

const chartConfig = {
  remaining: {
    label: "Remaining",
    color: "#d4d4d4",
  },
  spent: {
    label: "Spent",
    color: "hsl(var(--chart-outflow-main))",
  },
} satisfies ChartConfig;

type Props = {
  budget: BudgetData[];
};

export function BudgetByIdRadialChart({ budget }: Props) {
  return (
    <Card className="hidden h-full flex-col lg:flex">
      <CardHeader className="items-center pb-0">
        <CardTitle>Budget tracker</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={budget}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    const remaining = budget[0]?.remaining;
                    const isOverspent = remaining < 0;
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className={`fill-foreground font-bold ${remaining > 10000 ? "text-2xl" : "text-3xl"} ${remaining < -100 ? "text-[22px]" : "text-2xl"}`}
                        >
                          $<FormatNumber number={remaining} />
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className={` ${isOverspent ? "fill-red-600 text-sm font-bold" : "fill-muted-foreground"}`}
                        >
                          {isOverspent ? "Overspent" : "Left to spend"}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="remaining"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-remaining)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="total_spend"
              fill="var(--color-spent)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col px-6 pb-6">
        <div className="flex w-full items-center gap-4 py-4 leading-none">
          <span className="font-medium">Spending budget</span>
          <span className="ml-auto font-bold">
            $<FormatNumber number={Number(budget[0]?.amount)} />
          </span>
        </div>
        <div className="flex w-full items-center gap-4 border-b border-t py-4 leading-none">
          <span className="font-medium">Current spending</span>
          <span className="ml-auto font-bold">
            -$
            <FormatNumber number={budget[0]?.total_spend} />
          </span>
        </div>
        <div className="flex w-full items-center gap-4 py-4 leading-none">
          <span className="font-medium">Remaining</span>
          <span className="ml-auto font-bold text-green-700">
            $
            {budget[0]?.remaining > 0 ? (
              <FormatNumber number={budget[0]?.remaining} />
            ) : (
              <FormatNumber number={Number(budget[0]?.amount)} />
            )}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
