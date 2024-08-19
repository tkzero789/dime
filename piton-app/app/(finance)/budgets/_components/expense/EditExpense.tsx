import React from "react";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Expenses } from "@/db/schema";
import { db } from "@/db/dbConfig";
import { and, eq } from "drizzle-orm";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { ExpenseDatePicker } from "./ExpenseDatePicker";
import { PopoverClose } from "@radix-ui/react-popover";

type Props = {
  refreshData: () => void;
  currentUser: string | undefined;
  expenseId: string;
  name: string;
  amount: string;
  date: Date;
  method: string;
};

export default function EditExpense({
  refreshData,
  currentUser,
  expenseId,
  name,
  amount,
  date,
  method,
}: Props) {
  const [expenseName, setExpenseName] = React.useState<string>("");
  const [expenseAmount, setExpenseAmount] = React.useState<string>("");
  const [expenseDate, setExpenseDate] = React.useState<Date | undefined>(date);
  const [initialExpenseDate] = React.useState<Date | undefined>(date);
  const [paymentMethod, setPaymentMethod] = React.useState<string>(method);
  const [initialPaymentMethod] = React.useState<string>(method);

  // Update expense
  const onUpdateExpense = async (expenseId: string) => {
    const updateExpenseName = expenseName || name;
    const updateExpenseAmount = expenseAmount || amount;
    const updatedExpenseDate = expenseDate || date;
    const updatePaymentMethod = paymentMethod || method;
    const result = await db
      .update(Expenses)
      .set({
        name: updateExpenseName,
        amount: updateExpenseAmount,
        date: updatedExpenseDate.toISOString(),
        paymentMethod: updatePaymentMethod,
      })
      .where(
        and(
          eq(Expenses.id, expenseId),
          eq(Expenses.createdBy, currentUser ?? ""),
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
    setPaymentMethod(method);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="success" onClick={handleOnClickEdit}>
          Edit
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Expense</AlertDialogTitle>
          <AlertDialogDescription>
            {/* Expense Name */}
            <div>
              <label className="font-semibold text-dark">Expense Name</label>
              <Input
                className="mt-1"
                defaultValue={name}
                onChange={(e) => setExpenseName(e.target.value)}
              />
            </div>
            {/* Amount */}
            <div className="mt-2">
              <label className="font-semibold text-dark">Amount</label>
              <Input
                type="number"
                className="mt-1 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                defaultValue={Number(amount)}
                onChange={(e) => setExpenseAmount(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <label className="font-semibold text-dark">Date</label>
              <ExpenseDatePicker date={expenseDate} setDate={setExpenseDate} />
            </div>
            {/* Payment method */}
            <div className="mt-2">
              <label className="font-semibold text-dark">Payment Method</label>
              <Select
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value)}
              >
                <SelectTrigger className="mt-1">
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
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <PopoverClose asChild>
            <AlertDialogAction
              disabled={
                !(
                  expenseName ||
                  expenseAmount ||
                  expenseDate?.getTime() !== initialExpenseDate?.getTime() ||
                  paymentMethod !== initialPaymentMethod
                )
              }
              onClick={() => onUpdateExpense(expenseId)}
            >
              Save
            </AlertDialogAction>
          </PopoverClose>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
