"use client";

import { Button } from "@/components/ui/button";
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
import { BudgetInput } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addBudget } from "@/lib/api/budgets";
import { queryKeys } from "@/lib/queryKeys";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { DatePicker } from "@/app/(finance)/_components/picker/DatePicker";
import { TRANSACTION_CATEGORIES, BUDGET_PERIODS } from "@/lib/constants";
import { useDesktop } from "@/hooks/use-desktop";
import { addDays, endOfMonth, format, startOfMonth } from "date-fns";

export default function AddBudget() {
  const isDesktop = useDesktop();

  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isCategoryOpen, setIsCategoryOpen] = React.useState<boolean>(false);
  const [categoryName, setCategoryName] = React.useState<string>("");
  const [isPeriodOpen, setIsPeriodOpen] = React.useState<boolean>(false);
  const [periodName, setPeriodName] = React.useState<string>("");
  const [amountInCents, setAmountInCents] = React.useState<number>(0);

  const [newBudget, setNewBudget] = React.useState<BudgetInput>({
    category: "",
    amount: "",
    period: "monthly",
    start_date: undefined,
    end_date: undefined,
  });

  const computeDates = (
    date: Date,
    period: string,
  ): { start_date: Date; end_date: Date } => {
    if (period === "weekly") {
      return { start_date: date, end_date: addDays(date, 6) };
    }
    const start = startOfMonth(date);
    return { start_date: start, end_date: endOfMonth(start) };
  };

  const handleFormChange = (field: keyof BudgetInput, value: string | Date) => {
    setNewBudget((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === "start_date" && value instanceof Date) {
        const { start_date, end_date } = computeDates(value, prev.period);
        updated.start_date = start_date;
        updated.end_date = end_date;
      }

      if (field === "period" && typeof value === "string" && prev.start_date) {
        const { start_date, end_date } = computeDates(prev.start_date, value);
        updated.start_date = start_date;
        updated.end_date = end_date;
      }

      return updated;
    });
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
    mutationFn: addBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.all() });
      setIsOpen(false);
      toast.success("Budget added");
    },
    onError: (error) => {
      toast.error("Failed to add budget");
      console.log("Failed to add budget", error);
    },
    onSettled: () => {
      handleClearInput();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newBudget.category ||
      !newBudget.amount ||
      !newBudget.period ||
      !newBudget.start_date
    ) {
      toast.error("Missing required information");
      return;
    }

    mutate({
      category: newBudget.category,
      amount: newBudget.amount,
      period: newBudget.period,
      start_date: newBudget.start_date,
      end_date: newBudget.end_date,
    });
  };

  const handleClearInput = () => {
    setNewBudget({
      category: "",
      amount: "",
      period: "monthly",
      start_date: undefined,
      end_date: undefined,
    });
    setAmountInCents(0);
    setCategoryName("");
    setPeriodName("");
  };

  const checkEmptyValue = () => {
    if (
      !newBudget.category ||
      !newBudget.amount ||
      !newBudget.period ||
      !newBudget.start_date ||
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
          <span className="hidden lg:block">Add budget</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add budget</DialogTitle>
          <Button
            size="icon"
            type="submit"
            form="addBudgetForm"
            disabled={checkEmptyValue()}
            className="lg:hidden"
          >
            {isPending ? <LoaderCircle className="animate-spin" /> : <Plus />}
          </Button>
        </DialogHeader>
        <form
          id="addBudgetForm"
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 p-4"
        >
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
                {newBudget.category ? categoryName : "Category"}
                {isCategoryOpen ? <ChevronUp /> : <ChevronDown />}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex max-h-80 w-[--radix-popover-trigger-width] flex-col overflow-auto p-0">
              {TRANSACTION_CATEGORIES.expense.map((item, index) => (
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

          {/* Period */}
          <Popover open={isPeriodOpen} onOpenChange={setIsPeriodOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-12 justify-between text-base text-muted-foreground lg:h-9 lg:text-sm",
                  periodName && "text-foreground",
                )}
              >
                {newBudget.period ? periodName || "Monthly" : "Period"}
                {isPeriodOpen ? <ChevronUp /> : <ChevronDown />}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex w-[--radix-popover-trigger-width] flex-col p-0">
              {BUDGET_PERIODS.map((item, index) => (
                <Button
                  key={item.value}
                  variant="outline"
                  onClick={() => {
                    handleFormChange("period", item.value);
                    setIsPeriodOpen(false);
                    setPeriodName(item.label);
                  }}
                  className={cn(
                    "h-12 justify-start rounded-none border-0 p-4 text-base hover:border-t-border lg:h-9 lg:text-sm",
                    index !== 0 && "border-t",
                  )}
                >
                  {item.label}
                </Button>
              ))}
            </PopoverContent>
          </Popover>

          {/* Start Date */}
          <DatePicker<BudgetInput>
            date={newBudget.start_date}
            label="Start date"
            field="start_date"
            handleFormChange={handleFormChange}
            disabled={
              newBudget.period === "monthly"
                ? (date: Date) => date.getDate() !== 1
                : undefined
            }
          />

          {/* End Date (auto-calculated) */}
          {newBudget.end_date && (
            <div className="flex h-12 items-center rounded-md border px-3 text-base text-muted-foreground lg:h-9 lg:text-sm">
              End date: {format(newBudget.end_date, "MMM dd, yyyy")}
            </div>
          )}
        </form>
        {/* Button */}
        <div className="hidden items-center justify-end border-t p-4 lg:flex">
          <Button
            type="submit"
            form="addBudgetForm"
            disabled={checkEmptyValue()}
          >
            {isPending && <LoaderCircle className="animate-spin" />}Add budget
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
