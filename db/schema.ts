import {
  date,
  numeric,
  pgTable,
  timestamp,
  uuid,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";

export const account = pgTable("account", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  debt: numeric("debt", { precision: 10, scale: 2 }).notNull(),
  type: varchar("type").notNull(),
  color: varchar("color").notNull(),
  is_active: boolean("is_active").notNull().default(true),
  created_by: varchar("created_by").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const transaction = pgTable("transaction", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  type: varchar("type").notNull(),
  category: varchar("category").notNull(),
  payment_source: varchar("payment_source").notNull(),
  date: date("date").notNull(),
  created_by: varchar("created_by").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const budget = pgTable("budget", {
  id: uuid("id").primaryKey().defaultRandom(),
  category: varchar("category").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  period: varchar("period").notNull().default("monthly"),
  start_date: date("start_date").notNull(),
  end_date: date("end_date"),
  is_active: boolean("is_active").notNull().default(true),
  created_by: varchar("created_by").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
