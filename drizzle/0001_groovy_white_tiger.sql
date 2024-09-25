CREATE TABLE IF NOT EXISTS "single" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"category" varchar NOT NULL,
	"payment_method" varchar NOT NULL,
	"date" date NOT NULL,
	"created_by" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
