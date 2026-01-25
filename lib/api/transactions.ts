import { TransactionData, TransactionInput } from "@/types";

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

export async function addTransaction(newTransaction: TransactionInput) {
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

type TransactionUpdateState = TransactionInput & {
  id: string;
};

export async function updateTransaction(
  transactionToUpdate: TransactionUpdateState,
) {
  try {
    const response = await fetch(
      `/api/transactions/${transactionToUpdate.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionToUpdate),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error || "API error updating transaction");
    }

    if (response.status === 204) return null;

    return await response.json();
  } catch (error) {
    console.error("API error updating transaction", error);
    throw error;
  }
}

export async function deleteTransaction(transactionId: string) {
  try {
    const response = await fetch(`/api/transactions/${transactionId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error || "API error deleting transaction");
    }

    if (response.status === 204) return null;

    return await response.json();
  } catch (error) {
    console.error("API error deleting transaction", error);
    throw error;
  }
}
