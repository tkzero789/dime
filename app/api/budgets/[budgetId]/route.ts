import { db } from "@/db/dbConfig";
import { budget, budget_expense } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq, getTableColumns, sql } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ budgetId: string }> },
) {
  const user = await currentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const budgetId = (await params).budgetId;

    const data = await db
      .select({
        ...getTableColumns(budget),
        total_spend: sql`sum(${budget_expense.amount})`.mapWith(Number),
        remaining:
          sql`${budget.amount} - sum(${budget_expense.amount})`.mapWith(Number),
      })
      .from(budget)
      .leftJoin(budget_expense, eq(budget_expense.budget_id, budget.id))
      .where(
        and(
          eq(budget.id, budgetId),
          eq(budget.created_by, user?.primaryEmailAddress?.emailAddress ?? ""),
        ),
      )
      .groupBy(budget.id);

    const budgetItem = data.length > 0 ? data[0] : null;

    return Response.json(budgetItem);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Server error fetching budget item data" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ budgetId: string }> },
) {
  const user = await currentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const budgetId = (await params).budgetId;

    await db
      .update(budget)
      .set({
        amount: body.amount,
        category: body.category,
        emoji: body.emoji,
        date: body.date,
      })
      .where(
        and(
          eq(budget.id, budgetId),
          eq(budget.created_by, user?.primaryEmailAddress?.emailAddress ?? ""),
        ),
      );

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Server error updating budget" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ budgetId: string }> },
) {
  const user = await currentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const budgetId = (await params).budgetId;

    await db
      .delete(budget)
      .where(
        and(
          eq(budget.id, budgetId),
          eq(budget.created_by, user?.primaryEmailAddress?.emailAddress ?? ""),
        ),
      );

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Server error deleting budget" },
      { status: 500 },
    );
  }
}
