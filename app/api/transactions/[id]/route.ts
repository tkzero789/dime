import { wsDb } from "@/db/dbConfig";
import { account, transaction } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq, sql } from "drizzle-orm";

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
    const transactionId = (await params).id;

    await wsDb.transaction(async (tx) => {
      // 1. Get old transaction details
      const [oldTransaction] = await tx
        .select({
          payment_source: transaction.payment_source,
          amount: transaction.amount,
        })
        .from(transaction)
        .where(
          and(
            eq(transaction.id, transactionId),
            eq(transaction.created_by, user.id),
          ),
        )
        .limit(1);

      if (!oldTransaction) {
        throw new Error("Transaction not found or unauthorized");
      }

      // 2. Get old account type
      const [oldAccountData] = await tx
        .select({ type: account.type })
        .from(account)
        .where(eq(account.id, oldTransaction.payment_source))
        .limit(1);

      if (!oldAccountData) {
        throw new Error("Account not found");
      }

      // 3. Reverse old transaction effect (add amount back)
      await tx
        .update(account)
        .set({
          amount: sql`COALESCE(${account.amount}, 0) + ${oldTransaction.amount}`,
        })
        .where(eq(account.id, oldTransaction.payment_source));

      // 4. If old account was credit, reduce debt
      if (oldAccountData.type === "credit") {
        await tx
          .update(account)
          .set({
            debt: sql`COALESCE(${account.debt}, 0) - ${oldTransaction.amount}`,
          })
          .where(eq(account.id, oldTransaction.payment_source));
      }

      // 5. Get new account type
      const [newAccountData] = await tx
        .select({ type: account.type })
        .from(account)
        .where(eq(account.id, body.payment_source))
        .limit(1);

      if (!newAccountData) {
        throw new Error("New account not found");
      }

      // 6. Apply new transaction effect (subtract new amount)
      await tx
        .update(account)
        .set({
          amount: sql`COALESCE(${account.amount}, 0) - ${body.amount}`,
        })
        .where(eq(account.id, body.payment_source));

      // 7. If new account is credit, increase debt
      if (newAccountData.type === "credit") {
        await tx
          .update(account)
          .set({
            debt: sql`COALESCE(${account.debt}, 0) + ${body.amount}`,
          })
          .where(eq(account.id, body.payment_source));
      }

      // 8. Update transaction record
      await tx
        .update(transaction)
        .set({
          type: body.type,
          name: body.name,
          amount: body.amount,
          category: body.category,
          payment_source: body.payment_source,
          date: body.date,
        })
        .where(
          and(
            eq(transaction.id, transactionId),
            eq(transaction.created_by, user.id),
          ),
        );
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Server error updating transaction" },
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
    const transactionId = (await params).id;

    await wsDb.transaction(async (tx) => {
      // 1. Get transaction details
      const [transactionData] = await tx
        .select({
          payment_source: transaction.payment_source,
          amount: transaction.amount,
        })
        .from(transaction)
        .where(
          and(
            eq(transaction.id, transactionId),
            eq(transaction.created_by, user.id),
          ),
        )
        .limit(1);

      if (!transactionData) {
        throw new Error("Transaction not found or unauthorized");
      }

      // 2. Get account type
      const [accountData] = await tx
        .select({ type: account.type })
        .from(account)
        .where(and(eq(account.id, transactionData.payment_source)))
        .limit(1);

      if (!accountData) {
        throw new Error("Transaction not found or unauthorized");
      }

      // 3. Update account available credit/balance
      await tx
        .update(account)
        .set({
          amount: sql`COALESCE(${account.amount}, 0) + ${transactionData.amount}`,
        })
        .where(eq(account.id, transactionData.payment_source));

      // 4. Update debt for credit account
      if (accountData.type === "credit") {
        await tx
          .update(account)
          .set({
            debt: sql`COALESCE(${account.debt}, 0) - ${transactionData.amount}`,
          })
          .where(eq(account.id, transactionData.payment_source));
      }

      // 5. Delete transaction
      await tx
        .delete(transaction)
        .where(
          and(
            eq(transaction.id, transactionId),
            eq(transaction.created_by, user.id),
          ),
        );
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Server error deleting transaction" },
      { status: 500 },
    );
  }
}