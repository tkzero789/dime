import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/db/dbConfig";
import { user, budgetCategory } from "@/db/schema";
import { eq } from "drizzle-orm";

const DEFAULT_BUDGET_CATEGORIES = [
  { name: "Auto & Transport", icon: "Car" },
  { name: "Business", icon: "Building2" },
  { name: "Dining & Drinks", icon: "Martini" },
  { name: "Education", icon: "School" },
  { name: "Entertainment", icon: "Drama" },
  { name: "Gifts & Donations", icon: "HeartHandshake" },
  { name: "Groceries", icon: "ShoppingCart" },
  { name: "Medical", icon: "BriefcaseMedical" },
  { name: "Pets", icon: "PawPrint" },
  { name: "Shopping", icon: "ShoppingBag" },
  { name: "Travel & Vacation", icon: "Plane" },
  { name: "Others", icon: "BadgeDollarSign" },
];

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env.local",
    );
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return Response.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return Response.json({ error: "Verification failed" }, { status: 400 });
  }

  const eventType = evt.type;

  try {
    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name } = evt.data;
      const primaryEmail =
        email_addresses.find((e) => e.id === evt.data.primary_email_address_id)
          ?.email_address || email_addresses[0]?.email_address;

      // Create user record
      await db.insert(user).values({
        id,
        email: primaryEmail || "",
        first_name: first_name || null,
        last_name: last_name || null,
      });

      // Seed default budget categories
      for (const cat of DEFAULT_BUDGET_CATEGORIES) {
        await db.insert(budgetCategory).values({
          user_id: id,
          name: cat.name,
          icon: cat.icon,
        });
      }
    }

    if (eventType === "user.updated") {
      const { id, email_addresses, first_name, last_name } = evt.data;
      const primaryEmail =
        email_addresses.find((e) => e.id === evt.data.primary_email_address_id)
          ?.email_address || email_addresses[0]?.email_address;

      await db
        .update(user)
        .set({
          email: primaryEmail || "",
          first_name: first_name || null,
          last_name: last_name || null,
        })
        .where(eq(user.id, id));
    }

    if (eventType === "user.deleted") {
      const { id } = evt.data;
      if (id) {
        await db.delete(user).where(eq(user.id, id));
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}