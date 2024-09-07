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
import DeleteIncome from "./DeleteIncome";
import FormatMonth from "@/utils/formatMonth";

type Props = {
  filterIncome: IncomeDetail[];
  selectedMonth: string | null;
  refreshData: () => void;
};

export default function IncomeList({
  filterIncome,
  selectedMonth,
  refreshData,
}: Props) {
  const { user } = useUser();
  const currentUser = user?.primaryEmailAddress?.emailAddress;

  const [isClick, setIsClick] = React.useState<string | null>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  // Handle on click
  const handleOnClick = (incomeId: string) => {
    setIsClick(incomeId);
  };

  // Effect to handle clicks outside of the PopoverTrigger (remove the bg-neutral-200 on the income item)
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsClick(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="mt-8 h-fit flex-1 rounded-lg border bg-white p-4 shadow-md">
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-xl font-bold">
          {selectedMonth ? (
            <FormatMonth month={selectedMonth} />
          ) : (
            <GetCurrentMonth month={new Date()} />
          )}
        </h2>
        <AddIncome currentUser={currentUser || "default"} />
      </div>
      <div className="grid grid-cols-[90px_1fr_200px_180px_120px_100px] gap-2 rounded-lg bg-neutral-200 py-2 text-sm font-semibold text-medium">
        <div className="text-center">Date</div>
        <div className="pl-4">Name</div>
        <div className="text-start">Category</div>
        <div className="text-start">Method</div>
        <div className="text-end">Amount</div>
      </div>
      {filterIncome.length > 0 ? (
        filterIncome.map((income) => (
          <div
            key={income.id}
            className={`grid grid-cols-[90px_1fr_200px_180px_120px_100px] gap-2 rounded-md border-b py-2 text-sm font-medium ${isClick === income.id ? "bg-neutral-100" : "bg-transparent"}`}
          >
            <div className="text-center">
              <FormatDate numMonthNumDateUTC={new Date(income.date)} />
            </div>
            <div className="pl-4">{income.name}</div>
            <div className="text-start">
              <FormatString text={income.category} />
            </div>
            <div className="text-start">
              <FormatString text={income.payment_method} />
            </div>
            <div className="text-end font-semibold text-green-700">
              $<FormatNumber number={Number(income.amount)} />
            </div>
            <Popover>
              <div ref={popoverRef}>
                <PopoverTrigger
                  className="group flex w-full items-center justify-center"
                  onClick={() => handleOnClick(income.id)}
                >
                  <Ellipsis className="rounded-md transition group-hover:bg-neutral-200" />
                </PopoverTrigger>
              </div>
              <PopoverContent className="flex w-40 flex-col px-0 py-0">
                <div className="flex items-center justify-center border-b px-3 py-2 text-sm font-semibold">
                  Action
                </div>
                <div className="p-1">
                  <EditIncome
                    currentUser={currentUser || "default"}
                    incomeInfo={income}
                    refreshData={refreshData}
                  />
                  <DeleteIncome
                    currentUser={currentUser || "default"}
                    incomeId={income.id}
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
