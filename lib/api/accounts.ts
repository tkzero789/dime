import { AccountState } from "@/types";

export async function addAccount(newAccount: AccountState) {
  try {
    const response = await fetch("/api/accounts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAccount),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error || "API error adding account");
    }

    return await response.json();
  } catch (error) {
    console.error("API error adding account", error);
    throw error;
  }
}
