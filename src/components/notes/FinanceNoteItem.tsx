"use client";

import type { FinanceNote } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit3, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAppContext } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import React from "react";
import { FinanceNoteForm } from "./FinanceNoteForm";


interface FinanceNoteItemProps {
  note: FinanceNote;
}

export function FinanceNoteItem({ note }: FinanceNoteItemProps) {
  const { deleteFinanceNote } = useAppContext();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  const handleDelete = () => {
    deleteFinanceNote(note.id);
    toast({
      title: "Note Deleted",
      description: `"${note.title}" has been removed.`,
      variant: "destructive",
    });
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col bg-card text-card-foreground">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-lg">{note.title}</CardTitle>
        <CardDescription className="text-muted-foreground">
          Last updated: {format(parseISO(note.updatedAt), "PPP p")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm whitespace-pre-wrap line-clamp-5">{note.content}</p>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 pt-4">
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Edit3 className="mr-1 h-4 w-4" /> Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg bg-popover text-popover-foreground">
            <DialogHeader>
              <DialogTitle className="font-headline">Edit Note</DialogTitle>
              <DialogDescription>Make changes to your note.</DialogDescription>
            </DialogHeader>
            <FinanceNoteForm note={note} onSave={() => setIsEditDialogOpen(false)} />
          </DialogContent>
        </Dialog>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-1 h-4 w-4" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-background text-foreground">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-headline">Are you sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                This action cannot be undone. This will permanently delete the note titled "{note.title}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
