import { db } from "@/db/dbConfig";
import { budget, transaction } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq, sql, gte, lte, desc } from "drizzle-orm";

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");

  try {
    // Build budget query conditions
    const budgetConditions = [
      eq(budget.created_by, user.id),
    ];

    // Filter budgets whose date range overlaps with the query range
    if (startDate && endDate) {
      budgetConditions.push(lte(budget.start_date, endDate));
      budgetConditions.push(gte(budget.end_date, startDate));
    }

    // Get budgets for the user within the date range
    const budgets = await db
      .select()
      .from(budget)
      .where(and(...budgetConditions))
      .orderBy(desc(budget.created_at));

    // For each budget, calculate the total spent from transactions
    const budgetsWithSpending = await Promise.all(
      budgets.map(async (budgetItem) => {
        // Build transaction query conditions
        const transactionConditions = [
          eq(transaction.created_by, user.id),
          eq(transaction.category, budgetItem.category),
          eq(transaction.type, "expense"),
        ];

        // Use budget dates or query params for filtering transactions
        if (startDate && endDate) {
          transactionConditions.push(gte(transaction.date, startDate));
          transactionConditions.push(lte(transaction.date, endDate));
        } else if (budgetItem.start_date) {
          transactionConditions.push(gte(transaction.date, budgetItem.start_date));
          if (budgetItem.end_date) {
            transactionConditions.push(lte(transaction.date, budgetItem.end_date));
          }
        }

        // Calculate total spent for this budget's category
        const [result] = await db
          .select({
            total_spent: sql<string>`COALESCE(SUM(${transaction.amount}::numeric), 0)`,
          })
          .from(transaction)
          .where(and(...transactionConditions));

        const totalSpent = parseFloat(result?.total_spent || "0");
        const budgetAmount = parseFloat(budgetItem.amount);
        const remaining = budgetAmount - totalSpent;

        return {
          ...budgetItem,
          total_spent: totalSpent.toFixed(2),
          remaining: remaining.toFixed(2),
          percentage: budgetAmount > 0 ? ((totalSpent / budgetAmount) * 100).toFixed(1) : "0",
        };
      }),
    );

    return Response.json(budgetsWithSpending);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Server error fetching budgets" },
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

    const [newBudget] = await db
      .insert(budget)
      .values({
        category: body.category,
        amount: body.amount,
        period: body.period,
        start_date: body.start_date,
        end_date: body.end_date || null,
        created_by: user.id,
      })
      .returning();

    return Response.json(newBudget, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Server error adding budget" },
      { status: 500 },
    );
  }
}