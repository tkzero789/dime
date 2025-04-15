"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
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
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { Recurring_rule } from "@/db/schema";
import { db } from "@/db/dbConfig";

export default function AddRecurring() {
  const router = useRouter();
  const { user } = useUser();
  const currentUser = user?.primaryEmailAddress?.emailAddress ?? "";

  const [name, setName] = React.useState<string>("");
  const [amount, setAmount] = React.useState<string>("");
  const [category, setCategory] = React.useState<string>("");
  const [method, setMethod] = React.useState<string>("");
  const [frequency, setFrequency] = React.useState<string>("");
  const [dueDate, setDueDate] = React.useState<string>("");

  const currentDate = new Date();
  const currentYear = currentDate.getUTCFullYear();
  const currentMonth = String(currentDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(Math.floor(Number(dueDate))).padStart(2, "0");

  const formattedDate = `${currentYear}-${currentMonth}-${day}`;

  const addNewRecurrence = async () => {
    if (
      !amount ||
      !frequency ||
      !dueDate ||
      !category ||
      !method ||
      !currentUser
    ) {
      window.alert("Missing required information");
      return;
    }

    const result = await db
      .insert(Recurring_rule)
      .values({
        name: name,
        amount: amount,
        category: category,
        payment_method: method,
        set_date: new Date().toISOString(),
        frequency: frequency,
        due_date: formattedDate,
        created_by: currentUser,
      })
      .returning({ insertId: Recurring_rule.id });

    if (result) {
      toast.success("New Reccuring Payment Added!");
      router.refresh();
    }
  };

  const handleClearInput = () => {
    setName("");
    setAmount("");
    setFrequency("");
    setDueDate("");
    setCategory("");
    setMethod("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={handleClearInput}>
          <Plus />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add reccuring payment</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 px-6 md:pb-6 lg:pb-0">
            {/* Payment Name */}
            <Input
              type="text"
              placeholder="Payment name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {/* Payment Amount */}
            <Input
              type="number"
              placeholder="Amount"
              className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              value={amount}
              onChange={(e) => {
                const value = e.target.value;
                if (parseFloat(value) > 0 || value === "") {
                  setAmount(e.target.value);
                }
              }}
            />
            {/* Recurrence Type */}
            <Select
              value={frequency}
              onValueChange={(value) => setFrequency(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Repeat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            {/* Due Date */}
            <Select
              value={dueDate}
              onValueChange={(value) => setDueDate(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Due date" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 31 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                <SelectItem value="car payment">Car Payment</SelectItem>
                <SelectItem value="credit card payment">
                  Credit Card Payment
                </SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
                <SelectItem value="loan">Loan</SelectItem>
                <SelectItem value="monthly subscription">
                  Monthly Subscription
                </SelectItem>
                <SelectItem value="mortgage">Mortgage</SelectItem>
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
          </div>
          <div className="hidden items-center justify-end border-t p-6 lg:flex">
            <Button
              type="submit"
              disabled={!(name && amount && category && method)}
              onClick={() => addNewRecurrence()}
            >
              Add payment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
