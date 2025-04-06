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
import { BudgetDatePicker } from "./BudgetDatePicket";
import { startOfDay } from "date-fns";

export default function CreateBudget() {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isOpenEmoji, setIsOpenEmoji] = React.useState<boolean>(false);

  const [newBudget, setNewBudget] = React.useState<BudgetState>({
    amount: "",
    category: "",
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
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
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
      !newBudget.amount ||
      !newBudget.category ||
      !newBudget.emoji ||
      !newBudget.date
    ) {
      {
        toast.error("Missing required information");
        return;
      }
    }

    mutate({
      amount: newBudget.amount,
      category: newBudget.category,
      emoji: newBudget.emoji,
      date: newBudget.date,
    });
  };

  const handleClearInput = () => {
    setNewBudget({
      amount: "",
      category: "",
      emoji: "",
      date: startOfDay(new Date()),
    });
  };

  const checkEmptyValue = () => {
    if (
      !newBudget.amount ||
      !newBudget.category ||
      !newBudget.emoji ||
      !newBudget.date ||
      isPending
    )
      return true;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={handleClearInput}>
          <Plus />
          New budget
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Budget</DialogTitle>
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
            {/* Month */}
            <BudgetDatePicker
              date={newBudget.date}
              handleFormChange={handleFormChange}
            />
            {/* Emoji selection & Budget category */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpenEmoji(!isOpenEmoji);
                }}
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
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d{0,2}$/.test(value)) {
                  handleFormChange("amount", value);
                }
              }}
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
