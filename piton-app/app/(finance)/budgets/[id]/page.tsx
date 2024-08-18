"use client";

import React from "react";
import { db } from "@/db/dbConfig";
import { Budgets, Expenses } from "@/db/schema";
import { useUser } from "@clerk/nextjs";
import { and, desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Skeleton } from "@/components/ui/skeleton";
import { BudgetDetail, ExpenseDetail } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import EditBudget from "../_components/budget/EditBudget";
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
import BudgetItem from "../_components/budget/BudgetItem";
import AddExpense from "../_components/expense/AddExpense";
import ExpenseList from "../_components/expense/ExpenseList";
import toast from "react-hot-toast";
import { ExpenseBarChart } from "../_components/chart/ExpenseBarChart";

type Props = {
  params: {
    id: string;
  };
};

export default function SpecificBudgetPage({ params }: Props) {
  const { user } = useUser();
  const currentUser = user?.primaryEmailAddress?.emailAddress;

  const router = useRouter();

  const [budgetInfo, setBudgetInfo] = React.useState<BudgetDetail[]>([]);
  const [expenseDetail, setExpenseDetail] = React.useState<ExpenseDetail[]>([]);

  React.useEffect(() => {
    user && getBudgetInfo();
  }, [user]);

  // Detail from budget
  const getBudgetInfo = async () => {
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(
        and(
          eq(Budgets.createdBy, currentUser ?? ""),
          eq(Budgets.id, params.id),
        ),
      )
      .groupBy(Budgets.id);

    if (result) {
      setBudgetInfo(result);
      getExpenseDetail();
      console.log(result);
    }
  };

  // All expenses in the budget
  const getExpenseDetail = async () => {
    const result = await db
      .select()
      .from(Expenses)
      .where(
        and(
          eq(Expenses.createdBy, currentUser ?? ""),
          eq(Expenses.budgetId, params.id),
        ),
      )
      .orderBy(desc(Expenses.createdAt));

    setExpenseDetail(result);
  };

  // Delete budget
  const deleteBudget = async () => {
    const deleteRelatedExpenses = await db
      .delete(Expenses)
      .where(
        and(
          eq(Expenses.budgetId, params.id),
          eq(Expenses.createdBy, currentUser ?? ""),
        ),
      )
      .returning();

    // If deleted expenses successfully
    if (deleteRelatedExpenses) {
      const result = await db
        .delete(Budgets)
        .where(
          and(
            eq(Budgets.id, params.id),
            eq(Budgets.createdBy, currentUser ?? ""),
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
    <div className="h-full bg-[#f5f5f5] px-8 pb-8 pt-4">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">Budget info</h2>
        <EditBudget
          budgetInfo={budgetInfo}
          currentUser={currentUser || "default"}
          refreshData={() => getBudgetInfo()}
        />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="flex gap-2">
              <Trash />
              <span>Delete</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                budget and remove your data from our database.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => deleteBudget()}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-4">
          {budgetInfo.length > 0 ? (
            <BudgetItem budget={budgetInfo[0]} />
          ) : (
            <Skeleton className="h-28 bg-gray-200" />
          )}
          <AddExpense
            paramId={params.id}
            currentUser={currentUser || "default"}
            refreshData={() => getBudgetInfo()}
          />
        </div>
        <div className="col-span-2">
          <ExpenseBarChart expenseDetail={expenseDetail} />
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Latest Expenses</h2>
        <ExpenseList
          expenseDetail={expenseDetail}
          currentUser={currentUser || "default"}
          refreshData={() => getBudgetInfo()}
        />
      </div>
    </div>
  );
}
