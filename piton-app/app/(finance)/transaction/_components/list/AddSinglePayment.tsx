import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HandCoins } from "lucide-react";

export default function AddSinglePayment() {
  return (
    <Dialog>
      <DialogTrigger className="flex w-full items-center justify-center rounded-md border border-gray-400 p-4 hover:bg-gray-200">
        <span className="flex w-2/5 justify-end pr-2">
          <HandCoins />
        </span>
        <span className="flex-1 text-start">Single Payment</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
