import { db, wsDb } from "@/db/dbConfig";
import { account, transaction } from "@/db/schema";
import { TRANSACTION_CATEGORIES } from "@/lib/constants";
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

    const transformedData = data.map((row) => {
      const rowCategory = row.category;

      const allCategories = [
        ...TRANSACTION_CATEGORIES.expense,
        ...TRANSACTION_CATEGORIES.income,
      ];

      const matchingCategory = allCategories.find(
        (item) => item.value === rowCategory,
      );

      if (matchingCategory) {
        return {
          ...row,
          category: {
            label: matchingCategory.label,
            value: matchingCategory.value,
            color: matchingCategory.color,
          },
        };
      }
    });

    return Response.json(transformedData);
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

    const result = await wsDb.transaction(async (tx) => {
      // 1. Get account type and verify ownership
      const [accountData] = await tx
        .select({ type: account.type })
        .from(account)
        .where(
          and(
            eq(account.id, body.payment_source),
            eq(
              account.created_by,
              user.primaryEmailAddress?.emailAddress ?? "",
            ),
          ),
        )
        .limit(1);

      if (!accountData) {
        throw new Error("Account not found or unauthorized");
      }

      // 2. Update account available credit/balance
      await tx
        .update(account)
        .set({
          amount: sql`COALESCE(${account.amount}, 0) - ${body.amount}`,
        })
        .where(
          and(
            eq(account.id, body.payment_source),
            eq(
              account.created_by,
              user?.primaryEmailAddress?.emailAddress ?? "",
            ),
          ),
        );

      // 3. Update debt for credit accounts
      if (accountData.type === "credit") {
        await tx
          .update(account)
          .set({
            debt: sql`COALESCE(${account.debt}, 0) + ${body.amount}`,
          })
          .where(
            and(
              eq(account.id, body.payment_source),
              eq(
                account.created_by,
                user.primaryEmailAddress?.emailAddress || "",
              ),
            ),
          );
      }

      // 4. Insert transaction record
      const [newTransaction] = await tx
        .insert(transaction)
        .values({
          type: body.type,
          name: body.name,
          amount: body.amount,
          category: body.category,
          payment_source: body.payment_source,
          date: body.date,
          created_by: user.primaryEmailAddress?.emailAddress || "",
        })
        .returning();

      return newTransaction;
    });

    return Response.json(result, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Server error adding transaction" },
      { status: 500 },
    );
  }
}
