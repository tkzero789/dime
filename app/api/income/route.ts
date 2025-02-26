import { db } from "@/db/dbConfig";
import { Income } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { getTableColumns } from "drizzle-orm";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userEmail = user?.primaryEmailAddress?.emailAddress;

  const url = new URL(request.url);
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 },
    );
  }

  console.log(startDate);
  console.log(endDate);

  try {
    const data = await db
      .select({ ...getTableColumns(Income) })
      .from(Income)
      .where(
        and(
          eq(Income.created_by, userEmail || ""),
          gte(Income.date, startDate),
          lte(Income.date, endDate),
        ),
      )
      .orderBy(desc(Income.date));

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch income data" },
      { status: 500 },
    );
  }
}
