import {
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
  icon: varchar("icon"),
  createdBy: varchar("createdBy").notNull(),
  createdAt: timestamp("createdAt").notNull(),
});

export const Expenses = pgTable("expenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar("paymentMethod").notNull(),
  budgetId: uuid("budgetId").references(() => Budgets.id),
  createdBy: varchar("createdBy").notNull(),
  createdAt: timestamp("createdAt").notNull(),
});
