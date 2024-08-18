import React from "react";
import { Button } from "@/components/ui/button";
import { db } from "@/db/dbConfig";
import { and, desc, eq, gte, lte, param } from "drizzle-orm";
import { Budgets, Expenses } from "@/db/schema";
import {
  Dialog,
  DialogClose,
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

  React.useEffect(() => {
    currentUser && getActiveBudget();
  }, [currentUser]);

  //  Get all current active budgets from user
  const getActiveBudget = async () => {
    try {
      const currentDate = new Date();
      const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );
      const lastDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
      );
      const result = await db
        .select({ id: Budgets.id, name: Budgets.name, icon: Budgets.icon })
        .from(Budgets)
        .where(
          and(
            eq(Budgets.createdBy, currentUser ?? ""),
            gte(Budgets.createdAt, firstDayOfMonth),
            lte(Budgets.createdAt, lastDayOfMonth),
          ),
        )
        .orderBy(desc(Budgets.createdAt));

      if (result) {
        setBudgetList(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //   On transfer expense to another budget
  const handleTransferExpense = async (budgetId: string) => {
    try {
      const result = await db
        .update(Expenses)
        .set({ budgetId })
        .where(
          and(
            eq(Expenses.id, expenseId),
            eq(Expenses.createdBy, currentUser ?? ""),
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
      <DialogTrigger asChild>
        <Button
          className="border bg-blue-700 hover:bg-blue-700/90"
          onClick={getActiveBudget}
        >
          Transfer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer expense</DialogTitle>
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
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <DialogClose asChild>
                            <AlertDialogAction
                              onClick={() => handleTransferExpense(item.id)}
                            >
                              Confirm
                            </AlertDialogAction>
                          </DialogClose>
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
