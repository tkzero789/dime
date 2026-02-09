import {
  BadgeDollarSign,
  Banknote,
  BriefcaseMedical,
  Building2,
  Car,
  ChartCandlestick,
  Drama,
  HeartHandshake,
  HousePlus,
  Martini,
  PawPrint,
  PiggyBank,
  Plane,
  School,
  ShoppingBag,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";

// Transaction
export type TransactionCategoryItem = {
  label: string;
  value: string;
  icon: LucideIcon;
  color?: string;
};

export const TRANSACTION_CATEGORIES = {
  expense: [
    {
      label: "Auto & Transport",
      value: "auto_transport",
      icon: Car,
      color: "#000000",
    },
    {
      label: "Business",
      value: "business",
      icon: Building2,
      color: "#000000",
    },
    {
      label: "Dining & Drinks",
      value: "dining_drinks",
      icon: Martini,
      color: "#000000",
    },
    {
      label: "Education",
      value: "education",
      icon: School,
      color: "#000000",
    },
    {
      label: "Entertainment",
      value: "entertainment",
      icon: Drama,
      color: "#000000",
    },
    {
      label: "Gifts & Donations",
      value: "gifts_donations",
      icon: HeartHandshake,
      color: "#000000",
    },
    {
      label: "Groceries",
      value: "groceries",
      icon: ShoppingCart,
      color: "#000000",
    },
    {
      label: "Medical",
      value: "medical",
      icon: BriefcaseMedical,
      color: "#000000",
    },
    {
      label: "Pets",
      value: "pets",
      icon: PawPrint,
      color: "#000000",
    },
    {
      label: "Shopping",
      value: "shopping",
      icon: ShoppingBag,
      color: "#000000",
    },
    {
      label: "Travel & Vacation",
      value: "travel_vacation",
      icon: Plane,
      color: "#000000",
    },
    {
      label: "Others",
      value: "others",
      icon: BadgeDollarSign,
      color: "#000000",
    },
  ] as const satisfies TransactionCategoryItem[],
  income: [
    { label: "Salary", value: "salary", icon: Banknote, color: "#000000" },
    {
      label: "Investments",
      value: "investments",
      icon: ChartCandlestick,
      color: "#000000",
    },
    {
      label: "Rental Income",
      value: "rental_income",
      icon: HousePlus,
      color: "#000000",
    },
    { label: "Pensions", value: "pensions", icon: PiggyBank, color: "#000000" },
  ] as const satisfies TransactionCategoryItem[],
} as const;

export type TransactionType = keyof typeof TRANSACTION_CATEGORIES;
export type ExpenseCategory =
  (typeof TRANSACTION_CATEGORIES.expense)[number]["value"];
export type IncomeCategory =
  (typeof TRANSACTION_CATEGORIES.income)[number]["value"];
export type TransactionCategory = ExpenseCategory | IncomeCategory;

// Budget
export const BUDGET_PERIODS = [
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
] as const;

export type BudgetPeriod = (typeof BUDGET_PERIODS)[number]["value"];
