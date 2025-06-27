
"use client";

import type { Expense } from "@/lib/types";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppContext } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { CategoryIcon } from "./CategoryIcon";
import { ExpenseForm } from "./ExpenseForm";

interface ExpenseListItemProps {
  expense: Expense;
}

export function ExpenseListItem({ expense }: ExpenseListItemProps) {
  const { deleteExpense } = useAppContext();
  const { toast } = useToast();
  
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = React.useState(false);
  
  const longPressTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const handleDeleteConfirm = () => {
    deleteExpense(expense.id);
    toast({
      title: "Expense Deleted",
      description: `Expense for ${expense.category} has been removed.`,
      variant: "destructive",
    });
    setIsDeleteDialogOpen(false); // Close the confirmation dialog
  };

  const handlePointerDown = () => {
    longPressTimerRef.current = setTimeout(() => {
      setIsActionMenuOpen(true);
      longPressTimerRef.current = null;
    }, 700); // 700ms for long press
  };

  const clearLongPressTimer = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handlePointerUpOrLeave = () => {
    clearLongPressTimer();
  };
  
  const handleAmountClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card's pointer events if amount is clicked
    if (isActionMenuOpen) return; // If action menu is already shown, let it take precedence
    clearLongPressTimer(); // Ensure long press doesn't trigger if it was a quick click on amount
    setIsEditDialogOpen(true);
  };

  const handleEditFromActionMenu = () => {
    setIsActionMenuOpen(false);
    setIsEditDialogOpen(true);
  };

  const handleDeleteFromActionMenu = () => {
    setIsActionMenuOpen(false);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <Card 
        className="shadow-md hover:shadow-lg transition-shadow duration-200 bg-card text-card-foreground"
        onMouseDown={handlePointerDown}
        onMouseUp={handlePointerUpOrLeave}
        onMouseLeave={handlePointerUpOrLeave}
        onTouchStart={handlePointerDown}
        onTouchEnd={handlePointerUpOrLeave}
        // onTouchMove={handlePointerUpOrLeave} // Can enable if scroll causes issues
        // onTouchCancel={handlePointerUpOrLeave} 
        role="button"
        tabIndex={0}
        // onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsActionMenuOpen(true);}} // Basic accessibility
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-4 px-4">
          <div className="flex items-center space-x-3">
            <CategoryIcon category={expense.category} className="h-6 w-6 text-primary" />
            <CardTitle className="text-lg font-medium font-headline">
              {expense.category}
            </CardTitle>
          </div>
          <div 
            className="text-xl font-bold text-primary cursor-pointer hover:underline"
            onClick={handleAmountClick}
            role="button"
            tabIndex={0}
            // onKeyDown={(e) => {if (e.key === 'Enter' || e.key === ' ') handleAmountClick(e as any);}}
          >
            {formatCurrency(expense.amount)}
          </div>
        </CardHeader>
        {expense.note && (
          <CardContent className="pb-2 pt-0 px-4">
            <p className="text-sm text-muted-foreground">{expense.note}</p>
          </CardContent>
        )}
        {/* Footer is removed as buttons are gone, add back if other info is needed */}
        {/* <CardFooter className="flex justify-end space-x-2 pt-2 pb-4 px-4"></CardFooter> */}
      </Card>

      {/* Edit Expense Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-popover text-popover-foreground">
          <DialogHeader>
            <DialogTitle className="font-headline">Edit Expense</DialogTitle>
            <DialogDescription>Make changes to your expense.</DialogDescription>
          </DialogHeader>
          <ExpenseForm expenseToEdit={expense} onSave={() => setIsEditDialogOpen(false)} />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-background text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This action cannot be undone. This will permanently delete the expense for "{expense.category}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Long Press Action Menu Dialog */}
      <Dialog open={isActionMenuOpen} onOpenChange={setIsActionMenuOpen}>
        <DialogContent className="sm:max-w-xs bg-popover text-popover-foreground">
          <DialogHeader>
            <DialogTitle className="font-headline text-center">Actions</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-2 pt-2">
            <Button variant="outline" onClick={handleEditFromActionMenu}>
              Edit Expense
            </Button>
            <Button variant="destructive" onClick={handleDeleteFromActionMenu}>
              Delete Expense
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
