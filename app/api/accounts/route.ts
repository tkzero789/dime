import { db } from "@/db/dbConfig";
import { account } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, asc, eq, getTableColumns } from "drizzle-orm";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await db
      .select({ ...getTableColumns(account) })
      .from(account)
      .where(
        and(
          eq(account.created_by, user?.primaryEmailAddress?.emailAddress ?? ""),
          eq(account.is_active, true),
        ),
      )
      .orderBy(asc(account.created_at));

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Server error fetching account data" },
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

    const data = await db.insert(account).values({
      name: body.name,
      type: body.type,
      amount: body.amount,
      debt: body.debt,
      color: body.color,
      created_by: user?.primaryEmailAddress?.emailAddress || "",
    });

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Server error adding account" },
      { status: 500 },
    );
  }
}
