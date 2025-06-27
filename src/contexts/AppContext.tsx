
// Ensure this file is treated as a client component
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useMemo, useReducer, useCallback } from 'react';
import type { Expense, FinanceNote, SpendingSummaryData } from '@/lib/types';
import { 
  getExpensesFromStorage, 
  addExpenseToStorage,
  updateExpenseInStorage,
  deleteExpenseFromStorage,
  getFinanceNotesFromStorage,
  addFinanceNoteToStorage,
  updateFinanceNoteInStorage,
  deleteFinanceNoteFromStorage
} from '@/lib/localStorageService';

interface AppState {
  expenses: Expense[];
  financeNotes: FinanceNote[];
  darkMode: boolean;
  isDataLoaded: boolean;
}

type AppAction =
  | { type: 'SET_EXPENSES'; payload: Expense[] }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string } // id of expense to delete
  | { type: 'SET_FINANCE_NOTES'; payload: FinanceNote[] }
  | { type: 'ADD_FINANCE_NOTE'; payload: FinanceNote }
  | { type: 'UPDATE_FINANCE_NOTE'; payload: FinanceNote }
  | { type: 'DELETE_FINANCE_NOTE'; payload: string } // id of note to delete
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_DARK_MODE'; payload: boolean }
  | { type: 'SET_DATA_LOADED'; payload: boolean };

const initialState: AppState = {
  expenses: [],
  financeNotes: [],
  darkMode: false,
  isDataLoaded: false,
};

const AppReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload };
    case 'ADD_EXPENSE':
      return { ...state, expenses: [action.payload, ...state.expenses] };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(exp =>
          exp.id === action.payload.id ? action.payload : exp
        ),
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(exp => exp.id !== action.payload),
      };
    case 'SET_FINANCE_NOTES':
      return { ...state, financeNotes: action.payload };
    case 'ADD_FINANCE_NOTE':
      return { ...state, financeNotes: [action.payload, ...state.financeNotes] };
    case 'UPDATE_FINANCE_NOTE':
      return {
        ...state,
        financeNotes: state.financeNotes.map(note =>
          note.id === action.payload.id ? action.payload : note
        ),
      };
    case 'DELETE_FINANCE_NOTE':
      return {
        ...state,
        financeNotes: state.financeNotes.filter(note => note.id !== action.payload),
      };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'SET_DARK_MODE':
      return { ...state, darkMode: action.payload };
    case 'SET_DATA_LOADED':
      return { ...state, isDataLoaded: action.payload };
    default:
      return state;
  }
};

interface AppContextProps extends AppState {
  addExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  addFinanceNote: (note: Omit<FinanceNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFinanceNote: (note: FinanceNote) => void;
  deleteFinanceNote: (id: string) => void;
  toggleDarkMode: () => void;
  spendingSummary: SpendingSummaryData;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  useEffect(() => {
    const storedExpenses = getExpensesFromStorage();
    dispatch({ type: 'SET_EXPENSES', payload: storedExpenses });

    const storedNotes = getFinanceNotesFromStorage();
    dispatch({ type: 'SET_FINANCE_NOTES', payload: storedNotes });
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedDarkMode = localStorage.getItem('spendnote_darkMode');
    if (storedDarkMode !== null) {
      dispatch({ type: 'SET_DARK_MODE', payload: JSON.parse(storedDarkMode) });
    } else {
      dispatch({ type: 'SET_DARK_MODE', payload: prefersDark });
    }
    dispatch({ type: 'SET_DATA_LOADED', payload: true });
  }, []);
  
  useEffect(() => {
    if (state.isDataLoaded) { 
      if (state.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('spendnote_darkMode', JSON.stringify(state.darkMode));
    }
  }, [state.darkMode, state.isDataLoaded]);

  const addExpense = useCallback((expenseData: Omit<Expense, 'id' | 'date'>) => {
    const newExpense: Expense = { 
      ...expenseData, 
      category: expenseData.category.trim(), 
      id: Date.now().toString(),
      date: new Date().toISOString() 
    };
    dispatch({ type: 'ADD_EXPENSE', payload: newExpense });
    addExpenseToStorage(newExpense);
  }, []);

  const updateExpense = useCallback((updatedExpenseData: Expense) => {
    // Note: The date of the expense remains the original creation date.
    // Only amount, category, and note are updated from the form.
    const expenseWithTrimmedCategory: Expense = {
      ...updatedExpenseData,
      category: updatedExpenseData.category.trim(),
    };
    dispatch({ type: 'UPDATE_EXPENSE', payload: expenseWithTrimmedCategory });
    updateExpenseInStorage(expenseWithTrimmedCategory);
  }, []);

  const deleteExpense = useCallback((id: string) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
    deleteExpenseFromStorage(id);
  }, []);

  const addFinanceNote = useCallback((noteData: Omit<FinanceNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newNote: FinanceNote = { ...noteData, id: Date.now().toString(), createdAt: now, updatedAt: now };
    dispatch({ type: 'ADD_FINANCE_NOTE', payload: newNote });
    addFinanceNoteToStorage(newNote);
  }, []);

  const updateFinanceNote = useCallback((updatedNoteData: FinanceNote) => {
    const noteWithTimestamp: FinanceNote = { ...updatedNoteData, updatedAt: new Date().toISOString() };
    dispatch({ type: 'UPDATE_FINANCE_NOTE', payload: noteWithTimestamp });
    updateFinanceNoteInStorage(noteWithTimestamp);
  }, []);

  const deleteFinanceNote = useCallback((id: string) => {
    dispatch({ type: 'DELETE_FINANCE_NOTE', payload: id });
    deleteFinanceNoteFromStorage(id);
  }, []);
  
  const toggleDarkMode = useCallback(() => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  }, []);

  const spendingSummary = useMemo((): SpendingSummaryData => {
    let total = 0;
    state.expenses.forEach(exp => {
      total += exp.amount;
    });
    return { daily: 0, weekly: 0, monthly: 0, total };
  }, [state.expenses]);

  if (!state.isDataLoaded) {
    return null; 
  }

  return (
    <AppContext.Provider value={{ ...state, addExpense, updateExpense, deleteExpense, addFinanceNote, updateFinanceNote, deleteFinanceNote, toggleDarkMode, spendingSummary }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
