import { db } from "@/db/dbConfig";
import { budget, budget_expense } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, desc, eq, getTableColumns, gte, lte, sql } from "drizzle-orm";

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");

  if (!startDate || !endDate) {
    return Response.json(
      { error: "Missing required parameters" },
      { status: 400 },
    );
  }

  try {
    const data = await db
      .select({
        ...getTableColumns(budget),
        total_spend: sql`sum(${budget_expense.amount})`.mapWith(Number),
        remaining:
          sql`${budget.amount} - sum(${budget_expense.amount})`.mapWith(Number),
      })
      .from(budget)
      .leftJoin(budget_expense, eq(budget.id, budget_expense.budget_id))
      .where(
        and(
          eq(budget.created_by, user?.primaryEmailAddress?.emailAddress || ""),
          gte(budget.date, startDate),
          lte(budget.date, endDate),
        ),
      )
      .groupBy(budget.id)
      .orderBy(desc(budget.created_at));

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Server error fetching budget data" },
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

    const data = await db.insert(budget).values({
      amount: body.amount,
      category: body.category,
      emoji: body.emoji,
      date: body.date,
      created_by: user?.primaryEmailAddress?.emailAddress || "",
    });

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Server error adding budget" },
      { status: 500 },
    );
  }
}
