"use client";

import React from "react";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { Check, LoaderCircle, PenBox } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BudgetData, BudgetState } from "@/types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import BudgetCategory from "./BudgetCategory";
import { BudgetDatePicker } from "./BudgetDatePicker";
import { convertToLocalDate } from "@/utils/convertToLocalDate";
import { updateBudget } from "@/lib/api/budgets";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

type Props = {
  budgetData: BudgetData | undefined;
};

export default function EditBudget({ budgetData }: Props) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isOpenEmoji, setIsOpenEmoji] = React.useState<boolean>(false);

  const [budgetToUpdate, setBudgetToUpdate] = React.useState<BudgetState>({
    emoji: budgetData?.emoji ?? null,
    category: budgetData?.category ?? "",
    amount: budgetData?.amount ?? "",
    date: convertToLocalDate(budgetData?.date ?? ""),
  });

  const handleFormChange = (
    field: keyof BudgetState,
    value: string | number | Date,
  ) => {
    setBudgetToUpdate((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: updateBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.budgets.byId(budgetData?.id ?? ""),
      });
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
      !budgetToUpdate.emoji ||
      !budgetToUpdate.category ||
      !budgetToUpdate.amount ||
      !budgetToUpdate.date
    ) {
      toast.error("Missing required information");
      return;
    }

    mutate({
      id: budgetData?.id ?? "",
      emoji: budgetToUpdate.emoji,
      category: budgetToUpdate.category,
      amount: budgetToUpdate.amount,
      date: budgetToUpdate.date,
    });
  };

  const checkEmptyValue = () => {
    if (
      !budgetToUpdate.emoji ||
      !budgetToUpdate.category ||
      !budgetToUpdate.amount ||
      !budgetToUpdate.date ||
      isPending
    )
      return true;
  };

  console.log(budgetToUpdate);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <PenBox />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit budget</DialogTitle>
          <DialogClose asChild>
            <Button
              size="icon"
              type="submit"
              form="editBudgetForm"
              disabled={checkEmptyValue()}
              className="lg:hidden"
            >
              <Check />
            </Button>
          </DialogClose>
        </DialogHeader>
        <form
          id="editBudgetForm"
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          {/* Form content */}
          <div className="flex flex-col gap-4 px-6 md:pb-6 lg:pb-0">
            {/* Emoji selection & Budget category */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpenEmoji(!isOpenEmoji);
                }}
                className="h-12"
              >
                {budgetToUpdate.emoji ? budgetToUpdate.emoji : "Emoji"}
              </Button>
              <BudgetCategory
                category={budgetToUpdate.category}
                handleFormChange={handleFormChange}
              />
            </div>
            {/* Emoji pop-up */}
            <div className="absolute z-10">
              <EmojiPicker
                open={isOpenEmoji}
                emojiStyle={EmojiStyle.TWITTER}
                onEmojiClick={(e) => {
                  handleFormChange("emoji", e.emoji);
                  setIsOpenEmoji(false);
                }}
              />
            </div>
            {/* Amount */}
            <Input
              type="number"
              placeholder="Amount"
              value={budgetToUpdate.amount}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d{0,2}$/.test(value)) {
                  handleFormChange("amount", value);
                }
              }}
            />
            {/* Month */}
            <BudgetDatePicker
              date={budgetToUpdate.date}
              handleFormChange={handleFormChange}
            />
          </div>
          {/* Button */}
          <div className="hidden items-center justify-end border-t p-6 lg:flex">
            <Button type="submit" disabled={checkEmptyValue()}>
              {isPending && <LoaderCircle className="animate-spin" />}
              Save changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
