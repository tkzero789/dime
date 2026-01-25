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
import { LoaderCircle, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PopoverClose } from "@radix-ui/react-popover";
import toast from "react-hot-toast";
import { queryKeys } from "@/lib/queryKeys";
import { deleteTransaction } from "@/lib/api/transactions";

type Props = {
  transactionId: string;
};

export default function DeleteTransaction({ transactionId }: Props) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all() });
      setIsOpen(false);
      toast.success("Transaction deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete transaction");
      console.log("Failed to delete transaction", error);
    },
  });

  const handleDelete = () => {
    mutate(transactionId);
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
          <AlertDialogTitle>Delete transaction</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this transaction? This action cannot
            be undone. Click &apos;Delete&apos; to confirm this action.
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
