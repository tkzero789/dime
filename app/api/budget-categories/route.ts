import { db } from "@/db/dbConfig";
import { budgetCategory } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  const user = await currentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const categories = await db
      .select()
      .from(budgetCategory)
      .where(eq(budgetCategory.user_id, user.id))
      .orderBy(asc(budgetCategory.name));

    return Response.json(categories);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Server error fetching budget categories" },
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

    const [newCategory] = await db
      .insert(budgetCategory)
      .values({
        user_id: user.id,
        name: body.name,
        icon: body.icon,
      })
      .returning();

    return Response.json(newCategory, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Server error adding budget category" },
      { status: 500 },
    );
  }
}