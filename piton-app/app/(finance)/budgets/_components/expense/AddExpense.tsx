import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/db/dbConfig";
import { Budgets, Expenses } from "@/db/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { ExpenseDatePicker } from "./ExpenseDatePicker";

type Props = {
  paramId: string;
  currentUser: string | undefined;
  refreshData: () => void;
};

export default function AddExpense({
  paramId,
  currentUser,
  refreshData,
}: Props) {
  const [name, setName] = React.useState<string>("");
  const [amount, setAmount] = React.useState<string>("");
  const [paymentMethod, setPaymentMethod] = React.useState<string>("");
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const addNewExpense = async () => {
    if (!name || !amount || !paymentMethod || !date || !currentUser) {
      window.alert("Missing required information");
      return;
    }
    const result = await db
      .insert(Expenses)
      .values({
        name: name,
        amount: amount,
        paymentMethod: paymentMethod,
        date: date?.toISOString(),
        budgetId: paramId,
        createdBy: currentUser,
      })
      .returning({ insertedId: Budgets.id });
    // reset
    setName("");
    setAmount("");
    setPaymentMethod("");
    setDate(new Date());

    if (result) {
      refreshData();
      toast.success("New Expense Added!");
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-3 rounded-lg border bg-white p-4 shadow-md">
      {/* Name */}
      <Input
        className="mt-1"
        placeholder="Expense name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {/* Amount */}
      <Input
        type="number"
        className="mt-1 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      {/* Date */}
      <ExpenseDatePicker date={date} setDate={setDate} />
      {/* Payment method */}
      <Select
        value={paymentMethod}
        onValueChange={(value) => setPaymentMethod(value)}
      >
        <SelectTrigger className="mt-1">
          <SelectValue
            placeholder="Payment method"
            className="text-[#a9a9a9]"
          />
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
      <Button
        disabled={!(name && amount && paymentMethod)}
        onClick={() => addNewExpense()}
      >
        Add New Expense
      </Button>
    </div>
  );
}
