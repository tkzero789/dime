"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CirclePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { db } from "@/db/dbConfig";
import { Income } from "@/db/schema";
import { IncomeDatePicker } from "./IncomeDatePicker";
import toast from "react-hot-toast";

type Props = {
  currentUser: string | undefined;
  refreshData: () => void;
};

export default function AddIncome({ currentUser, refreshData }: Props) {
  const [name, setName] = React.useState<string>("");
  const [amount, setAmount] = React.useState<string>("");
  const [category, setCategory] = React.useState<string>("");
  const [method, setMethod] = React.useState<string>("");
  const [date, setDate] = React.useState<Date>(new Date());

  const addNewIncome = async () => {
    if (!amount || !date || !category || !method || !currentUser) {
      window.alert("Missing required information");
      return;
    }
    const result = await db
      .insert(Income)
      .values({
        name: name,
        amount: amount,
        date: date?.toISOString(),
        category: category,
        payment_method: method,
        created_by: currentUser,
      })
      .returning({ insertedId: Income.id });

    if (result) {
      toast.success("New Income Added!");
      refreshData();
    }
  };

  const handleClearInput = () => {
    setName("");
    setAmount("");
    setCategory("");
    setMethod("");
    setDate(new Date());
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={handleClearInput}
        >
          <CirclePlus strokeWidth={1.5} />
          Add Income
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-dvh flex-col gap-8 sm:h-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Add Income</DialogTitle>
          <DialogDescription className="flex flex-col gap-4 pt-4">
            {/* Income Name */}
            <Input
              placeholder="Income name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {/* Income Amount */}
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
            {/* DatePicker */}
            <IncomeDatePicker date={date} setDate={setDate} />
            {/* Category */}
            <Select
              value={category}
              onValueChange={(value) => setCategory(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="salary">Salary</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="investments">Investments</SelectItem>
                <SelectItem value="rental income">Rental Income</SelectItem>
                <SelectItem value="pensions">Pensions</SelectItem>
              </SelectContent>
            </Select>
            {/* Payment Method */}
            <Select value={method} onValueChange={(value) => setMethod(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="check">Check</SelectItem>
                <SelectItem value="direct deposit">Direct Deposit</SelectItem>
                <SelectItem value="mobile payment">
                  Mobile Payment (Paypal, CashApp, Zelle, etc.)
                </SelectItem>
                <SelectItem value="payroll card">Payroll Card</SelectItem>
              </SelectContent>
            </Select>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:justify-start">
          <DialogClose asChild>
            <Button
              className="w-full"
              disabled={!(name && amount && date && category && method)}
              onClick={() => addNewIncome()}
            >
              Add income
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
