import { AccountData, AccountState } from "@/types";

export async function getAccountData(): Promise<AccountData[]> {
  try {
    const response = await fetch("/api/accounts");

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error || "API error fetching account data");
    }

    return await response.json();
  } catch (error) {
    console.error("API error fetching account data", error);
    throw error;
  }
}

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

type AccountUpdateState = AccountState & {
  id: string;
};

export async function updateAccount(accountToUpdate: AccountUpdateState) {
  try {
    const response = await fetch(
      `/api/accounts/${accountToUpdate.id}?updateMode=update`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accountToUpdate),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error || "API error updating account");
    }

    if (response.status === 204) return null;

    return await response.json();
  } catch (error) {
    console.error("API error updating account", error);
    throw error;
  }
}

export async function deactivateAccount(accountToUpdate: AccountUpdateState) {
  try {
    const response = await fetch(
      `/api/accounts/${accountToUpdate.id}?updateMode=deactivate`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accountToUpdate),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error || "API error updating account");
    }

    if (response.status === 204) return null;

    return await response.json();
  } catch (error) {
    console.error("API error updating account", error);
    throw error;
  }
}
