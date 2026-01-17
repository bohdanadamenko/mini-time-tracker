export interface TimeEntry {
  id: number;
  date: string;
  project: string;
  hours: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEntryDto {
  date: string;
  project: string;
  hours: number;
  description: string;
}

import { API_URL } from './constants';

export const api = {
  async getEntries(): Promise<TimeEntry[]> {
    const response = await fetch(`${API_URL}/entries`);
    if (!response.ok) throw new Error('Failed to fetch entries');
    return response.json();
  },

  async createEntry(entry: CreateEntryDto): Promise<TimeEntry> {
    const response = await fetch(`${API_URL}/entries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create entry');
    }
    return response.json();
  },
};
