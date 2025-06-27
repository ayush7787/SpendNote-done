
"use client";

import React from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { useAppContext } from "@/contexts/AppContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Sigma } from "lucide-react";

export default function ExpensesPage() {
  const { isDataLoaded, spendingSummary } = useAppContext();
  const [isAddExpenseOpen, setIsAddExpenseOpen] = React.useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  if (!isDataLoaded) {
    return (
      <>
        <AppHeader />
        <main className="flex-1 container mx-auto p-4 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Skeleton className="h-10 w-48" />
          </div>
          <Skeleton className="h-24 rounded-lg mb-6" /> {/* Skeleton for Total Expenses */}
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" /> {/* Skeleton for Expense List */}
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <AppHeader />
      <main className="flex-1 container mx-auto p-4 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <h1 className="text-3xl font-bold font-headline text-primary">My Expenses</h1>
        </div>
        
        <Card className="shadow-lg bg-card text-card-foreground mb-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-headline">Total Expenses</CardTitle>
            <Sigma className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(spendingSummary.total)}</div>
            <p className="text-xs text-muted-foreground">All recorded expenses</p>
          </CardContent>
        </Card>

        <section className="space-y-4" aria-labelledby="recent-expenses-title">
          <h2 id="recent-expenses-title" className="text-2xl font-semibold font-headline">Recent Transactions</h2>
          <ExpenseList />
        </section>
      </main>

      {/* FAB for Adding New Expense */}
      <Popover open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
        <PopoverTrigger asChild>
          <Button 
            className="fixed bottom-20 right-4 sm:bottom-24 sm:right-8 h-14 w-14 rounded-full bg-accent text-accent-foreground shadow-xl hover:bg-accent/90 z-50"
            size="icon"
            aria-label="Add Expense"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 sm:w-96 p-0 mb-20 bg-popover text-popover-foreground" align="end" sideOffset={10}>
          <div className="p-4">
            <h4 className="font-medium leading-none font-headline mb-4">Add New Expense</h4>
            <ExpenseForm onSave={() => setIsAddExpenseOpen(false)} />
          </div>
        </PopoverContent>
      </Popover>

      <footer className="py-6 text-center text-sm text-muted-foreground border-t mt-auto">
        © {new Date().getFullYear() === 2024 ? 2025 : new Date().getFullYear()} SpendNote. All rights reserved.
      </footer>
    </>
  );
}
