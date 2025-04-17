import { db } from "@/db/dbConfig";
import { currentUser } from "@clerk/nextjs/server";
import { sql } from "drizzle-orm";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ budgetId: string; expenseId: string }> },
) {
  const user = await currentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const expenseId = (await params).expenseId;

    await db.execute(sql`
    SELECT delete_budget_expense(
    ${expenseId},
    ${user?.primaryEmailAddress?.emailAddress}
    ) as delete`);

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Server error deleting budget expense" },
      { status: 500 },
    );
  }
}
