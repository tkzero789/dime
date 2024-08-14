"use client";

import React from "react";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { PenBox } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { BudgetDetail } from "@/types/types";
import { db } from "@/db/dbConfig";
import { Budgets } from "@/db/schema";
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
  BriefcaseMedical,
  Building2,
  Car,
  CirclePlus,
  Coins,
  Drama,
  Flower,
  HeartHandshake,
  House,
  Laptop,
  PawPrint,
  Plane,
  School,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";

type Props = {
  budgetInfo: BudgetDetail[];
  refreshData: () => void;
};

export default function EditBudget({ budgetInfo, refreshData }: Props) {
  // Budget types list
  const budgetCategory = [
    {
      icon: Car,
      color: "#db0000",
      name: "Auto & Transport",
    },
    {
      icon: Building2,
      color: "#000000",
      name: "Business",
    },
    {
      icon: HeartHandshake,
      color: "#000000",
      name: "Charitable Donations",
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
      icon: Coins,
      color: "#000000",
      name: "Fees",
    },
    {
      icon: ShoppingCart,
      color: "#000000",
      name: "Groceries",
    },
    {
      icon: House,
      color: "#000000",
      name: "Home & Outdoors",
    },
    {
      icon: BriefcaseMedical,
      color: "#000000",
      name: "Medical",
    },
    {
      icon: Flower,
      color: "#000000",
      name: "Personal Care",
    },
    {
      icon: PawPrint,
      color: "#000000",
      name: "Pets",
    },
    {
      icon: ShoppingBag,
      color: "#dbbe00",
      name: "Shopping",
    },
    {
      icon: Laptop,
      color: "#000000",
      name: "Software & Tech",
    },
    {
      icon: Plane,
      color: "#000000",
      name: "Travel & Vacation",
    },
  ];
  const { toast } = useToast();

  const [emoji, setEmoji] = React.useState<string>("");
  const [initialEmoji, setInitialEmoji] = React.useState<string>("");
  const [openEmoji, setOpenEmoji] = React.useState(false);

  const [name, setName] = React.useState<string>("");
  const [category, setCategory] = React.useState<string>("");
  const [initialCategory, setInitalCategory] = React.useState<string>("");
  const [amount, setAmount] = React.useState<string>("");

  const { user } = useUser();
  const onUpdateBudget = async () => {
    const result = await db
      .update(Budgets)
      .set({
        name: name,
        amount: amount,
        icon: emoji,
      })
      .where(
        and(
          eq(Budgets.id, budgetInfo[0].id),
          eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress ?? ""),
        ),
      )
      .returning();

    if (result) {
      refreshData();
      toast({
        variant: "success",
        description: "Your budget is updated!",
      });
    }
  };

  return (
    <div className="ml-auto">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex gap-2"
            onClick={() => {
              setInitialEmoji(budgetInfo[0]?.icon || "");
              setEmoji(budgetInfo[0]?.icon || "");
              setInitalCategory(budgetInfo[0]?.category);
              setCategory(budgetInfo[0]?.category);
            }}
          >
            <PenBox />
            <span>Edit</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
            <DialogDescription className="flex flex-col gap-4 pt-4">
              {/* Name */}
              <Input
                defaultValue={budgetInfo[0]?.name}
                onChange={(e) => setName(e.target.value)}
              />
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
                    <Button variant="secondary" className="flex-1 border">
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
                              <span className="pl-6 text-base font-semibold text-dark">
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
          <DialogFooter className="mt-4 sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={
                  !(
                    name ||
                    amount ||
                    emoji !== initialEmoji ||
                    category !== initialCategory
                  )
                }
                onClick={() => onUpdateBudget()}
              >
                Update Budget
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
