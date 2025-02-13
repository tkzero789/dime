// budget
export type BudgetDetail = {
  id: string;
  name: string;
  amount: string;
  category: string;
  icon: string | null;
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
  name: string;
  amount: string;
  category: string;
  icon: string | null;
  month: number;
  year: number;
  created_by: string;
  created_at: Date;
};

// expense
export type ExpenseDetail = {
  id: string;
  budget_id: string | null;
  name: string;
  amount: string;
  payment_method: string;
  date: string;
  created_by: string;
  created_at: Date;
};

// expense with category
export type ExpenseDetailWithCategory = ExpenseDetail & {
  category: string;
};

// income
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

// recurrence
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

// recurring_rule
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
  isActive: boolean;
};

// single payment
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
