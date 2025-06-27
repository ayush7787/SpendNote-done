import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from '@/contexts/AppContext';
import { BottomNavigation } from '@/components/layout/BottomNavigation';
import './globals.css';

export const metadata: Metadata = {
  title: 'SpendNote',
  description: 'Minimalist notes and expense tracking.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen bg-background text-foreground">
        <AppProvider>
          <div className="flex-grow pb-16"> {/* Added pb-16 for bottom nav space */}
            {children}
          </div>
          <BottomNavigation />
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
