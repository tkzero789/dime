import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Wallet } from "lucide-react";
import { db } from "@/db/dbConfig";
import { Recurrence } from "@/db/schema";
import toast from "react-hot-toast";
import { RecurringRule } from "@/types/types";
import { Button } from "@/components/ui/button";
import FormatNumber from "@/utils/formatNumber";
import FormatString from "@/utils/formatString";
import FormatDate from "@/utils/formatDate";
import { RecurringDatePicker } from "./RecurringDatePicker";

type Props = {
  recurringInfo: RecurringRule;
  isPaid: Record<string, boolean>;
  refreshData: () => void;
};

export default function PayRecurring({
  recurringInfo,
  isPaid,
  refreshData,
}: Props) {
  const [date, setDate] = React.useState<Date>(new Date());

  const payRecurrence = async () => {
    try {
      const result = await db
        .insert(Recurrence)
        .values({
          rule_id: recurringInfo.id,
          name: recurringInfo.name,
          amount: recurringInfo.amount,
          category: recurringInfo.category,
          payment_method: recurringInfo.payment_method,
          date: date?.toISOString(),
          created_by: recurringInfo.created_by,
        })
        .returning({ insertId: Recurrence.id });

      if (result) {
        toast.success("Mark As Paid");
        refreshData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleReset = () => {
    setDate(new Date());
  };

  return (
    <Dialog>
      <DialogTrigger
        className="flex h-fit w-full items-center justify-start gap-2 rounded-md bg-transparent px-0 py-2 text-sm font-normal text-dark hover:bg-neutral-200"
        onClick={handleReset}
      >
        <span className="pl-4">
          <Wallet strokeWidth={2} className="h-4 w-4" color="#555353" />
        </span>
        <span className="font-semibold text-medium">Pay</span>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-8">
        <DialogHeader>
          <DialogTitle className="text-center">
            Mark As Paid
            <span
              className={`mx-auto mt-2 block w-fit rounded-md bg-opacity-50 px-2 py-1 text-[13px] font-normal md:hidden ${isPaid[recurringInfo.id] ? "bg-green-300 text-green-700" : "bg-red-300 text-red-700"}`}
            >
              {isPaid[recurringInfo.id] ? "Paid" : "Unpaid"}
            </span>
          </DialogTitle>
          <DialogDescription className="flex flex-col gap-4 pt-4">
            <div className="relative flex justify-between md:block">
              <span className="inline-block font-semibold text-dark md:w-36">
                Due date:
              </span>
              <span>
                <FormatDate fullFormatUTC={new Date(recurringInfo.due_date)} />
              </span>
              <span
                className={`absolute right-0 top-0 ml-auto hidden rounded-md bg-opacity-50 px-2 py-1 text-[13px] md:block ${isPaid[recurringInfo.id] ? "bg-green-300 text-green-700" : "bg-red-300 text-red-700"}`}
              >
                {isPaid[recurringInfo.id] ? "Paid" : "Unpaid"}
              </span>
            </div>
            <div className="flex justify-between md:block">
              <span className="inline-block font-semibold text-dark md:w-36">
                Name:
              </span>
              <span>{recurringInfo.name}</span>
            </div>
            <div className="flex justify-between md:block">
              <span className="inline-block font-semibold text-dark md:w-36">
                Category:
              </span>
              <span>
                <FormatString text={recurringInfo.category} />
              </span>
            </div>
            <div className="flex justify-between md:block">
              <span className="inline-block font-semibold text-dark md:w-36">
                Payment method:
              </span>
              <span>
                <FormatString text={recurringInfo.payment_method} />
              </span>
            </div>
            <div className="flex justify-between md:block">
              <span className="inline-block font-semibold text-dark md:w-36">
                Repeat:
              </span>
              <span>
                <FormatString text={recurringInfo.frequency} />
              </span>
            </div>
            <div className="flex justify-between md:block">
              <span className="inline-block font-semibold text-dark md:w-36">
                Amount:
              </span>
              <span>
                $<FormatNumber number={Number(recurringInfo.amount)} />
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="inline-block font-semibold text-dark md:w-36">
                Paid on:
              </span>
              <RecurringDatePicker date={date} setDate={setDate} />
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:justify-start">
          <DialogClose asChild>
            <Button className="w-full" onClick={payRecurrence}>
              Mark Paid
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
