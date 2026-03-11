import { BudgetCategoryData, BudgetCategoryInput } from "@/types";

export async function getBudgetCategories(): Promise<BudgetCategoryData[]> {
  try {
    const response = await fetch("/api/budget-categories");

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error || "API error fetching budget categories");
    }

    return await response.json();
  } catch (error) {
    console.error("API error fetching budget categories", error);
    throw error;
  }
}

export async function addBudgetCategory(category: BudgetCategoryInput) {
  try {
    const response = await fetch("/api/budget-categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error || "API error adding budget category");
    }

    return await response.json();
  } catch (error) {
    console.error("API error adding budget category", error);
    throw error;
  }
}

export async function updateBudgetCategory(
  id: string,
  category: BudgetCategoryInput,
) {
  try {
    const response = await fetch(`/api/budget-categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error || "API error updating budget category");
    }

    return await response.json();
  } catch (error) {
    console.error("API error updating budget category", error);
    throw error;
  }
}

export async function deleteBudgetCategory(id: string) {
  try {
    const response = await fetch(`/api/budget-categories/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error || "API error deleting budget category");
    }

    return await response.json();
  } catch (error) {
    console.error("API error deleting budget category", error);
    throw error;
  }
}