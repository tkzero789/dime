import { IncomeDetail, IncomeState } from "@/types";

export async function addIncome(newIncome: IncomeState) {
  try {
    const response = await fetch("/api/income", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newIncome),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error || "API error adding income:");
    }

    return await response.json();
  } catch (error) {
    console.error("API error adding income:", error);
    throw error;
  }
}

export async function getIncomeData(searchParams: {
  startDate: string;
  endDate: string;
}): Promise<IncomeDetail[]> {
  const params = new URLSearchParams({
    startDate: searchParams.startDate,
    endDate: searchParams.endDate,
  });
  const response = await fetch(`/api/income?${params.toString()}`);
  return response.json();
}
