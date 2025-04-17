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
import toast from "react-hot-toast";
import { PopoverClose } from "@radix-ui/react-popover";
import { LoaderCircle, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBudgetExpense } from "@/lib/api/budgets/expenses";
import { queryKeys } from "@/lib/queryKeys";

type Props = {
  budgetId: string;
  expenseId: string;
};

export default function DeleteBudgetExpense({ budgetId, expenseId }: Props) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: deleteBudgetExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.budgetExpenses.byBudgetId(budgetId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.budgets.byId(budgetId),
      });
      setIsOpen(false);
      toast.success("Expense deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete expense");
      console.log("Failed to delete expense", error);
    },
  });

  const handleDelete = () => {
    mutate({ budgetId, expenseId });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <Trash2 />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete expense</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this expense? This action cannot be
            undone. Click &apos;Delete&apos; to confirm this action.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className={buttonVariants({ variant: "outline" })}>
            Cancel
          </AlertDialogCancel>
          <PopoverClose asChild>
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              disabled={isPending}
              onClick={handleDelete}
            >
              {isPending && <LoaderCircle className="animate-spin" />}
              Delete
            </AlertDialogAction>
          </PopoverClose>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
