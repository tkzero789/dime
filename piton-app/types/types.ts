// budget
export type BudgetDetail = {
  id: string;
  name: string;
  amount: string;
  icon: string | null;
  category: string;
  createdBy: string;
  createdAt: Date;
  totalSpend: number;
  totalItem: number;
};

// expense
export type ExpenseDetail = {
  id: string;
  name: string;
  amount: string;
  paymentMethod: string;
  date: Date;
  budgetId: string | null;
  createdBy: string;
  createdAt: Date;
};
