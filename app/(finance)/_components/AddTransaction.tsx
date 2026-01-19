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
import {
  BadgeDollarSign,
  Banknote,
  BriefcaseMedical,
  Building,
  Building2,
  Car,
  ChartCandlestick,
  Drama,
  HeartHandshake,
  HousePlus,
  LoaderCircle,
  Martini,
  PawPrint,
  PiggyBank,
  Plane,
  School,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import React from "react";
import { TransactionState } from "@/types";
import { startOfDay } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addTransaction } from "@/lib/api/transactions";
import { queryKeys } from "@/lib/queryKeys";
import toast from "react-hot-toast";
import { getAccountData } from "@/lib/api/accounts";
import { cn } from "@/lib/utils";
import { useDesktop } from "@/hooks/use-desktop";
import { TransactionDatePicker } from "./TransactionDatePicker";

const category = {
  expense: [
    {
      label: "Auto & Transport",
      value: "auto_transport",
      icon: Car,
      color: "#000000",
    },
    {
      label: "Business",
      value: "business",
      icon: Building2,
      color: "#000000",
    },
    {
      label: "Dining & Drinks",
      value: "dining_drinks",
      icon: Martini,
      color: "#000000",
    },
    {
      label: "Education",
      value: "education",
      icon: School,
      color: "#000000",
    },
    {
      label: "Entertainment",
      value: "entertainment",
      icon: Drama,
      color: "#000000",
    },
    {
      label: "Gifts & Donations",
      value: "gifts_donations",
      icon: HeartHandshake,
      color: "#000000",
    },
    {
      label: "Groceries",
      value: "groceries",
      icon: ShoppingCart,
      color: "#000000",
    },
    {
      label: "Medical",
      value: "medical",
      icon: BriefcaseMedical,
      color: "#000000",
    },
    {
      label: "Pets",
      value: "pets",
      icon: PawPrint,
      color: "#000000",
    },
    {
      label: "Shopping",
      value: "shopping",
      icon: ShoppingBag,
      color: "#000000",
    },
    {
      label: "Travel & Vacation",
      value: "travel_vacation",
      icon: Plane,
      color: "#000000",
    },
    {
      label: "Others",
      value: "others",
      icon: BadgeDollarSign,
      color: "#000000",
    },
  ],
  income: [
    { label: "Salary", value: "salary", icon: Banknote },
    { label: "Business", value: "business", icon: Building },
    { label: "Investments", value: "investments", icon: ChartCandlestick },
    { label: "Rental Income", value: "rental_income", icon: HousePlus },
    { label: "Pensions", value: "pensions", icon: PiggyBank },
  ],
};

export default function AddTransaction() {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isAccountOpen, setIsAccountOpen] = React.useState<boolean>(false);
  const [accountName, setAccountName] = React.useState<string>("");
  const [isCategoryOpen, setIsCategoryOpen] = React.useState<boolean>(false);
  const [categoryName, setCategoryName] = React.useState<string>("");

  const { data: accountData } = useQuery({
    queryKey: queryKeys.accounts.all(),
    queryFn: getAccountData,
  });

  const [newTransaction, setNewTransaction] = React.useState<TransactionState>({
    type: "expense",
    name: "",
    amount: "",
    category: "",
    payment_source: "",
    date: startOfDay(new Date()),
  });

  const handleFormChange = (
    field: keyof TransactionState,
    value: string | Date,
  ) => {
    setNewTransaction((prev) => ({
      ...prev,
      [field]: value,
    }));
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
      !newTransaction.type ||
      newTransaction.name.trim() == "" ||
      !newTransaction.amount ||
      !newTransaction.category ||
      !newTransaction.payment_source ||
      !newTransaction.date
    ) {
      toast.error("Missing required information");
      return;
    }

    mutate({
      type: newTransaction.type,
      name: newTransaction.name,
      amount: newTransaction.amount,
      category: newTransaction.category,
      payment_source: newTransaction.payment_source,
      date: newTransaction.date,
    });
  };

  const handleClearInput = () => {
    setNewTransaction({
      type: "expense",
      name: "",
      amount: "",
      category: "",
      payment_source: "",
      date: startOfDay(new Date()),
    });
  };

  const checkEmptyValue = () => {
    if (
      !newTransaction.type ||
      newTransaction.name.trim() === "" ||
      !newTransaction.amount ||
      !newTransaction.category ||
      !newTransaction.payment_source ||
      !newTransaction.date ||
      isPending
    )
      return true;
  };

  const isDesktop = useDesktop();

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
            value={newTransaction.amount}
            onChange={(e) => handleFormChange("amount", e.target.value)}
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
                ? category.expense.map((item, index) => (
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
                : category.income.map((item, index) => (
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
