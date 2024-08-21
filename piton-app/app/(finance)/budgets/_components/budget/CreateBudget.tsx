"use client";

import React from "react";
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
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Budgets } from "@/db/schema";
import { useUser } from "@clerk/nextjs";
import { db } from "@/db/dbConfig";
import {
  BadgeDollarSign,
  BriefcaseMedical,
  Building2,
  Car,
  CirclePlus,
  Drama,
  HeartHandshake,
  Martini,
  PawPrint,
  Plane,
  School,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import { and, count, eq, gte, lte } from "drizzle-orm";
import toast from "react-hot-toast";

type Props = {
  refreshData: () => void;
};

export default function CreateBudget({ refreshData }: Props) {
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
  const [openEmoji, setOpenEmoji] = React.useState(false);

  const [name, setName] = React.useState<string>("");
  const [category, setCategory] = React.useState<string>("");
  const [amount, setAmount] = React.useState<string>("");
  const [isExceed, setIsExceed] = React.useState<boolean>(false);

  const { user } = useUser();
  // Create new budget
  const onCreateBudget = async () => {
    if (!name || !amount || !user?.primaryEmailAddress?.emailAddress) {
      window.alert("Missing required information");
      return;
    }

    // If less than 4 budgets
    const result = await db
      .insert(Budgets)
      .values({
        name: name,
        amount: amount,
        icon: emoji,
        category: category,
        createdBy: user?.primaryEmailAddress?.emailAddress,
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
    // Count the total budgets of the current month
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
          eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress ?? ""),
          gte(Budgets.createdAt, firstDayOfMonth),
          lte(Budgets.createdAt, currentDate),
        ),
      );

    // If more than 14 budgets in current month
    const budgetCountResult = budgetCount[0]?.count;
    if (budgetCountResult > 13) {
      setIsExceed(true);
    }
  };

  // Clear input
  const handleClearInput = () => {
    setName("");
    setEmoji("");
    setCategory("");
    setAmount("");
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="group flex items-center justify-center gap-2"
            onClick={checkBudgetAmount}
          >
            <CirclePlus
              strokeWidth={1.75}
              className="rounded-full group-hover:bg-teal-700 group-hover:stroke-white"
            />
            <span className="font-bold group-hover:text-teal-700">
              Create new budget
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="h-screen sm:h-auto">
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
            {isExceed ? (
              <DialogDescription>Cannot create more</DialogDescription>
            ) : (
              <DialogDescription className="flex flex-col gap-4 pt-4">
                {/* Name */}
                <Input
                  placeholder="Budget name"
                  onChange={(e) => setName(e.target.value)}
                />
                <div className="flex items-center gap-2">
                  {/* Emoji selection */}
                  <Button
                    variant="ghost"
                    onClick={() => setOpenEmoji(!openEmoji)}
                  >
                    {emoji ? emoji : "Icon"}
                  </Button>
                  {/* Budget category */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="flex-1 border">
                        {category || "Budget category"}
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
                                <span className="pl-4 text-base font-semibold text-dark lg:pl-6">
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
                  type="number"
                  placeholder="Amount"
                  className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (value > 0) {
                      setAmount(e.target.value);
                    } else {
                      e.target.value = "";
                    }
                  }}
                />
              </DialogDescription>
            )}
          </DialogHeader>
          <DialogFooter className="mt-4 sm:justify-start">
            <DialogClose asChild>
              <Button
                className="w-full"
                disabled={!(emoji && name && amount)}
                onClick={() => onCreateBudget()}
              >
                Create budget
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
