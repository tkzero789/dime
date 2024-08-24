// budget
export type BudgetDetail = {
  id: string;
  name: string;
  amount: string;
  icon: string | null;
  category: string;
  created_by: string;
  created_at: Date;
  total_spend: number;
  total_item: number;
  remaining: number;
};

// expense
export type ExpenseDetail = {
  id: string;
  name: string;
  amount: string;
  payment_method: string;
  date: string;
  budget_id: string | null;
  created_by: string;
  created_at: Date;
};

// income
export type IncomeDetail = {
  id: string;
  name: string;
  amount: string;
  date: string;
  category: string;
  created_by: string;
  created_at: Date;
};
