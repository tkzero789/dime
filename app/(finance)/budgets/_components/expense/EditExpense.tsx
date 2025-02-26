import React from "react";
import { Button } from "@/components/ui/button";
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
import { BudgetExpenses } from "@/db/schema";
import { db } from "@/db/dbConfig";
import { and, eq } from "drizzle-orm";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { ExpenseDatePicker } from "./ExpenseDatePicker";
import { PopoverClose } from "@radix-ui/react-popover";
import { Pencil } from "lucide-react";
import { ExpenseData } from "@/types";

type Props = {
  refreshData: () => void;
  currentUser: string | undefined;
  expenseInfo: ExpenseData;
};

export default function EditExpense({
  refreshData,
  currentUser,
  expenseInfo,
}: Props) {
  // Correct date displays for datepicker in edit expense
  const convertToLocalDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const [expenseName, setExpenseName] = React.useState<string>("");
  const [expenseAmount, setExpenseAmount] = React.useState<string>("");
  const [expenseDate, setExpenseDate] = React.useState<Date>(
    convertToLocalDate(expenseInfo.date),
  );
  const [initialExpenseDate] = React.useState<Date>(
    convertToLocalDate(expenseInfo.date),
  );
  const [paymentMethod, setPaymentMethod] = React.useState<string>(
    expenseInfo.payment_method,
  );
  const [initialPaymentMethod] = React.useState<string>(
    expenseInfo.payment_method,
  );

  // Update expense
  const onUpdateExpense = async () => {
    const updateExpenseName = expenseName || expenseInfo.name;
    const updateExpenseAmount = expenseAmount || expenseInfo.amount;
    const updatedExpenseDate = expenseDate || expenseInfo.date;
    const updatePaymentMethod = paymentMethod || expenseInfo.payment_method;
    const result = await db
      .update(BudgetExpenses)
      .set({
        name: updateExpenseName,
        amount: updateExpenseAmount,
        date: updatedExpenseDate.toISOString(),
        payment_method: updatePaymentMethod,
      })
      .where(
        and(
          eq(BudgetExpenses.id, expenseInfo.id),
          eq(BudgetExpenses.created_by, currentUser ?? ""),
        ),
      )
      .returning();

    if (result) {
      refreshData();
      toast.success("Your expense is updated!");
    }
  };

  // On click edit (reset to original)
  const handleOnClickEdit = () => {
    setExpenseName("");
    setExpenseAmount("");
    setPaymentMethod(expenseInfo.payment_method);
    setExpenseDate(convertToLocalDate(expenseInfo.date));
  };

  return (
    <Dialog>
      <DialogTrigger
        className="flex h-fit w-full items-center justify-start gap-2 rounded-md bg-transparent px-0 py-2 text-sm font-normal text-foreground hover:bg-neutral-200"
        onClick={handleOnClickEdit}
      >
        <span className="pl-4">
          <Pencil strokeWidth={2} className="h-4 w-4" color="#555353" />
        </span>
        <span className="font-semibold text-secondary-foreground">Edit</span>
      </DialogTrigger>
      <DialogContent className="flex h-dvh flex-col gap-8 sm:h-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Edit Expense</DialogTitle>
          <DialogDescription className="flex flex-col gap-4 pt-4 text-left">
            {/* Expense Name */}
            <Input
              defaultValue={expenseInfo.name}
              onChange={(e) => setExpenseName(e.target.value)}
            />
            {/* Amount */}
            <Input
              type="number"
              className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              defaultValue={Number(expenseInfo.amount)}
              onChange={(e) => setExpenseAmount(e.target.value)}
            />
            {/* Datepicker */}
            <ExpenseDatePicker date={expenseDate} setDate={setExpenseDate} />
            {/* Payment method */}
            <Select
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value)}
            >
              <SelectTrigger>
                <SelectValue className="text-[#a9a9a9]" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="credit card">Credit Card</SelectItem>
                <SelectItem value="debit card">Debit Card</SelectItem>
                <SelectItem value="prepaid card">Prepaid Card</SelectItem>
                <SelectItem value="digital wallet">
                  Digital Wallet (Apple Pay, Samsung Pay, Google Pay, etc.)
                </SelectItem>
                <SelectItem value="check">Check</SelectItem>
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
                  expenseName ||
                  expenseAmount ||
                  expenseDate?.getTime() !== initialExpenseDate?.getTime() ||
                  paymentMethod !== initialPaymentMethod
                )
              }
              onClick={() => onUpdateExpense()}
            >
              Save
            </Button>
          </PopoverClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
