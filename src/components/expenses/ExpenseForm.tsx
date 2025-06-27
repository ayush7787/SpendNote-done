
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppContext } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect } from "react";
import type { Expense } from "@/lib/types";

const expenseFormSchema = z.object({
  amount: z.coerce.number().positive({ message: "Amount must be positive." }),
  category: z.string().min(1, "Category is required.").max(50, "Category too long."),
  note: z.string().max(200, "Note too long.").optional(),
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

interface ExpenseFormProps {
  expenseToEdit?: Expense;
  onSave?: () => void; // Callback after saving, to close popover/dialog
}

export function ExpenseForm({ expenseToEdit, onSave }: ExpenseFormProps) {
  const { addExpense, updateExpense } = useAppContext();
  const { toast } = useToast();

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      amount: expenseToEdit?.amount ?? undefined,
      category: expenseToEdit?.category ?? "",
      note: expenseToEdit?.note ?? "",
    },
  });

  useEffect(() => {
    if (expenseToEdit) {
      form.reset({
        amount: expenseToEdit.amount,
        category: expenseToEdit.category,
        note: expenseToEdit.note ?? "",
      });
    } else {
      form.reset({ // Reset for new expense form
        amount: undefined,
        category: "",
        note: "",
      });
    }
  }, [expenseToEdit, form]);

  function onSubmit(data: ExpenseFormValues) {
    if (expenseToEdit) {
      updateExpense({ ...expenseToEdit, ...data }); // Spread existing id and date
      toast({
        title: "Expense Updated",
        description: `Expense details saved.`,
      });
    } else {
      addExpense(data);
      // toast({ // Toast on error is preferred
      //   title: "Expense Added",
      //   description: `${data.category} expense of $${data.amount.toFixed(2)} recorded.`,
      // });
    }
    if (!expenseToEdit) { // Only reset fully if it's a new expense being added from FAB
        form.reset({ amount: undefined, category: "", note: "" });
    }
    onSave?.();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0.00"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? undefined : parseFloat(value));
                  }}
                  step="0.01"
                  className="bg-input text-foreground placeholder:text-muted-foreground"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input 
                  type="text" 
                  placeholder="e.g. Food, Travel" 
                  {...field} 
                  className="bg-input text-foreground placeholder:text-muted-foreground"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Short description..." 
                  {...field} 
                  value={field.value ?? ""}
                  className="bg-input text-foreground placeholder:text-muted-foreground"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            {expenseToEdit ? "Save Changes" : "Save Expense"}
            </Button>
            {expenseToEdit && onSave && (
                <Button type="button" variant="outline" onClick={onSave} className="w-full">
                Cancel
                </Button>
            )}
        </div>
      </form>
    </Form>
  );
}
