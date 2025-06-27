"use client";

import { useAppContext } from "@/contexts/AppContext";
import { FinanceNoteItem } from "./FinanceNoteItem";

export function FinanceNoteList() {
  const { financeNotes } = useAppContext();

  if (financeNotes.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p className="text-lg">No finance notes yet.</p>
        <p>Create your first note using the form above.</p>
      </div>
    );
  }

  // Sort notes by updatedAt in descending order (newest first)
  const sortedNotes = [...financeNotes].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sortedNotes.map(note => (
        <FinanceNoteItem key={note.id} note={note} />
      ))}
    </div>
  );
}
