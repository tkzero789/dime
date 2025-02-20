ALTER TABLE "budget_expenses" ADD COLUMN "account_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "budget_expenses" ADD CONSTRAINT "budget_expenses_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
