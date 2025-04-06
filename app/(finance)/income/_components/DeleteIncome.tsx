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
import { deleteIncome } from "@/lib/api/income";
import { PopoverClose } from "@radix-ui/react-popover";
import toast from "react-hot-toast";

type Props = {
  incomeId: string;
};

export default function DeleteIncome({ incomeId }: Props) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: deleteIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["income"] });
      setIsOpen(false);
      toast.success("Income deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete income");
      console.log("Failed to delete income", error);
    },
  });

  const handleDelete = () => {
    mutate(incomeId);
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
          <AlertDialogTitle>Delete Income</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this income? This action cannot be
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
