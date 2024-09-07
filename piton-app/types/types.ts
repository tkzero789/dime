// budget
export type BudgetDetail = {
  id: string;
  name: string;
  amount: string;
  category: string;
  icon: string | null;
  total_item: number;
  total_spend: number;
  remaining: number;
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

// single payment
export type SingleDetail = {
  id: string;
  name: string;
  amount: string;
  category: string;
  payment_method: string;
  date: string;
  create_by: string;
  create_at: Date;
};
