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
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import BudgetCategory from "./BudgetCategory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BudgetState } from "@/types";
import { LoaderCircle, Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addBudget } from "@/lib/api/budgets";
import toast from "react-hot-toast";
import { BudgetDatePicker } from "./BudgetDatePicker";
import { startOfDay } from "date-fns";
import { queryKeys } from "@/lib/queryKeys";

export default function CreateBudget() {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isOpenEmoji, setIsOpenEmoji] = React.useState<boolean>(false);

  const [newBudget, setNewBudget] = React.useState<BudgetState>({
    category: "",
    amount: "",
    emoji: "",
    date: startOfDay(new Date()),
  });

  const handleFormChange = (
    field: keyof BudgetState,
    value: string | number | Date,
  ) => {
    setNewBudget((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: addBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.all() });
      setIsOpen(false);
      toast.success("Budget created");
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
      !newBudget.emoji ||
      !newBudget.category ||
      !newBudget.amount ||
      !newBudget.date
    ) {
      {
        toast.error("Missing required information");
        return;
      }
    }

    mutate({
      emoji: newBudget.emoji,
      category: newBudget.category,
      amount: newBudget.amount,
      date: newBudget.date,
    });
  };

  const handleClearInput = () => {
    setNewBudget({
      emoji: "",
      category: "",
      amount: "",
      date: startOfDay(new Date()),
    });
  };

  const checkEmptyValue = () => {
    if (
      !newBudget.emoji ||
      !newBudget.category ||
      !newBudget.amount ||
      !newBudget.date ||
      isPending
    )
      return true;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          onClick={handleClearInput}
          className="lg:w-auto lg:px-4 lg:py-2"
        >
          <Plus />
          <span className="hidden lg:block">New budget</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create budget</DialogTitle>
          <DialogClose asChild>
            <Button
              size="icon"
              type="submit"
              form="addBudgetForm"
              disabled={checkEmptyValue()}
              className="lg:hidden"
            >
              <Plus />
            </Button>
          </DialogClose>
        </DialogHeader>
        <form
          id="addBudgetForm"
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
                {newBudget.emoji ? newBudget.emoji : "Emoji"}
              </Button>
              <BudgetCategory
                category={newBudget.category}
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
              value={newBudget.amount}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d{0,2}$/.test(value)) {
                  handleFormChange("amount", value);
                }
              }}
            />
            {/* Month */}
            <BudgetDatePicker
              date={newBudget.date}
              handleFormChange={handleFormChange}
            />
          </div>
          {/* Button */}
          <div className="hidden items-center justify-end border-t p-6 lg:flex">
            <Button type="submit" disabled={checkEmptyValue()}>
              {isPending && <LoaderCircle className="animate-spin" />}
              Create budget
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
