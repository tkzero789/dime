import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CircleDollarSign, DollarSign, Info, Landmark } from "lucide-react";
import {
  ExpenseDetail,
  IncomeDetail,
  RecurrenceDetail,
  SingleDetail,
} from "@/types/types";
import FormatNumber from "@/utils/formatNumber";

type Props = {
  spending: (ExpenseDetail | RecurrenceDetail | SingleDetail)[];
  income: IncomeDetail[];
};

export default function DashboardFinanceInfo({ spending, income }: Props) {
  const [activeIncome, setActiveIncome] = React.useState<number>(0);
  const [currentSpend, setCurrentSpend] = React.useState<number>(0);
  const [remaining, setRemaining] = React.useState<number>(0);
  const currentMonth = new Date().getUTCMonth();

  React.useEffect(() => {
    const calculate = () => {
      const incomeAmount = income?.reduce(
        (acc, curr) => acc + Number(curr.amount),
        0,
      );

      const currentMonthList = spending.filter((item) => {
        const itemMonth = new Date(item.date).getUTCMonth();
        return itemMonth === currentMonth;
      });

      const currentSpendingAmount = currentMonthList.reduce(
        (acc, curr) => acc + Number(curr.amount),
        0,
      );

      const remainingAmount = incomeAmount - currentSpendingAmount;

      setActiveIncome(incomeAmount);
      setCurrentSpend(currentSpendingAmount);
      setRemaining(remainingAmount);
    };

    calculate();
  }, [income, spending, currentMonth]);

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Income Card */}
      <div className="flex flex-col gap-3 rounded-xl border bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Landmark className="h-5 w-5 stroke-teal-700" strokeWidth={2} />
          <span className="text-sm font-medium">Income</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold tracking-wide">
            $<FormatNumber number={activeIncome} />
          </div>
        </div>
      </div>

      {/* Spending Card */}
      <div className="flex flex-col gap-3 rounded-xl border bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-2">
          <CircleDollarSign
            className="h-5 w-5 stroke-teal-700"
            strokeWidth={2}
          />
          <span className="text-sm font-medium">Spending</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild className="cursor-pointer">
                <Info
                  strokeWidth={2}
                  className="ml-auto h-5 w-5 text-[#555353] hover:stroke-teal-700"
                />
              </TooltipTrigger>
              <TooltipContent className="mr-8 max-w-64 border shadow-lg">
                <p className="font-normal text-medium">
                  The sum of all your expenses, including those budgeted and
                  unbudgeted (such as bills, utilities, subscriptions, mortgage,
                  etc.)
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold tracking-wide">
            $<FormatNumber number={currentSpend} />
          </div>
        </div>
      </div>

      {/* Remaining Card */}
      <div className="flex flex-col gap-3 rounded-xl border bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 stroke-teal-700" strokeWidth={2} />
          <span className="text-sm font-medium">Remaining</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold tracking-wide">
            ${remaining >= 0 ? <FormatNumber number={remaining} /> : "0"}
          </div>
        </div>
      </div>
    </div>
  );
}
