import { TransactionData, TransactionState } from "@/types";

export async function getTransactionData(searchParams: {
  startDate: string;
  endDate: string;
}): Promise<TransactionData[]> {
  const params = new URLSearchParams({
    startDate: searchParams.startDate,
    endDate: searchParams.endDate,
  });
  try {
    const response = await fetch(`/api/transactions?${params.toString()}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error || "API error fetching income data");
    }

    return await response.json();
  } catch (error) {
    console.error("API error fetching income data", error);
    throw error;
  }
}

export async function addTransaction(newTransaction: TransactionState) {
  try {
    const response = await fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTransaction),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error || "API error adding transaction");
    }
  } catch (error) {
    console.error("API error adding transaction", error);
    throw error;
  }
}
