"use client";
import React from "react";
import { TrendingUp } from "lucide-react";
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
const chartData = [
  { browser: "safari", visitors: 10, fill: "var(--color-safari)" },
];
const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type Props = {
  budgetList: BudgetDetail[];
};

export function BudgetRadicalChart({ budgetList }: Props) {
  const [totalBudget, setTotalBudget] = React.useState<number>(0);
  const [totalSpend, setTotalSpend] = React.useState<number>(0);
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

    setTotalBudget(totalAmount);
    setTotalSpend(totalSpend);

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
        <CardTitle>Radial Chart - Text</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
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
            <RadialBar dataKey="visitors" background cornerRadius={10} />
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
                          className="fill-foreground text-4xl font-bold"
                        >
                          ${totalSpend}
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
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          ${totalBudget} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
