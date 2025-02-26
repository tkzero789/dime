// Mutation type ========================
export type AddAccountType = {
  name: string;
  type: string;
  amount: string;
  debt: string;
  color: string;
};

export type NewBudgetType = {
  amount: string;
  category: string;
  emoji: string | null;
  month: number;
  year: number;
};

// Query type ========================
export type AccountDataType = {
  id: string;
  name: string;
  type: string;
  amount: string;
  debt: string;
  color: string;
  is_actived: boolean;
  created_by: string;
  created_at: Date;
};

export type BudgetData = {
  id: string;
  amount: string;
  category: string;
  emoji: string | null;
  month: number;
  year: number;
  total_item: number;
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
  month: number;
  year: number;
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

export type IncomeDetail = {
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
  created_by: string;
  is_actived: boolean;
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
