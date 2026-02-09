import { BudgetData, BudgetInput } from "@/types";

export async function getBudgetData(searchParams?: {
  startDate?: string;
  endDate?: string;
}): Promise<BudgetData[]> {
  try {
    let url = "/api/budgets";

    if (searchParams?.startDate && searchParams?.endDate) {
      const params = new URLSearchParams({
        startDate: searchParams.startDate,
        endDate: searchParams.endDate,
      });
      url = `/api/budgets?${params.toString()}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error || "API error fetching budget data");
    }

    return await response.json();
  } catch (error) {
    console.error("API error fetching budget data", error);
    throw error;
  }
}

export async function addBudget(newBudget: BudgetInput) {
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
  } catch (error) {
    console.error("API error adding budget", error);
    throw error;
  }
}

type BudgetUpdateState = BudgetInput & {
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
