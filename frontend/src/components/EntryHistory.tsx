'use client';

import React from 'react';
import { TimeEntry } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { format } from 'date-fns';

export function EntryHistory({ entries }: { entries: TimeEntry[] }) {
  const groupedEntries = entries.reduce((groups: Record<string, TimeEntry[]>, entry) => {
    const date = entry.date.split('T')[0];
    if (!groups[date]) groups[date] = [];
    groups[date].push(entry);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedEntries).sort((a, b) => b.localeCompare(a));
  const grandTotal = entries.reduce((sum, entry) => sum + entry.hours, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Entry History</h2>
        <div className="text-lg font-semibold bg-primary/10 px-4 py-2 rounded-lg">
          Grand Total: {grandTotal.toFixed(1)} hrs
        </div>
      </div>

      {sortedDates.map((date) => {
        const dayEntries = groupedEntries[date];
        const dayTotal = dayEntries.reduce((sum, entry) => sum + entry.hours, 0);

        return (
          <Card key={date} className="overflow-hidden">
            <CardHeader className="bg-muted/50 py-3 flex flex-row justify-between items-center">
              <CardTitle className="text-lg">{format(new Date(date), 'MMMM d, yyyy')}</CardTitle>
              <span className="font-medium">Total: {dayTotal.toFixed(1)} hrs</span>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {dayEntries.map((entry) => (
                  <div key={entry.id} className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div className="font-medium text-primary">{entry.project}</div>
                    <div className="text-sm text-muted-foreground">{entry.hours} hrs</div>
                    <div className="md:col-span-2 text-sm">{entry.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {entries.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No entries found. Start by adding your first time entry!
        </div>
      )}
    </div>
  );
}
