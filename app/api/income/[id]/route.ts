import { db } from "@/db/dbConfig";
import { income } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await currentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const incomeId = (await params).id;

    const data = await db
      .delete(income)
      .where(
        and(
          eq(income.id, incomeId),
          eq(income.created_by, user?.primaryEmailAddress?.emailAddress ?? ""),
        ),
      );

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Server error deleting income" },
      { status: 500 },
    );
  }
}
