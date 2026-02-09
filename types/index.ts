import { TransactionCategoryItem, TransactionType } from "@/lib/constants";

// Mutation type ========================
export type AccountState = {
  name: string;
  type: string;
  amount: string;
  debt: string;
  color: string;
};

export type TransactionInput = {
  type: TransactionType;
  name: string;
  amount: string;
  category: string;
  payment_source: string;
  date: Date;
};

export type BudgetInput = {
  category: string;
  amount: string;
  period: string;
  start_date: Date | undefined;
  end_date: Date | undefined;
};

export type BudgetState = {
  amount: string;
  category: string;
  emoji: string | null;
  date: Date;
};

export type BudgetExpenseState = {
  budget_id: string;
  account_id: string;
  name: string;
  amount: string;
  category: string;
  payment_source: string;
  date: Date;
};

export type IncomeState = {
  name: string;
  amount: string;
  category: string;
  payment_method: string;
  date: Date;
};

// Query type ========================
export type AccountData = {
  id: string;
  name: string;
  type: string;
  amount: string;
  debt: string;
  color: string;
  is_active: boolean;
  created_by: string;
  created_at: Date;
};

export type TransactionData = {
  id: string;
  type: TransactionType;
  name: string;
  amount: string;
  category: TransactionCategoryItem;
  payment_source: AccountData;
  date: string;
  created_by: string;
  created_at: string;
};

export type BudgetData = {
  id: string;
  category: string;
  amount: string;
  period: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  total_spent: string;
  remaining: string;
  percentage: string;
  created_by: string;
  created_at: Date;
};

export type BudgetDetailGetData = {
  id: string;
  amount: string;
  category: string;
  emoji: string | null;
  created_by: string;
  created_at: Date;
};

export type BudgetExpenseData = {
  id: string;
  budget_id: string | null;
  account_id: string | null;
  name: string;
  amount: string;
  category: string;
  payment_source: string;
  date: string;
  account_name?: string;
  account_color?: string;
  budget_category?: string;
  budget_emoji?: string;
  created_by: string;
  created_at: Date;
};

export type IncomeData = {
  id: string;
  name: string;
  amount: string;
  category: string;
  payment_method: string;
  date: string;
  created_by: string;
  created_at: Date;
};

export type RecurrenceDetail = {
  id: string;
  name: string;
  amount: string;
  category: string;
  payment_method: string;
  date: string;
  created_by: string;
  created_at: Date;
};

export type RecurringRule = {
  id: string;
  name: string;
  amount: string;
  category: string;
  payment_method: string;
  set_date: string;
  frequency: string;
  due_date: string;
  is_active: boolean;
  created_by: string;
};

export type SingleDetail = {
  id: string;
  name: string;
  amount: string;
  category: string;
  payment_method: string;
  date: string;
  created_by: string;
  created_at: Date;
};
