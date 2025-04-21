import { BudgetExpenseData, BudgetExpenseState } from "@/types";

export async function getBudgetExpenseData(
  budgetId: string,
): Promise<BudgetExpenseData> {
  try {
    const response = await fetch(`/api/budgets/${budgetId}/expenses`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error || "API error fetching account data");
    }

    return await response.json();
  } catch (error) {
    console.error("API error fetching budget expense data", error);
    throw error;
  }
}

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

type BudgetExpenseUpdateState = BudgetExpenseState & {
  id: string;
};

export async function updateBudgetExpense(
  budgetExpenseToUpdate: BudgetExpenseUpdateState,
) {
  try {
    const response = await fetch(
      `/api/budgets/${budgetExpenseToUpdate.budget_id}/expenses/${budgetExpenseToUpdate.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(budgetExpenseToUpdate),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error || "API error updating account");
    }

    if (response.status === 204) return null;

    return await response.json();
  } catch (error) {
    console.error("API error updating budget expense", error);
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
