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
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Budgets, BudgetExpenses } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { db } from "@/db/dbConfig";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Props = {
  paramsId: string;
  currentUser: string | undefined;
};

export default function DeleteBudget({ paramsId, currentUser }: Props) {
  const router = useRouter();
  // Delete budget
  const deleteBudget = async () => {
    const deleteRelatedExpenses = await db
      .delete(BudgetExpenses)
      .where(
        and(
          eq(BudgetExpenses.budget_id, paramsId),
          eq(BudgetExpenses.created_by, currentUser ?? ""),
        ),
      )
      .returning();

    // If deleted expenses successfully
    if (deleteRelatedExpenses) {
      const result = await db
        .delete(Budgets)
        .where(
          and(
            eq(Budgets.id, paramsId),
            eq(Budgets.created_by, currentUser ?? ""),
          ),
        )
        .returning();

      if (result) {
        toast.success("Budget deleted successfully!");
        router.replace("/budgets");
      }
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="flex h-fit w-full items-center justify-start gap-2 bg-transparent px-0 py-2 text-sm font-normal text-foreground hover:bg-neutral-200">
          <span className="pl-4">
            <Trash2 strokeWidth={2} className="h-4 w-4" color="#555353" />
          </span>
          <span className="font-semibold text-secondary-foreground">
            Delete Budget
          </span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Budget?</AlertDialogTitle>
          <AlertDialogDescription>
            This action is irreversible and will permanently remove your budget
            and all related expenses within this budget.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => deleteBudget()}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
