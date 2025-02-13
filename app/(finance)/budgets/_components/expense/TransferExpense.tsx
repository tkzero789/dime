import React from "react";
import { Button } from "@/components/ui/button";
import { db } from "@/db/dbConfig";
import { and, desc, eq } from "drizzle-orm";
import { Budgets, BudgetExpenses } from "@/db/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { PopoverClose } from "@radix-ui/react-popover";
import { RefreshCcw } from "lucide-react";

type Props = {
  refreshData: () => void;
  currentUser: string | undefined;
  expenseId: string;
};

type BudgetList = {
  id: string;
  name: string;
  icon: string | null;
};

export default function TransferExpense({
  refreshData,
  currentUser,
  expenseId,
}: Props) {
  const params = useParams();
  const [budgetList, setBudgetList] = React.useState<BudgetList[]>([]);

  const currentMonth = new Date().getUTCMonth();
  const currentYear = new Date().getUTCFullYear();

  //  Get all current active budgets from user
  const getActiveBudget = React.useCallback(async () => {
    try {
      const result = await db
        .select({ id: Budgets.id, name: Budgets.name, icon: Budgets.icon })
        .from(Budgets)
        .where(
          and(
            eq(Budgets.created_by, currentUser ?? ""),
            eq(Budgets.month, currentMonth),
            eq(Budgets.year, currentYear),
          ),
        )
        .orderBy(desc(Budgets.created_at));

      if (result) {
        setBudgetList(result);
      }
    } catch (error) {
      console.log(error);
    }
  }, [currentUser, currentMonth, currentYear]);

  React.useEffect(() => {
    if (currentUser) {
      getActiveBudget();
    }
  }, [currentUser, getActiveBudget]);

  //   On transfer expense to another budget
  const handleTransferExpense = async (budget_id: string) => {
    try {
      const result = await db
        .update(BudgetExpenses)
        .set({ budget_id })
        .where(
          and(
            eq(BudgetExpenses.id, expenseId),
            eq(BudgetExpenses.created_by, currentUser ?? ""),
          ),
        );

      if (result) {
        refreshData();
        toast.success("Expense transferred!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger
        className="flex h-fit w-full items-center justify-start gap-2 rounded-md bg-transparent px-0 py-2 text-sm font-normal text-dark hover:bg-neutral-200"
        onClick={getActiveBudget}
      >
        <span className="pl-4">
          <RefreshCcw strokeWidth={2} className="h-4 w-4" color="#555353" />
        </span>
        <span className="font-semibold text-medium">Transfer</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Transfer expense</DialogTitle>
          <DialogDescription>
            <ul className="item flex max-h-96 flex-col overflow-y-auto pr-4">
              {budgetList
                .filter((item) => item.id !== params.id)
                .map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-wrap items-center py-4"
                  >
                    <div className="w-[60px] text-center text-3xl">
                      {item.icon}
                    </div>
                    <span className="pl-2 text-base font-semibold text-dark">
                      {item.name}
                    </span>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="ml-auto">Select</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Transfer expense</AlertDialogTitle>
                          <AlertDialogDescription>
                            This expense will be transferred to {item.icon}{" "}
                            <span className="font-semibold text-dark">
                              {item.name}
                            </span>{" "}
                            budget. Do you want to proceed?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel asChild>
                            <Button variant="outline">Cancel</Button>
                          </AlertDialogCancel>
                          <PopoverClose asChild>
                            <AlertDialogAction
                              onClick={() => handleTransferExpense(item.id)}
                            >
                              Confirm
                            </AlertDialogAction>
                          </PopoverClose>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </li>
                ))}
            </ul>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
