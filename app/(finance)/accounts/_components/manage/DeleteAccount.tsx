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
import { deactivateAccount } from "@/lib/api/accounts";
import { AccountData } from "@/types";
import toast from "react-hot-toast";
import { queryKeys } from "@/lib/queryKeys";

type Props = {
  accountData: AccountData;
};

export default function DeleteAccount({ accountData }: Props) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: deactivateAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all() });
      setIsOpen(false);
      toast.success("Accounts deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete accounts");
      console.log("Failed to delete accounts", error);
    },
  });

  const handleDeactivateAccount = () => {
    mutate(accountData);
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
          <AlertDialogTitle>
            Delete &quot;{accountData.name}&quot; account
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this account? This action cannot be
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
              onClick={handleDeactivateAccount}
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
