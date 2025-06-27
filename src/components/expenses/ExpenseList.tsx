
"use client";

import { useAppContext } from "@/contexts/AppContext";
import { ExpenseListItem } from "./ExpenseListItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Expense } from "@/lib/types";

export function ExpenseList() {
  const { expenses } = useAppContext();

  if (expenses.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p className="text-lg">No expenses recorded yet.</p>
        <p>Click the "+" button to get started!</p>
      </div>
    );
  }

  // Sort expenses by date in descending order (newest first)
  const sortedExpenses = [...expenses].sort((a: Expense, b: Expense) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <ScrollArea className="h-[calc(100vh-300px)] sm:h-[calc(100vh-280px)] pr-4"> {/* Adjusted height for better viewport fit */}
      <div className="space-y-4">
        {sortedExpenses.map(expense => (
          <ExpenseListItem key={expense.id} expense={expense} />
        ))}
      </div>
    </ScrollArea>
  );
}
