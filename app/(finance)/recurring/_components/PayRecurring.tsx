import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { CircleCheck } from "lucide-react";
import { db } from "@/db/dbConfig";
import { Recurrence } from "@/db/schema";
import toast from "react-hot-toast";
import { RecurringRule } from "@/types/types";
import { Button } from "@/components/ui/button";

type Props = {
  recurringInfo: RecurringRule;
  refreshData: () => void;
};

export default function PayRecurring({ recurringInfo, refreshData }: Props) {
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
          date: new Date().toISOString(),
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
    <AlertDialog>
      <AlertDialogTrigger className="flex h-fit w-full items-center justify-start gap-2 rounded-md bg-transparent px-0 py-2 text-sm font-normal text-dark hover:bg-neutral-200">
        <span className="pl-4">
          <CircleCheck strokeWidth={2} className="h-4 w-4" color="#555353" />
        </span>
        <span className="font-semibold text-medium">Pay</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Mark As Paid</AlertDialogTitle>
          <AlertDialogDescription>Confirm mark as paid</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction onClick={payRecurrence}>
            Mark as paid
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}