'use client';

import { useState, useEffect } from 'react';
import { TimeEntry, api, UpdateEntryDto } from '@/lib/api';
import { Button, Input, Textarea } from './ui/base';
import { PROJECTS } from '@/lib/constants';
import { useToast } from './ui/toast';
import { X } from 'lucide-react';
import { DatePicker } from './ui/date-picker';
import { format } from 'date-fns';

interface EditEntryDialogProps {
  entry: TimeEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEntryUpdated: () => void;
}

export function EditEntryDialog({ entry, open, onOpenChange, onEntryUpdated }: EditEntryDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateEntryDto>({
    date: '',
    project: '',
    hours: 0,
    description: '',
  });
  const { showToast } = useToast();

  useEffect(() => {
    if (entry) {
      setFormData({
        date: entry.date.split('T')[0],
        project: entry.project,
        hours: entry.hours,
        description: entry.description,
      });
    }
  }, [entry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entry) return;

    setLoading(true);
    try {
      if ((formData.hours ?? 0) <= 0) throw new Error('Hours must be a positive number');
      await api.updateEntry(entry.id, {
        ...formData,
        hours: Number(formData.hours),
      });
      showToast('Entry updated successfully!', 'success');
      onOpenChange(false);
      onEntryUpdated();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update entry';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 w-full max-w-lg mx-4 bg-background rounded-2xl shadow-2xl border border-border/50 animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <h2 className="text-xl font-bold">Edit Entry</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 p-0 rounded-lg"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label htmlFor="edit-date" className="text-sm font-bold text-foreground">
              Date
            </label>
            <DatePicker
              date={formData.date ? new Date(formData.date) : undefined}
              setDate={(date) => setFormData({ ...formData, date: date ? format(date, 'yyyy-MM-dd') : '' })}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-project" className="text-sm font-bold text-foreground">
              Project
            </label>
            <select
              id="edit-project"
              className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:border-primary/50 focus:border-primary font-medium cursor-pointer shadow-sm"
              value={formData.project}
              onChange={(e) => setFormData({ ...formData, project: e.target.value })}
            >
              {PROJECTS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-hours" className="text-sm font-bold text-foreground">
              Hours
            </label>
            <Input
              id="edit-hours"
              type="number"
              step="0.1"
              min="0.1"
              max="24"
              required
              value={formData.hours || ''}
              onChange={(e) => setFormData({ ...formData, hours: Number(e.target.value) })}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-description" className="text-sm font-bold text-foreground">
              Description
            </label>
            <Textarea
              id="edit-description"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="resize-none min-h-[100px]"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-11"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 h-11"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
