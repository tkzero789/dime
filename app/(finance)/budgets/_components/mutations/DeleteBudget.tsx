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
import { Button, buttonVariants } from "@/components/ui/button";
import { LoaderCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBudget } from "@/lib/api/budgets";
import toast from "react-hot-toast";
import { queryKeys } from "@/lib/queryKeys";

type Props = {
  budgetId: string | undefined;
};

export default function DeleteBudget({ budgetId }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: deleteBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.all() });
      setIsOpen(false);
      router.replace("/budgets");
      toast.success("Budget deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete budget");
      console.log("Failed to delete budget", error);
    },
  });

  const handleDelete = () => {
    if (budgetId) mutate(budgetId);
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
          <AlertDialogTitle>Delete budget?</AlertDialogTitle>
          <AlertDialogDescription>
            This action is irreversible and will permanently remove your budget
            and all related expenses within this budget.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className={buttonVariants({ variant: "outline" })}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            disabled={isPending}
            onClick={handleDelete}
          >
            {isPending && <LoaderCircle className="animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
