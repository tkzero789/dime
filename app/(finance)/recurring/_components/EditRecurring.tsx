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
import { Recurrence } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { RecurringDatePicker } from "./RecurringDatePicker";
import { RecurrenceDetail } from "@/types/types";

type Props = {
  currentUser: string | undefined;
  recurringInfo: RecurrenceDetail;
};

export default function EditRecurring({ currentUser, recurringInfo }: Props) {
  // Correct date displays for datepicker in edit recurring payment
  const convertToLocalDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

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
  const [recurringDate, setRecurringDate] = React.useState<Date>(
    convertToLocalDate(recurringInfo.date),
  );
  const [initialRecurringDate] = React.useState<Date>(
    convertToLocalDate(recurringInfo.date),
  );

  const router = useRouter();

  // Update recurring payment
  const onUpdateRecurring = async () => {
    const updateName = recurringName || recurringInfo.name;
    const updatedAmount = recurringAmount || recurringInfo.amount;
    const updateCategory = recurringCategory || recurringInfo.category;
    const updateMethod = recurringMethod || recurringInfo.payment_method;
    const updateDate = recurringDate || recurringInfo.date;
    const result = await db
      .update(Recurrence)
      .set({
        name: updateName,
        amount: updatedAmount,
        category: updateCategory,
        payment_method: updateMethod,
        date: updateDate.toISOString(),
      })
      .where(
        and(
          eq(Recurrence.id, recurringInfo.id),
          eq(Recurrence.created_by, currentUser ?? ""),
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
    setRecurringDate(convertToLocalDate(recurringInfo.date));
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
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
            {/* DatePicker */}
            <RecurringDatePicker
              date={recurringDate}
              setDate={setRecurringDate}
            />
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
        <DialogFooter>
          <PopoverClose asChild>
            <Button
              className="w-full"
              disabled={
                !(
                  recurringName ||
                  recurringAmount ||
                  recurringCategory !== initialRecurringCategory ||
                  recurringMethod !== initialRecurringMethod ||
                  recurringDate?.getTime() !== initialRecurringDate?.getTime()
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
