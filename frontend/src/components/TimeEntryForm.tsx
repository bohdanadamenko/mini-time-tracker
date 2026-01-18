'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input, Textarea } from './ui/base';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { api, CreateEntryDto } from '@/lib/api';
import { PROJECTS } from '@/lib/constants';
import { useToast } from './ui/toast';
import { DatePicker } from './ui/date-picker';
import { format } from 'date-fns';

export function TimeEntryForm({ onEntryAdded }: { onEntryAdded: () => void }) {
  const [loading, setLoading] = useState(false);
  const [dailyTotal, setDailyTotal] = useState(0);
  const [formData, setFormData] = useState<CreateEntryDto>({
    date: '',
    project: PROJECTS[0],
    hours: 0,
    description: '',
  });
  const { showToast } = useToast();

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      date: new Date().toISOString().split('T')[0]
    }));
  }, []);

  useEffect(() => {
    if (formData.date) {
      api.getDailyTotal(formData.date)
        .then(res => setDailyTotal(res.total))
        .catch(console.error);
    }
  }, [formData.date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.hours <= 0) throw new Error('Hours must be a positive number');
      if (formData.hours + dailyTotal > 24) {
        throw new Error(`Cannot exceed 24 hours per day. Remaining: ${(24 - dailyTotal).toFixed(1)} hours`);
      }

      await api.createEntry({
        ...formData,
        hours: Number(formData.hours),
      });
      
      // Refresh daily total
      const newTotal = await api.getDailyTotal(formData.date);
      setDailyTotal(newTotal.total);

      setFormData({
        ...formData,
        hours: 0,
        description: '',
      });
      showToast('Entry added successfully!', 'success');
      onEntryAdded();
    } catch (err: any) {
      showToast(err.message || 'Failed to add entry', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-xl border-border/50 hover:shadow-2xl transition-all duration-300">
      <CardHeader className="space-y-1 pb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-primary"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Add Entry</CardTitle>
            <p className="text-sm text-muted-foreground">Log your work hours</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="date-input" className="text-sm font-bold text-foreground flex items-center gap-2">
              <svg className="w-4 h-4 text-muted-foreground" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Date
            </label>
            <DatePicker
              date={formData.date ? new Date(formData.date) : undefined}
              setDate={(date) => setFormData({ ...formData, date: date ? format(date, 'yyyy-MM-dd') : '' })}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="project-select" className="text-sm font-bold text-foreground flex items-center gap-2">
              <svg className="w-4 h-4 text-muted-foreground" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Project
            </label>
            <select
              id="project-select"
              className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:border-primary/50 focus:border-primary font-medium cursor-pointer shadow-sm focus:shadow-md"
              value={formData.project}
              onChange={(e) => setFormData({ ...formData, project: e.target.value })}
              aria-label="Select project"
            >
              {PROJECTS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="hours-input" className="text-sm font-bold text-foreground flex items-center gap-2">
              <svg className="w-4 h-4 text-muted-foreground" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Hours
            </label>
            <Input
              id="hours-input"
              type="number"
              step="0.1"
              min="0.1"
              max={24 - dailyTotal}
              required
              value={formData.hours || ''}
              onChange={(e) => setFormData({ ...formData, hours: Number(e.target.value) })}
              placeholder="e.g., 8.5"
              className="h-11"
              aria-label="Enter hours worked"
            />
            <p className="text-xs text-muted-foreground font-medium text-right">
              Remaining: <span className={24 - dailyTotal < 4 ? "text-orange-500 font-bold" : "text-primary font-bold"}>
                {(24 - dailyTotal).toFixed(1)}
              </span> hours
            </p>
          </div>
          <div className="space-y-2">
            <label htmlFor="description-input" className="text-sm font-bold text-foreground flex items-center gap-2">
              <svg className="w-4 h-4 text-muted-foreground" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Description
            </label>
            <Textarea
              id="description-input"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what you worked on..."
              className="resize-none min-h-[100px]"
              aria-label="Enter work description"
            />
          </div>
          <Button
            type="submit"
            className="w-full h-12 text-base font-bold"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Entry
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
