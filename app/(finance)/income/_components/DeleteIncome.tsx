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
import { income } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

type Props = {
  incomeId: string;
};

export default function DeleteIncome({ incomeId }: Props) {
  const { user } = useUser();

  const deleteIncome = async (incomeId: string) => {
    await db
      .delete(income)
      .where(
        and(
          eq(income.id, incomeId),
          eq(income.created_by, user?.primaryEmailAddress?.emailAddress ?? ""),
        ),
      )
      .returning();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <Trash2 />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Income</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this income? This action cannot be
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
