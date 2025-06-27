
import type { Expense, FinanceNote } from './types';

const EXPENSES_KEY = 'spendnote_expenses';
const NOTES_KEY = 'spendnote_finance_notes';

// Helper to safely get items from localStorage
function getItems<T>(key: string): T[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return [];
  }
}

// Helper to safely set items in localStorage
function setItems<T>(key:string, data: T[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
  }
}

// Expenses
export function getExpensesFromStorage(): Expense[] {
  return getItems<Expense>(EXPENSES_KEY);
}

export function saveExpensesToStorage(expenses: Expense[]): void {
  setItems<Expense>(EXPENSES_KEY, expenses);
}

export function addExpenseToStorage(expense: Expense): void {
  const expenses = getExpensesFromStorage();
  saveExpensesToStorage([expense, ...expenses]);
}

export function updateExpenseInStorage(updatedExpense: Expense): void {
  let expenses = getExpensesFromStorage();
  expenses = expenses.map(exp => exp.id === updatedExpense.id ? updatedExpense : exp);
  saveExpensesToStorage(expenses);
}

export function deleteExpenseFromStorage(expenseId: string): void {
  let expenses = getExpensesFromStorage();
  expenses = expenses.filter(exp => exp.id !== expenseId);
  saveExpensesToStorage(expenses);
}


// Finance Notes
export function getFinanceNotesFromStorage(): FinanceNote[] {
  return getItems<FinanceNote>(NOTES_KEY);
}

export function saveFinanceNotesToStorage(notes: FinanceNote[]): void {
  setItems<FinanceNote>(NOTES_KEY, notes);
}

export function addFinanceNoteToStorage(note: FinanceNote): void {
  const notes = getFinanceNotesFromStorage();
  saveFinanceNotesToStorage([note, ...notes]);
}

export function updateFinanceNoteInStorage(updatedNote: FinanceNote): void {
  let notes = getFinanceNotesFromStorage();
  notes = notes.map(note => note.id === updatedNote.id ? updatedNote : note);
  saveFinanceNotesToStorage(notes);
}

export function deleteFinanceNoteFromStorage(noteId: string): void {
  let notes = getFinanceNotesFromStorage();
  notes = notes.filter(note => note.id !== noteId);
  saveFinanceNotesToStorage(notes);
}
