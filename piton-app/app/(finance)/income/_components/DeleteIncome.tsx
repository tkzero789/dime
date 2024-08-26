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
import { PopoverClose } from "@radix-ui/react-popover";
import { Trash2 } from "lucide-react";
import { db } from "@/db/dbConfig";
import { Income } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Props = {
  currentUser: string | undefined;
  incomeId: string;
};

export default function DeleteIncome({ currentUser, incomeId }: Props) {
  const router = useRouter();

  //Delete income
  const deleteIncome = async (incomeId: string) => {
    const result = await db
      .delete(Income)
      .where(
        and(eq(Income.id, incomeId), eq(Income.created_by, currentUser ?? "")),
      )
      .returning();

    if (result) {
      toast.success("Income Deleted!");
      router.refresh();
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="flex h-fit w-full items-center justify-start gap-2 rounded-md bg-transparent px-0 py-2 text-sm font-normal text-dark hover:bg-neutral-200">
        <span className="pl-4">
          <Trash2 strokeWidth={2} className="h-4 w-4" color="#555353" />
        </span>
        <span className="font-semibold text-medium">Delete</span>
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
              onClick={() => deleteIncome(incomeId)}
            >
              Delete
            </AlertDialogAction>
          </PopoverClose>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}