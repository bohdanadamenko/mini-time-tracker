'use client';

import { useState } from 'react';
import { TimeEntry, api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button, Input } from './ui/base';
import { Dialog } from './ui/dialog';
import { EditEntryDialog } from './EditEntryDialog';
import { format } from 'date-fns';
import { Trash2, Calendar, Clock, Briefcase, Pencil, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { useToast } from './ui/toast';
import { PROJECTS } from '@/lib/constants';
import { DateRangePicker } from './ui/date-picker';

interface EntryHistoryProps {
  entries: TimeEntry[];
  onEntriesChange: () => void;
  filters: {
    project: string;
    startDate: string;
    endDate: string;
  };
  onFiltersChange: (filters: any) => void;
  pagination: {
    page: number;
    limit: number;
    total: number;
    last_page: number;
  };
  onPageChange: (page: number) => void;
}

export function EntryHistory({
  entries,
  onEntriesChange,
  filters,
  onFiltersChange,
  pagination,
  onPageChange,
}: EntryHistoryProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<{ id: number; project: string } | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [entryToEdit, setEntryToEdit] = useState<TimeEntry | null>(null);
  const { showToast } = useToast();

  const handleEditClick = (entry: TimeEntry) => {
    setEntryToEdit(entry);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (id: number, project: string) => {
    setEntryToDelete({ id, project });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!entryToDelete) return;

    setDeletingId(entryToDelete.id);
    try {
      await api.deleteEntry(entryToDelete.id);
      showToast('Entry deleted successfully', 'success');
      onEntriesChange();
    } catch (error: any) {
      showToast(error.message || 'Failed to delete entry', 'error');
    } finally {
      setDeletingId(null);
      setEntryToDelete(null);
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
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Page Total</span>
          <span className="text-3xl font-black text-gradient">
            {grandTotal.toFixed(1)} <span className="text-lg font-bold">hrs</span>
          </span>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-sm border-border/50 bg-muted/30">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Filter className="w-3 h-3" /> Project
              </label>
              <select
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={filters.project}
                onChange={(e) => onFiltersChange({ ...filters, project: e.target.value })}
              >
                <option value="">All Projects</option>
                {PROJECTS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Date Range</label>
              <DateRangePicker
                date={
                  filters.startDate
                    ? {
                        from: new Date(filters.startDate),
                        to: filters.endDate ? new Date(filters.endDate) : undefined,
                      }
                    : undefined
                }
                setDate={(range) => {
                  onFiltersChange({
                    ...filters,
                    startDate: range?.from ? format(range.from, 'yyyy-MM-dd') : '',
                    endDate: range?.to ? format(range.to, 'yyyy-MM-dd') : '',
                  });
                }}
                className="h-10 bg-background w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

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
                            onClick={() => handleEditClick(entry)}
                            className="h-10 w-10 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl"
                            aria-label={`Edit entry for ${entry.project}`}
                          >
                            <Pencil className="w-5 h-5" aria-hidden="true" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={deletingId === entry.id}
                            onClick={() => handleDeleteClick(entry.id, entry.project)}
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
              <h3 className="text-xl font-bold">No entries found</h3>
              <p className="text-muted-foreground max-w-sm font-medium">
                Try adjusting your filters or add a new entry.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {pagination.total > 0 && (
        <div className="flex items-center justify-between border-t border-border/50 pt-6">
          <p className="text-sm text-muted-foreground font-medium">
            Showing <span className="font-bold text-foreground">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
            <span className="font-bold text-foreground">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
            <span className="font-bold text-foreground">{pagination.total}</span> entries
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="h-9 px-4"
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.last_page}
              className="h-9 px-4"
            >
              Next <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Time Entry"
        description={`Are you sure you want to delete this entry for "${entryToDelete?.project}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setEntryToDelete(null)}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Edit Entry Dialog */}
      <EditEntryDialog
        entry={entryToEdit}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onEntryUpdated={onEntriesChange}
      />
    </div>
  );
}
