import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Banknote, Plus, RefreshCcwDot } from "lucide-react";
import Link from "next/link";
import AddSingle from "../single/AddSingle";

export default function AddTransaction() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader forceHeaderCenter={true}>
          <DialogTitle>Add transaction</DialogTitle>
        </DialogHeader>
        <div className="flex w-full flex-col items-center justify-center gap-4 px-6 pb-6">
          <AddSingle />
          <Button asChild variant="outline">
            <Link
              href="/recurring"
              className="flex w-full items-center justify-center rounded-md border"
            >
              <span className="flex w-2/5 justify-end pr-2">
                <RefreshCcwDot />
              </span>
              <span className="flex-1 text-start">Recurring payment</span>
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link
              href="/budgets"
              className="flex w-full items-center justify-center rounded-md border"
            >
              <span className="flex w-2/5 justify-end p-4 pr-2">
                <Banknote />
              </span>
              <span className="flex-1 text-start">Budget expense</span>
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
