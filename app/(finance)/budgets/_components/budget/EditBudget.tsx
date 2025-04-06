"use client";

import React from "react";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { PenBox } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BudgetData } from "@/types";
import { db } from "@/db/dbConfig";
import { and, eq } from "drizzle-orm";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BadgeDollarSign,
  BriefcaseMedical,
  Building2,
  Car,
  Drama,
  HeartHandshake,
  Martini,
  PawPrint,
  Plane,
  School,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import toast from "react-hot-toast";
import { PopoverClose } from "@radix-ui/react-popover";
import { budget } from "@/db/schema";

type Props = {
  budgetInfo: BudgetData[];
  currentUser: string | undefined;
  refreshData: () => void;
};

export default function EditBudget({
  budgetInfo,
  currentUser,
  refreshData,
}: Props) {
  // Budget types list
  const budgetCategory = [
    {
      icon: Car,
      color: "#000000",
      name: "Auto & Transport",
    },
    {
      icon: Building2,
      color: "#000000",
      name: "Business",
    },
    {
      icon: Martini,
      color: "#000000",
      name: "Dining & Drinks",
    },
    {
      icon: School,
      color: "#000000",
      name: "Education",
    },
    {
      icon: Drama,
      color: "#000000",
      name: "Entertainment",
    },
    {
      icon: HeartHandshake,
      color: "#000000",
      name: "Gifts & Donations",
    },
    {
      icon: ShoppingCart,
      color: "#000000",
      name: "Groceries",
    },
    {
      icon: BriefcaseMedical,
      color: "#000000",
      name: "Medical",
    },
    {
      icon: PawPrint,
      color: "#000000",
      name: "Pets",
    },
    {
      icon: ShoppingBag,
      color: "#000000",
      name: "Shopping",
    },
    {
      icon: Plane,
      color: "#000000",
      name: "Travel & Vacation",
    },
    {
      icon: BadgeDollarSign,
      color: "#000000",
      name: "Others",
    },
  ];

  const [emoji, setEmoji] = React.useState<string>("");
  const [initialEmoji, setInitialEmoji] = React.useState<string>("");
  const [openEmoji, setOpenEmoji] = React.useState(false);
  const [category, setCategory] = React.useState<string>("");
  const [initialCategory, setInitalCategory] = React.useState<string>("");
  const [amount, setAmount] = React.useState<string>("");

  // Edit budget
  const onUpdateBudget = async () => {
    const updatedAmount = amount || budgetInfo[0]?.amount;
    const result = await db
      .update(budget)
      .set({
        amount: updatedAmount,
        emoji: emoji,
        category: category,
      })
      .where(
        and(
          eq(budget.id, budgetInfo[0].id),
          eq(budget.created_by, currentUser ?? ""),
        ),
      )
      .returning();

    if (result) {
      refreshData();
      toast.success("Your budget is updated!");
    }
  };

  // On click edit (reset to original)
  const handleOnClickEdit = () => {
    setInitialEmoji(budgetInfo[0]?.emoji || "");
    setEmoji(budgetInfo[0]?.emoji || "");
    setInitalCategory(budgetInfo[0]?.category);
    setCategory(budgetInfo[0]?.category);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="flex h-fit w-full items-center justify-start gap-2 bg-transparent px-0 py-2 text-sm font-normal text-foreground hover:bg-neutral-200"
          onClick={handleOnClickEdit}
        >
          <span className="pl-4">
            <PenBox strokeWidth={2} className="h-4 w-4" color="#555353" />
          </span>
          <span className="font-semibold text-secondary-foreground">
            Edit Budget
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-dvh flex-col gap-8 sm:h-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Edit Budget</DialogTitle>
          <DialogDescription className="flex flex-col gap-4 pt-4">
            <div className="flex items-center gap-2">
              {/* Emoji selection */}
              <Button
                variant="outline"
                onClick={() => setOpenEmoji(!openEmoji)}
              >
                {emoji}
              </Button>
              {/* Budget category */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1 border">
                    {category || budgetInfo[0]?.category}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>What is this budget for?</DialogTitle>
                    <DialogDescription>
                      <div className="item flex max-h-96 flex-col overflow-y-auto">
                        {budgetCategory.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center py-4 pr-4"
                          >
                            <item.icon
                              color={item.color}
                              strokeWidth={1.5}
                              className="h-[30px] w-[30px]"
                            />
                            <span className="pl-6 text-base font-semibold text-foreground">
                              {item.name}
                            </span>
                            <DialogClose asChild>
                              <Button
                                className="ml-auto"
                                onClick={() => setCategory(item.name)}
                              >
                                Select
                              </Button>
                            </DialogClose>
                          </div>
                        ))}
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
            {/* Emoji pop-up */}
            <div className="absolute z-10">
              <EmojiPicker
                open={openEmoji}
                emojiStyle={EmojiStyle.TWITTER}
                onEmojiClick={(e) => {
                  setEmoji(e.emoji);
                  setOpenEmoji(false);
                }}
              />
            </div>
            {/* Amount */}
            <Input
              className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              type="number"
              defaultValue={Number(budgetInfo[0]?.amount)}
              onChange={(e) => setAmount(e.target.value)}
            />
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:justify-start">
          <PopoverClose asChild>
            <Button
              className="w-full"
              disabled={
                !(
                  amount ||
                  emoji !== initialEmoji ||
                  category !== initialCategory
                )
              }
              onClick={() => onUpdateBudget()}
            >
              Update Budget
            </Button>
          </PopoverClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
