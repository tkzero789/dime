"use client";

import React from "react";
import GetCurrentMonth from "@/utils/getCurrentMonth";
import { Ellipsis } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AddIncome from "./AddIncome";
import { useUser } from "@clerk/nextjs";
import { IncomeDetail } from "@/types/types";
import FormatDate from "@/utils/formatDate";
import FormatNumber from "@/utils/formatNumber";
import FormatString from "@/utils/formatString";
import EditIncome from "./EditIncome";

type Props = {
  incomeList: IncomeDetail[];
};

export default function IncomeList({ incomeList }: Props) {
  const { user } = useUser();
  const currentUser = user?.primaryEmailAddress?.emailAddress;
  const currentMonth = new Date();

  // Correct date displays for datepicker in edit income
  const convertToLocalDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  return (
    <div className="h-fit w-fit flex-1 rounded-lg border bg-white p-4 shadow-md">
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-xl font-bold">
          <GetCurrentMonth month={currentMonth} />
        </h2>
        <AddIncome currentUser={currentUser || "default"} />
      </div>
      <div className="grid w-fit grid-cols-[90px_500px_120px_80px] gap-2 rounded-lg bg-neutral-200 py-2 text-sm font-semibold text-medium">
        <div className="text-center">Date</div>
        <div className="pl-4">Amount</div>
        <div className="text-start">Category</div>
      </div>
      {incomeList.length > 0 ? (
        incomeList.map((income) => (
          <div
            key={income.id}
            className="grid grid-cols-[90px_500px_120px_80px] gap-2 rounded-md border-b py-2 pt-2 text-sm font-medium"
          >
            <div className="text-center">
              <FormatDate numMonthNumDateUTC={new Date(income.date)} />
            </div>
            <div className="pl-4">
              $<FormatNumber number={Number(income.amount)} />
            </div>
            <div className="text-start">
              <FormatString text={income.category} />
            </div>
            <Popover>
              <PopoverTrigger>
                <Ellipsis />
              </PopoverTrigger>
              <PopoverContent className="flex w-40 flex-col px-0 py-0">
                <div className="flex items-center justify-center border-b px-3 py-2 text-sm font-semibold">
                  Action
                </div>
                <div className="p-1">
                  <EditIncome
                    currentUser={currentUser || "default"}
                    incomeId={income.id}
                    amount={income.amount}
                    date={convertToLocalDate(income.date)}
                    category={income.category}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center pt-4 text-medium">
          No income added yet
        </div>
      )}
    </div>
  );
}
