
"use client";

import React from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { FinanceNoteForm } from "@/components/notes/FinanceNoteForm";
import { FinanceNoteList } from "@/components/notes/FinanceNoteList";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotesPage() {
  const { isDataLoaded } = useAppContext();
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  if (!isDataLoaded) {
    return (
      <>
        <AppHeader />
        <main className="flex-1 container mx-auto p-4 md:p-8 space-y-6">
           <Skeleton className="h-10 w-64 mb-6" />
           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-48 rounded-lg" />
            <Skeleton className="h-48 rounded-lg" />
            <Skeleton className="h-48 rounded-lg" />
           </div>
        </main>
      </>
    );
  }

  return (
    <>
      <AppHeader />
      <main className="flex-1 container mx-auto p-4 md:p-8 space-y-8">
        <section aria-labelledby="your-notes-title">
          <div className="flex justify-between items-center mb-6">
            <h1 id="your-notes-title" className="text-3xl font-bold font-headline text-primary">Your Notes</h1>
          </div>
          <FinanceNoteList />
        </section>
      </main>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogTrigger asChild>
           <Button
            className="fixed bottom-20 right-4 sm:bottom-24 sm:right-8 h-14 w-14 rounded-full bg-accent text-accent-foreground shadow-xl hover:bg-accent/90 z-50"
            size="icon"
            aria-label="Add Note"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg bg-card text-card-foreground">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">Add New Note</DialogTitle>
            <DialogDescription>Keep track of your thoughts and reminders.</DialogDescription>
          </DialogHeader>
          <FinanceNoteForm onSave={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
      
      <footer className="py-6 text-center text-sm text-muted-foreground border-t mt-auto">
        © {new Date().getFullYear() === 2024 ? 2025 : new Date().getFullYear()} SpendNote. Minimalist Tracking.
      </footer>
    </>
  );
}
