import { IncomeData } from "@/types";
import React from "react";
import FormatNumber from "@/utils/formatNumber";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { format } from "date-fns";

type Props = {
  incomeData: IncomeData[];
};

export default function IncomeSummary({ incomeData }: Props) {
  const currentMonth = new Date().getUTCMonth();

  const calculate = () => {
    const totalIncome = incomeData?.reduce(
      (acc, curr) => acc + Number(curr.amount),
      0,
    );

    let averageMonthlyIncome;
    if (totalIncome) {
      averageMonthlyIncome = totalIncome / (currentMonth + 1);
    }

    const previousMonthIncome = incomeData
      ?.filter((item) => {
        const incomeDate = new Date(item.date);
        return incomeDate.getUTCMonth() === currentMonth - 1;
      })
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const currentMonthIncome = incomeData
      ?.filter((item) => {
        const incomeDate = new Date(item.date);
        return incomeDate.getUTCMonth() === currentMonth;
      })
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    let incomeGrowthGrate;
    if (previousMonthIncome && currentMonthIncome) {
      incomeGrowthGrate =
        ((currentMonthIncome - Number(previousMonthIncome)) /
          Number(previousMonthIncome)) *
        100;
    }

    return {
      totalIncome,
      averageMonthlyIncome,
      currentMonthIncome,
      incomeGrowthGrate,
    };
  };

  return (
    <div className="order-first col-span-3 rounded-xl bg-white p-6 shadow-card-shadow xl:order-last xl:col-span-1">
      <h2 className="inline items-center text-xl font-semibold">Summary</h2>
      <span className="ml-2 inline-block text-secondary-foreground">
        (
        {format(
          new Date(new Date().getUTCFullYear(), new Date().getUTCMonth()),
          "MMM yyyy",
        )}
        )
      </span>
      <div className="mt-4 flex items-center justify-between gap-4 pb-2 text-sm">
        <div>Total Earnings</div>
        <div className="font-semibold">
          ${<FormatNumber number={calculate().totalIncome} />}
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 border-t py-2 text-sm">
        <div className="flex items-center gap-1">
          Average Monthly Income
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger className="rounded-full hover:bg-muted">
                <Info className="h-5 w-5 stroke-[1.5] text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-64">
                <p>
                  Your total earnings divided by the number of months
                  you&apos;ve earned.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="font-semibold">
          $
          <FormatNumber
            number={calculate().averageMonthlyIncome || 0}
            decimals={2}
          />
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 border-t py-2 text-sm">
        <div>Income This Month</div>
        <div className="font-semibold">
          ${<FormatNumber number={calculate().currentMonthIncome} />}
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 border-t py-2 text-sm">
        <div className="flex items-center gap-1">
          Income Growth Rate
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger className="rounded-full hover:bg-muted">
                <Info className="h-5 w-5 stroke-[1.5] text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-64">
                <p>
                  The percentage change in your income compared to last month.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div
          className={cn(
            "font-semibold",
            (calculate().incomeGrowthGrate || 0) > 0 && "text-green-700",
            (calculate().incomeGrowthGrate || 0) < 0 && "text-red-600",
          )}
        >
          <FormatNumber
            number={calculate().incomeGrowthGrate || 0}
            decimals={1}
          />
          %
        </div>
      </div>
    </div>
  );
}
