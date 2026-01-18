'use client';

import { useState } from 'react';
import { TimeEntry, api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/base';
import { format } from 'date-fns';
import { Trash2, Calendar, Clock, Briefcase } from 'lucide-react';
import { useToast } from './ui/toast';

interface EntryHistoryProps {
  entries: TimeEntry[];
  onEntriesChange: () => void;
}

export function EntryHistory({ entries, onEntriesChange }: EntryHistoryProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { showToast } = useToast();

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    setDeletingId(id);
    try {
      await api.deleteEntry(id);
      showToast('Entry deleted successfully', 'success');
      onEntriesChange();
    } catch (error: any) {
      showToast(error.message || 'Failed to delete entry', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const groupedEntries = entries.reduce((groups: Record<string, TimeEntry[]>, entry) => {
    const date = entry.date.split('T')[0];
    if (!groups[date]) groups[date] = [];
    groups[date].push(entry);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedEntries).sort((a, b) => b.localeCompare(a));
  const grandTotal = entries.reduce((sum, entry) => sum + entry.hours, 0);

  return (
    <div className="space-y-8">
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            Entry History
          </h2>
          <p className="text-muted-foreground font-medium">Your recent work activities</p>
        </div>
        <div className="flex flex-col items-end gap-1 bg-gradient-to-br from-primary/10 to-blue-500/10 px-6 py-4 rounded-2xl border border-primary/20 shadow-sm backdrop-blur-sm">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Grand Total</span>
          <span className="text-3xl font-black text-gradient">
            {grandTotal.toFixed(1)} <span className="text-lg font-bold">hrs</span>
          </span>
        </div>
      </div>

      {/* Entries */}
      <div className="space-y-6">
        {sortedDates.map((date, index) => {
          const dayEntries = groupedEntries[date];
          const dayTotal = dayEntries.reduce((sum, entry) => sum + entry.hours, 0);

          return (
            <Card
              key={date}
              className="overflow-hidden shadow-lg border-border/50 hover:shadow-xl transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CardHeader className="bg-muted/30 py-4 border-b border-border/50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <CardTitle className="text-lg font-bold flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse"></div>
                    {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                  </CardTitle>
                  <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-xl border border-primary/20">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="font-bold text-primary">{dayTotal.toFixed(1)} hrs</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {dayEntries.map((entry, entryIndex) => (
                    <div
                      key={entry.id}
                      className="p-6 hover:bg-muted/20 transition-all duration-200 group animate-fade-in"
                      style={{ animationDelay: `${(index * 0.05) + (entryIndex * 0.02)}s` }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-6">
                        {/* Project Badge */}
                        <div className="flex items-center gap-4 md:w-56 flex-shrink-0">
                          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center shadow-sm border border-primary/10">
                            <Briefcase className="w-6 h-6 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-foreground truncate">{entry.project}</div>
                            <div className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 mt-0.5">
                              <Clock className="w-3.5 h-3.5" />
                              {entry.hours} {entry.hours === 1 ? 'hour' : 'hours'}
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="flex-1 text-sm text-foreground/80 leading-relaxed font-medium">
                          {entry.description}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 md:ml-auto opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={deletingId === entry.id}
                            onClick={() => handleDelete(entry.id)}
                            className="h-10 w-10 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
                            aria-label={`Delete entry for ${entry.project}`}
                          >
                            {deletingId === entry.id ? (
                              <svg className="animate-spin h-5 w-5" width="20" height="20" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <Trash2 className="w-5 h-5" aria-hidden="true" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {entries.length === 0 && (
        <Card className="border-dashed border-2 border-border/50 bg-muted/5">
          <CardContent className="flex flex-col items-center justify-center py-24 text-center space-y-6">
            <div className="h-24 w-24 rounded-full bg-muted/50 flex items-center justify-center shadow-inner">
              <Calendar className="w-12 h-12 text-muted-foreground/50" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">No entries yet</h3>
              <p className="text-muted-foreground max-w-sm font-medium">
                Start by adding your first time entry using the form on the left.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
