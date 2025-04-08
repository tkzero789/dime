import { db } from "@/db/dbConfig";
import { budget } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

export async function PUT(request: Request) {
  const user = await currentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

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
          eq(budget.id, body.id),
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
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await currentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const budgetId = (await params).id;

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
