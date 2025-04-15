import { db } from "@/db/dbConfig";
import { account } from "@/db/schema";
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

  const url = new URL(request.url);
  const updateMode = url.searchParams.get("updateMode");

  if (!updateMode) {
    return Response.json(
      { error: "Missing required parameter" },
      { status: 400 },
    );
  }

  try {
    const body = await request.json();
    const accountId = (await params).id;

    await db
      .update(account)
      .set({
        name: body.name,
        type: body.type,
        amount: body.amount,
        debt: body.debt,
        color: body.color,
        is_active:
          updateMode === "update"
            ? true
            : updateMode === "deactivate"
              ? false
              : true,
        created_by: user?.primaryEmailAddress?.emailAddress || "",
      })
      .where(
        and(
          eq(account.id, accountId),
          eq(account.created_by, user?.primaryEmailAddress?.emailAddress ?? ""),
        ),
      );

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Server error updating account" },
      { status: 500 },
    );
  }
}
