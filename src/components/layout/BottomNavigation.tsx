"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    { 
      href: '/', 
      label: 'Notes', 
      icon: () => (
        <span 
          className={cn(
            "flex items-center justify-center h-6 w-6 mb-1 border-2 rounded-full text-sm font-semibold",
            pathname === '/' 
              ? "border-primary-foreground text-primary-foreground bg-primary-foreground/20" 
              : "border-primary-foreground/70 text-primary-foreground/70 group-hover:border-primary-foreground group-hover:text-primary-foreground"
          )}
        >
          N
        </span>
      ) 
    },
    { 
      href: '/expenses', 
      label: 'Expenses', 
      icon: DollarSign 
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-primary text-primary-foreground shadow-t-lg">
      <div className="container mx-auto grid h-16 max-w-lg grid-cols-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex flex-col items-center justify-center px-5 hover:bg-primary/80 transition-colors group",
                isActive ? "bg-primary/90" : ""
              )}
            >
              <IconComponent
                // Conditional props for Lucide icon vs custom span
                {...(typeof IconComponent !== 'function' ? {
                    className: cn(
                      "h-6 w-6 mb-1 group-hover:text-primary-foreground",
                      isActive ? "text-primary-foreground" : "text-primary-foreground/70"
                    ),
                    'aria-hidden': "true"
                  } : {})}
              />
              <span className={cn(
                "text-xs sm:text-sm group-hover:text-primary-foreground",
                isActive ? "text-primary-foreground font-semibold" : "text-primary-foreground/70"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
