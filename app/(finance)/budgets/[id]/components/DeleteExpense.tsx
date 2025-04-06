import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { and, eq } from "drizzle-orm";
import { db } from "@/db/dbConfig";
import toast from "react-hot-toast";
import { PopoverClose } from "@radix-ui/react-popover";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { budget_expense } from "@/db/schema";

type Props = {
  refreshData: () => void;
  currentUser: string | undefined;
  expenseId: string;
};

export default function DeleteExpense({
  refreshData,
  currentUser,
  expenseId,
}: Props) {
  // Delete expense
  const deleteExpense = async (expenseId: string) => {
    const result = await db
      .delete(budget_expense)
      .where(
        and(
          eq(budget_expense.id, expenseId),
          eq(budget_expense.created_by, currentUser ?? ""),
        ),
      )
      .returning();

    if (result) {
      refreshData();
      toast.success("Expense Deleted!");
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger className="flex h-fit w-full items-center justify-start gap-2 rounded-md bg-transparent px-0 py-2 text-sm font-normal text-foreground hover:bg-neutral-200">
        <span className="pl-4">
          <Trash2 strokeWidth={2} className="h-4 w-4" color="#555353" />
        </span>
        <span className="font-semibold text-secondary-foreground">Delete</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Expense</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this expense? This action cannot be
            undone. Click &apos;Delete&apos; to confirm this action.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
          <PopoverClose asChild>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteExpense(expenseId)}
            >
              Delete
            </AlertDialogAction>
          </PopoverClose>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
