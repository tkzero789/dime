import { db } from "@/db/dbConfig";
import { budgetCategory } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const user = await currentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const [updated] = await db
      .update(budgetCategory)
      .set({
        name: body.name,
        icon: body.icon,
      })
      .where(
        and(
          eq(budgetCategory.id, params.id),
          eq(budgetCategory.user_id, user.id),
        ),
      )
      .returning();

    if (!updated) {
      return Response.json({ error: "Category not found" }, { status: 404 });
    }

    return Response.json(updated);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Server error updating budget category" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const user = await currentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [deleted] = await db
      .delete(budgetCategory)
      .where(
        and(
          eq(budgetCategory.id, params.id),
          eq(budgetCategory.user_id, user.id),
        ),
      )
      .returning();

    if (!deleted) {
      return Response.json({ error: "Category not found" }, { status: 404 });
    }

    return Response.json(deleted);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Server error deleting budget category" },
      { status: 500 },
    );
  }
}