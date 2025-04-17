export const queryKeys = {
  budgets: {
    all: () => ["budgets"] as const,
    byDateRange: (startDate?: string, endDate?: string) =>
      [...queryKeys.budgets.all(), startDate, endDate] as const,
    byId: (budgetId: string) => [...queryKeys.budgets.all(), budgetId] as const,
  },
  budgetExpenses: {
    all: () => ["budgetExpenses"] as const,
    byBudgetId: (budgetId: string) =>
      [...queryKeys.budgetExpenses.all(), budgetId] as const,
    byId: (budgetId: string, budgetExpenseId: string) =>
      [
        ...queryKeys.budgetExpenses.byBudgetId(budgetId),
        budgetExpenseId,
      ] as const,
  },
  accounts: {
    all: () => ["accounts"] as const,
  },
  income: {
    all: () => ["income"] as const,
    byYear: (year?: number) => [...queryKeys.income.all(), year] as const,
  },
};
