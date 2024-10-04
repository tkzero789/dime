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

import { CircleCheck } from "lucide-react";
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
  return (
    <Dialog>
      <DialogTrigger className="flex h-fit w-full items-center justify-start gap-2 rounded-md bg-transparent px-0 py-2 text-sm font-normal text-dark hover:bg-neutral-200">
        <span className="pl-4">
          <CircleCheck strokeWidth={2} className="h-4 w-4" color="#555353" />
        </span>
        <span className="font-semibold text-medium">Pay</span>
      </DialogTrigger>
      <DialogContent className="flex h-dvh flex-col gap-8 sm:h-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Mark As Paid</DialogTitle>
          <DialogDescription className="flex flex-col gap-4 pt-4">
            <div className="flex items-center">
              <span className="inline-block w-36">Due date:</span>
              <span>
                <FormatDate fullFormatUTC={new Date(recurringInfo.due_date)} />
              </span>
              <span className="ml-auto">
                {isPaid[recurringInfo.id] ? "Paid" : "Unpaid"}
              </span>
            </div>
            <div>
              <span className="inline-block w-36">Name:</span>
              <span>{recurringInfo.name}</span>
            </div>
            <div>
              <span className="inline-block w-36">Category:</span>
              <span>
                <FormatString text={recurringInfo.category} />
              </span>
            </div>
            <div>
              <span className="inline-block w-36">Payment method:</span>
              <span>
                <FormatString text={recurringInfo.payment_method} />
              </span>
            </div>
            <div>
              <span className="inline-block w-36">Repeat:</span>
              <span>
                <FormatString text={recurringInfo.frequency} />
              </span>
            </div>
            <div>
              <span className="inline-block w-36">Amount:</span>
              <span>
                $<FormatNumber number={Number(recurringInfo.amount)} />
              </span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-36">Paid on:</span>
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
