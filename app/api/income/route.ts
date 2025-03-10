import { db } from "@/db/dbConfig";
import { income } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { getTableColumns } from "drizzle-orm";
import { and, desc, eq, gte, lte } from "drizzle-orm";

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
      .select({ ...getTableColumns(income) })
      .from(income)
      .where(
        and(
          eq(income.created_by, user?.primaryEmailAddress?.emailAddress || ""),
          gte(income.date, startDate),
          lte(income.date, endDate),
        ),
      )
      .orderBy(desc(income.date));

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch income data" },
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

    const data = await db.insert(income).values({
      name: body.name,
      amount: body.amount,
      date: body.date,
      category: body.category,
      payment_method: body.method,
      created_by: user?.primaryEmailAddress?.emailAddress || "",
    });

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Server error adding income" },
      { status: 500 },
    );
  }
}
