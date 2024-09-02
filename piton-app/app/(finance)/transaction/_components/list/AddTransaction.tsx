import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Banknote, CirclePlus, HandCoins, RefreshCcwDot } from "lucide-react";
import Link from "next/link";
import AddSinglePayment from "./AddSinglePayment";

export default function AddTransaction() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center justify-center gap-2"
        >
          <CirclePlus strokeWidth={1.75} color="#555353" />
          <span className="font-semibold text-medium">Add New Transaction</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Add New Transaction</DialogTitle>
          <DialogDescription className="flex w-full flex-col items-center justify-center gap-4 pt-4">
            <AddSinglePayment />
            <Link
              href="/recurring"
              className="flex w-full items-center justify-center rounded-md border border-gray-400 p-4 hover:bg-gray-200"
            >
              <span className="flex w-2/5 justify-end pr-2">
                <RefreshCcwDot />
              </span>
              <span className="flex-1">Recurring Payment</span>
            </Link>
            <Link
              href="/budgets"
              className="flex w-full items-center justify-center rounded-md border border-gray-400 p-4 hover:bg-gray-200"
            >
              <span className="flex w-2/5 justify-end pr-2">
                <Banknote />
              </span>
              <span className="flex-1">Budget Expense</span>
            </Link>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
