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

import { Input } from "@/components/ui/input";
import {
  ChevronDown,
  ChevronUp,
  LoaderCircle,
  Pencil,
  Plus,
} from "lucide-react";
import React from "react";
import { TransactionData, TransactionInput } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateTransaction } from "@/lib/api/transactions";
import { queryKeys } from "@/lib/queryKeys";
import toast from "react-hot-toast";
import { getAccountData } from "@/lib/api/accounts";
import { cn } from "@/lib/utils";
import { TransactionDatePicker } from "./TransactionDatePicker";
import { convertToLocalDate } from "@/utils/convertToLocalDate";
import FormatString from "@/utils/formatString";
import { TRANSACTION_CATEGORIES } from "@/lib/constants";

type Props = {
  transactionData: TransactionData;
};

export default function EditTransaction({ transactionData }: Props) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isAccountOpen, setIsAccountOpen] = React.useState<boolean>(false);
  const [accountName, setAccountName] = React.useState<string>(
    transactionData.payment_source.name,
  );
  const [isCategoryOpen, setIsCategoryOpen] = React.useState<boolean>(false);

  const { data: accountData } = useQuery({
    queryKey: queryKeys.accounts.all(),
    queryFn: getAccountData,
  });

  const [transactionToUpdate, setTransactionToUpdate] =
    React.useState<TransactionInput>({
      type: transactionData.type,
      name: transactionData.name,
      amount: transactionData.amount,
      category: transactionData.category.value,
      payment_source: transactionData.payment_source.id,
      date: convertToLocalDate(transactionData.date),
    });

  const handleFormChange = (
    field: keyof TransactionInput,
    value: string | Date,
  ) => {
    setTransactionToUpdate((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: updateTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all() });
      setIsOpen(false);
      toast.success("Transaction updated");
    },
    onError: (error) => {
      toast.error("Failed to update transaction");
      console.log("Failed to update transaction", error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !transactionToUpdate.type ||
      transactionToUpdate.name.trim() == "" ||
      !transactionToUpdate.amount ||
      !transactionToUpdate.category ||
      !transactionToUpdate.payment_source ||
      !transactionToUpdate.date
    ) {
      toast.error("Missing required information");
      return;
    }

    mutate({
      id: transactionData.id,
      type: transactionToUpdate.type,
      name: transactionToUpdate.name,
      amount: transactionToUpdate.amount,
      category: transactionToUpdate.category,
      payment_source: transactionToUpdate.payment_source,
      date: transactionToUpdate.date,
    });
  };

  const handleResetValue = () => {
    setTransactionToUpdate({
      type: transactionData.type,
      name: transactionData.name,
      amount: transactionData.amount,
      category: transactionData.category.value,
      payment_source: transactionData.payment_source.id,
      date: convertToLocalDate(transactionData.date),
    });
  };

  const checkEmptyValue = () => {
    if (
      !transactionToUpdate.type ||
      transactionToUpdate.name.trim() === "" ||
      !transactionToUpdate.amount ||
      !transactionToUpdate.category ||
      !transactionToUpdate.payment_source ||
      !transactionToUpdate.date ||
      isPending
    )
      return true;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResetValue}
          className="w-full justify-start"
        >
          <Pencil />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit transaction</DialogTitle>
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
                transactionToUpdate.type === "expense" &&
                  "bg-primary text-primary-foreground hover:text-primary-foreground",
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
                transactionToUpdate.type === "income" &&
                  "bg-primary text-primary-foreground hover:text-primary-foreground",
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
            date={transactionToUpdate.date}
            handleFormChange={handleFormChange}
          />
          {/* Name */}
          <Input
            type="text"
            placeholder="Name"
            value={transactionToUpdate.name}
            onChange={(e) => handleFormChange("name", e.target.value)}
          />
          {/* Amount */}
          <Input
            type="number"
            placeholder="Amount"
            value={transactionToUpdate.amount}
            onChange={(e) => handleFormChange("amount", e.target.value)}
          />
          {/* Category */}
          <Popover open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-12 justify-between text-base text-muted-foreground lg:h-9 lg:text-sm",
                  transactionToUpdate.category && "text-foreground",
                )}
              >
                {transactionToUpdate.category ? (
                  <FormatString text={transactionToUpdate.category} split="_" />
                ) : (
                  "Category"
                )}
                {isCategoryOpen ? <ChevronUp /> : <ChevronDown />}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex max-h-80 w-[--radix-popover-trigger-width] flex-col overflow-auto p-0">
              {transactionToUpdate.type === "expense"
                ? TRANSACTION_CATEGORIES.expense.map((item, index) => (
                    <Button
                      key={item.value}
                      variant="outline"
                      onClick={() => {
                        handleFormChange("category", item.value);
                        setIsCategoryOpen(false);
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
                {transactionToUpdate?.payment_source ? accountName : "From"}
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
                      {account.type === "debit" ? "Debit" : "Credit"}
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
            {isPending && <LoaderCircle className="animate-spin" />} Save
            changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
