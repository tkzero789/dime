"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import React from "react";
import { TransactionInput } from "@/types";
import { startOfDay } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addTransaction } from "@/lib/api/transactions";
import { queryKeys } from "@/lib/queryKeys";
import toast from "react-hot-toast";
import { getAccountData } from "@/lib/api/accounts";
import { cn } from "@/lib/utils";
import { TransactionDatePicker } from "./TransactionDatePicker";
import { TRANSACTION_CATEGORIES } from "@/lib/constants";
import { useDesktop } from "@/hooks/use-desktop";

export default function AddTransaction() {
  const isDesktop = useDesktop();

  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isAccountOpen, setIsAccountOpen] = React.useState<boolean>(false);
  const [accountName, setAccountName] = React.useState<string>("");
  const [isCategoryOpen, setIsCategoryOpen] = React.useState<boolean>(false);
  const [categoryName, setCategoryName] = React.useState<string>("");
  const [amountInCents, setAmountInCents] = React.useState<number>(0);

  const { data: accountData } = useQuery({
    queryKey: queryKeys.accounts.all(),
    queryFn: getAccountData,
  });

  const [newTransaction, setNewTransaction] = React.useState<TransactionInput>({
    name: "",
    amount: "",
    type: "expense",
    category: "",
    payment_source: "",
    date: startOfDay(new Date()),
  });

  const handleFormChange = (
    field: keyof TransactionInput,
    value: string | Date,
  ) => {
    setNewTransaction((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatAmountDisplay = (cents: number): string => {
    const dollars = (cents / 100).toFixed(2);
    return dollars;
  };

  const handleAmountInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const key = e.key;

    // Handle backspace
    if (key === "Backspace") {
      const newCents = Math.floor(amountInCents / 10);
      setAmountInCents(newCents);
      const newAmount = newCents === 0 ? "" : (newCents / 100).toString();
      handleFormChange("amount", newAmount);
      return;
    }

    // Only allow digits
    if (!/^\d$/.test(key)) {
      return;
    }

    // Add digit to the right (shift cents left and add new digit)
    const digit = parseInt(key);
    const newCents = amountInCents * 10 + digit;

    // Prevent overflow (max 9999999.99 = 999999999 cents)
    if (newCents > 999999999) {
      return;
    }

    setAmountInCents(newCents);
    handleFormChange("amount", (newCents / 100).toString());
  };

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: addTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all() });
      setIsOpen(false);
      toast.success("Transaction added");
    },
    onError: (error) => {
      toast.error("Failed to add transaction");
      console.log("Failed to add transaction", error);
    },
    onSettled: () => {
      handleClearInput();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      newTransaction.name.trim() == "" ||
      !newTransaction.amount ||
      !newTransaction.type ||
      !newTransaction.category ||
      !newTransaction.payment_source ||
      !newTransaction.date
    ) {
      toast.error("Missing required information");
      return;
    }

    mutate({
      name: newTransaction.name,
      amount: newTransaction.amount,
      type: newTransaction.type,
      category: newTransaction.category,
      payment_source: newTransaction.payment_source,
      date: newTransaction.date,
    });
  };

  const handleClearInput = () => {
    setNewTransaction({
      name: "",
      amount: "",
      type: "expense",
      category: "",
      payment_source: "",
      date: startOfDay(new Date()),
    });
  };

  const checkEmptyValue = () => {
    if (
      newTransaction.name.trim() === "" ||
      !newTransaction.amount ||
      !newTransaction.type ||
      !newTransaction.category ||
      !newTransaction.payment_source ||
      !newTransaction.date ||
      isPending
    )
      return true;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size={isDesktop ? "default" : "icon"}
          onClick={handleClearInput}
        >
          <Plus />
          <span className="hidden lg:block">Add transaction</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add transaction</DialogTitle>
          <Button
            size="icon"
            type="submit"
            form="addTransactionForm"
            disabled={checkEmptyValue()}
            className="lg:hidden"
          >
            {isPending ? <LoaderCircle className="animate-spin" /> : <Plus />}
          </Button>
        </DialogHeader>
        <form
          id="addTransactionForm"
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 p-4"
        >
          {/* Type */}
          <ButtonGroup className="w-full rounded-lg">
            <Button
              variant="outline"
              type="button"
              className={cn(
                "h-12 w-full text-base focus:text-primary-foreground lg:h-9 lg:text-sm",
                newTransaction.type === "expense" &&
                  "bg-primary text-primary-foreground",
              )}
              onClick={() => {
                handleFormChange("type", "expense");
                handleFormChange("category", "");
              }}
            >
              Expense
            </Button>
            <Button
              variant="outline"
              type="button"
              className={cn(
                "h-12 w-full text-base focus:text-primary-foreground lg:h-9 lg:text-sm",
                newTransaction.type === "income" &&
                  "bg-primary text-primary-foreground",
              )}
              onClick={() => {
                handleFormChange("type", "income");
                handleFormChange("category", "");
              }}
            >
              Income
            </Button>
          </ButtonGroup>
          {/* Date */}
          <TransactionDatePicker
            date={newTransaction.date}
            handleFormChange={handleFormChange}
          />
          {/* Name */}
          <Input
            type="text"
            placeholder="Name"
            value={newTransaction.name}
            onChange={(e) => handleFormChange("name", e.target.value)}
          />
          {/* Amount */}
          <Input
            type="number"
            placeholder="Amount"
            value={
              amountInCents === 0 ? "" : formatAmountDisplay(amountInCents)
            }
            onKeyDown={handleAmountInput}
            onChange={() => {}}
          />
          {/* Category */}
          <Popover open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-12 justify-between text-base text-muted-foreground lg:h-9 lg:text-sm",
                  categoryName && "text-foreground",
                )}
              >
                {newTransaction.category ? categoryName : "Category"}
                {isCategoryOpen ? <ChevronUp /> : <ChevronDown />}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex max-h-80 w-[--radix-popover-trigger-width] flex-col overflow-auto p-0">
              {newTransaction.type === "expense"
                ? TRANSACTION_CATEGORIES.expense.map((item, index) => (
                    <Button
                      key={item.value}
                      variant="outline"
                      onClick={() => {
                        handleFormChange("category", item.value);
                        setIsCategoryOpen(false);
                        setCategoryName(item.label);
                      }}
                      className={cn(
                        "h-12 justify-start gap-4 rounded-none border-0 p-4 text-base hover:border-t-border lg:h-9 lg:text-sm",
                        index !== 0 && "border-t",
                      )}
                    >
                      <item.icon />
                      {item.label}
                    </Button>
                  ))
                : TRANSACTION_CATEGORIES.income.map((item, index) => (
                    <Button
                      key={item.value}
                      variant="outline"
                      onClick={() => {
                        handleFormChange("category", item.value);
                        setIsCategoryOpen(false);
                        setCategoryName(item.label);
                      }}
                      className={cn(
                        "h-12 justify-start gap-4 rounded-none border-0 p-4 text-base hover:border-t-border lg:h-9 lg:text-sm",
                        index !== 0 && "border-t",
                      )}
                    >
                      <item.icon />
                      {item.label}
                    </Button>
                  ))}
            </PopoverContent>
          </Popover>
          {/* Payment source */}
          <Popover open={isAccountOpen} onOpenChange={setIsAccountOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-12 justify-between text-base text-muted-foreground lg:h-9 lg:text-sm",
                  accountName && "text-foreground",
                )}
              >
                {newTransaction?.payment_source ? accountName : "From"}
                {isAccountOpen ? <ChevronUp /> : <ChevronDown />}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex max-h-80 w-[--radix-popover-trigger-width] flex-col overflow-y-auto p-0">
              {accountData?.map((account, index) => (
                <Button
                  key={account.id}
                  variant="outline"
                  onClick={() => {
                    handleFormChange("payment_source", account.id);
                    setAccountName(account.name);
                    setIsAccountOpen(false);
                  }}
                  className={cn(
                    "relative h-12 justify-between rounded-none border-0 hover:border-t-border lg:h-9",
                    index !== 0 && "border-t",
                  )}
                >
                  <div className="text-base lg:text-sm">{account.name}</div>
                  <div
                    className={cn(
                      "rounded-md bg-gradient-to-br px-2 py-1",
                      account.color,
                    )}
                  >
                    <div className="text-xs font-medium text-background">
                      {account.type === "checking" ? "Debit" : "Credit"}
                    </div>
                  </div>
                </Button>
              ))}
            </PopoverContent>
          </Popover>
        </form>
        {/* Button */}
        <div className="hidden items-center justify-end border-t p-4 lg:flex">
          <Button
            type="submit"
            form="addTransactionForm"
            disabled={checkEmptyValue()}
          >
            {isPending && <LoaderCircle className="animate-spin" />}Add
            transaction
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
