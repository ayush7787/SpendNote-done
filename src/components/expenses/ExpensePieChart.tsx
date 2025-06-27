"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/contexts/AppContext";
import type { CategoryBreakdownData } from '@/lib/types';
import { ChartConfig, ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import React from 'react';


export function ExpensePieChart() {
  const { categoryBreakdown, expenses } = useAppContext();

  if (expenses.length === 0) {
    return (
       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No expense data for chart.</p>
        </CardContent>
      </Card>
    );
  }
  
  const chartConfig = categoryBreakdown.reduce((acc, entry) => {
    acc[entry.name] = { label: entry.name, color: entry.fill };
    return acc;
  }, {} as ChartConfig);


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel nameKey="name" />}
              />
              <Pie
                data={categoryBreakdown}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                labelLine={false}
                label={({ percent, name }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {categoryBreakdown.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                ))}
              </Pie>
               <ChartLegend content={<ChartLegendContent nameKey="name" />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
