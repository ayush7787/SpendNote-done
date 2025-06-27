"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/contexts/AppContext";
import { TrendingUp, CalendarDays, CalendarRange, Sigma } from "lucide-react"; // Added Sigma for Total

export function SpendingSummary() {
  const { spendingSummary } = useAppContext();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"> {/* Changed to 4 cols for total */}
      <Card className="shadow-lg bg-card text-card-foreground">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium font-headline">Today's Spend</CardTitle>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{formatCurrency(spendingSummary.daily)}</div>
          <p className="text-xs text-muted-foreground">Total for today</p>
        </CardContent>
      </Card>
      <Card className="shadow-lg bg-card text-card-foreground">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium font-headline">This Week's Spend</CardTitle>
          <CalendarRange className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{formatCurrency(spendingSummary.weekly)}</div>
          <p className="text-xs text-muted-foreground">Total for this week</p>
        </CardContent>
      </Card>
      <Card className="shadow-lg bg-card text-card-foreground">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium font-headline">This Month's Spend</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{formatCurrency(spendingSummary.monthly)}</div>
          <p className="text-xs text-muted-foreground">Total for this month</p>
        </CardContent>
      </Card>
      <Card className="shadow-lg bg-card text-card-foreground"> {/* New Card for Total Expenses */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium font-headline">Total Expenses</CardTitle>
          <Sigma className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{formatCurrency(spendingSummary.total)}</div>
          <p className="text-xs text-muted-foreground">All recorded expenses</p>
        </CardContent>
      </Card>
    </div>
  );
}
