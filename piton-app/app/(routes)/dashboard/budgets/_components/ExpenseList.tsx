import { db } from "@/db/dbConfig";
import { Expenses } from "@/db/schema";
import { ExpenseDetail } from "@/types/types";
import { eq } from "drizzle-orm";
import { Trash2 } from "lucide-react";
import React from "react";
import { useToast } from "@/components/ui/use-toast";

type Props = {
  expenseDetail: ExpenseDetail[];
  refreshData: () => void;
};

export default function ExpenseList({ expenseDetail, refreshData }: Props) {
  const { toast } = useToast();

  const formatPaymentMethod = (payment: string) => {
    return payment
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const deleteExpense = async (expenseId: string) => {
    const result = await db
      .delete(Expenses)
      .where(eq(Expenses.id, expenseId))
      .returning();

    if (result) {
      refreshData();
      toast({
        variant: "success",
        description: "Expense Deleted!",
      });
    }
  };

  return (
    <div className="mt-3">
      <div className="grid grid-cols-5 bg-gray-200 text-center">
        <span>Name</span>
        <span>Amount</span>
        <span>Payment</span>
        <span>Date</span>
        <span>Action</span>
      </div>
      {expenseDetail.map((expense, index) => (
        <div
          key={index}
          className="grid grid-cols-5 bg-slate-50 pt-2 text-center"
        >
          <span>{expense.name}</span>
          <span>{expense.amount}</span>
          <span>{formatPaymentMethod(expense.paymentMethod)}</span>
          <span>{expense.createdAt.toLocaleDateString("en-US")}</span>
          <span>
            <Trash2
              className="cursor-pointer"
              onClick={() => deleteExpense(expense.id)}
              aria-label="Delete expense"
              tabIndex={0}
            />
          </span>
        </div>
      ))}
    </div>
  );
}
