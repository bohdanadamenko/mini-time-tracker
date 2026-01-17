'use client';

import React, { useState } from 'react';
import { Button, Input, Textarea } from './ui/base';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { api, CreateEntryDto } from '@/lib/api';

const PROJECTS = ["Viso Internal", "Client A", "Client B", "Personal Development"];

export function TimeEntryForm({ onEntryAdded }: { onEntryAdded: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateEntryDto>({
    date: new Date().toISOString().split('T')[0],
    project: PROJECTS[0],
    hours: 0,
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (formData.hours <= 0) throw new Error('Hours must be a positive number');
      await api.createEntry({
        ...formData,
        hours: Number(formData.hours),
      });
      setFormData({
        ...formData,
        hours: 0,
        description: '',
      });
      onEntryAdded();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Add Time Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Project</label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={formData.project}
              onChange={(e) => setFormData({ ...formData, project: e.target.value })}
            >
              {PROJECTS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Hours</label>
            <Input
              type="number"
              step="0.1"
              required
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What did you work on?"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : 'Save Entry'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
