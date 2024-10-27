import React from "react";
import Link from "next/link";
import {
  CircleDollarSign,
  Info,
  Landmark,
  PiggyBank,
  Plus,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import FormatNumber from "@/utils/formatNumber";

type Props = {
  totalIncome: number;
  currentSpend: number;
  potentialSave: number;
};

export default function DashboardFinanceOverview({
  totalIncome,
  currentSpend,
  potentialSave,
}: Props) {
  return (
    <div className="rounded-lg border bg-white shadow-md">
      <h2 className="px-6 pb-4 pt-6 text-xl font-bold">Financial Overview</h2>
      <div className="flex items-center gap-4 px-6 py-4 text-base font-medium">
        <Landmark className="h-5 w-5 stroke-teal-700" />
        <span>Income</span>
        <span className="ml-auto font-bold">
          $<FormatNumber number={totalIncome} />
        </span>
        <Link href={"/income"}>
          <Plus
            strokeWidth={2}
            color="#555353"
            className="h-6 w-6 hover:stroke-teal-700"
          />
        </Link>
      </div>
      <div className="flex items-center gap-4 border-b border-t px-6 py-4 text-base font-medium">
        <CircleDollarSign className="h-5 w-5 stroke-teal-700" />
        <span>Current Spending</span>
        <span className="ml-auto font-bold">
          -$
          <FormatNumber number={currentSpend} />
        </span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild className="cursor-pointer">
              <Info
                strokeWidth={2}
                color="#555353"
                className="h-6 w-6 hover:stroke-teal-700"
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
      <div className="flex items-center gap-4 px-6 py-4 text-base font-medium">
        <PiggyBank className="h-5 w-5 stroke-teal-700" />
        <span>Potential Saving</span>
        <span className="ml-auto font-bold text-green-700">
          $<FormatNumber number={potentialSave} />
        </span>
        <Link href={"/saving"}>
          <Plus
            strokeWidth={2}
            color="#555353"
            className="h-6 w-6 hover:stroke-teal-700"
          />
        </Link>
      </div>
    </div>
  );
}
