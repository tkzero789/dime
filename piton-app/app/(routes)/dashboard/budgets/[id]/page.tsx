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
import { useToast } from "@/components/ui/use-toast";
import EditBudget from "../../budgets/_components/EditBudget";
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
import BudgetItem from "../../budgets/_components/BudgetItem";
import AddExpense from "../../budgets/_components/AddExpense";
import ExpenseList from "../../budgets/_components/ExpenseList";

type Props = {
  params: {
    id: string;
  };
};

export default function SpecificBudgetPage({ params }: Props) {
  const { user } = useUser();
  const { toast } = useToast();
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
          eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress ?? ""),
          eq(Budgets.id, params.id),
        ),
      )
      .groupBy(Budgets.id);

    if (result) {
      setBudgetInfo(result);
      getExpenseDetail();
    }
  };

  // All expenses in the budget
  const getExpenseDetail = async () => {
    const result = await db
      .select()
      .from(Expenses)
      .where(
        and(
          eq(Expenses.createdBy, user?.primaryEmailAddress?.emailAddress ?? ""),
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
          eq(Expenses.createdBy, user?.primaryEmailAddress?.emailAddress ?? ""),
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
            eq(
              Budgets.createdBy,
              user?.primaryEmailAddress?.emailAddress ?? "",
            ),
          ),
        )
        .returning();

      if (result) {
        toast({
          variant: "success",
          description: "Budget deleted successfully!",
        });
        router.replace("/dashboard/budgets");
      }
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">My expenses</h2>
        <EditBudget
          budgetInfo={budgetInfo}
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
              <AlertDialogAction onClick={() => deleteBudget()}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {budgetInfo.length > 0 ? (
          <BudgetItem budget={budgetInfo[0]} />
        ) : (
          <Skeleton className="h-28 bg-gray-200" />
        )}
        <AddExpense paramId={params.id} refreshData={() => getBudgetInfo()} />
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Latest Expenses</h2>
        <ExpenseList
          expenseDetail={expenseDetail}
          refreshData={() => getBudgetInfo()}
        />
      </div>
    </div>
  );
}
