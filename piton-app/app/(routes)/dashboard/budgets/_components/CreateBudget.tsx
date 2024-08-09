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
import EmojiPicker from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Budgets } from "@/db/schema";
import { useUser } from "@clerk/nextjs";
import { db } from "@/db/dbConfig";
import { useToast } from "@/components/ui/use-toast";
import { CirclePlus } from "lucide-react";

type Props = {
  refreshData: () => void;
};

export default function CreateBudget({ refreshData }: Props) {
  const { toast } = useToast();

  const [emoji, setEmoji] = React.useState<string | undefined>();
  const [openEmoji, setOpenEmoji] = React.useState(false);

  const [name, setName] = React.useState<string | undefined>();
  const [amount, setAmount] = React.useState<string | undefined>();

  const { user } = useUser();
  const onCreateBudget = async () => {
    if (!name || !amount || !user?.primaryEmailAddress?.emailAddress) {
      window.alert("Missing required information");
      return;
    }
    const result = await db
      .insert(Budgets)
      .values({
        name: name,
        amount: amount,
        icon: emoji,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: new Date(),
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

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            <CirclePlus strokeWidth={1.25} />
            <span className="font-medium">Create new budget</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
            <DialogDescription>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setOpenEmoji(!openEmoji)}
              >
                {emoji ? emoji : "Add an icon"}
              </Button>
              <div className="absolute z-10">
                <EmojiPicker
                  open={openEmoji}
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
                  placeholder="e.g Finance"
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
                  placeholder="e.g 1000"
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={!name || !amount}
                onClick={() => onCreateBudget()}
                className="mt-4"
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
