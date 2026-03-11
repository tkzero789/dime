import { db } from "@/db/dbConfig";
import { budget } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await currentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const budgetId = (await params).id;

    // Verify budget exists and belongs to user
    const [existingBudget] = await db
      .select()
      .from(budget)
      .where(
        and(
          eq(budget.id, budgetId),
          eq(budget.created_by, user.id),
        ),
      )
      .limit(1);

    if (!existingBudget) {
      return Response.json(
        { error: "Budget not found or unauthorized" },
        { status: 404 },
      );
    }

    // Update budget
    await db
      .update(budget)
      .set({
        category: body.category,
        amount: body.amount,
        period: body.period,
        start_date: body.start_date,
        end_date: body.end_date || null,
      })
      .where(
        and(
          eq(budget.id, budgetId),
          eq(budget.created_by, user.id),
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
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await currentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const budgetId = (await params).id;

    // Verify budget exists and belongs to user
    const [existingBudget] = await db
      .select()
      .from(budget)
      .where(
        and(
          eq(budget.id, budgetId),
          eq(budget.created_by, user.id),
        ),
      )
      .limit(1);

    if (!existingBudget) {
      return Response.json(
        { error: "Budget not found or unauthorized" },
        { status: 404 },
      );
    }

    // Delete budget
    await db
      .delete(budget)
      .where(
        and(
          eq(budget.id, budgetId),
          eq(budget.created_by, user.id),
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