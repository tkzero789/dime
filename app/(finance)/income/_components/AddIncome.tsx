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
import { LoaderCircle, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IncomeDatePicker } from "./IncomeDatePicker";
import { IncomeState } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addIncome } from "@/lib/api/income";
import toast from "react-hot-toast";
import { startOfDay } from "date-fns";

const selectOptions = {
  categories: [
    { value: "salary", label: "Salary" },
    { value: "business", label: "Business" },
    { value: "investments", label: "Investments" },
    { value: "rental income", label: "Rental Income" },
    { value: "pensions", label: "Pensions" },
  ],
  paymentMethods: [
    { value: "cash", label: "Cash" },
    { value: "check", label: "Check" },
    { value: "direct deposit", label: "Direct Deposit" },
    {
      value: "mobile payment",
      label: "Mobile Payment (Paypal, CashApp, Zelle, etc.)",
    },
    { value: "payroll card", label: "Payroll Card" },
  ],
};

export default function AddIncome() {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const [newIncome, setNewIncome] = React.useState<IncomeState>({
    name: "",
    amount: "",
    category: "",
    payment_method: "",
    date: startOfDay(new Date()),
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
      setIsOpen(false);
      toast.success("Income added");
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
      newIncome.name.trim() == "" ||
      !newIncome.amount ||
      !newIncome.date ||
      !newIncome.category ||
      !newIncome.payment_method
    ) {
      toast.error("Missing required information");
      return;
    }

    mutate({
      name: newIncome.name,
      amount: newIncome.amount,
      date: newIncome.date,
      category: newIncome.category,
      payment_method: newIncome.payment_method,
    });
  };

  const handleClearInput = () => {
    setNewIncome({
      name: "",
      amount: "",
      category: "",
      payment_method: "",
      date: startOfDay(new Date()),
    });
  };

  const checkEmptyValue = () => {
    if (
      newIncome.name.trim() === "" ||
      !newIncome.amount ||
      !newIncome.date ||
      !newIncome.category ||
      !newIncome.payment_method ||
      isPending
    )
      return true;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={handleClearInput}>
          <Plus />
          Add income
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add income</DialogTitle>
          <Button
            size="icon"
            type="submit"
            form="addIncomeForm"
            disabled={checkEmptyValue()}
            className="lg:hidden"
          >
            {isPending ? <LoaderCircle className="animate-spin" /> : <Plus />}
          </Button>
        </DialogHeader>
        <form
          id="addIncomeForm"
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          {/* Form content */}
          <div className="flex flex-col gap-4 px-6 md:pb-6 lg:pb-0">
            {/* Name */}
            <Input
              type="text"
              placeholder="Income name"
              value={newIncome.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
            />
            {/* Amount */}
            <Input
              type="number"
              placeholder="Amount"
              value={newIncome.amount}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d{0,2}$/.test(value)) {
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
                {selectOptions.categories.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Payment method */}
            <Select
              value={newIncome.payment_method}
              onValueChange={(value) =>
                handleFormChange("payment_method", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Payment method" />
              </SelectTrigger>
              <SelectContent>
                {selectOptions.paymentMethods.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Button */}
          <div className="hidden items-center justify-end border-t p-6 lg:flex">
            <Button type="submit" disabled={checkEmptyValue()}>
              {isPending && <LoaderCircle className="animate-spin" />}Add income
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
