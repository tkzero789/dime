import { db } from "@/db/dbConfig";
import { Recurrence } from "@/db/schema";
import { getTableColumns, lte } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const today = new Date();
    const recurrences = await db
      .select({ ...getTableColumns(Recurrence) })
      .from(Recurrence)
      .where(lte(Recurrence.date, today.toISOString()));

    for (const recurrence of recurrences) {
      const nextDate = new Date(recurrence.date);
      nextDate.setMonth(nextDate.getMonth() + 1);

      await db
        .insert(Recurrence)
        .values({
          name: recurrence.name,
          amount: recurrence.amount,
          date: nextDate.toDateString(),
          payment_method: recurrence.payment_method,
          created_by: recurrence.created_by,
        })
        .returning({ insertId: Recurrence.id });
    }

    res.status(200).json({ message: "Recurring payments checked and updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
