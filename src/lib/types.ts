
export type ExpenseCategory = string;

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  note?: string;
  date: string; // ISO string date of creation, not typically edited
}

export interface FinanceNote {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO string date
  updatedAt: string; // ISO string date
}

export interface SpendingSummaryData {
  daily: number; 
  weekly: number; 
  monthly: number; 
  total: number; 
}

// CategoryBreakdownData is no longer needed as charts are removed.
// export interface CategoryBreakdownData {
//   name: ExpenseCategory;
//   value: number;
//   fill: string;
// }
