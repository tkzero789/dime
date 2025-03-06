"use client";

import React from "react";
import {
  Dialog,
  DialogClose,
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
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IncomeDatePicker } from "./IncomeDatePicker";
import { IncomeState } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addIncome } from "@/lib/api/income";
import toast from "react-hot-toast";

export default function AddIncome() {
  const [open, setOpen] = React.useState<boolean>(false);

  const [newIncome, setNewIncome] = React.useState<IncomeState>({
    name: "",
    amount: "",
    category: "",
    method: "",
    date: new Date(),
  });

  const handleFormChange = (field: keyof IncomeState, value: string | Date) => {
    setNewIncome((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: addIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["income"] });
      setOpen(false);
      toast.success("Income added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add income");
      console.log("Failed to add income", error);
    },
    onSettled: () => {
      handleClearInput();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newIncome.name ||
      !newIncome.amount ||
      !newIncome.date ||
      !newIncome.category ||
      !newIncome.method
    ) {
      toast.error("Missing required information");
      return;
    }

    mutate({
      name: newIncome.name,
      amount: newIncome.amount,
      date: newIncome.date,
      category: newIncome.category,
      method: newIncome.method,
    });
  };

  const handleClearInput = () => {
    setNewIncome({
      name: "",
      amount: "",
      category: "",
      method: "",
      date: new Date(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2" onClick={handleClearInput}>
          <Plus className="h-6 w-6" strokeWidth={1.5} />
          Add income
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add income</DialogTitle>
          <DialogClose asChild className="lg:hidden">
            <Button
              size="icon"
              type="submit"
              form="addIncomeForm"
              disabled={
                !(
                  newIncome.name &&
                  newIncome.amount &&
                  newIncome.date &&
                  newIncome.category &&
                  newIncome.method
                ) || isPending
              }
            >
              <Plus className="h-6 w-6" strokeWidth={1.5} />
            </Button>
          </DialogClose>
        </DialogHeader>
        <form
          id="addIncomeForm"
          onSubmit={handleSubmit}
          className="flex flex-col gap-8"
        >
          <div className="flex flex-col gap-4 px-6">
            <Input
              type="text"
              placeholder="Income name"
              value={newIncome.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
            />
            {/* Income Amount */}
            <Input
              type="number"
              placeholder="Amount"
              value={newIncome.amount}
              onChange={(e) => {
                const value = e.target.value;
                if (parseFloat(value) > 0 || value === "") {
                  handleFormChange("amount", value);
                }
              }}
            />
            {/* DatePicker */}
            <IncomeDatePicker
              date={newIncome.date}
              handleFormChange={handleFormChange}
            />
            {/* Category */}
            <Select
              value={newIncome.category}
              onValueChange={(value) => handleFormChange("category", value)}
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
            <Select
              value={newIncome.method}
              onValueChange={(value) => handleFormChange("method", value)}
            >
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
          </div>
          <div className="flex items-center justify-end border-t px-6 py-4">
            <Button
              type="submit"
              className="hidden lg:block"
              disabled={
                !(
                  newIncome.name &&
                  newIncome.amount &&
                  newIncome.date &&
                  newIncome.category &&
                  newIncome.method
                ) || isPending
              }
            >
              {isPending && "loading..."}
              Add income
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
