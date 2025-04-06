import { db } from "@/db/dbConfig";
import { user_list } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";

export async function POST() {
  const user = await currentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.lastSignInAt === null) {
    try {
      const data = await db.insert(user_list).values({
        email: user?.primaryEmailAddress?.emailAddress || "",
      });

      return Response.json(data);
    } catch (error) {
      console.error(error);
      return Response.json(
        { error: "Server error adding user" },
        { status: 500 },
      );
    }
  }
}
