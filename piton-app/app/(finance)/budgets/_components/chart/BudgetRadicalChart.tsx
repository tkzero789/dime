"use client";
import React from "react";
import { CircleEqual, CirclePlus, MinusCircle } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { BudgetDetail } from "@/types/types";
import GetCurrentMonth from "@/utils/getCurrentMonth";
import FormatNumber from "@/utils/formatNumber";

const chartData = [{ spending: 1, fill: "var(--color-spending)" }];
const chartConfig = {
  spending: {
    label: "Spending",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type Props = {
  budgetList: BudgetDetail[];
};

export function BudgetRadicalChart({ budgetList }: Props) {
  const [totalBudget, setTotalBudget] = React.useState<number>(0);
  const [totalSpend, setTotalSpend] = React.useState<number>(0);
  const [remaining, setRemaining] = React.useState<number>(0);
  const [chartPercent, setChartPercent] = React.useState<number>(0);

  React.useEffect(() => {
    calculation();
    totalSpendChartDegree(totalBudget, totalSpend);
  }, [budgetList, totalBudget, totalSpend]);

  // Calculate budget amount and total spending
  const calculation = () => {
    const totalAmount = budgetList
      ?.map((budget) => budget.amount)
      .reduce((acc, curr) => acc + Number(curr), 0);

    const totalSpend = budgetList
      ?.map((budget) => budget.totalSpend)
      .reduce((acc, curr) => acc + curr, 0);

    const remainingAmount = totalAmount - totalSpend;

    setTotalBudget(totalAmount);
    setTotalSpend(totalSpend);
    setRemaining(remainingAmount);

    totalSpendChartDegree(totalBudget, totalSpend);
  };

  // Get the degree number to display in endAngle
  const totalSpendChartDegree = (totalBudget: number, totalSpend: number) => {
    const spendingPercent = (totalSpend / totalBudget) * 100;
    const chartPercent = (360 * spendingPercent) / 100;
    setChartPercent(chartPercent);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Budget Chart</CardTitle>
        <CardDescription>
          <GetCurrentMonth createdAt={budgetList[0]?.createdAt} />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={chartPercent}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="spending" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                          className={`fill-foreground font-bold ${totalSpend > 10000 ? "text-2xl" : "text-3xl"}`}
                        >
                          $<FormatNumber number={totalSpend} />
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Spent
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col px-6 pb-6 text-sm lg:px-10">
        <div className="flex w-full items-center gap-4 py-3 font-medium leading-none">
          <CirclePlus className="h-5 w-5 text-teal-700" />
          <span className="text-base font-medium">Spending Budget</span>
          <span className="ml-auto text-base font-bold">
            $<FormatNumber number={totalBudget} />
          </span>
        </div>
        <div className="flex w-full items-center gap-4 border-b border-t py-3 font-medium leading-none">
          <MinusCircle className="h-5 w-5 text-teal-700" />
          <span className="text-base font-medium">Current Spending</span>
          <span className="ml-auto text-base font-bold">
            $<FormatNumber number={totalSpend} />
          </span>
        </div>
        <div className="flex w-full items-center gap-4 py-3 font-medium leading-none">
          <CircleEqual className="h-5 w-5 text-teal-700" />
          <span className="text-base font-medium">Remaining</span>
          <span className="ml-auto text-base font-bold text-green-700">
            $<FormatNumber number={remaining} />
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
