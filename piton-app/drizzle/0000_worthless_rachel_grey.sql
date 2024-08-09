CREATE TABLE IF NOT EXISTS "budgets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"icon" varchar,
	"createdBy" varchar NOT NULL,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "expenses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"paymentMethod" varchar NOT NULL,
	"budgetId" uuid,
	"createdBy" varchar NOT NULL,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "expenses" ADD CONSTRAINT "expenses_budgetId_budgets_id_fk" FOREIGN KEY ("budgetId") REFERENCES "public"."budgets"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
