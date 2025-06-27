
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
import type { FinanceNote } from "@/lib/types";

const noteFormSchema = z.object({
  title: z.string().min(1, "Title is required.").max(100, "Title too long."),
  content: z.string().min(1, "Content is required.").max(5000, "Content too long."),
});

type NoteFormValues = z.infer<typeof noteFormSchema>;

interface FinanceNoteFormProps {
  note?: FinanceNote; // For editing
  onSave?: () => void; // Callback after saving
}

export function FinanceNoteForm({ note, onSave }: FinanceNoteFormProps) {
  const { addFinanceNote, updateFinanceNote } = useAppContext();
  const { toast } = useToast();

  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: note?.title || "",
      content: note?.content || "",
    },
  });

  function onSubmit(data: NoteFormValues) {
    if (note) {
      updateFinanceNote({ ...note, ...data });
      // toast({ title: "Note Updated", description: `"${data.title}" has been saved.` });
    } else {
      addFinanceNote(data);
      // toast({ title: "Note Added", description: `"${data.title}" has been created.` });
    }
    form.reset({ title: "", content: ""}); // Reset form for both add and edit after submission
    onSave?.();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., Meeting Notes, Recipe Ideas" 
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
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Write your thoughts here..." 
                  {...field} 
                  rows={8} 
                  className="bg-input text-foreground placeholder:text-muted-foreground"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
            <Button type="submit" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
            {note ? "Save Changes" : "Add Note"}
            </Button>
            {onSave && note && ( 
                <Button type="button" variant="outline" onClick={onSave} className="w-full sm:w-auto">
                Cancel
                </Button>
            )}
        </div>
      </form>
    </Form>
  );
}
