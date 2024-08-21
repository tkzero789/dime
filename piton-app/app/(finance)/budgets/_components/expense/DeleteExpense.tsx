import React from "react";
import { Button } from "@/components/ui/button";
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
import { Expenses } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { db } from "@/db/dbConfig";
import toast from "react-hot-toast";
import { PopoverClose } from "@radix-ui/react-popover";
import { Trash2 } from "lucide-react";

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
      .delete(Expenses)
      .where(
        and(
          eq(Expenses.id, expenseId),
          eq(Expenses.createdBy, currentUser ?? ""),
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
      <AlertDialogTrigger asChild>
        <Button className="flex h-fit w-full items-center justify-start gap-2 bg-transparent px-0 py-2 text-sm font-normal text-dark hover:bg-neutral-200">
          <span className="pl-4">
            <Trash2 strokeWidth={2} className="h-4 w-4" color="#555353" />
          </span>
          <span className="font-semibold text-medium">Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Expense</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this expense? This action cannot be
            undone. Click 'Delete' to confirm this action.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
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
