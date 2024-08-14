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
import { useToast } from "@/components/ui/use-toast";
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
import { and, count, eq, gte, lte } from "drizzle-orm";

type Props = {
  refreshData: () => void;
};

export default function CreateBudget({ refreshData }: Props) {
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
      toast({
        variant: "success",
        description: "New Budget Created!",
      });
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
            className="flex items-center justify-center gap-2 border-neutral-500"
            onClick={checkBudgetAmount}
          >
            <CirclePlus strokeWidth={1.25} />
            <span className="font-medium">Create new budget</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
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
                    variant="outline"
                    onClick={() => setOpenEmoji(!openEmoji)}
                  >
                    {emoji ? emoji : "Icon"}
                  </Button>
                  {/* Budget category */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="secondary" className="flex-1 border">
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
