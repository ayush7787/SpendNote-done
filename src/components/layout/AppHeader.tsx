
"use client";

import Link from 'next/link';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';

export function AppHeader() {
  const { darkMode, toggleDarkMode } = useAppContext();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-primary text-primary-foreground">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary-foreground"
          >
            <rect width="12" height="12" rx="2" fill="currentColor"/>
            <rect x="16" width="12" height="12" rx="2" fill="currentColor"/>
            <rect y="16" width="12" height="12" rx="2" fill="currentColor"/>
            <rect x="16" y="16" width="12" height="12" rx="2" fill="currentColor"/>
          </svg>
          <span className="font-headline text-xl font-bold text-primary-foreground">SpendNote</span>
        </Link>
        <nav className="flex items-center space-x-2 lg:space-x-4">
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} aria-label="Toggle dark mode" className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground">
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </nav>
      </div>
    </header>
  );
}
