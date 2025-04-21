import { db } from "@/db/dbConfig";
import { currentUser } from "@clerk/nextjs/server";
import { sql } from "drizzle-orm";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ budgetId: string; expenseId: string }> },
) {
  const user = await currentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const budgetId = (await params).budgetId;
    const budgetExpenseId = (await params).expenseId;

    const body = await request.json();

    await db.execute(sql`
      SELECT update_budget_expense(
      ${budgetExpenseId},
      ${budgetId},
      ${body.account_id},
      ${body.name},
      ${body.amount}::numeric,
      ${body.category},
      ${body.payment_source},
      ${body.date}::timestamp,
      ${user?.primaryEmailAddress?.emailAddress}
      ) as expense_data
      `);

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Server error updating budget expense" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ budgetId: string; expenseId: string }> },
) {
  const user = await currentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const budgetExpenseId = (await params).expenseId;

    await db.execute(sql`
    SELECT delete_budget_expense(
    ${budgetExpenseId},
    ${user?.primaryEmailAddress?.emailAddress}
    )`);

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Server error deleting budget expense" },
      { status: 500 },
    );
  }
}
