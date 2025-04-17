import { BudgetExpenseState } from "@/types";

export async function addBudgetExpense(newBudgetExpense: BudgetExpenseState) {
  try {
    const response = await fetch(
      `/api/budgets/${newBudgetExpense.budget_id}/expenses`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBudgetExpense),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error || "API error adding income");
    }

    return await response.json();
  } catch (error) {
    console.error("API error adding budget expense", error);
    throw error;
  }
}

export async function deleteBudgetExpense({
  budgetId,
  expenseId,
}: {
  budgetId: string;
  expenseId: string;
}) {
  try {
    const response = await fetch(
      `/api/budgets/${budgetId}/expenses/${expenseId}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error || "API error deleting budget expense");
    }

    if (response.status === 204) return null;

    return await response.json();
  } catch (error) {
    console.error("API error deleting budget expense");
    throw error;
  }
}
