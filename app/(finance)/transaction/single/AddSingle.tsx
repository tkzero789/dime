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
import { HandCoins } from "lucide-react";
import { Input } from "@/components/ui/input";
import { db } from "@/db/dbConfig";
import toast from "react-hot-toast";
import { Single } from "@/db/schema";
import { useUser } from "@clerk/nextjs";
import { SingleDatePicker } from "./SingleDatePicker";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export default function AddSingle() {
  const router = useRouter();
  const { user } = useUser();
  const currentUser = user?.primaryEmailAddress?.emailAddress;

  const [name, setName] = React.useState<string>("");
  const [amount, setAmount] = React.useState<string>("");
  const [method, setMethod] = React.useState<string>("");
  const [date, setDate] = React.useState<Date>(new Date());
  const category = "single payment";

  const addNewSingle = async () => {
    if (!amount || !date || !category || !method || !currentUser) {
      window.alert("Missing required information");
      return;
    }

    const formattedDate = format(date, "yyyy-MM-dd");

    const result = await db
      .insert(Single)
      .values({
        name: name,
        amount: amount,
        category: category,
        payment_method: method,
        date: formattedDate,
        created_by: currentUser,
      })
      .returning({ insertId: Single.id });

    if (result) {
      toast.success("New Single Payment Added!");
      router.refresh();
    }
  };

  const handleClearInput = () => {
    setName("");
    setAmount("");
    setMethod("");
    setDate(new Date());
  };

  return (
    <Dialog>
      <DialogTrigger asChild onClick={handleClearInput}>
        <Button variant="outline" className="w-full">
          <span className="flex w-2/5 justify-end pr-2">
            <HandCoins />
          </span>
          <span className="flex-1 text-start">Single payment</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-dvh flex-col gap-8 sm:h-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Add Single Payment</DialogTitle>
          <DialogDescription>
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
                  const value = e.target.value;
                  if (parseFloat(value) > 0 || value === "") {
                    setAmount(e.target.value);
                  }
                }}
              />
              {/* DatePicker */}
              <SingleDatePicker date={date} setDate={setDate} />
              {/* Payment Category */}
              <div className="flex h-10 items-center justify-start rounded-md border border-input px-3 py-2 text-foreground">
                Single payment
              </div>
              {/* Payment method */}
              <Select
                value={method}
                onValueChange={(value) => setMethod(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="credit card">Credit Card</SelectItem>
                  <SelectItem value="debit card">Debit Card</SelectItem>
                  <SelectItem value="direct deposit">Direct Deposit</SelectItem>
                  <SelectItem value="mobile payment">
                    Mobile Payment (Paypal, CashApp, Zelle, etc.)
                  </SelectItem>
                  <SelectItem value="payroll card">Payroll Card</SelectItem>
                </SelectContent>
              </Select>
            </DialogDescription>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:justify-start">
          <DialogClose asChild>
            <Button
              className="w-full"
              disabled={!(name && amount && date && category && method)}
              onClick={() => addNewSingle()}
            >
              Add payment
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
