"use client";

import React from "react";
import { CircleEqual, CirclePlus, MinusCircle, TrendingUp } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
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
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BudgetDetail } from "@/types/types";
import FormatNumber from "@/utils/formatNumber";
import GetCurrentMonth from "@/utils/getCurrentMonth";
const chartConfig = {
  remaining: {
    label: "Remaining",
    color: "#d4d4d4",
  },
  spent: {
    label: "Spent",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type Props = {
  budget: BudgetDetail[];
};

export function BudgetByIdRadicalChart({ budget }: Props) {
  return (
    <Card className="hidden h-full flex-col rounded-lg shadow-md lg:flex">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-xl font-bold tracking-normal">
          Budget Tracker
        </CardTitle>
        <CardDescription>
          <GetCurrentMonth month={budget[0]?.created_at} />
        </CardDescription>
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
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className={`fill-foreground font-bold ${budget[0]?.remaining > 10000 ? "text-2xl" : "text-3xl"}`}
                        >
                          $<FormatNumber number={budget[0]?.remaining} />
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Left to spend
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
      <CardFooter className="flex-col px-6 pb-6 text-sm lg:px-10">
        <div className="flex w-full items-center gap-4 py-3 font-medium leading-none">
          <CirclePlus className="h-5 w-5 text-teal-700" />
          <span className="text-base font-medium">Spending Budget</span>
          <span className="ml-auto text-base font-bold">
            $<FormatNumber number={Number(budget[0]?.amount)} />
          </span>
        </div>
        <div className="flex w-full items-center gap-4 border-b border-t py-3 font-medium leading-none">
          <MinusCircle className="h-5 w-5 text-teal-700" />
          <span className="text-base font-medium">Current Spending</span>
          <span className="ml-auto text-base font-bold">
            $<FormatNumber number={budget[0]?.total_spend} />
          </span>
        </div>
        <div className="flex w-full items-center gap-4 py-3 font-medium leading-none">
          <CircleEqual className="h-5 w-5 text-teal-700" />
          <span className="text-base font-medium">Remaining</span>
          <span className="ml-auto text-base font-bold text-green-700">
            $<FormatNumber number={budget[0]?.remaining} />
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
