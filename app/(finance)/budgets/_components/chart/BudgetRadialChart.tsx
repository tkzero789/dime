"use client";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { BudgetData } from "@/types";
import { Button } from "@/components/ui/button";
import FormatNumber from "@/utils/formatNumber";
import { format } from "date-fns";
import { convertToLocalDate } from "@/utils/convertToLocalDate";

const chartData = [{ spending: 1, fill: "var(--color-spent)" }];
const chartConfig = {
  spent: {
    label: "Spent",
    color: "hsl(var(--chart-outflow-main))",
  },
} satisfies ChartConfig;

type Props = {
  date: string;
  budgetData: BudgetData[];
  handlePreviousMonth: () => void;
  handleNextMonth: () => void;
};

export function BudgetRadialChart({
  date,
  budgetData,
  handlePreviousMonth,
  handleNextMonth,
}: Props) {
  const [totalBudget, setTotalBudget] = React.useState<number>(0);
  const [totalSpend, setTotalSpend] = React.useState<number>(0);
  const [remaining, setRemaining] = React.useState<number>(0);
  const [chartPercent, setChartPercent] = React.useState<number>(0);

  // const months = [
  //   "January",
  //   "February",
  //   "March",
  //   "April",
  //   "May",
  //   "June",
  //   "July",
  //   "August",
  //   "September",
  //   "October",
  //   "November",
  //   "December",
  // ];

  React.useEffect(() => {
    const calculation = () => {
      const { totalAmount, totalSpend, remainingAmount } = budgetData?.reduce(
        (acc, budget) => {
          acc.totalAmount += Number(budget.amount);
          acc.totalSpend += budget.total_spend;
          if (budget.remaining === null) {
            acc.remainingAmount += Number(budget.amount);
          } else {
            acc.remainingAmount += budget.remaining;
          }
          return acc;
        },
        { totalAmount: 0, totalSpend: 0, remainingAmount: 0 },
      ) || { totalAmount: 0, totalSpend: 0, remainingAmount: 0 };

      setTotalBudget(totalAmount);
      setTotalSpend(totalSpend);
      setRemaining(remainingAmount);

      totalSpendChartDegree(totalAmount, totalSpend);
    };

    // Get the degree number to display in endAngle
    const totalSpendChartDegree = (totalBudget: number, totalSpend: number) => {
      const spendingPercent = (totalSpend / totalBudget) * 100;
      const chartPercent = (360 * spendingPercent) / 100;
      setChartPercent(chartPercent);
    };

    calculation();
  }, [budgetData]);

  return (
    <Card className="col-span-3 flex flex-col xl:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between pb-0">
        <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
          <ChevronLeft />
        </Button>
        <div>
          <CardTitle className="text-xl font-bold tracking-normal">
            {format(convertToLocalDate(date), "MMMM yyyy")}
          </CardTitle>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextMonth}
          // disabled={month === currentMonth && year === currentYear}
        >
          <ChevronRight />
        </Button>
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
      <CardFooter className="flex-col px-6 pb-6">
        <div className="flex w-full items-center gap-4 py-4 leading-none">
          <span className="font-medium">Total budget</span>
          <span className="ml-auto font-bold">
            $<FormatNumber number={totalBudget} />
          </span>
        </div>
        <div className="flex w-full items-center gap-4 border-b border-t py-4 leading-none">
          <span className="font-medium">Current spending</span>
          <span className="ml-auto font-bold">
            -$
            <FormatNumber number={totalSpend} />
          </span>
        </div>
        <div className="flex w-full items-center gap-4 py-4 leading-none">
          <span className="font-medium">Remaining</span>
          <span className="ml-auto font-bold text-green-700">
            $<FormatNumber number={remaining} />
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
