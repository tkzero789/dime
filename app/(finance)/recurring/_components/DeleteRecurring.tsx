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
import { Recurrence } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Props = {
  currentUser: string | undefined;
  recurringId: string;
};

export default function DeleteRecurring({ currentUser, recurringId }: Props) {
  const router = useRouter();

  //Delete recurring
  const deleteRecurring = async (recurringId: string) => {
    const result = await db
      .delete(Recurrence)
      .where(
        and(
          eq(Recurrence.id, recurringId),
          eq(Recurrence.created_by, currentUser ?? ""),
        ),
      )
      .returning();

    if (result) {
      toast.success("Recurring Payment Deleted!");
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
          <AlertDialogTitle>Delete Recurring Payment</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this recurring payment? This action
            cannot be undone. Click 'Delete' to confirm this action.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <PopoverClose asChild>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteRecurring(recurringId)}
            >
              Delete
            </AlertDialogAction>
          </PopoverClose>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
