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

type Props = {
  budgetInfo: BudgetDetail[];
  refreshData: () => void;
};

export default function EditBudget({ budgetInfo, refreshData }: Props) {
  const { toast } = useToast();

  const [emoji, setEmoji] = React.useState<string | undefined>();
  const [openEmoji, setOpenEmoji] = React.useState(false);

  const [name, setName] = React.useState<string | undefined>();
  const [amount, setAmount] = React.useState<string | undefined>();

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
            onClick={() => setEmoji(budgetInfo[0]?.icon || "")}
          >
            <PenBox />
            <span>Edit</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
            <DialogDescription>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setOpenEmoji(!openEmoji)}
              >
                {emoji}
              </Button>
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
              <div className="mt-4">
                <label className="font-semibold text-dark">Budget Name</label>
                <Input
                  className="mt-2"
                  defaultValue={budgetInfo[0]?.name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mt-4">
                <label className="font-semibold text-dark">
                  Budget Amount ($)
                </label>
                <Input
                  className="mt-2"
                  type="number"
                  defaultValue={budgetInfo[0]?.amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={!name && !amount}
                onClick={() => onUpdateBudget()}
                className="mt-4"
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
