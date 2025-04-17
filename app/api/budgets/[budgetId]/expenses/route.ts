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
        ...getTableColumns(budget_expense),
        budget_category: budget.category,
        budget_emoji: budget.emoji,
      })
      .from(budget_expense)
      .leftJoin(budget, eq(budget.id, budget_expense.budget_id))
      .where(
        and(
          eq(budget_expense.budget_id, budgetId),
          eq(
            budget_expense.created_by,
            user?.primaryEmailAddress?.emailAddress ?? "",
          ),
        ),
      );

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Server error fetching budget expense data" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ budgetId: string }> },
) {
  const user = await currentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const budgetId = (await params).budgetId;

    const body = await request.json();

    const data = await db.execute(sql`
        SELECT add_budget_expense(
        ${budgetId}, 
        ${body.account_id}, 
        ${body.name}, 
        ${body.amount}::numeric,
        ${body.category}, 
        ${body.payment_source}, 
        ${body.date}::timestamp, 
        ${user?.primaryEmailAddress?.emailAddress}
        ) as expense_data`);

    return Response.json(data, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Server error adding budget expense" },
      { status: 500 },
    );
  }
}
