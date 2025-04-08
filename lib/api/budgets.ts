import { BudgetData, BudgetState } from "@/types";

export async function getBudgetData(searchParams: {
  startDate: string;
  endDate: string;
}): Promise<BudgetData[]> {
  const params = new URLSearchParams({
    startDate: searchParams.startDate,
    endDate: searchParams.endDate,
  });
  try {
    const response = await fetch(`/api/budgets?${params.toString()}`);
    return await response.json();
  } catch (error) {
    console.error("API error getting budget data");
    throw error;
  }
}

export async function addBudget(newBudget: BudgetState) {
  try {
    const response = await fetch("/api/budgets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBudget),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error || "API error adding budget");
    }

    return await response.json();
  } catch (error) {
    console.error("API error adding budget", error);
    throw error;
  }
}

type BudgetUpdateState = BudgetState & {
  id: string;
};

export async function updateBudget(budgetToUpdate: BudgetUpdateState) {
  try {
    const response = await fetch(`/api/budgets/${budgetToUpdate.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(budgetToUpdate),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error || "API error updating budget");
    }

    if (response.status === 204) return null;

    return await response.json();
  } catch (error) {
    console.error("API error updating budget", error);
    throw error;
  }
}

export async function deleteBudget(budgetId: string) {
  try {
    const response = await fetch(`/api/budgets/${budgetId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error || "API error deleting budget");
    }

    if (response.status === 204) return null;

    return await response.json();
  } catch (error) {
    console.error("API error deleting budget", error);
    throw error;
  }
}
