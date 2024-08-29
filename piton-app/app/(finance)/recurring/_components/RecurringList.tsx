"use client";

import React from "react";
import { RecurrenceDetail } from "@/types/types";
import FormatDate from "@/utils/formatDate";
import FormatString from "@/utils/formatString";
import FormatNumber from "@/utils/formatNumber";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUser } from "@clerk/nextjs";
import { Ellipsis } from "lucide-react";
import AddRecurring from "./AddRecurring";
import EditRecurring from "./EditRecurring";
import DeleteRecurring from "./DeleteRecurring";
import GetCurrentMonth from "@/utils/getCurrentMonth";

type Props = {
  recurringList: RecurrenceDetail[];
};

export default function RecurringList({ recurringList }: Props) {
  const { user } = useUser();
  const currentUser = user?.primaryEmailAddress?.emailAddress;

  React.useEffect(() => {
    user && calculateTotalAmount();
  }, [user, recurringList]);

  const [totalAmount, setTotalAmount] = React.useState<number>(0);
  const calculateTotalAmount = () => {
    const totalAmount = recurringList.reduce(
      (acc, curr) => acc + Number(curr.amount),
      0,
    );
    setTotalAmount(totalAmount);
  };

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

  // Correct date displays for datepicker in edit recurring payment
  const convertToLocalDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  return (
    <div className="mt-8 h-fit w-full flex-1 rounded-lg border bg-white p-4 shadow-md">
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-xl font-bold">
          <GetCurrentMonth month={new Date()} />
        </h2>
        <AddRecurring />
      </div>
      <div className="grid grid-cols-[90px_1fr_200px_180px_120px_100px] gap-2 rounded-lg bg-neutral-200 py-2 text-sm font-semibold text-medium">
        <div className="text-center">Date</div>
        <div className="pl-4">Name</div>
        <div className="text-start">Category</div>
        <div className="text-start">Method</div>
        <div className="text-end">Amount</div>
      </div>
      {recurringList.length > 0 ? (
        recurringList.map((item) => (
          <div
            key={item.id}
            className={`grid grid-cols-[90px_1fr_200px_180px_120px_100px] gap-2 rounded-md border-b py-2 text-sm font-medium ${isClick === item.id ? "bg-neutral-100" : "bg-transparent"}`}
          >
            <div className="text-center">
              <FormatDate numMonthNumDateUTC={new Date(item.date)} />
            </div>
            <div className="pl-4">{item.name}</div>
            <div className="text-start">
              <FormatString text={item.category} />
            </div>
            <div className="text-start">
              <FormatString text={item.payment_method} />
            </div>
            <div className="text-end font-semibold">
              -$
              <FormatNumber number={Number(item.amount)} />
            </div>
            <Popover>
              <div ref={popoverRef}>
                <PopoverTrigger
                  className="group flex w-full items-center justify-center"
                  onClick={() => handleOnClick(item.id)}
                >
                  <Ellipsis className="rounded-md transition group-hover:bg-neutral-200" />
                </PopoverTrigger>
              </div>
              <PopoverContent className="flex w-40 flex-col px-0 py-0">
                <div className="flex items-center justify-center border-b px-3 py-2 text-sm font-semibold">
                  Action
                </div>
                <div className="p-1">
                  <EditRecurring
                    currentUser={currentUser || "default"}
                    recurringId={item.id}
                    name={item.name}
                    amount={item.amount}
                    category={item.category}
                    method={item.payment_method}
                    date={convertToLocalDate(item.date)}
                  />
                  <DeleteRecurring
                    currentUser={currentUser || "default"}
                    recurringId={item.id}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center pt-4 text-medium">
          No reccuring payments added yet
        </div>
      )}
      <div className="grid grid-cols-[90px_1fr_100px] rounded-b-lg bg-neutral-200 py-2 text-sm font-semibold text-medium">
        <span className="text-center">Total</span>
        <span className="text-end font-bold">
          -$
          <FormatNumber number={totalAmount} />
        </span>
      </div>
    </div>
  );
}
