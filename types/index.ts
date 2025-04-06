// Mutation type ========================
export type AccountState = {
  name: string;
  type: string;
  amount: string;
  debt: string;
  color: string;
};

export type BudgetState = {
  amount: string;
  category: string;
  emoji: string | null;
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

export type BudgetData = {
  id: string;
  amount: string;
  category: string;
  emoji: string | null;
  date: string;
  total_spend: number;
  remaining: number;
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

export type ExpenseData = {
  id: string;
  budget_id: string | null;
  name: string;
  amount: string;
  payment_method: string;
  date: string;
  created_by: string;
  created_at: Date;
};

export type ExpenseDetailWithCategory = ExpenseData & {
  category: string;
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
