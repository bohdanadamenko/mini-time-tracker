'use client';

import { useEffect, useState } from 'react';
import { TimeEntryForm } from '@/components/TimeEntryForm';
import { EntryHistory } from '@/components/EntryHistory';
import { api, TimeEntry } from '@/lib/api';

export default function Home() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    try {
      const data = await api.getEntries();
      setEntries(data);
    } catch (error) {
      console.error('Failed to fetch entries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Mini Time Tracker
          </h1>
          <p className="text-muted-foreground">
            Track your work hours across projects with ease.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <TimeEntryForm onEntryAdded={fetchEntries} />
          </div>
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <EntryHistory entries={entries} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
