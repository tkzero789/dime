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
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, LoaderCircle, Pencil } from "lucide-react";
import React from "react";
import { BudgetData, BudgetInput } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBudget } from "@/lib/api/budgets";
import { queryKeys } from "@/lib/queryKeys";
import toast from "react-hot-toast";
import { cn, convertToLocalDate } from "@/lib/utils";
import { DatePicker } from "@/app/(finance)/_components/picker/DatePicker";
import { TRANSACTION_CATEGORIES, BUDGET_PERIODS } from "@/lib/constants";
import { addDays, endOfMonth, format, startOfMonth } from "date-fns";

type Props = {
  budgetData: BudgetData;
};

export default function EditBudget({ budgetData }: Props) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isCategoryOpen, setIsCategoryOpen] = React.useState<boolean>(false);
  const [isPeriodOpen, setIsPeriodOpen] = React.useState<boolean>(false);

  const getInitialCents = (amount: string) =>
    Math.round(parseFloat(amount) * 100);

  const [amountInCents, setAmountInCents] = React.useState<number>(
    getInitialCents(budgetData.amount),
  );

  const [budgetToUpdate, setBudgetToUpdate] = React.useState<BudgetInput>({
    category: budgetData.category,
    amount: budgetData.amount,
    period: budgetData.period,
    start_date: convertToLocalDate(budgetData.start_date),
    end_date: budgetData.end_date
      ? convertToLocalDate(budgetData.end_date)
      : undefined,
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
    setBudgetToUpdate((prev) => {
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
    return (cents / 100).toFixed(2);
  };

  const handleAmountInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const key = e.key;

    if (key === "Backspace") {
      const newCents = Math.floor(amountInCents / 10);
      setAmountInCents(newCents);
      const newAmount = newCents === 0 ? "" : (newCents / 100).toString();
      handleFormChange("amount", newAmount);
      return;
    }

    if (!/^\d$/.test(key)) {
      return;
    }

    const digit = parseInt(key);
    const newCents = amountInCents * 10 + digit;

    if (newCents > 999999999) {
      return;
    }

    setAmountInCents(newCents);
    handleFormChange("amount", (newCents / 100).toString());
  };

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: updateBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.all() });
      setIsOpen(false);
      toast.success("Budget updated");
    },
    onError: (error) => {
      toast.error("Failed to update budget");
      console.log("Failed to update budget", error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !budgetToUpdate.category ||
      !budgetToUpdate.amount ||
      !budgetToUpdate.period ||
      !budgetToUpdate.start_date
    ) {
      toast.error("Missing required information");
      return;
    }

    mutate({
      id: budgetData.id,
      category: budgetToUpdate.category,
      amount: budgetToUpdate.amount,
      period: budgetToUpdate.period,
      start_date: budgetToUpdate.start_date,
      end_date: budgetToUpdate.end_date,
    });
  };

  const handleResetValue = () => {
    setBudgetToUpdate({
      category: budgetData.category,
      amount: budgetData.amount,
      period: budgetData.period,
      start_date: convertToLocalDate(budgetData.start_date),
      end_date: budgetData.end_date
        ? convertToLocalDate(budgetData.end_date)
        : undefined,
    });
    setAmountInCents(getInitialCents(budgetData.amount));
  };

  const checkEmptyValue = () => {
    if (
      !budgetToUpdate.category ||
      !budgetToUpdate.amount ||
      !budgetToUpdate.period ||
      !budgetToUpdate.start_date ||
      isPending
    )
      return true;
  };

  const categoryLabel = TRANSACTION_CATEGORIES.expense.find(
    (item) => item.value === budgetToUpdate.category,
  )?.label;

  const periodLabel = BUDGET_PERIODS.find(
    (item) => item.value === budgetToUpdate.period,
  )?.label;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" onClick={handleResetValue}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit budget</DialogTitle>
          <Button
            size="icon"
            type="submit"
            form="editBudgetForm"
            disabled={checkEmptyValue()}
            className="lg:hidden"
          >
            {isPending ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <Pencil />
            )}
          </Button>
        </DialogHeader>
        <form
          id="editBudgetForm"
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
                  budgetToUpdate.category && "text-foreground",
                )}
              >
                {budgetToUpdate.category ? categoryLabel : "Category"}
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
                  budgetToUpdate.period && "text-foreground",
                )}
              >
                {budgetToUpdate.period ? periodLabel : "Period"}
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
            date={budgetToUpdate.start_date}
            label="Start date"
            field="start_date"
            handleFormChange={handleFormChange}
            disabled={
              budgetToUpdate.period === "monthly"
                ? (date: Date) => date.getDate() !== 1
                : undefined
            }
          />

          {/* End Date (auto-calculated) */}
          {budgetToUpdate.end_date && (
            <div className="flex h-12 items-center rounded-md border px-3 text-base text-muted-foreground lg:h-9 lg:text-sm">
              End date: {format(budgetToUpdate.end_date, "MMM dd, yyyy")}
            </div>
          )}
        </form>
        {/* Button */}
        <div className="hidden items-center justify-end border-t p-4 lg:flex">
          <Button
            type="submit"
            form="editBudgetForm"
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
