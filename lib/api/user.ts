export async function addUser() {
  try {
    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error || "API error adding user");
    }

    return await response.json();
  } catch (error) {
    console.error("API error adding user", error);
    throw error;
  }
}
