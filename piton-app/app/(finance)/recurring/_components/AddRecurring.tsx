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
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { RecurringDatePicker } from "./RecurringDatePicker";
import { Recurrence } from "@/db/schema";
import { useUser } from "@clerk/nextjs";

export default function AddRecurring() {
  const router = useRouter();
  const { user } = useUser();
  const currentUser = user?.primaryEmailAddress?.emailAddress;

  const [name, setName] = React.useState<string>("");
  const [amount, setAmount] = React.useState<string>("");
  const [category, setCategory] = React.useState<string>("");
  const [method, setMethod] = React.useState<string>("");
  const [date, setDate] = React.useState<Date>(new Date());

  const addNewRecurrence = async () => {
    if (!amount || !date || !category || !method || !currentUser) {
      window.alert("Missing required information");
      return;
    }
    const result = await db
      .insert(Recurrence)
      .values({
        name: name,
        amount: amount,
        category: category,
        payment_method: method,
        date: date?.toDateString(),
        created_by: currentUser,
      })
      .returning({ insertId: Recurrence.id });

    if (result) {
      toast.success("New Reccuring Payment Added!");
      router.refresh();
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center justify-center gap-2"
        >
          <CirclePlus strokeWidth={1.75} color="#555353" />
          <span className="font-semibold text-medium">Add New Payment</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            Add Reccuring Payment
          </DialogTitle>
          <DialogDescription className="flex flex-col gap-4 pt-4">
            {/* Payment Name */}
            <Input
              placeholder="Payment name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {/* Payment Amount */}
            <Input
              placeholder="Amount"
              type="number"
              className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              value={amount}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (value > 0) {
                  setAmount(e.target.value);
                } else {
                  e.target.value = "";
                }
              }}
            />
            {/* DatePicker */}
            <RecurringDatePicker date={date} setDate={setDate} />
            {/* Payment Category */}
            <Select
              value={category}
              onValueChange={(value) => setCategory(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Category" />
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
            {/* Payment method */}
            <Select value={method} onValueChange={(value) => setMethod(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="check">Check</SelectItem>
                <SelectItem value="credit card">Credit Card</SelectItem>
                <SelectItem value="debit card">Debit Card</SelectItem>
                <SelectItem value="mobile payment">
                  Mobile Payment (Paypal, CashApp, Zelle, etc.)
                </SelectItem>
              </SelectContent>
            </Select>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 sm:justify-start">
          <DialogClose asChild>
            <Button
              className="w-full"
              disabled={!(name && amount && date && category && method)}
              onClick={() => addNewRecurrence()}
            >
              Add payment
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
