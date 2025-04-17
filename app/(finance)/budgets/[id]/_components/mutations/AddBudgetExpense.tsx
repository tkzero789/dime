import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { ExpenseDatePicker } from "./ExpenseDatePicker";
import { startOfDay } from "date-fns";
import { ChevronDown, ChevronUp, LoaderCircle, Plus } from "lucide-react";
import { AccountData, BudgetExpenseState } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { addBudgetExpense } from "@/lib/api/budget/expense";

type Props = {
  budgetId: string;
  budgetCategory: string;
  accountData: AccountData[];
};

export default function AddBudgetExpense({
  budgetId,
  budgetCategory,
  accountData,
}: Props) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isAccountOpen, setIsAccountOpen] = React.useState<boolean>(false);

  const [newBudgetExpense, setNewBudgetExpense] =
    React.useState<BudgetExpenseState>({
      budget_id: "",
      account_id: "",
      name: "",
      amount: "",
      category: "",
      payment_source: "",
      date: startOfDay(new Date()),
    });

  const handleFormChange = (
    field: keyof BudgetExpenseState,
    value: string | Date,
  ) => {
    setNewBudgetExpense((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: addBudgetExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgetExpense"] });
      setIsOpen(false);
      toast.success("Expense added");
    },
    onError: (error) => {
      toast.error("Failed to add expense");
      console.log("Failed to add expense", error);
    },
    onSettled: () => {
      handleClearInput();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      newBudgetExpense.name.trim() === "" ||
      !newBudgetExpense.budget_id ||
      !newBudgetExpense.account_id ||
      !newBudgetExpense.amount ||
      !newBudgetExpense.date ||
      !newBudgetExpense.category ||
      !newBudgetExpense.payment_source
    ) {
      toast.error("Missing required information");
      return;
    }

    mutate({
      budget_id: newBudgetExpense.budget_id,
      account_id: newBudgetExpense.account_id,
      name: newBudgetExpense.name,
      amount: newBudgetExpense.amount,
      category: newBudgetExpense.category,
      payment_source: newBudgetExpense.payment_source,
      date: newBudgetExpense.date,
    });
  };

  const handleClearInput = () => {
    setNewBudgetExpense({
      budget_id: budgetId,
      account_id: "",
      name: "",
      amount: "",
      category: budgetCategory,
      payment_source: "",
      date: startOfDay(new Date()),
    });
  };

  const checkEmptyValue = () => {
    if (
      newBudgetExpense.name.trim() === "" ||
      !newBudgetExpense.budget_id ||
      !newBudgetExpense.account_id ||
      !newBudgetExpense.amount ||
      !newBudgetExpense.date ||
      !newBudgetExpense.category ||
      !newBudgetExpense.payment_source ||
      isPending
    )
      return true;
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            size="icon"
            onClick={handleClearInput}
            className="lg:w-auto lg:px-4 lg:py-2"
          >
            <Plus />
            <span className="hidden lg:block">Add expense</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add expense</DialogTitle>
            <Button
              size="icon"
              type="submit"
              form="addBudgetExpenseForm"
              disabled={checkEmptyValue()}
              className="lg:hidden"
            >
              <Plus />
            </Button>
          </DialogHeader>
          <form
            id="addBudgetExpenseForm"
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-4 px-6 md:pb-6 lg:pb-0">
              {/* Name */}
              <Input
                placeholder="Expense name"
                value={newBudgetExpense.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
              />
              {/* Amount */}
              <Input
                placeholder="Amount"
                type="number"
                className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                value={newBudgetExpense.amount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*\.?\d{0,2}$/.test(value)) {
                    handleFormChange("amount", value);
                  }
                }}
              />
              {/* Payment source */}
              <Popover open={isAccountOpen} onOpenChange={setIsAccountOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-12 justify-between text-base font-normal text-muted-foreground"
                  >
                    {newBudgetExpense?.payment_source
                      ? newBudgetExpense.payment_source
                      : "From"}
                    {isAccountOpen ? <ChevronUp /> : <ChevronDown />}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="flex max-h-80 w-[--radix-popover-trigger-width] flex-col gap-2 overflow-y-auto">
                  {accountData?.map((item) => (
                    <Button
                      key={item.id}
                      variant="outline"
                      onClick={() => {
                        handleFormChange("account_id", item.id);
                        handleFormChange("payment_source", item.id);
                        setIsAccountOpen(false);
                      }}
                      className="relative h-auto justify-between"
                    >
                      <div className="text-base font-medium">{item.name}</div>
                      <div
                        className={cn(
                          "rounded-md bg-gradient-to-br px-2 py-1",
                          item.color,
                        )}
                      >
                        <div className="text-xs font-medium text-white">
                          {item.type === "checking" ? "Debit" : "Credit"}
                        </div>
                      </div>
                    </Button>
                  ))}
                </PopoverContent>
              </Popover>
              {/* Date */}
              <ExpenseDatePicker
                date={newBudgetExpense.date}
                handleFormChange={handleFormChange}
              />
            </div>
            {/* Button */}
            <div className="hidden items-center justify-end border-t p-6 lg:flex">
              <Button type="submit" disabled={checkEmptyValue()}>
                {isPending && <LoaderCircle className="animate-spin" />}Add
                expense
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
