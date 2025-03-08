"use client";

import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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

import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Budgets } from "@/db/schema";
import { useUser } from "@clerk/nextjs";
import { db } from "@/db/dbConfig";
import { Plus } from "lucide-react";
import { and, count, eq, gte, lte } from "drizzle-orm";
import toast from "react-hot-toast";
import BudgetCategory from "./BudgetCategory";
import { BudgetState } from "@/types";

type Props = {
  refreshData: () => void;
};

export default function CreateBudget({ refreshData }: Props) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentDate = new Date();
  const currentMonthIndex = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const [newBudget, setNewBudget] = React.useState<BudgetState>({
    amount: "",
    category: "",
    emoji: "",
    month: 0,
    year: currentYear,
  });

  const [openEmoji, setOpenEmoji] = React.useState(false);
  const [isExceed, setIsExceed] = React.useState<boolean>(false);

  const getPreviousMonths = (currentMonthIndex: number, count: number) => {
    const previousMonths = [];
    for (let i = 0; i <= count; i++) {
      const monthIndex = (currentMonthIndex - i + 12) % 12;
      previousMonths.push({ name: months[monthIndex], index: monthIndex });
    }
    return previousMonths;
  };

  const previousMonths = getPreviousMonths(currentMonthIndex, 5);

  const { user } = useUser();
  // Create new budget
  const onCreateBudget = async () => {
    if (
      !newBudget.amount ||
      !newBudget.month === null ||
      !currentYear ||
      !user?.primaryEmailAddress?.emailAddress
    ) {
      toast.error("Missing required information");
      return;
    }

    // If less than 4 budgets
    const result = await db
      .insert(Budgets)
      .values({
        amount: newBudget.amount,
        emoji: newBudget.emoji,
        month: newBudget.month,
        year: currentYear,
        category: newBudget.category,
        created_by: user?.primaryEmailAddress?.emailAddress,
      })
      .returning({ insertedId: Budgets.id });

    if (result) {
      refreshData();
      toast.success("New Budget Created!");
    }
  };

  // Check the amount of budgets of current month
  const checkBudgetAmount = async () => {
    handleClearInput();
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const budgetCount = await db
      .select({ count: count() })
      .from(Budgets)
      .where(
        and(
          eq(Budgets.created_by, user?.primaryEmailAddress?.emailAddress ?? ""),
          gte(Budgets.created_at, firstDayOfMonth),
          lte(Budgets.created_at, currentDate),
        ),
      );

    const budgetCountResult = budgetCount[0]?.count;
    if (budgetCountResult > 13) {
      setIsExceed(true);
    }
  };

  const handleFormChange = (
    field: keyof BudgetState,
    value: string | number,
  ) => {
    setNewBudget((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClearInput = () => {
    setNewBudget({
      amount: "",
      category: "",
      emoji: "",
      month: 0,
      year: currentYear,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={checkBudgetAmount}>
          <Plus />
          New budget
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Budget</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        {!isExceed && (
          <form className="grid gap-8">
            <div className="grid gap-4">
              {/* Month */}
              <Select
                value={
                  newBudget.month !== null ? newBudget.month.toString() : ""
                }
                onValueChange={(value) => handleFormChange("month", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {previousMonths.map((m, index) => (
                    <SelectItem key={m.index} value={m.index.toString()}>
                      {index === 0 ? "Current month - " + m.name : m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                {/* Emoji selection */}
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenEmoji(!openEmoji);
                  }}
                >
                  {newBudget.emoji ? newBudget.emoji : "Emoji"}
                </Button>
                {/* Budget category */}
                <BudgetCategory
                  category={newBudget.category}
                  handleFormChange={handleFormChange}
                />
              </div>
              {/* Emoji pop-up */}
              <div className="absolute z-10">
                <EmojiPicker
                  open={openEmoji}
                  emojiStyle={EmojiStyle.TWITTER}
                  onEmojiClick={(e) => {
                    handleFormChange("emoji", e.emoji);
                    setOpenEmoji(false);
                  }}
                />
              </div>
              {/* Amount */}
              <Input
                type="number"
                placeholder="Amount"
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value > 0) {
                    handleFormChange("amount", value);
                  } else {
                    e.target.value = "";
                  }
                }}
              />
            </div>
            <DialogClose asChild>
              <Button
                className="w-full"
                disabled={
                  !(
                    newBudget.emoji &&
                    newBudget.amount &&
                    newBudget.month !== null &&
                    newBudget.category
                  )
                }
                onClick={() => onCreateBudget()}
              >
                Create budget
              </Button>
            </DialogClose>
          </form>
        )}
        {isExceed && <div>Budget amount exceeded</div>}
      </DialogContent>
    </Dialog>
  );
}
