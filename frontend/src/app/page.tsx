'use client';

import { useEffect, useState } from 'react';
import { TimeEntryForm } from '@/components/TimeEntryForm';
import { EntryHistory } from '@/components/EntryHistory';
import { ThemeToggle } from '@/components/ThemeToggle';
import { api, TimeEntry } from '@/lib/api';

export default function Home() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    project: '',
    startDate: '',
    endDate: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    last_page: 1,
  });

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const response = await api.getEntries({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });
      setEntries(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.meta.total,
        last_page: response.meta.last_page,
      }));
    } catch (error) {
      console.error('❌ Failed to fetch entries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [filters, pagination.page]);

  return (
    <div className="min-h-screen bg-background selection:bg-primary/10">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-background border-b border-border/50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <svg
                  className="w-6 h-6 text-primary-foreground"
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Mini Time Tracker</h1>
                <p className="text-xs text-muted-foreground font-medium">Track your productive hours</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
                <span className="text-muted-foreground">Total Entries:</span>
                <span className="font-bold text-primary">{entries.length}</span>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Welcome Section */}
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gradient">
              Welcome Back!
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Track your work hours efficiently across multiple projects. Add new entries and view your history all in one place.
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Form Section */}
            <div className="lg:col-span-1 animate-slide-up">
              <TimeEntryForm onEntryAdded={fetchEntries} />
            </div>

            {/* History Section */}
            <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-6">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-muted"></div>
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent absolute top-0"></div>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading your entries...</p>
                </div>
              ) : (
                <EntryHistory
                  entries={entries}
                  onEntriesChange={fetchEntries}
                  filters={filters}
                  onFiltersChange={setFilters}
                  pagination={pagination}
                  onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
