import {
  budget,
  budget_expense,
  income,
  Recurrence,
  Single,
} from "@/db/schema";
import {
  BudgetDetailGetData,
  BudgetExpenseData,
  IncomeData,
  RecurrenceDetail,
  SingleDetail,
} from "@/types";
import { Client } from "pg";
import { db } from "@/db/dbConfig";
import { and, eq, getTableColumns, gte, lte } from "drizzle-orm";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cache: { [key: string]: any } = {};

// Function to query the income table
export async function getUserData(userEmail: string) {
  if (cache[userEmail]) {
    return cache[userEmail];
  }

  const client = new Client({
    connectionString: process.env.NEXT_PUBLIC_DATABASE_URL as string,
  });

  await client.connect();

  const currentMonth = new Date().getUTCMonth();
  const currentYear = new Date().getUTCFullYear();
  const firstDayOfPrevMonth = new Date(
    Date.UTC(currentYear, currentMonth - 1, 1),
  ).toISOString();
  const firstDayOfMonth = new Date(
    Date.UTC(currentYear, currentMonth, 1),
  ).toISOString();
  const lastDayOfMonth = new Date(
    Date.UTC(currentYear, currentMonth + 1, 0),
  ).toISOString();

  try {
    const batchReponse = await db.batch([
      db
        .select({ ...getTableColumns(income) })
        .from(income)
        .where(
          and(
            eq(income.created_by, userEmail),
            gte(income.date, firstDayOfPrevMonth),
            lte(income.date, lastDayOfMonth),
          ),
        ),
      db
        .select({ ...getTableColumns(budget) })
        .from(budget)
        .where(and(eq(budget.created_by, userEmail))),
      db
        .select({ ...getTableColumns(budget_expense) })
        .from(budget_expense)
        .where(
          and(
            eq(budget_expense.created_by, userEmail),
            gte(budget_expense.date, firstDayOfPrevMonth),
            lte(budget_expense.date, lastDayOfMonth),
          ),
        ),
      db
        .select({ ...getTableColumns(Single) })
        .from(Single)
        .where(
          and(
            eq(Single.created_by, userEmail),
            gte(Single.date, firstDayOfPrevMonth),
            lte(Single.date, lastDayOfMonth),
          ),
        ),
      db
        .select({ ...getTableColumns(Recurrence) })
        .from(Recurrence)
        .where(
          and(
            eq(Recurrence.created_by, userEmail),
            gte(Recurrence.date, firstDayOfMonth),
            lte(Recurrence.date, lastDayOfMonth),
          ),
        ),
    ]);

    let incomeResult: IncomeData[] = [];
    let budgetsResult: BudgetDetailGetData[] = [];
    let budgetExpensesResult: BudgetExpenseData[] = [];
    let singleResult: SingleDetail[] = [];
    let recurringResult: RecurrenceDetail[] = [];

    if (batchReponse) {
      [
        incomeResult,
        budgetsResult,
        budgetExpensesResult,
        singleResult,
        recurringResult,
      ] = batchReponse;
    }

    const userData = {
      userIncome: incomeResult,
      userBudgets: budgetsResult,
      userExpensesFromBudgets: budgetExpensesResult,
      userSingleOrOneTimePayment: singleResult,
      userRecurringPayment: recurringResult,
    };

    cache[userEmail] = userData;
    return userData;
  } finally {
    await client.end();
  }
}

export function clearUserCache(userEmail: string) {
  delete cache[userEmail];
}
