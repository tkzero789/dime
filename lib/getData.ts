import {
  BudgetExpenses,
  Budgets,
  Income,
  Recurrence,
  Single,
} from "@/db/schema";
import {
  BudgetDetail,
  ExpenseDetail,
  IncomeDetail,
  RecurrenceDetail,
  SingleDetail,
} from "@/types/types";
import { Client } from "pg";
import { BatchResponse } from "drizzle-orm/batch";
import { db } from "@/db/dbConfig";
import { and, eq, getTableColumns, gte, lte } from "drizzle-orm";

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
    const batchReponse: BatchResponse<any> = await db.batch([
      db
        .select({ ...getTableColumns(Income) })
        .from(Income)
        .where(
          and(
            eq(Income.created_by, userEmail),
            gte(Income.date, firstDayOfPrevMonth),
            lte(Income.date, lastDayOfMonth),
          ),
        ),
      db
        .select({ ...getTableColumns(Budgets) })
        .from(Budgets)
        .where(
          and(
            eq(Budgets.created_by, userEmail),
            gte(Budgets.created_at, new Date(firstDayOfPrevMonth)),
            lte(Budgets.created_at, new Date(lastDayOfMonth)),
          ),
        ),
      db
        .select({ ...getTableColumns(BudgetExpenses) })
        .from(BudgetExpenses)
        .where(
          and(
            eq(BudgetExpenses.created_by, userEmail),
            gte(BudgetExpenses.date, firstDayOfPrevMonth),
            lte(BudgetExpenses.date, lastDayOfMonth),
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

    let incomeResult: IncomeDetail[] = [];
    let budgetsResult: BudgetDetail[] = [];
    let budgetExpensesResult: ExpenseDetail[] = [];
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