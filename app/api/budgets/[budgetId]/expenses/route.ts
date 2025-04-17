import { db } from "@/db/dbConfig";
import { budget_expense } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq, sql } from "drizzle-orm";

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const budgetId = url.searchParams.get("budgetId");

    if (!budgetId) {
      return Response.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    const data = await db
      .select()
      .from(budget_expense)
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

export async function POST(request: Request) {
  const user = await currentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const data = await db.execute(sql`
        SELECT add_budget_expense(
        ${body.budget_id}, 
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
