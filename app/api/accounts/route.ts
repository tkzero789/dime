import { db } from "@/db/dbConfig";
import { account } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";

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
