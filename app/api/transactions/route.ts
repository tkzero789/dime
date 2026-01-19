import { db } from "@/db/dbConfig";
import { account, transaction } from "@/db/schema";
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
      .select({ ...getTableColumns(transaction), payment_source: account })
      .from(transaction)
      .leftJoin(
        account,
        eq(sql`${transaction.payment_source}::uuid`, account.id),
      )
      .where(
        and(
          eq(
            transaction.created_by,
            user?.primaryEmailAddress?.emailAddress || "",
          ),
          gte(transaction.date, startDate),
          lte(transaction.date, endDate),
        ),
      )
      .orderBy(desc(transaction.date));

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Server error fetching transaction data" },
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

    const data = await db.execute(sql`
        SELECT add_transaction(
        ${body.type},
        ${body.name},
        ${body.amount},
        ${body.category},
        ${body.payment_source},
        ${body.date}::timestamp,
        ${user.primaryEmailAddress?.emailAddress}
        ) as transaction_data
        `);

    return Response.json(data, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Server error adding transaction" },
      { status: 500 },
    );
  }
}
