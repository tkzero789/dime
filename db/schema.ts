import {
  date,
  numeric,
  pgTable,
  timestamp,
  uuid,
  varchar,
  boolean,
  integer,
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

export const Budgets = pgTable("budgets", {
  id: uuid("id").primaryKey().defaultRandom(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category").notNull(),
  emoji: varchar("emoji"),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  created_by: varchar("created_by").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const budget_expense = pgTable("budget_expense", {
  id: uuid("id").primaryKey().defaultRandom(),
  budget_id: uuid("budget_id").references(() => Budgets.id),
  account_id: uuid("account_id").references(() => account.id),
  name: varchar("name").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  payment_method: varchar("payment_method").notNull(),
  date: date("date").notNull(),
  created_by: varchar("created_by").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const income = pgTable("income", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category").notNull(),
  payment_method: varchar("payment_method").notNull(),
  date: date("date").notNull(),
  created_by: varchar("created_by").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const Recurring_rule = pgTable("recurring_rule", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category").notNull(),
  payment_method: varchar("payment_method").notNull(),
  set_date: date("set_date").notNull(),
  frequency: varchar("frequency").notNull(),
  due_date: date("due_date").notNull(),
  is_active: boolean("is_active").notNull().default(true),
  created_by: varchar("created_by").notNull(),
});

export const Recurrence = pgTable("recurrence", {
  id: uuid("id").primaryKey().defaultRandom(),
  rule_id: uuid("rule_id")
    .notNull()
    .references(() => Recurring_rule.id),
  name: varchar("name").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category").notNull(),
  payment_method: varchar("payment_method").notNull(),
  date: date("date").notNull(),
  created_by: varchar("created_by").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const Single = pgTable("single", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category").notNull(),
  payment_method: varchar("payment_method").notNull(),
  date: date("date").notNull(),
  created_by: varchar("created_by").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
