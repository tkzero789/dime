import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/db/dbConfig";
import { Budgets, BudgetExpenses } from "@/db/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { ExpenseDatePicker } from "./ExpenseDatePicker";
import { format } from "date-fns";
import { DialogFooter } from "@/components/ui/dialog";

type Props = {
  paramId: string;
  currentUser: string | undefined;
  refreshData: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddExpense({
  paramId,
  currentUser,
  refreshData,
  setOpen,
}: Props) {
  const [name, setName] = React.useState<string>("");
  const [amount, setAmount] = React.useState<string>("");
  const [paymentMethod, setPaymentMethod] = React.useState<string>("");
  const [date, setDate] = React.useState<Date>(new Date());

  const addNewExpense = async () => {
    if (!name || !amount || !paymentMethod || !date || !currentUser) {
      window.alert("Missing required information");
      return;
    }

    const formattedDate = format(date, "yyyy-MM-dd");

    const result = await db
      .insert(BudgetExpenses)
      .values({
        name: name,
        amount: amount,
        payment_method: paymentMethod,
        date: formattedDate,
        budget_id: paramId,
        created_by: currentUser,
      })
      .returning({ insertedId: Budgets.id });

    if (result) {
      refreshData();
      toast.success("New Expense Added!");
      // reset
      setName("");
      setAmount("");
      setPaymentMethod("");
      setDate(new Date());
    }
  };

  return (
    <>
      {/* Name */}
      <Input
        placeholder="Expense name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {/* Amount */}
      <Input
        placeholder="Amount"
        type="number"
        className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        value={amount}
        onChange={(e) => {
          const value = e.target.value;
          if (parseFloat(value) > 0 || value === "") {
            setAmount(e.target.value);
          }
        }}
      />
      {/* Date */}
      <ExpenseDatePicker date={date} setDate={setDate} />
      {/* Payment method */}
      <Select
        value={paymentMethod}
        onValueChange={(value) => setPaymentMethod(value)}
      >
        <SelectTrigger>
          <SelectValue
            placeholder="Payment method"
            className="text-[#a9a9a9]"
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="cash">Cash</SelectItem>
          <SelectItem value="check">Check</SelectItem>
          <SelectItem value="credit card">Credit Card</SelectItem>
          <SelectItem value="debit card">Debit Card</SelectItem>
          <SelectItem value="prepaid card">Prepaid Card</SelectItem>
          <SelectItem value="digital wallet">
            Digital Wallet (Apple Pay, Samsung Pay, Google Pay, etc.)
          </SelectItem>
        </SelectContent>
      </Select>
      <DialogFooter className="flex-col sm:justify-start">
        <Button
          className="mt-4 w-full"
          disabled={!(name && amount && paymentMethod)}
          onClick={() => {
            addNewExpense();
            setOpen(false);
          }}
        >
          Add New Expense
        </Button>
      </DialogFooter>
    </>
  );
}
