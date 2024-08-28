import {
  date,
  numeric,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const Budgets = pgTable("budgets", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category").notNull(),
  icon: varchar("icon"),
  created_by: varchar("created_by").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const BudgetExpenses = pgTable("budget_expenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  budget_id: uuid("budget_id").references(() => Budgets.id),
  name: varchar("name").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  payment_method: varchar("payment_method").notNull(),
  date: date("date").notNull(),
  created_by: varchar("created_by").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const Income = pgTable("income", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category").notNull(),
  payment_method: varchar("payment_method").notNull(),
  date: date("date").notNull(),
  created_by: varchar("created_by").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const Recurrence = pgTable("recurrence", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category").notNull(),
  payment_method: varchar("payment_method").notNull(),
  date: date("date").notNull(),
  created_by: varchar("created_by").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
