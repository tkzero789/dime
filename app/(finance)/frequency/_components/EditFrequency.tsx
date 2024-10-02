"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PopoverClose } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { db } from "@/db/dbConfig";
import { Recurring_rule } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { RecurringRule } from "@/types/types";

type Props = {
  recurringInfo: RecurringRule;
  currentUser: string | undefined;
};

export default function EditFrequency({ recurringInfo, currentUser }: Props) {
  const [recurringName, setRecurringName] = React.useState<string>("");
  const [recurringAmount, setRecurringAmount] = React.useState<string>("");
  const [recurringCategory, setRecurringCategory] = React.useState<string>(
    recurringInfo.category,
  );
  const [initialRecurringCategory] = React.useState<string>(
    recurringInfo.category,
  );
  const [recurringMethod, setRecurringMethod] = React.useState<string>(
    recurringInfo.payment_method,
  );
  const [initialRecurringMethod] = React.useState<string>(
    recurringInfo.payment_method,
  );
  const [dueDate, setDueDate] = React.useState<string>(
    parseInt(recurringInfo.due_date).toString(),
  );
  const [initialDueDate] = React.useState<string>(
    parseInt(recurringInfo.due_date).toString(),
  );

  const router = useRouter();

  // Update recurring payment
  const onUpdateRecurring = async () => {
    const updateName = recurringName || recurringInfo.name;
    const updatedAmount = recurringAmount || recurringInfo.amount;
    const updateCategory = recurringCategory || recurringInfo.category;
    const updateMethod = recurringMethod || recurringInfo.payment_method;
    const updateDueDate = dueDate || recurringInfo.due_date;
    const result = await db
      .update(Recurring_rule)
      .set({
        name: updateName,
        amount: updatedAmount,
        category: updateCategory,
        payment_method: updateMethod,
        due_date: updateDueDate,
      })
      .where(
        and(
          eq(Recurring_rule.id, recurringInfo.id),
          eq(Recurring_rule.created_by, currentUser ?? ""),
        ),
      )
      .returning();

    if (result) {
      toast.success("Your recurring payment is updated!");
      router.refresh();
    }
  };

  // On click edit (reset to original)
  const handleOnClickEdit = () => {
    setRecurringName("");
    setRecurringAmount("");
    setRecurringCategory(recurringInfo.category);
    setRecurringMethod(recurringInfo.payment_method);
  };

  return (
    <Dialog>
      <DialogTrigger
        className="flex h-fit w-full items-center justify-start gap-2 rounded-md bg-transparent px-0 py-2 text-sm font-normal text-dark hover:bg-neutral-200"
        onClick={handleOnClickEdit}
      >
        <span className="pl-4">
          <Pencil strokeWidth={2} className="h-4 w-4" color="#555353" />
        </span>
        <span className="font-semibold text-medium">Edit</span>
      </DialogTrigger>
      <DialogContent className="flex h-dvh flex-col gap-8 sm:h-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            Edit recurring payment
          </DialogTitle>
          <DialogDescription className="flex flex-col gap-4 pt-4">
            {/* Recurring Name */}
            <Input
              type="text"
              defaultValue={recurringInfo.name}
              onChange={(e) => setRecurringName(e.target.value)}
            />
            {/* Recurring Amount */}
            <Input
              type="number"
              className="mt-1 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              defaultValue={Number(recurringInfo.amount)}
              onChange={(e) => setRecurringAmount(e.target.value)}
            />
            {/* Due Date */}
            <Select
              value={dueDate}
              onValueChange={(value) => setDueDate(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 31 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Recurring Category */}
            <Select
              value={recurringCategory}
              onValueChange={(value) => setRecurringCategory(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bill and utilities">
                  Bill and Utilities
                </SelectItem>
                <SelectItem value="credit card payment">
                  Credit Card Payment
                </SelectItem>
                <SelectItem value="car payment">Car Payment</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
                <SelectItem value="loan">Loan</SelectItem>
                <SelectItem value="mortgage">Mortgage</SelectItem>
                <SelectItem value="monthly subscription">
                  Monthly Subscription
                </SelectItem>
                <SelectItem value="rent">Rent</SelectItem>
              </SelectContent>
            </Select>
            {/* Recurring Payment Method */}
            <Select
              value={recurringMethod}
              onValueChange={(value) => setRecurringMethod(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="check">Check</SelectItem>
                <SelectItem value="credit card">Credit Card</SelectItem>
                <SelectItem value="debit card">Debit Card</SelectItem>
                <SelectItem value="mobile payment">
                  Mobile Payment (Paypal, CashApp, Zelle, etc.)
                </SelectItem>
                <SelectItem value="payroll card">Payroll Card</SelectItem>
              </SelectContent>
            </Select>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:justify-start">
          <PopoverClose asChild>
            <Button
              className="w-full"
              disabled={
                !(
                  recurringName ||
                  recurringAmount ||
                  dueDate !== initialDueDate ||
                  recurringCategory !== initialRecurringCategory ||
                  recurringMethod !== initialRecurringMethod
                )
              }
              onClick={() => onUpdateRecurring()}
            >
              Save
            </Button>
          </PopoverClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
